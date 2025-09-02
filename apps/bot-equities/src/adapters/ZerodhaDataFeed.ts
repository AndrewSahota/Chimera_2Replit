import { Injectable } from '@nestjs/common';
import { EventEmitter } from 'events';
import WebSocket from 'ws';
import { IDataFeed } from '../../../../packages/shared/src/interfaces';
import { Tick } from '../../../../types';

@Injectable()
export class ZerodhaDataFeed extends EventEmitter implements IDataFeed {
  private ws: WebSocket | null = null;
  private apiKey: string;
  private accessToken: string;
  
  constructor() {
    super();
    this.apiKey = process.env.ZERODHA_API_KEY!;
    this.accessToken = process.env.ZERODHA_ACCESS_TOKEN!;
     if (!this.apiKey || !this.accessToken) {
        throw new Error('Zerodha API key and access token must be provided in environment variables.');
    }
  }
  
  async connect(): Promise<void> {
    const tickerUrl = `wss://ws.kite.trade?api_key=${this.apiKey}&access_token=${this.accessToken}`;
    this.ws = new WebSocket(tickerUrl);
    
    this.ws.on('open', () => {
      console.log('ZerodhaDataFeed WebSocket connected.');
      this.emit('connect');
    });
    
    this.ws.on('message', (data: WebSocket.Data) => {
      // Zerodha sends binary data which needs to be parsed.
      // This is a placeholder for the complex parsing logic.
      // We will log a message to indicate data is received.
      console.log('Received binary data from Zerodha WebSocket.');
    });

    this.ws.on('close', () => {
      console.log('ZerodhaDataFeed WebSocket disconnected.');
      this.emit('disconnect');
    });

    this.ws.on('error', (error) => {
      console.error('ZerodhaDataFeed WebSocket error:', error);
    });
  }

  async subscribe(symbols: string[]): Promise<void> {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket is not connected.');
    }
    console.log(`Subscribing to Zerodha instruments: ${symbols.join(', ')}`);
    // Zerodha uses instrument tokens for subscription.
    // A real implementation would need a service to map symbols to tokens.
    const instrumentTokens = [256265]; // Placeholder token for NIFTY 50
    
    const subscriptionMessage = {
      a: 'subscribe',
      v: instrumentTokens,
    };
    this.ws.send(JSON.stringify(subscriptionMessage));

    // Also set mode to full to get all data points
    const modeMessage = {
        a: 'mode',
        v: ['full', instrumentTokens]
    }
    this.ws.send(JSON.stringify(modeMessage));
  }
}
