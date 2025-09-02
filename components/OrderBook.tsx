
import React from 'react';
import { OrderBookLevel } from '../types';

interface OrderBookProps {
  bids: OrderBookLevel[];
  asks: OrderBookLevel[];
  lastPrice: number;
}

const OrderBookRow: React.FC<{ level: OrderBookLevel, type: 'bid' | 'ask', maxTotal: number }> = ({ level, type, maxTotal }) => {
  const percentage = maxTotal > 0 ? (level.total! / maxTotal) * 100 : 0;
  const bgColorClass = type === 'bid' ? `bg-chimera-green/20` : `bg-chimera-red/20`;
  const textColorClass = type === 'bid' ? 'text-chimera-green' : 'text-chimera-red';

  return (
    <div className="relative flex justify-between items-center text-xs font-mono p-1 hover:bg-chimera-grey/50">
      <div
        className={`absolute top-0 bottom-0 ${type === 'bid' ? 'right-0' : 'left-0'} ${bgColorClass}`}
        style={{ width: `${percentage}%` }}
      />
      <span className={textColorClass}>{level.price.toFixed(2)}</span>
      <span>{level.size.toFixed(4)}</span>
      <span>{level.total!.toFixed(4)}</span>
    </div>
  );
};


const OrderBook: React.FC<OrderBookProps> = ({ bids, asks, lastPrice }) => {
  let bidTotal = 0;
  const bidsWithTotal = bids.map(bid => {
    bidTotal += bid.size;
    return { ...bid, total: bidTotal };
  });

  let askTotal = 0;
  const asksWithTotal = asks.map(ask => {
    askTotal += ask.size;
    return { ...ask, total: askTotal };
  });

  const maxTotal = Math.max(bidTotal, askTotal);

  return (
    <div className="flex flex-col h-full">
      <h3 className="text-md font-semibold mb-2 p-2 border-b border-chimera-grey">Order Book</h3>
      <div className="grid grid-cols-3 text-xs text-chimera-lightgrey px-1 py-2">
        <span>Price (USD)</span>
        <span className="text-right">Size (BTC)</span>
        <span className="text-right">Total (BTC)</span>
      </div>
      <div className="flex-grow overflow-y-auto pr-1">
        {/* Asks */}
        <div className="flex flex-col-reverse">
            {asksWithTotal.slice(0, 15).map(ask => (
                <OrderBookRow key={ask.price} level={ask} type="ask" maxTotal={maxTotal} />
            ))}
        </div>

        <div className="py-2 text-center text-lg font-bold border-t border-b border-chimera-grey my-1">
            <span className={lastPrice > (bids[0]?.price || 0) ? 'text-chimera-green' : 'text-chimera-red'}>
                {lastPrice.toFixed(2)}
            </span>
        </div>

        {/* Bids */}
        <div>
            {bidsWithTotal.slice(0, 15).map(bid => (
                <OrderBookRow key={bid.price} level={bid} type="bid" maxTotal={maxTotal} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default OrderBook;
