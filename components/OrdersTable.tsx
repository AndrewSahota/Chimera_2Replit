
import React from 'react';
import { Order, OrderSide, OrderStatus } from '../types';

interface OrdersTableProps {
  orders: Order[];
}

const StatusBadge: React.FC<{status: OrderStatus}> = ({ status }) => {
    const color = {
        [OrderStatus.OPEN]: 'bg-blue-500/20 text-blue-300',
        [OrderStatus.FILLED]: 'bg-green-500/20 text-green-300',
        [OrderStatus.PARTIALLY_FILLED]: 'bg-yellow-500/20 text-yellow-300',
        [OrderStatus.CANCELLED]: 'bg-gray-500/20 text-gray-400',
    }[status];

    return (
        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${color}`}>{status}</span>
    )
}

const OrdersTable: React.FC<OrdersTableProps> = ({ orders }) => {
  return (
    <div className="h-full flex flex-col">
      <h3 className="text-md font-semibold mb-2 px-1">Orders</h3>
      <div className="overflow-y-auto flex-grow">
        <table className="w-full text-left text-xs">
          <thead className="sticky top-0 bg-chimera-lightdark">
            <tr className="text-chimera-lightgrey border-b border-chimera-grey">
              <th className="p-2 font-medium">Symbol</th>
              <th className="p-2 font-medium">Bot</th>
              <th className="p-2 font-medium">Side</th>
              <th className="p-2 font-medium text-right">Quantity</th>
              <th className="p-2 font-medium text-right">Price</th>
              <th className="p-2 font-medium text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
                <tr>
                    <td colSpan={6} className="text-center py-4 text-chimera-lightgrey">No orders</td>
                </tr>
            ) : (
                orders.map((order) => (
                    <tr key={order.id} className="border-b border-chimera-grey/50 hover:bg-chimera-grey/40 font-mono">
                    <td className="p-2 font-semibold">{order.symbol}</td>
                    <td className="p-2 text-chimera-lightgrey">{order.botName}</td>
                    <td className={`p-2 font-bold ${order.side === OrderSide.BUY ? 'text-chimera-green' : 'text-chimera-red'}`}>
                        {order.side}
                    </td>
                    <td className="p-2 text-right">{order.quantity.toFixed(4)}</td>
                    <td className="p-2 text-right">{order.price ? `$${order.price.toFixed(2)}` : 'Market'}</td>
                    <td className="p-2 text-center">
                        <StatusBadge status={order.status}/>
                    </td>
                    </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersTable;