import { Injectable, NotFoundException } from '@nestjs/common';
// import { PrismaService } from '../prisma/prisma.service'; // Assumes Prisma service exists

// Mock PrismaService for demonstration
const mockPrisma = {
  trade: {
    findMany: async (options) => {
      // Generate mock trade data for 'bot-equities'
      if (options.where.botName === 'bot-equities') {
        let pnl = 100000;
        const trades = [];
        for (let i = 0; i < 150; i++) {
            const tradePnl = (Math.random() - 0.45) * 500;
            pnl += tradePnl;
            trades.push({ 
                id: `trade-${i}`, 
                pnl: tradePnl, 
                timestamp: new Date(Date.now() - (150 - i) * 3600000) 
            });
        }
        return trades;
      }
      return [];
    },
  },
  strategyConfiguration: {
    // FIX: Updated mock function to accept an argument to match its usage.
    findFirst: async (options) => ({
        backtestResult: {
            totalPnl: 18500,
            winRate: 0.68,
            maxDrawdown: 0.08,
            equityCurve: Array.from({length: 150}, (_, i) => ({
                time: new Date(Date.now() - (150 - i) * 3600000).getTime(),
                equity: 100000 + (i * 120) + (Math.random() - 0.5) * 2000,
            }))
        }
    })
  }
};


@Injectable()
export class AnalyticsService {
  // constructor(private prisma: PrismaService) {}
  // Using mock for demonstration
  private prisma = mockPrisma;

  async getPerformance(botName: string) {
    const trades = await this.prisma.trade.findMany({
      where: { botName },
      orderBy: { timestamp: 'asc' },
    });

    if (trades.length === 0) {
      throw new NotFoundException(`No trades found for bot: ${botName}`);
    }

    let totalPnl = 0;
    let winningTrades = 0;
    let peakEquity = 100000; // Assuming initial capital
    let maxDrawdown = 0;
    let currentEquity = 100000;

    const equityCurve = trades.map(trade => {
      totalPnl += trade.pnl;
      currentEquity += trade.pnl;

      if (trade.pnl > 0) {
        winningTrades++;
      }

      if (currentEquity > peakEquity) {
        peakEquity = currentEquity;
      }

      const drawdown = (peakEquity - currentEquity) / peakEquity;
      if (drawdown > maxDrawdown) {
        maxDrawdown = drawdown;
      }

      return {
        time: trade.timestamp.getTime(),
        equity: currentEquity,
      };
    });

    const winRate = winningTrades / trades.length;

    // Fetch associated backtest result
    const activeConfig = await this.prisma.strategyConfiguration.findFirst({
        where: { botName, isActive: true },
        include: { backtestResult: true }
    });

    return {
      kpis: {
        totalPnl,
        winRate,
        maxDrawdown,
        totalTrades: trades.length,
      },
      liveEquityCurve: equityCurve,
      backtestResult: activeConfig?.backtestResult || null
    };
  }
}
