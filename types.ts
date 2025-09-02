
export interface Tick {
  symbol: string;
  price: number;
  timestamp: Date;
}

export interface Order {
  id: string;
  symbol: string;
  side: OrderSide;
  type: OrderType.MARKET | OrderType.LIMIT;
  quantity: number;
  price?: number;
  filledQuantity: number;
  status: OrderStatus;
  createdAt: Date;
}

export interface Position {
  symbol: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  pnl: number;
}

export enum OrderSide {
  BUY = 'BUY',
  SELL = 'SELL'
}

export enum OrderType {
  MARKET = 'MARKET',
  LIMIT = 'LIMIT',
  BRACKET = 'BRACKET'
}

export enum OrderStatus {
  OPEN = 'OPEN',
  FILLED = 'FILLED',
  CANCELLED = 'CANCELLED',
  REJECTED = 'REJECTED'
}

export interface PlaceOrderParams {
  symbol: string;
  side: string;
  type: string;
  quantity: number;
  price?: number;
}

export interface BracketOrderParams extends PlaceOrderParams {
  takeProfit: number;
  stopLoss: number;
}

export interface IBroker {
  connect(): Promise<void>;
  placeOrder(params: PlaceOrderParams): Promise<Order | Order[]>;
  cancelOrder(orderId: string): Promise<boolean>;
  getPositions(): Promise<Position[]>;
  getOpenOrders(): Promise<Order[]>;
}

export interface IDataFeed {
  connect(): Promise<void>;
  subscribe(symbols: string[]): Promise<void>;
  on(event: string, listener: Function): void;
  emit(event: string, ...args: any[]): void;
}
