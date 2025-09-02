
import React from 'react';

const mockHistory = [
    { id: 'job-123', strategy: 'MACrossStrategy', symbol: 'INFY', range: '2023-01-01 - 2024-01-01', status: 'Completed', pnl: 15230.50, sharpe: 1.85 },
    { id: 'job-124', strategy: 'RSI Momentum', symbol: 'BTC/USD', range: '2022-06-01 - 2023-06-01', status: 'Completed', pnl: -2340.10, sharpe: -0.42 },
    { id: 'job-125', strategy: 'Mean Reversion', symbol: 'EUR/USD', range: '2023-10-01 - 2024-01-01', status: 'Running', pnl: null, sharpe: null },
];

const BacktestingPage: React.FC = () => {
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Backtesting Hub</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1 bg-chimera-lightdark rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Submit a Backtest Job</h3>
          <form className="space-y-4">
            <div>
              <label className="text-sm text-chimera-lightgrey">Strategy</label>
              <select className="w-full bg-chimera-grey p-2 rounded-md mt-1">
                <option>MACrossStrategy</option>
                <option>RSI Momentum</option>
                <option>Mean Reversion</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-chimera-lightgrey">Symbol</label>
              <input type="text" placeholder="e.g., INFY" className="w-full bg-chimera-grey p-2 rounded-md mt-1" />
            </div>
             <div>
              <label className="text-sm text-chimera-lightgrey">Date Range</label>
              <div className="flex space-x-2 mt-1">
                <input type="date" className="w-full bg-chimera-grey p-2 rounded-md" />
                <input type="date" className="w-full bg-chimera-grey p-2 rounded-md" />
              </div>
            </div>
            <div>
              <label className="text-sm text-chimera-lightgrey">Parameters (JSON)</label>
              <textarea rows={5} placeholder='{ "fast_ema": 12, "slow_ema": 26 }' className="w-full bg-chimera-grey p-2 rounded-md mt-1 font-mono text-sm"></textarea>
            </div>
            <button type="submit" className="w-full py-3 font-bold rounded-md bg-chimera-blue hover:bg-chimera-blue/90">
                🚀 Run Backtest
            </button>
          </form>
        </div>
        <div className="lg:col-span-2 bg-chimera-lightdark rounded-lg p-2">
            <h3 className="text-lg font-semibold mb-2 p-2">Backtest History</h3>
            <div className="overflow-y-auto">
                 <table className="w-full text-left text-sm">
                    <thead className="sticky top-0 bg-chimera-lightdark">
                        <tr className="text-chimera-lightgrey border-b border-chimera-grey">
                            <th className="p-2 font-medium">Strategy</th>
                            <th className="p-2 font-medium">Symbol</th>
                            <th className="p-2 font-medium">Status</th>
                            <th className="p-2 font-medium text-right">Net P&L</th>
                            <th className="p-2 font-medium text-right">Sharpe Ratio</th>
                            <th className="p-2 font-medium text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockHistory.map(h => (
                            <tr key={h.id} className="border-b border-chimera-grey/50 hover:bg-chimera-grey/40">
                                <td className="p-2 font-semibold">{h.strategy}</td>
                                <td className="p-2">{h.symbol}</td>
                                <td className="p-2">{h.status}</td>
                                <td className={`p-2 font-mono text-right ${h.pnl > 0 ? 'text-chimera-green' : 'text-chimera-red'}`}>{h.pnl?.toFixed(2) || '-'}</td>
                                <td className={`p-2 font-mono text-right ${h.sharpe > 1 ? 'text-chimera-green' : 'text-chimera-lightgrey'}`}>{h.sharpe?.toFixed(2) || '-'}</td>
                                <td className="p-2 text-center">
                                    <button className="text-chimera-blue font-semibold text-xs">View Report</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                 </table>
            </div>
        </div>
      </div>
    </div>
  );
};

export default BacktestingPage;
