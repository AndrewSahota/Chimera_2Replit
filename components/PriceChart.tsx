
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Tick } from '../types';

interface PriceChartProps {
  data: Tick[];
}

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-chimera-grey p-2 border border-chimera-lightgrey rounded-md text-sm">
        <p className="label">{`Time: ${new Date(label).toLocaleTimeString()}`}</p>
        <p className="intro">{`Price: $${payload[0].value.toFixed(2)}`}</p>
      </div>
    );
  }
  return null;
};


const PriceChart: React.FC<PriceChartProps> = ({ data }) => {
  const chartData = data.map(tick => ({
    time: tick.timestamp.getTime(),
    price: tick.price
  }));

  const lastPrice = chartData.length > 0 ? chartData[chartData.length - 1].price : 0;
  const firstPrice = chartData.length > 0 ? chartData[0].price : 0;
  const gradientColor = lastPrice >= firstPrice ? '#26a69a' : '#ef5350';

  return (
    <div className="w-full h-full flex flex-col">
       <div className="p-2">
         <h2 className="text-lg font-semibold">BTC/USD Chart</h2>
         <p className="text-2xl font-mono" style={{color: gradientColor}}>${lastPrice.toFixed(2)}</p>
       </div>
       <div className="flex-grow">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={gradientColor} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={gradientColor} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2e39" />
            <XAxis 
              dataKey="time" 
              tickFormatter={(time) => new Date(time).toLocaleTimeString()} 
              stroke="#4f5966"
              tick={{ fill: '#d1d5db', fontSize: 12 }}
              dy={10}
            />
            <YAxis 
              dataKey="price" 
              domain={['dataMin - 100', 'dataMax + 100']}
              orientation="right"
              stroke="#4f5966"
              tickFormatter={(price) => `$${price.toFixed(0)}`}
              tick={{ fill: '#d1d5db', fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="price" stroke={gradientColor} fillOpacity={1} fill="url(#colorPrice)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
       </div>
    </div>
  );
};

export default PriceChart;
