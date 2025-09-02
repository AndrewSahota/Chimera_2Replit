
import { useEffect, useRef } from 'react';
import { useBotStore } from '../store/botStore';
import { BotStatus, Order, Position, SystemLog } from '../../../types';

// Mocking some data for demonstration
const mockBotStatuses: { [key: string]: BotStatus } = {
  'bot-equities': { name: 'bot-equities', status: 'Running', strategy: { name: 'EMA Crossover', symbol: 'RELIANCE' } },
  'bot-crypto': { name: 'bot-crypto', status: 'Stopped', strategy: { name: 'Mean Reversion', symbol: 'BTC/USD' } },
  'bot-forex': { name: 'bot-forex', status: 'Error', strategy: { name: 'MACD Divergence', symbol: 'EUR/USD' } },
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

    // Mock live log updates
    const logInterval = setInterval(() => {
        const levels: SystemLog['level'][] = ['INFO', 'TRADE', 'ERROR', 'CMD', 'RISK'];
        const services = ['bot-equities', 'bot-crypto', 'Risk Overseer'];
        const messages = ['Connecting to Zerodha...', 'BUY order for 10 RELIANCE @ 2500.50 FILLED.', 'Lost connection to broker API.', 'StopStrategy command issued to Crypto Bot.', 'Portfolio drawdown has breached the -2% warning threshold.'];
        const randomLog: SystemLog = {
            timestamp: new Date(),
            level: levels[Math.floor(Math.random() * levels.length)],
            service: services[Math.floor(Math.random() * services.length)],
            message: messages[Math.floor(Math.random() * messages.length)],
        };
        actions.addLog(randomLog);
    }, 5000);


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
