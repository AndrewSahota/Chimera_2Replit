
import React from 'react';
import { Position } from '../types';

interface PositionsTableProps {
  positions: Position[];
}

const PositionsTable: React.FC<PositionsTableProps> = ({ positions }) => {
  // Helper to map bot name to asset class
  const getAssetClass = (botName: string) => {
    if (botName.includes('equities')) return 'Equities';
    if (botName.includes('crypto')) return 'Crypto';
    if (botName.includes('forex')) return 'Forex';
    return 'Unknown';
  }
    
  return (
    <div className="h-full flex flex-col">
      <h3 className="text-md font-semibold mb-2 px-1">Current Positions</h3>
      <div className="overflow-y-auto flex-grow">
        <table className="w-full text-left text-xs">
          <thead className="sticky top-0 bg-chimera-lightdark">
            <tr className="text-chimera-lightgrey border-b border-chimera-grey">
              <th className="p-2 font-medium">Asset Class</th>
              <th className="p-2 font-medium">Symbol</th>
              <th className="p-2 font-medium text-right">Quantity</th>
              <th className="p-2 font-medium text-right">Avg. Entry Price</th>
              <th className="p-2 font-medium text-right">Unrealized P&L</th>
              <th className="p-2 font-medium">Bot</th>
            </tr>
          </thead>
          <tbody>
            {positions.length === 0 ? (
              <tr>
                  <td colSpan={6} className="text-center py-4 text-chimera-lightgrey">No open positions</td>
              </tr>
            ) : (
              positions.map((pos) => (
                <tr key={`${pos.botName}-${pos.symbol}`} className="border-b border-chimera-grey/50 hover:bg-chimera-grey/40 font-mono">
                  <td className="p-2">{getAssetClass(pos.botName)}</td>
                  <td className="p-2 font-semibold">{pos.symbol}</td>
                  <td className={`p-2 text-right ${pos.quantity > 0 ? 'text-chimera-green' : 'text-chimera-red'}`}>
                    {pos.quantity.toFixed(4)}
                  </td>
                  <td className="p-2 text-right">${pos.averagePrice.toFixed(2)}</td>
                  <td className={`p-2 text-right ${pos.unrealizedPnl >= 0 ? 'text-chimera-green' : 'text-chimera-red'}`}>
                    {pos.unrealizedPnl.toFixed(2)}
                  </td>
                   <td className="p-2 text-chimera-lightgrey">{pos.botName}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PositionsTable;
