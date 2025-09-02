
import { create } from 'zustand';
import { BotStatus, Position, Order, Trade, PortfolioStats } from '../../../types';

interface BotStore {
  // Bot Management
  bots: BotStatus[];
  activeBots: string[];
  
  // Portfolio Data
  positions: Position[];
  orders: Order[];
  trades: Trade[];
  portfolioStats: PortfolioStats;
  
  // UI State
  isConnected: boolean;
  lastUpdate: Date;
  
  // Actions
  setBots: (bots: BotStatus[]) => void;
  updateBotStatus: (botName: string, status: BotStatus['status']) => void;
  startBot: (botName: string) => void;
  stopBot: (botName: string) => void;
  
  setPositions: (positions: Position[]) => void;
  updatePosition: (symbol: string, updates: Partial<Position>) => void;
  
  setOrders: (orders: Order[]) => void;
  addOrder: (order: Order) => void;
  updateOrder: (orderId: string, updates: Partial<Order>) => void;
  
  setTrades: (trades: Trade[]) => void;
  addTrade: (trade: Trade) => void;
  
  updatePortfolioStats: (stats: PortfolioStats) => void;
  setConnectionStatus: (connected: boolean) => void;
  updateLastUpdate: () => void;
}

export const useBotStore = create<BotStore>((set, get) => ({
  // Initial State
  bots: [
    {
      name: 'Equity-Bot-1',
      status: 'running',
      pnl: 2450.75,
      strategy: { name: 'Moving Average Crossover', symbol: 'RELIANCE' },
      lastUpdate: new Date()
    },
    {
      name: 'Crypto-Bot-1',
      status: 'stopped',
      pnl: -150.50,
      strategy: { name: 'RSI Divergence', symbol: 'BTC-USDT' },
      lastUpdate: new Date()
    }
  ],
  activeBots: ['Equity-Bot-1'],
  
  positions: [
    {
      id: '1',
      symbol: 'RELIANCE',
      quantity: 100,
      avgPrice: 2450.50,
      currentPrice: 2465.75,
      pnl: 1525.00,
      dayChange: 15.25,
      dayChangePercent: 0.62,
      unrealizedPnl: 1525.00,
      miniChart: [
        { time: Date.now() - 86400000, price: 2440 },
        { time: Date.now() - 43200000, price: 2455 },
        { time: Date.now(), price: 2465.75 }
      ]
    },
    {
      id: '2',
      symbol: 'TCS',
      quantity: 50,
      avgPrice: 3650.00,
      currentPrice: 3645.25,
      pnl: -237.50,
      dayChange: -4.75,
      dayChangePercent: -0.13,
      unrealizedPnl: -237.50,
      miniChart: [
        { time: Date.now() - 86400000, price: 3655 },
        { time: Date.now() - 43200000, price: 3648 },
        { time: Date.now(), price: 3645.25 }
      ]
    }
  ],
  
  orders: [
    {
      id: '1',
      symbol: 'HDFC',
      side: 'BUY',
      quantity: 25,
      price: 1650.00,
      status: 'PENDING',
      timestamp: new Date(),
      botName: 'Equity-Bot-1'
    }
  ],
  
  trades: [
    {
      id: '1',
      symbol: 'RELIANCE',
      side: 'BUY',
      quantity: 100,
      price: 2450.50,
      pnl: 0,
      timestamp: new Date(Date.now() - 3600000),
      botName: 'Equity-Bot-1'
    }
  ],
  
  portfolioStats: {
    totalValue: 125430.50,
    totalPnl: 25430.50,
    dayChange: 1250.75,
    dayChangePercent: 2.15,
    cashBalance: 45000.00,
    marginUsed: 15000.00
  },
  
  isConnected: true,
  lastUpdate: new Date(),
  
  // Actions
  setBots: (bots) => set({ bots }),
  
  updateBotStatus: (botName, status) => set((state) => ({
    bots: state.bots.map(bot => 
      bot.name === botName 
        ? { ...bot, status, lastUpdate: new Date() }
        : bot
    )
  })),
  
  startBot: (botName) => set((state) => ({
    activeBots: [...state.activeBots.filter(name => name !== botName), botName],
    bots: state.bots.map(bot => 
      bot.name === botName 
        ? { ...bot, status: 'running' as const, lastUpdate: new Date() }
        : bot
    )
  })),
  
  stopBot: (botName) => set((state) => ({
    activeBots: state.activeBots.filter(name => name !== botName),
    bots: state.bots.map(bot => 
      bot.name === botName 
        ? { ...bot, status: 'stopped' as const, lastUpdate: new Date() }
        : bot
    )
  })),
  
  setPositions: (positions) => set({ positions }),
  
  updatePosition: (symbol, updates) => set((state) => ({
    positions: state.positions.map(pos => 
      pos.symbol === symbol ? { ...pos, ...updates } : pos
    )
  })),
  
  setOrders: (orders) => set({ orders }),
  
  addOrder: (order) => set((state) => ({
    orders: [order, ...state.orders]
  })),
  
  updateOrder: (orderId, updates) => set((state) => ({
    orders: state.orders.map(order => 
      order.id === orderId ? { ...order, ...updates } : order
    )
  })),
  
  setTrades: (trades) => set({ trades }),
  
  addTrade: (trade) => set((state) => ({
    trades: [trade, ...state.trades.slice(0, 99)] // Keep last 100 trades
  })),
  
  updatePortfolioStats: (stats) => set({ portfolioStats: stats }),
  
  setConnectionStatus: (connected) => set({ isConnected: connected }),
  
  updateLastUpdate: () => set({ lastUpdate: new Date() })
}));
