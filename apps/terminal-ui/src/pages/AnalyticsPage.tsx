
import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, LineChart, Line } from 'recharts';
import { useBotStore } from '../store/botStore';

const KpiCard = ({ title, value, format }: { title: string; value: number; format: (v: number) => string }) => (
    <div className="bg-chimera-grey p-4 rounded-lg">
        <p className="text-sm text-chimera-lightgrey">{title}</p>
        <p className="text-2xl font-bold font-mono">{format(value)}</p>
    </div>
);

export const AnalyticsPage: React.FC = () => {
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const { selectedBot } = useBotStore();

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                // Mock data for development
                const mockData = {
                    kpis: {
                        totalPnl: 1250.75,
                        winRate: 0.65,
                        maxDrawdown: 0.08,
                        totalTrades: 145
                    },
                    combinedChartData: Array.from({ length: 30 }, (_, i) => ({
                        time: Date.now() - (30 - i) * 24 * 60 * 60 * 1000,
                        liveEquity: 100000 + i * 500 + Math.random() * 1000,
                        backtestEquity: 100000 + i * 450 + Math.random() * 800
                    }))
                };
                
                setData(mockData);
                setError(null);
            } catch (err) {
                setError('Failed to fetch analytics data');
                console.error('Analytics fetch error:', err);
            }
        };

        fetchAnalytics();
    }, [selectedBot]);

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

    if (!data) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="text-chimera-lightgrey">Loading analytics...</div>
            </div>
        );
    }

    const { kpis } = data;

    return (
        <div className="h-full flex flex-col p-4 gap-4">
            <h2 className="text-xl font-bold">Performance Analytics: {selectedBot}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <KpiCard title="Total P&L" value={kpis.totalPnl} format={(v) => `$${v.toFixed(2)}`} />
                <KpiCard title="Win Rate" value={kpis.winRate} format={(v) => `${(v * 100).toFixed(2)}%`} />
                <KpiCard title="Max Drawdown" value={kpis.maxDrawdown} format={(v) => `${(v * 100).toFixed(2)}%`} />
                <KpiCard title="Total Trades" value={kpis.totalTrades} format={(v) => v.toString()} />
            </div>
            <div className="flex-grow bg-chimera-lightdark rounded-md p-4">
                 <h3 className="font-semibold mb-4">Equity Curve</h3>
                 <ResponsiveContainer width="100%" height="90%">
                    <LineChart data={data.combinedChartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#2a2e39" />
                         <XAxis 
                            dataKey="time" 
                            tickFormatter={(time) => new Date(time).toLocaleDateString()} 
                            stroke="#4f5966"
                            tick={{ fill: '#d1d5db', fontSize: 12 }}
                        />
                        <YAxis 
                            dataKey="liveEquity"
                            orientation="right"
                            stroke="#4f5966"
                            tick={{ fill: '#d1d5db', fontSize: 12 }}
                        />
                        <Tooltip 
                            labelFormatter={(time) => new Date(time).toLocaleString()}
                            formatter={(value: number, name: string) => [`$${value.toFixed(2)}`, name]}
                            contentStyle={{ backgroundColor: '#1a1e29', border: '1px solid #2a2e39' }}
                        />
                        <Legend />
                        <Line 
                            type="monotone" 
                            dataKey="liveEquity" 
                            stroke="#2962ff" 
                            strokeWidth={2} 
                            name="Live Equity"
                            dot={false}
                        />
                        <Line 
                            type="monotone" 
                            dataKey="backtestEquity" 
                            stroke="#26a69a" 
                            strokeWidth={2} 
                            name="Backtest Equity"
                            dot={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
