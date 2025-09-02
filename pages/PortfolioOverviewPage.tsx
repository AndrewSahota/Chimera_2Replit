
import React from 'react';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend } from 'recharts';
import { useBotStore } from '../apps/terminal-ui/src/store/botStore';
import PositionsTable from '../components/PositionsTable';

const KpiCard: React.FC<{ title: string; value: string; change?: string; changeColor?: string; }> = ({ title, value, change, changeColor }) => (
    <div className="bg-chimera-lightdark p-4 rounded-lg">
        <p className="text-sm text-chimera-lightgrey">{title}</p>
        <div className="flex items-baseline space-x-2">
            <p className="text-2xl font-bold font-mono">{value}</p>
            {change && <p className={`text-sm font-semibold ${changeColor}`}>{change}</p>}
        </div>
    </div>
);

// Mock data for equity curve and asset allocation
const equityData = Array.from({ length: 30 }, (_, i) => ({
  date: `Day ${i + 1}`,
  value: 100000 + i * 500 + Math.random() * 3000 - 1500,
}));

const allocationData = [
  { name: 'Equities', value: 45000 },
  { name: 'Crypto', value: 35000 },
  { name: 'Forex', value: 15000 },
  { name: 'Cash', value: 10000 },
];
const COLORS = ['#2962ff', '#26a69a', '#ef5350', '#4f5966'];


const PortfolioOverviewPage: React.FC = () => {
    const { positions } = useBotStore();
    const totalPortfolioValue = 105250.75; // Mock
    const pnl24h = 1250.25; // Mock
    const pnlPercent = (pnl24h / (totalPortfolioValue - pnl24h)) * 100;

    return (
        <div className="p-4 space-y-4">
            <h1 className="text-2xl font-bold">Portfolio Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <KpiCard title="Total Portfolio Value" value={`$${totalPortfolioValue.toFixed(2)}`} />
                <KpiCard title="Unrealized P&L (24h)" value={`$${pnl24h.toFixed(2)}`} change={`${pnlPercent.toFixed(2)}%`} changeColor="text-chimera-green" />
                <KpiCard title="Realized P&L (24h)" value="$850.10" />
                <KpiCard title="Active Bots" value="2 / 3" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[40vh]">
                <div className="lg:col-span-2 bg-chimera-lightdark rounded-lg p-4 flex flex-col">
                    <h3 className="font-semibold mb-4">Live Equity Curve</h3>
                    <div className="flex-grow">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={equityData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#2a2e39" />
                                <XAxis dataKey="date" stroke="#4f5966" tick={{ fill: '#d1d5db', fontSize: 12 }} />
                                <YAxis orientation="right" stroke="#4f5966" tickFormatter={(val) => `$${(val/1000).toFixed(0)}k`} tick={{ fill: '#d1d5db', fontSize: 12 }} />
                                <Tooltip contentStyle={{ backgroundColor: '#131722', border: '1px solid #4f5966' }} formatter={(value: number) => `$${value.toFixed(2)}`} />
                                <Line type="monotone" dataKey="value" stroke="#2962ff" strokeWidth={2} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="bg-chimera-lightdark rounded-lg p-4 flex flex-col">
                     <h3 className="font-semibold mb-4">Asset Allocation</h3>
                     <div className="flex-grow">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={allocationData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={'80%'}>
                                    {allocationData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#131722', border: '1px solid #4f5966' }}/>
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                     </div>
                </div>
            </div>

            <div className="bg-chimera-lightdark rounded-lg p-2 h-[calc(60vh-14rem)]">
                <PositionsTable positions={positions} />
            </div>
        </div>
    );
};

export default PortfolioOverviewPage;
