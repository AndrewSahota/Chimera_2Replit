
export type OrderSide = 'BUY' | 'SELL';
export type OrderType = 'MARKET' | 'LIMIT' | 'STOP' | 'STOP_LIMIT';
export type OrderStatus = 'PENDING' | 'FILLED' | 'CANCELLED' | 'REJECTED';
export type TradingMode = 'sim' | 'paper' | 'live';

export interface Order {
  id: string;
  symbol: string;
  side: OrderSide;
  type: OrderType;
  quantity: number;
  price?: number;
  stopPrice?: number;
  status: OrderStatus;
  timestamp: Date;
  filledQuantity?: number;
  avgFillPrice?: number;
}

export interface Position {
  symbol: string;
  company: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  unrealizedPnl: number;
  unrealizedPnlPercent: number;
  dayChange: number;
  dayChangePercent: number;
  logo?: string;
  miniChart?: number[];
}

export interface Trade {
  id: string;
  symbol: string;
  side: OrderSide;
  quantity: number;
  price: number;
  timestamp: Date;
  orderId: string;
}

export interface Portfolio {
  totalValue: number;
  cash: number;
  unrealizedPnl: number;
  dayChange: number;
  dayChangePercent: number;
}

export interface BotStatus {
  id: string;
  name: string;
  status: 'RUNNING' | 'STOPPED' | 'ERROR';
  strategy: string;
  pnl: number;
  positions: Position[];
  lastUpdate: Date;
}

export interface MarketData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  high: number;
  low: number;
  open: number;
  timestamp: Date;
}
