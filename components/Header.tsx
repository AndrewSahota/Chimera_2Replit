import React, { useState, useEffect } from 'react';
import { 
  RefreshCw, 
  Zap, 
  DollarSign, 
  TrendingUp,
  Activity,
  AlertCircle 
} from 'lucide-react';
import { PortfolioStats } from '../types';
import { TradingModeToggle } from './TradingModeToggle';

export default function Header() {
  const [portfolioStats, setPortfolioStats] = useState<PortfolioStats>({
    totalValue: 125430.50,
    totalPnl: 25430.50,
    dayChange: 1250.75,
    dayChangePercent: 2.15,
    cashBalance: 45000.00,
    marginUsed: 15000.00
  });

  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isConnected, setIsConnected] = useState(true);
  const [tradingMode, setTradingMode] = useState<'paper' | 'live'>('paper');

  const handleRefresh = () => {
    setLastUpdate(new Date());
    // Simulate data refresh
    console.log('Refreshing data...');
  };

  const handleTradingModeChange = (mode: 'paper' | 'live') => {
    setTradingMode(mode);
    console.log(`Trading mode changed to: ${mode}`);
    // In a real application, you would trigger data updates or API changes here
  };

  return (
    <div className="bg-[#1c1f26] border-b border-gray-700/50 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-white">Trading Dashboard</h1>
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <span>Last updated: {lastUpdate.toLocaleTimeString()}</span>
            <button 
              onClick={handleRefresh}
              className="p-1 hover:bg-gray-700/50 rounded transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm text-gray-400">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>

          <div className="flex items-center space-x-2 bg-green-900/20 text-green-400 px-3 py-1 rounded-full text-sm">
            <Zap className="w-4 h-4" />
            <span>{tradingMode === 'live' ? 'Live Trading' : 'Paper Trading'}</span>
          </div>
          <TradingModeToggle 
            currentMode={tradingMode} 
            onChange={handleTradingModeChange} 
          />
        </div>
      </div>

      {/* Portfolio Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#0e1117] p-4 rounded-lg border border-gray-700/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Portfolio Value</span>
            <DollarSign className="w-4 h-4 text-[#3bc9f4]" />
          </div>
          <div className="text-2xl font-bold text-white">
            ${portfolioStats.totalValue.toLocaleString()}
          </div>
          <div className="flex items-center space-x-1 mt-1">
            <div className="w-12 h-1 bg-gradient-to-r from-green-500 to-blue-500 rounded"></div>
          </div>
        </div>

        <div className="bg-[#0e1117] p-4 rounded-lg border border-gray-700/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Total P&L</span>
            <TrendingUp className="w-4 h-4 text-green-500" />
          </div>
          <div className={`text-2xl font-bold ${portfolioStats.totalPnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {portfolioStats.totalPnl >= 0 ? '+' : ''}${portfolioStats.totalPnl.toLocaleString()}
          </div>
          <div className="flex items-center space-x-1 mt-1">
            <div className={`w-12 h-1 ${portfolioStats.totalPnl >= 0 ? 'bg-green-500' : 'bg-red-500'} rounded`}></div>
          </div>
        </div>

        <div className="bg-[#0e1117] p-4 rounded-lg border border-gray-700/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Day Change</span>
            <Activity className="w-4 h-4 text-[#3bc9f4]" />
          </div>
          <div className={`text-2xl font-bold ${portfolioStats.dayChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {portfolioStats.dayChange >= 0 ? '+' : ''}${portfolioStats.dayChange.toLocaleString()}
          </div>
          <div className={`text-sm ${portfolioStats.dayChangePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {portfolioStats.dayChangePercent >= 0 ? '+' : ''}{portfolioStats.dayChangePercent.toFixed(2)}%
          </div>
        </div>

        <div className="bg-[#0e1117] p-4 rounded-lg border border-gray-700/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Cash/Margin</span>
            <AlertCircle className="w-4 h-4 text-[#3bc9f4]" />
          </div>
          <div className="text-2xl font-bold text-white">
            ${portfolioStats.cashBalance.toLocaleString()}
          </div>
          <div className="text-sm text-gray-400">
            Margin: ${portfolioStats.marginUsed.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}