
import { create } from 'zustand';
import { Order, Position, SystemLog, BotStatus } from '../../../types';

type ConnectionStatus = 'Connected' | 'Connecting' | 'Disconnected';

interface BotState {
  bots: string[];
  selectedBot: string; // Will be used in the sidebar's bot control
  connectionStatus: ConnectionStatus;
  lastHeartbeat: Date | null;
  positions: Position[];
  orders: Order[];
  logs: SystemLog[];
  botStatuses: { [botName: string]: BotStatus };
  sendMessage: (message: string) => void;
  actions: {
    selectBot: (botName: string) => void;
    setConnectionStatus: (status: ConnectionStatus) => void;
    setInitialState: (data: { positions: Position[]; orders: Order[]; botStatuses: { [botName: string]: BotStatus } }) => void;
    updatePosition: (position: Position) => void;
    updateOrder: (order: Order) => void;
    addLog: (log: SystemLog) => void;
    updateBotStatus: (status: BotStatus) => void;
    setHeartbeat: (date: Date) => void;
    setSendMessage: (fn: (message: string) => void) => void;
  };
}

export const useBotStore = create<BotState>((set, get) => ({
  bots: ['bot-equities', 'bot-crypto', 'bot-forex'],
  selectedBot: 'bot-equities', // Default to a specific bot instead of 'all'
  connectionStatus: 'Connecting',
  lastHeartbeat: null,
  positions: [],
  orders: [],
  logs: [],
  botStatuses: {},
  sendMessage: (message: string) => { console.warn('sendMessage function not initialized'); },
  actions: {
    selectBot: (botName) => set({ selectedBot: botName }),
    setConnectionStatus: (status) => set({ connectionStatus: status }),
    setHeartbeat: (date) => set({ lastHeartbeat: date }),
    setInitialState: (data) => set({ 
        positions: data.positions, 
        orders: data.orders,
        botStatuses: data.botStatuses,
    }),
    updatePosition: (position) => {
      set(state => ({
        positions: [
          ...state.positions.filter(p => !(p.symbol === position.symbol && p.botName === position.botName)),
          position
        ].sort((a,b) => a.symbol.localeCompare(b.symbol))
      }));
    },
    updateOrder: (order) => {
      set(state => ({
        orders: [
          ...state.orders.filter(o => o.id !== order.id),
          order
        ].sort((a,b) => b.createdAt.getTime() - a.createdAt.getTime())
      }));
    },
    addLog: (log) => {
        set(state => ({
            logs: [log, ...state.logs.slice(0, 199)] // Keep latest 200 logs
        }));
    },
    updateBotStatus: (status) => {
        set(state => ({
            botStatuses: {
                ...state.botStatuses,
                [status.name]: status,
            }
        }));
    },
    setSendMessage: (fn) => set({ sendMessage: fn }),
  }
}));
