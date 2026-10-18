import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Search, Truck, Check, X, FileText } from 'lucide-react';

export const OrdersAdmin: React.FC = () => {
  const { getIdToken } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const loadOrders = async () => {
    try {
      const token = await getIdToken();
      let url = '/api/admin/orders';
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      if (search) params.append('search', search);
      if (params.toString()) url += `?${params.toString()}`;

      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [statusFilter, search]);

  const handleAction = async (orderNo: string, action: string, extraBody = {}) => {
    try {
      const token = await getIdToken();
      const res = await fetch(`/api/admin/orders/${orderNo}/${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(extraBody)
      });
      if (res.ok) loadOrders();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-black text-[#092f55] font-nunito">Orders & Fulfilment</h1>

      <div className="bg-white p-6 rounded-3xl border border-[#e7edf2] flex flex-col sm:flex-row gap-4 items-center justify-between shadow-xs">
        <input
          type="text"
          placeholder="Search by order #, phone, email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full sm:w-80 px-4 py-2.5 bg-[#f6f9fc] border border-[#e7edf2] rounded-xl text-xs focus:outline-none focus:border-[#12A5B0]"
        />
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 bg-[#f6f9fc] border border-[#e7edf2] rounded-xl text-xs font-bold text-[#092f55]"
        >
          <option value="">All Statuses</option>
          <option value="pending_payment">Pending Payment</option>
          <option value="awaiting_confirmation">Awaiting Confirmation (COD)</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="rto">RTO</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="bg-white rounded-3xl border border-[#e7edf2] overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#f6f9fc] border-b border-[#e7edf2] text-[#092f55]">
              <th className="py-4 px-6">Order #</th>
              <th className="py-4 px-6">Customer</th>
              <th className="py-4 px-6">Payment</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6">Total</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e7edf2]">
            {orders.map((o: any) => (
              <tr key={o.order_no} className="hover:bg-[#f6f9fc]/50">
                <td className="py-4 px-6 font-extrabold text-[#092f55]">{o.order_no}</td>
                <td className="py-4 px-6">
                  <div className="font-bold">{o.ship_name}</div>
                  <div className="text-slate-400">{o.ship_phone}</div>
                </td>
                <td className="py-4 px-6 uppercase font-bold text-[11px]">{o.payment_method}</td>
                <td className="py-4 px-6">
                  <span className="px-2.5 py-1 bg-[#12A5B0]/10 text-[#12A5B0] font-bold rounded-full text-[10px] uppercase">
                    {o.status}
                  </span>
                </td>
                <td className="py-4 px-6 font-black">₹{o.total_paise / 100}</td>
                <td className="py-4 px-6 text-right space-x-2">
                  {o.status === 'awaiting_confirmation' && (
                    <button onClick={() => handleAction(o.order_no, 'confirm-cod')} className="px-3 py-1.5 bg-[#12A5B0] text-white font-bold rounded-xl text-[11px]">Confirm</button>
                  )}
                  {o.status === 'processing' && (
                    <button onClick={() => {
                      const awb = prompt('Enter Courier AWB number:');
                      if (awb) handleAction(o.order_no, 'ship', { awb, courier: 'Standard' });
                    }} className="px-3 py-1.5 bg-blue-600 text-white font-bold rounded-xl text-[11px]">Mark Shipped</button>
                  )}
                  {o.status === 'shipped' && (
                    <button onClick={() => handleAction(o.order_no, 'deliver')} className="px-3 py-1.5 bg-green-600 text-white font-bold rounded-xl text-[11px]">Mark Delivered</button>
                  )}
                  {o.status === 'rto' && (
                    <button onClick={() => handleAction(o.order_no, 'rto-restock')} className="px-3 py-1.5 bg-purple-600 text-white font-bold rounded-xl text-[11px]">Inspect & Restock</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
