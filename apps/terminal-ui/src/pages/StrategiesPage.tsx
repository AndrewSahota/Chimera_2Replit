
import React, { useState, useEffect } from 'react';

interface Strategy {
  id: string;
  name: string;
  description: string;
  symbol: string;
  parameters: Record<string, any>;
  isActive: boolean;
  lastBacktestDate?: Date;
  performance?: {
    totalReturn: number;
    sharpeRatio: number;
    maxDrawdown: number;
  };
}

export const StrategiesPage: React.FC = () => {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStrategies = async () => {
      try {
        // Mock data for development
        const mockStrategies: Strategy[] = [
          {
            id: '1',
            name: 'ML Signal Strategy',
            description: 'Machine learning based signal generation strategy',
            symbol: 'RELIANCE',
            parameters: {
              lookback: 20,
              threshold: 0.7,
              stopLoss: 2,
              takeProfit: 5
            },
            isActive: true,
            lastBacktestDate: new Date('2024-01-15'),
            performance: {
              totalReturn: 15.5,
              sharpeRatio: 1.8,
              maxDrawdown: 8.2
            }
          },
          {
            id: '2',
            name: 'Grid Trading Strategy',
            description: 'Grid-based trading strategy for crypto markets',
            symbol: 'BTCUSDT',
            parameters: {
              gridSize: 0.5,
              numberOfGrids: 10,
              orderSize: 0.1
            },
            isActive: false,
            lastBacktestDate: new Date('2024-01-10'),
            performance: {
              totalReturn: 8.3,
              sharpeRatio: 1.2,
              maxDrawdown: 12.1
            }
          }
        ];

        setStrategies(mockStrategies);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch strategies');
        setLoading(false);
      }
    };

    fetchStrategies();
  }, []);

  const handleToggleStrategy = async (strategyId: string) => {
    try {
      setStrategies(prev => prev.map(s => 
        s.id === strategyId ? { ...s, isActive: !s.isActive } : s
      ));
    } catch (err) {
      console.error('Failed to toggle strategy:', err);
    }
  };

  const handleRunBacktest = async (strategyId: string) => {
    try {
      console.log(`Running backtest for strategy ${strategyId}`);
      // In real implementation, this would trigger a backtest
    } catch (err) {
      console.error('Failed to run backtest:', err);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-chimera-lightgrey">Loading strategies...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-chimera-blue rounded-md"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Trading Strategies</h2>
        <button className="px-4 py-2 bg-chimera-blue rounded-md hover:bg-blue-600">
          Create New Strategy
        </button>
      </div>

      <div className="grid gap-4">
        {strategies.map((strategy) => (
          <div key={strategy.id} className="bg-chimera-lightdark p-4 rounded-lg">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">{strategy.name}</h3>
                <p className="text-chimera-lightgrey text-sm">{strategy.description}</p>
                <p className="text-sm mt-1">
                  <span className="font-medium">Symbol:</span> {strategy.symbol}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded text-xs ${
                  strategy.isActive 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-600 text-gray-300'
                }`}>
                  {strategy.isActive ? 'Active' : 'Inactive'}
                </span>
                <button
                  onClick={() => handleToggleStrategy(strategy.id)}
                  className={`px-3 py-1 rounded text-xs ${
                    strategy.isActive 
                      ? 'bg-red-600 hover:bg-red-700' 
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {strategy.isActive ? 'Stop' : 'Start'}
                </button>
              </div>
            </div>

            {strategy.performance && (
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-xs text-chimera-lightgrey">Total Return</p>
                  <p className="font-mono text-sm">{strategy.performance.totalReturn.toFixed(1)}%</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-chimera-lightgrey">Sharpe Ratio</p>
                  <p className="font-mono text-sm">{strategy.performance.sharpeRatio.toFixed(2)}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-chimera-lightgrey">Max Drawdown</p>
                  <p className="font-mono text-sm">{strategy.performance.maxDrawdown.toFixed(1)}%</p>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center text-xs text-chimera-lightgrey">
              <span>
                Last backtest: {strategy.lastBacktestDate?.toLocaleDateString() || 'Never'}
              </span>
              <button
                onClick={() => handleRunBacktest(strategy.id)}
                className="px-3 py-1 bg-chimera-grey hover:bg-gray-600 rounded text-white"
              >
                Run Backtest
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
