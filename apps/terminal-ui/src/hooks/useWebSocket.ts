
import { useEffect, useRef } from 'react';
import { useBotStore } from '../store/botStore';
import { BotStatus, Order, Position, SystemLog } from '../../../types';

ws.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          switch (data.type) {
            case 'BOT_STATUS':
              actions.updateBotStatus(data.payload);
              break;
            case 'ORDER_UPDATE':
              actions.updateOrder(data.payload);
              break;
            case 'POSITION_UPDATE':
              actions.updatePosition(data.payload);
              break;
            case 'LOG':
              actions.addLog(data.payload);
              break;
            case 'TICK':
              // Handle real-time price updates
              actions.updateTick(data.payload);
              break;
            default:
              console.log('Unknown message type:', data.type);
          }
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };
const mockPositions: Position[] = [
    { botName: 'bot-equities', symbol: 'RELIANCE', quantity: 10, averagePrice: 2500.50, unrealizedPnl: 150.25 },
    { botName: 'bot-crypto', symbol: 'BTC/USD', quantity: 0.5, averagePrice: 68000, unrealizedPnl: -500 },
];

export const useWebSocket = (url: string) => {
  const { actions } = useBotStore();
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    // For demonstration, let's populate with some initial mock data.
    // In a real scenario, this would come from an 'initial_state' message.
    actions.setInitialState({
        positions: mockPositions,
        orders: [],
        botStatuses: mockBotStatuses,
    });
    actions.setHeartbeat(new Date());

    // TODO: Remove mock log generation - real logs will come via WebSocket


    if (!url) return;

    const connect = () => {
      ws.current = new WebSocket(url);
      actions.setConnectionStatus('Connecting');

      ws.current.onopen = () => {
        console.log('WebSocket Connected');
        actions.setConnectionStatus('Connected');
        actions.setSendMessage((message: string) => {
            ws.current?.send(message);
        });
      };

      ws.current.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          switch (message.event) {
            case 'initial_state':
              actions.setInitialState(message.data);
              break;
            case 'position_update':
              actions.updatePosition(message.data);
              break;
            case 'order_update':
              actions.updateOrder(message.data);
              break;
            case 'log_message':
                actions.addLog(message.data);
                break;
            case 'bot_status_update':
                actions.updateBotStatus(message.data);
                break;
            case 'heartbeat':
                actions.setHeartbeat(new Date(message.data.timestamp));
                break;
            default:
              console.warn('Received unknown event type:', message.event);
          }
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      ws.current.onclose = () => {
        console.log('WebSocket Disconnected. Attempting to reconnect...');
        actions.setConnectionStatus('Disconnected');
        setTimeout(connect, 5000); 
      };
      
      ws.current.onerror = (err) => {
        console.error('WebSocket Error:', err);
        ws.current?.close();
      };
    };

    connect();

    return () => {
      if (ws.current) {
        ws.current.close();
      }
      clearInterval(logInterval);
    };
  }, [url, actions]);
};
