
import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function PriceChart() {
  const [selectedSymbol, setSelectedSymbol] = useState('AAPL');
  
  // Mock data - replace with real API
  const chartData = [
    { time: '09:30', price: 150.25 },
    { time: '10:00', price: 151.50 },
    { time: '10:30', price: 150.75 },
    { time: '11:00', price: 152.30 },
    { time: '11:30', price: 153.10 },
    { time: '12:00', price: 152.85 },
    { time: '12:30', price: 154.20 },
    { time: '13:00', price: 155.30 }
  ];

  return (
    <div className="bg-[#1c1f26] rounded-lg border border-gray-700/50 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Price Chart</h3>
        <select
          value={selectedSymbol}
          onChange={(e) => setSelectedSymbol(e.target.value)}
          className="bg-[#0e1117] text-white px-3 py-1 rounded border border-gray-600 focus:border-[#3bc9f4] focus:outline-none"
        >
          <option value="AAPL">AAPL</option>
          <option value="GOOGL">GOOGL</option>
          <option value="MSFT">MSFT</option>
        </select>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <XAxis 
              dataKey="time" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#8b949e', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#8b949e', fontSize: 12 }}
              domain={['dataMin - 0.5', 'dataMax + 0.5']}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#1c1f26',
                border: '1px solid #3bc9f4',
                borderRadius: '8px',
                color: 'white'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke="#3bc9f4" 
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: '#3bc9f4' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
