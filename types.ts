
export enum OrderSide {
  BUY = 'BUY',
  SELL = 'SELL',
}

export enum OrderType {
  LIMIT = 'LIMIT',
  MARKET = 'MARKET',
}

export enum OrderStatus {
  OPEN = 'OPEN',
  FILLED = 'FILLED',
  PARTIALLY_FILLED = 'PARTIALLY_FILLED',
  CANCELLED = 'CANCELLED',
}

export interface Order {
  id: string;
  symbol: string;
  side: OrderSide;
  type: OrderType;
  quantity: number;
  price?: number;
  filledQuantity: number;
  status: OrderStatus;
  createdAt: Date;
  botName?: string;
}

export interface Position {
  symbol: string;
  quantity: number;
  averagePrice: number;
  unrealizedPnl: number;
  botName?: string;
}

export interface Tick {
  symbol: string;
  price: number;
  timestamp: Date;
}

export interface HeartbeatMessage {
  service: string;
  timestamp: Date;
  status: 'OK';
}

export interface OrderBookLevel {
    price: number;
    size: number;
    total?: number;
}

export interface SystemLog {
  timestamp: Date;
  level: 'INFO' | 'CMD' | 'TRADE' | 'ERROR' | 'RISK';
  service: string;
  message: string;
}

export interface BotStatus {
  name: string;
  status: 'Running' | 'Stopped' | 'Error';
  strategy: {
    name: string;
    symbol: string;
  };
}
