
import React, { useState } from 'react';
import { Settings, AlertTriangle, CheckCircle } from 'lucide-react';

interface TradingModeToggleProps {
  currentMode: 'paper' | 'live';
  onModeChange: (mode: 'paper' | 'live') => void;
}

export const TradingModeToggle: React.FC<TradingModeToggleProps> = ({
  currentMode,
  onModeChange,
}) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingMode, setPendingMode] = useState<'paper' | 'live'>('paper');

  const handleModeToggle = (mode: 'paper' | 'live') => {
    if (mode === 'live' && currentMode === 'paper') {
      setPendingMode(mode);
      setShowConfirm(true);
    } else {
      onModeChange(mode);
    }
  };

  const confirmModeChange = () => {
    onModeChange(pendingMode);
    setShowConfirm(false);
  };

  return (
    <>
      <div className="flex items-center space-x-3 bg-[#1c1f26] p-3 rounded-lg border border-gray-700/50">
        <Settings className="w-4 h-4 text-gray-400" />
        <span className="text-sm text-gray-300">Trading Mode:</span>
        
        <div className="flex bg-[#0e1117] rounded-lg p-1">
          <button
            onClick={() => handleModeToggle('paper')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              currentMode === 'paper'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Paper Trading
          </button>
          <button
            onClick={() => handleModeToggle('live')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              currentMode === 'live'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Live Trading
          </button>
        </div>

        <div className="flex items-center space-x-1">
          {currentMode === 'paper' ? (
            <>
              <CheckCircle className="w-4 h-4 text-blue-500" />
              <span className="text-xs text-blue-400">Safe Mode</span>
            </>
          ) : (
            <>
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <span className="text-xs text-red-400">Real Money</span>
            </>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#1c1f26] border border-gray-700 rounded-lg p-6 max-w-md mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-500" />
              <h3 className="text-lg font-semibold text-white">Switch to Live Trading?</h3>
            </div>
            
            <p className="text-gray-300 mb-6">
              You are about to switch to live trading mode. This will use real money and execute actual trades. 
              Make sure your strategies are thoroughly tested before proceeding.
            </p>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmModeChange}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Confirm Live Trading
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
