import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, Package, Truck, FileText, ArrowRight } from 'lucide-react';

export const ThankYou: React.FC = () => {
  const { no } = useParams();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('t');
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${no}?t=${token || ''}`);
        if (res.ok) {
          const data = await res.json();
          setOrderData(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [no, token]);

  if (loading) return <div className="text-center py-20 font-bold text-[#092f55]">Loading order details...</div>;
  if (!orderData) return <div className="text-center py-20 font-bold text-red-600">Order not found or invalid token</div>;

  const { order } = orderData;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">
      <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#e7edf2] shadow-xs text-center space-y-6">
        <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-[#12A5B0]">Success</span>
          <h1 className="text-3xl sm:text-4xl font-black text-[#092f55] font-nunito">Order Placed Successfully!</h1>
          <p className="text-xs text-[#526d81]">Order Number: <strong className="text-[#092f55]">#{order.order_no}</strong></p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link
            to={`/invoice/${order.order_no}?t=${token}`}
            target="_blank"
            className="px-6 py-3 bg-[#092f55] text-white font-extrabold text-xs rounded-xl hover:bg-[#071E38] transition-colors flex items-center gap-2"
          >
            <FileText className="w-4 h-4" /> Print GST Invoice
          </Link>
          <Link
            to="/track"
            className="px-6 py-3 bg-[#12A5B0] text-white font-extrabold text-xs rounded-xl hover:bg-[#0f8fa5] transition-colors flex items-center gap-2"
          >
            <Truck className="w-4 h-4" /> Track Shipment
          </Link>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-[#e7edf2] space-y-6 shadow-xs">
        <h3 className="font-extrabold text-lg text-[#092f55]">Order Summary</h3>
        <div className="space-y-3">
          {order.items.map((i: any, idx: number) => (
            <div key={idx} className="flex justify-between text-xs py-2 border-b border-[#e7edf2]">
              <span>{i.title} (x{i.qty})</span>
              <span className="font-bold">₹{i.line_total_paise / 100}</span>
            </div>
          ))}
          <div className="flex justify-between pt-3 text-sm font-black text-[#092f55]">
            <span>Total Paid</span>
            <span>₹{order.total_paise / 100}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
