
import { Injectable } from '@nestjs/common';
import { EventEmitter } from 'events';
import WebSocket from 'ws';
import { IDataFeed } from '../../../../packages/shared/src/interfaces';
import { Tick } from '../../../../types';

@Injectable()
export class BinanceDataFeed extends EventEmitter implements IDataFeed {
  private ws: WebSocket | null = null;
  private subscribedSymbols: string[] = [];
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket('wss://stream.binance.com:9443/ws/!ticker@arr');
        
        this.ws.on('open', () => {
          console.log('Binance WebSocket connected');
          this.isConnected = true;
          this.reconnectAttempts = 0;
          this.emit('connect');
          resolve();
        });

        this.ws.on('message', (data) => {
          try {
            const tickers = JSON.parse(data.toString());
            
            if (Array.isArray(tickers)) {
              tickers.forEach(ticker => {
                const symbol = this.formatSymbol(ticker.s);
                if (this.subscribedSymbols.includes(symbol)) {
                  const tick: Tick = {
                    symbol,
                    price: parseFloat(ticker.c),
                    volume: parseFloat(ticker.v),
                    timestamp: new Date(ticker.E),
                    high: parseFloat(ticker.h),
                    low: parseFloat(ticker.l),
                    open: parseFloat(ticker.o),
                    bid: parseFloat(ticker.b),
                    ask: parseFloat(ticker.a),
                  };
                  this.emit('tick', tick);
                }
              });
            }
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        });

        this.ws.on('close', () => {
          console.log('Binance WebSocket disconnected');
          this.isConnected = false;
          this.emit('disconnect');
          this.handleReconnect();
        });

        this.ws.on('error', (error) => {
          console.error('Binance WebSocket error:', error);
          reject(error);
        });

      } catch (error) {
        reject(error);
      }
    });
  }

  async subscribe(symbols: string[]): Promise<void> {
    this.subscribedSymbols = symbols;
    console.log(`Subscribed to symbols: ${symbols.join(', ')}`);
  }

  private handleReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        this.connect().catch(error => {
          console.error('Reconnection failed:', error);
        });
      }, 1000 * this.reconnectAttempts);
    } else {
      console.error('Max reconnection attempts reached');
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

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}
