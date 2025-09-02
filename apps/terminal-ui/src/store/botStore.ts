
import { create } from 'zustand';

interface BotStatus {
  name: string;
  status: 'running' | 'stopped' | 'error';
  pnl: number;
  strategy: {
    name: string;
    symbol: string;
  };
}

interface Position {
  symbol: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  pnl: number;
}

interface BotStore {
  bots: BotStatus[];
  selectedBot: string;
  positions: Position[];
  actions: {
    selectBot: (botName: string) => void;
    updateBotStatus: (botName: string, status: Partial<BotStatus>) => void;
    updatePositions: (positions: Position[]) => void;
  };
}

export const useBotStore = create<BotStore>((set, get) => ({
  bots: [
    {
      name: 'equity-bot',
      status: 'running',
      pnl: 1250.75,
      strategy: { name: 'ML Signal Strategy', symbol: 'RELIANCE' }
    },
    {
      name: 'crypto-bot',
      status: 'stopped',
      pnl: -450.25,
      strategy: { name: 'Grid Strategy', symbol: 'BTCUSDT' }
    }
  ],
  selectedBot: 'equity-bot',
  positions: [
    {
      symbol: 'RELIANCE',
      quantity: 100,
      avgPrice: 2450.50,
      currentPrice: 2465.75,
      pnl: 1525.00
    },
    {
      symbol: 'TCS',
      quantity: 50,
      avgPrice: 3200.25,
      currentPrice: 3185.50,
      pnl: -737.50
    }
  ],
  actions: {
    selectBot: (botName: string) => set({ selectedBot: botName }),
    updateBotStatus: (botName: string, status: Partial<BotStatus>) =>
      set((state) => ({
        bots: state.bots.map((bot) =>
          bot.name === botName ? { ...bot, ...status } : bot
        ),
      })),
    updatePositions: (positions: Position[]) => set({ positions }),
  },
}));
