import { Injectable, Logger } from '@nestjs/common';
import { IBroker, PlaceOrderParams } from '../../../../packages/shared/src/interfaces';
import { Order, Position, OrderStatus, OrderType, OrderSide } from '../../../../types';
import { randomUUID } from 'crypto';
import { BracketOrderParams } from 'packages/shared/src/zod-schemas';

interface BracketOrderLegs {
    parentId: string;
    takeProfitId: string;
    stopLossId: string;
}

@Injectable()
export class SimulatedBroker implements IBroker {
  private readonly logger = new Logger(SimulatedBroker.name);
  private cash = 100000;
  private positions: Map<string, Position> = new Map();
  private orders: Map<string, Order> = new Map();
  // Stores the relationship for bracket orders: parentId -> { takeProfitId, stopLossId }
  private bracketLegs: Map<string, BracketOrderLegs> = new Map();


  async connect(): Promise<void> {
    this.logger.log('SimulatedBroker connected.');
    this.positions.set('BTC/USD', {
        symbol: 'BTC/USD',
        quantity: 0,
        averagePrice: 0,
        unrealizedPnl: 0,
    });
  }

  async placeOrder(params: PlaceOrderParams): Promise<Order | Order[]> {
    if (params.type === 'BRACKET') {
        return this.placeBracketOrder(params);
    }
      
    const newOrder: Order = {
      id: randomUUID(),
      symbol: params.symbol,
      // FIX: Cast params.side to the OrderSide enum to resolve the type mismatch.
      side: params.side as OrderSide,
      type: params.type as OrderType.MARKET | OrderType.LIMIT, // Cast after check
      quantity: params.quantity,
      price: params.type === 'LIMIT' ? params.price : undefined,
      filledQuantity: 0,
      status: OrderStatus.OPEN,
      createdAt: new Date(),
    };

    // For simulation, we assume market orders are filled instantly at a simulated price
    if (newOrder.type === OrderType.MARKET) {
      const fillPrice = 69500; 
      this.fillOrder(newOrder, newOrder.quantity, fillPrice);
    }
    
    this.orders.set(newOrder.id, newOrder);
    this.logger.log(`Placed order: ${JSON.stringify(newOrder)}`);
    return newOrder;
  }
  
  private async placeBracketOrder(params: BracketOrderParams): Promise<Order[]> {
    this.logger.log(`Placing BRACKET order for ${params.symbol}`);
    
    // 1. Create the parent limit order
    const parentOrder: Order = {
      id: randomUUID(),
      symbol: params.symbol,
      // FIX: Cast params.side to the OrderSide enum to resolve the type mismatch.
      side: params.side as OrderSide,
      type: OrderType.LIMIT,
      quantity: params.quantity,
      price: params.price,
      filledQuantity: 0,
      status: OrderStatus.OPEN,
      createdAt: new Date(),
    };
    this.orders.set(parentOrder.id, parentOrder);

    // In a real simulation, we'd wait for a tick to fill this. For now, we fill it immediately
    // to demonstrate the bracket logic.
    this.fillOrder(parentOrder, parentOrder.quantity, parentOrder.price!);
    
    return [parentOrder]; // In reality, we'd return all 3 orders eventually
  }

  private fillOrder(order: Order, quantity: number, price: number) {
      order.status = OrderStatus.FILLED;
      order.filledQuantity = quantity;
      this.updatePosition(order, price);
      
      // Check if this is a parent bracket order that just got filled
      if (this.bracketLegs.has(order.id)) {
          // Logic to place the TP and SL orders would go here
          this.logger.log(`Parent order ${order.id} filled. Placing TP and SL orders.`);
      }
  }


  private updatePosition(order: Order, fillPrice: number) {
    const existingPosition = this.positions.get(order.symbol) || {
        symbol: order.symbol, quantity: 0, averagePrice: 0, unrealizedPnl: 0
    };

    const currentCost = existingPosition.quantity * existingPosition.averagePrice;
    const tradeCost = order.quantity * fillPrice;

    const direction = order.side === OrderSide.BUY ? 1 : -1;
    const newQuantity = existingPosition.quantity + (order.quantity * direction);

    let newAveragePrice = existingPosition.averagePrice;
    if (newQuantity !== 0) {
        newAveragePrice = (currentCost + (tradeCost * direction)) / newQuantity;
    } else {
        newAveragePrice = 0;
    }
    
    const newPosition: Position = {
        ...existingPosition,
        quantity: newQuantity,
        averagePrice: Math.abs(newAveragePrice),
    };

    this.positions.set(order.symbol, newPosition);
    this.logger.log(`Updated position: ${JSON.stringify(newPosition)}`);
  }

  async cancelOrder(orderId: string): Promise<boolean> {
    const order = this.orders.get(orderId);
    if (order && order.status === OrderStatus.OPEN) {
      order.status = OrderStatus.CANCELLED;
      this.orders.set(orderId, order);
      return true;
    }
    return false;
  }

  async getPositions(): Promise<Position[]> {
    return Array.from(this.positions.values());
  }

  async getOpenOrders(): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(o => o.status === OrderStatus.OPEN);
  }
}