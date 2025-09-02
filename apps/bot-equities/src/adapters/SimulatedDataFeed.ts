import { Injectable } from '@nestjs/common';
import { EventEmitter } from 'events';
import { IDataFeed } from '../../../../packages/shared/src/interfaces';
import { Tick } from '../../../../types';

@Injectable()
export class SimulatedDataFeed extends EventEmitter implements IDataFeed {
  private lastPrice = 69000;
  private interval: NodeJS.Timeout | null = null;
  
  constructor() {
    super();
  }

  async connect(): Promise<void> {
    console.log('SimulatedDataFeed connected.');
    this.emit('connect');
  }

  async subscribe(symbols: string[]): Promise<void> {
    console.log(`Subscribing to ${symbols.join(', ')}`);
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.interval = setInterval(() => {
      // Simulating for the first symbol for simplicity
      if (symbols.length > 0) {
        this.generateTick(symbols[0]);
      }
    }, 1000);
  }

  private generateTick(symbol: string) {
    const change = (Math.random() - 0.5) * (this.lastPrice * 0.0005);
    this.lastPrice += change;
    const newTick: Tick = {
      symbol: symbol,
      price: this.lastPrice,
      timestamp: new Date(),
    };
    this.emit('tick', newTick);
  }
}
