
import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import * as crypto from 'crypto';
import { IBroker, PlaceOrderParams } from '../../../../packages/shared/src/interfaces';
import { Order, Position, OrderStatus, OrderType, OrderSide } from '../../../../types';

@Injectable()
export class BinanceBroker implements IBroker {
  private apiClient: AxiosInstance;
  private testnetClient: AxiosInstance;
  private apiKey: string;
  private apiSecret: string;
  private isPaperTrading: boolean;

  constructor() {
    this.apiKey = process.env.BINANCE_API_KEY!;
    this.apiSecret = process.env.BINANCE_API_SECRET!;
    this.isPaperTrading = process.env.TRADING_MODE !== 'live';
    
    if (!this.apiKey || !this.apiSecret) {
      throw new Error('Binance API key and secret must be provided in environment variables.');
    }

    // Live trading client
    this.apiClient = axios.create({
      baseURL: 'https://api.binance.com/api/v3',
      headers: {
        'X-MBX-APIKEY': this.apiKey,
      },
    });

    // Paper trading (testnet) client
    this.testnetClient = axios.create({
      baseURL: 'https://testnet.binance.vision/api/v3',
      headers: {
        'X-MBX-APIKEY': this.apiKey,
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    const signRequest = (config: any) => {
      if (config.data || config.params) {
        const timestamp = Date.now();
        const queryString = new URLSearchParams({
          ...config.params,
          timestamp: timestamp.toString(),
        }).toString();

        const signature = crypto
          .createHmac('sha256', this.apiSecret)
          .update(queryString)
          .digest('hex');

        config.params = {
          ...config.params,
          timestamp,
          signature,
        };
      }
      return config;
    };

    this.apiClient.interceptors.request.use(signRequest);
    this.testnetClient.interceptors.request.use(signRequest);
  }

  private getClient(): AxiosInstance {
    return this.isPaperTrading ? this.testnetClient : this.apiClient;
  }

  async connect(): Promise<void> {
    try {
      const client = this.getClient();
      const response = await client.get('/time');
      
      if (response.data.serverTime) {
        console.log(`Binance ${this.isPaperTrading ? 'Testnet' : 'Live'} connected successfully.`);
      } else {
        throw new Error('Invalid response from Binance time endpoint');
      }
    } catch (error) {
      console.error('Failed to connect to Binance.', error.response?.data || error.message);
      throw new Error('Binance connection failed');
    }
  }

  async placeOrder(params: PlaceOrderParams): Promise<Order> {
    try {
      const client = this.getClient();
      
      const binanceOrder = {
        symbol: params.symbol.replace('-', ''), // Convert BTC-USDT to BTCUSDT
        side: params.side,
        type: params.type === 'MARKET' ? 'MARKET' : 'LIMIT',
        quantity: params.quantity,
        ...(params.type === 'LIMIT' && { price: params.price }),
        timeInForce: 'GTC',
      };

      const response = await client.post('/order', binanceOrder);
      
      return {
        id: response.data.orderId.toString(),
        symbol: params.symbol,
        side: params.side,
        quantity: parseFloat(response.data.origQty),
        price: parseFloat(response.data.price || '0'),
        status: this.mapBinanceStatus(response.data.status),
        timestamp: new Date(response.data.transactTime),
        brokerOrderId: response.data.orderId.toString(),
      };
    } catch (error) {
      console.error('Failed to place order:', error.response?.data || error.message);
      throw new Error(`Failed to place order: ${error.response?.data?.msg || error.message}`);
    }
  }

  async cancelOrder(orderId: string): Promise<boolean> {
    try {
      const client = this.getClient();
      await client.delete('/order', {
        params: { orderId }
      });
      return true;
    } catch (error) {
      console.error('Failed to cancel order:', error.response?.data || error.message);
      return false;
    }
  }

  async getPositions(): Promise<Position[]> {
    try {
      const client = this.getClient();
      const response = await client.get('/account');
      
      return response.data.balances
        .filter((balance: any) => parseFloat(balance.free) > 0 || parseFloat(balance.locked) > 0)
        .map((balance: any) => ({
          id: balance.asset,
          symbol: balance.asset,
          quantity: parseFloat(balance.free) + parseFloat(balance.locked),
          avgPrice: 0, // Binance doesn't provide average price directly
          currentPrice: 0, // Would need separate price call
          pnl: 0,
          dayChange: 0,
          dayChangePercent: 0,
          unrealizedPnl: 0,
        }));
    } catch (error) {
      console.error('Failed to get positions:', error.response?.data || error.message);
      return [];
    }
  }

  async getOpenOrders(): Promise<Order[]> {
    try {
      const client = this.getClient();
      const response = await client.get('/openOrders');
      
      return response.data.map((order: any) => ({
        id: order.orderId.toString(),
        symbol: this.formatSymbol(order.symbol),
        side: order.side,
        quantity: parseFloat(order.origQty),
        price: parseFloat(order.price),
        status: this.mapBinanceStatus(order.status),
        timestamp: new Date(order.time),
        brokerOrderId: order.orderId.toString(),
      }));
    } catch (error) {
      console.error('Failed to get open orders:', error.response?.data || error.message);
      return [];
    }
  }

  private mapBinanceStatus(status: string): OrderStatus {
    switch (status) {
      case 'NEW':
        return 'PENDING';
      case 'FILLED':
        return 'FILLED';
      case 'CANCELED':
        return 'CANCELLED';
      case 'REJECTED':
        return 'REJECTED';
      default:
        return 'PENDING';
    }
  }

  private formatSymbol(binanceSymbol: string): string {
    // Convert BTCUSDT to BTC-USDT
    if (binanceSymbol.endsWith('USDT')) {
      const base = binanceSymbol.slice(0, -4);
      return `${base}-USDT`;
    }
    return binanceSymbol;
  }
}
