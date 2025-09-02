
import React from 'react';
import { Activity, RefreshCw } from 'lucide-react';

interface HeaderProps {
  lastUpdated?: Date;
  onRefresh?: () => void;
}

const Header: React.FC<HeaderProps> = ({ lastUpdated, onRefresh }) => {
  return (
    <header className="bg-[#1c1f26] h-16 flex items-center justify-between px-6 border-b border-gray-700/50">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Activity className="w-6 h-6 text-[#3bc9f4]" />
          <div>
            <h1 className="text-lg font-bold text-white">Chimera</h1>
            <p className="text-xs text-gray-400">Trading Terminal</p>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {lastUpdated && (
          <div className="text-sm text-gray-400">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
        )}
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="flex items-center space-x-2 px-3 py-1.5 bg-[#3bc9f4]/20 text-[#3bc9f4] rounded-lg hover:bg-[#3bc9f4]/30 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="text-sm">Refresh</span>
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
