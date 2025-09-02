
import React, { useState } from 'react';
import { Order, OrderSide, OrderType } from '../types';

interface OrderEntryProps {
  lastPrice: number;
  onPlaceOrder: (order: Omit<Order, 'id' | 'filledQuantity' | 'status' | 'createdAt'>) => void;
}

const OrderEntry: React.FC<OrderEntryProps> = ({ lastPrice, onPlaceOrder }) => {
  const [side, setSide] = useState<OrderSide>(OrderSide.BUY);
  const [type, setType] = useState<OrderType>(OrderType.LIMIT);
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quantity) return;

    onPlaceOrder({
      symbol: 'BTC/USD',
      side,
      type,
      quantity: parseFloat(quantity),
      price: type === OrderType.LIMIT ? parseFloat(price) : undefined,
    });

    setQuantity('');
    setPrice('');
  };

  return (
    <div className="flex flex-col h-full">
      <h3 className="text-md font-semibold mb-4">Trade</h3>
      <div className="flex mb-4">
        <button
          onClick={() => setSide(OrderSide.BUY)}
          className={`flex-1 py-2 text-sm font-bold rounded-l-md transition-colors ${side === OrderSide.BUY ? 'bg-chimera-green text-white' : 'bg-chimera-grey hover:bg-chimera-grey/70'}`}
        >
          BUY
        </button>
        <button
          onClick={() => setSide(OrderSide.SELL)}
          className={`flex-1 py-2 text-sm font-bold rounded-r-md transition-colors ${side === OrderSide.SELL ? 'bg-chimera-red text-white' : 'bg-chimera-grey hover:bg-chimera-grey/70'}`}
        >
          SELL
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-3 flex-grow flex flex-col">
        {/* Order Type Tabs */}
        <div className="flex text-sm border-b border-chimera-grey">
          <button type="button" onClick={() => setType(OrderType.LIMIT)} className={`px-3 py-1 ${type === OrderType.LIMIT ? 'border-b-2 border-chimera-blue text-white' : 'text-chimera-lightgrey'}`}>Limit</button>
          <button type="button" onClick={() => setType(OrderType.MARKET)} className={`px-3 py-1 ${type === OrderType.MARKET ? 'border-b-2 border-chimera-blue text-white' : 'text-chimera-lightgrey'}`}>Market</button>
        </div>
        
        {type === OrderType.LIMIT && (
           <div className="relative">
             <label htmlFor="price" className="text-xs text-chimera-lightgrey">Price</label>
             <input
               id="price"
               type="number"
               value={price}
               onChange={(e) => setPrice(e.target.value)}
               placeholder={lastPrice.toFixed(2)}
               className="w-full bg-chimera-grey p-2 rounded-md border border-transparent focus:border-chimera-blue focus:outline-none"
             />
              <span className="absolute right-3 top-6 text-xs text-chimera-lightgrey">USD</span>
           </div>
        )}
        <div className="relative">
          <label htmlFor="quantity" className="text-xs text-chimera-lightgrey">Quantity</label>
          <input
            id="quantity"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="0.0000"
            className="w-full bg-chimera-grey p-2 rounded-md border border-transparent focus:border-chimera-blue focus:outline-none"
          />
          <span className="absolute right-3 top-6 text-xs text-chimera-lightgrey">BTC</span>
        </div>

        <div className="flex-grow"></div>
        
        <button
          type="submit"
          className={`w-full py-3 font-bold rounded-md transition-colors ${side === OrderSide.BUY ? 'bg-chimera-green hover:bg-chimera-green/90' : 'bg-chimera-red hover:bg-chimera-red/90'}`}
        >
          {side === OrderSide.BUY ? 'Buy BTC' : 'Sell BTC'}
        </button>
      </form>
    </div>
  );
};

export default OrderEntry;
