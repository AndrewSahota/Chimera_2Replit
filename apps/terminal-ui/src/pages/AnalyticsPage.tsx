
import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, LineChart, Line } from 'recharts';
import { useBotStore } from '../store/botStore';

const KpiCard = ({ title, value, format }) => (
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
        const fetchData = async () => {
            try {
                // In a real app, API host is configured
                const response = await fetch(`http://localhost:3000/api/analytics/performance?botName=${selectedBot === 'all' ? 'bot-equities' : selectedBot }`);
                if (!response.ok) {
                    throw new Error('Failed to fetch analytics data');
                }
                const result = await response.json();
                
                // Combine live and backtest data for charting
                const combinedData = result.liveEquityCurve.map(livePoint => {
                    const backtestPoint = result.backtestResult?.equityCurve.find(bp => bp.time === livePoint.time);
                    return {
                        time: livePoint.time,
                        liveEquity: livePoint.equity,
                        backtestEquity: backtestPoint ? backtestPoint.equity : null,
                    }
                });
                setData({ ...result, combinedChartData: combinedData });

            } catch (err) {
                setError(err.message);
                setData(null);
            }
        };

        fetchData();
    }, [selectedBot]);

    if (error) {
        return <div className="p-4 text-chimera-red">Error: {error}</div>;
    }

    if (!data) {
        return <div className="p-4">Loading analytics...</div>;
    }

    const { kpis, backtestResult } = data;

    return (
        <div className="h-full flex flex-col p-4 gap-4">
            <h2 className="text-xl font-bold">Performance Analytics: {selectedBot}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <KpiCard title="Total P&L" value={kpis.totalPnl} format={(v) => `$${v.toFixed(2)}`} />
                <KpiCard title="Win Rate" value={kpis.winRate} format={(v) => `${(v * 100).toFixed(2)}%`} />
                <KpiCard title="Max Drawdown" value={kpis.maxDrawdown} format={(v) => `${(v * 100).toFixed(2)}%`} />
                <KpiCard title="Total Trades" value={kpis.totalTrades} format={(v) => v} />
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
                            tickFormatter={(val) => `$${(val/1000).toFixed(0)}k`}
                            tick={{ fill: '#d1d5db', fontSize: 12 }}
                        />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#131722', border: '1px solid #4f5966' }}
                            labelFormatter={(label) => new Date(label).toLocaleString()}
                            formatter={(value: number) => `$${value.toFixed(2)}`}
                        />
                        <Legend />
                        <Line type="monotone" dataKey="liveEquity" name="Live Performance" stroke="#2962ff" strokeWidth={2} dot={false} />
                        {backtestResult && (
                           <Line type="monotone" dataKey="backtestEquity" name="Backtest" stroke="#26a69a" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                        )}
                    </LineChart>
                 </ResponsiveContainer>
            </div>
        </div>
    );
};
