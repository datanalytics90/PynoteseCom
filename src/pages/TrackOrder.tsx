import React, { useState } from 'react';
import { Search, Truck, CheckCircle2, Clock } from 'lucide-react';

export const TrackOrder: React.FC = () => {
  const [orderNo, setOrderNo] = useState('');
  const [phone, setPhone] = useState('');
  const [trackingData, setTrackingData] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/track?order_no=${encodeURIComponent(orderNo.trim())}&phone=${encodeURIComponent(phone.trim())}`);
      const data = await res.json();
      if (res.ok) {
        setTrackingData(data);
      } else {
        setError(data.error || 'Order not found');
        setTrackingData(null);
      }
    } catch (err) {
      setError('Failed to fetch tracking details');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-10">
      <div className="text-center space-y-3">
        <span className="text-xs font-black uppercase tracking-wider text-[#12A5B0]">Shipment Tracking</span>
        <h1 className="text-3xl font-black text-[#092f55] font-nunito">Track Your Order</h1>
        <p className="text-xs text-[#526d81]">Enter your order number and registered mobile number.</p>
      </div>

      <form onSubmit={handleTrack} className="bg-white p-8 rounded-3xl border border-[#e7edf2] shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#092f55] mb-1">Order Number</label>
            <input
              type="text"
              required
              value={orderNo}
              onChange={e => setOrderNo(e.target.value)}
              placeholder="e.g. PN-1001"
              className="w-full px-4 py-3 bg-[#f6f9fc] border border-[#e7edf2] rounded-xl text-xs focus:outline-none focus:border-[#12A5B0]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#092f55] mb-1">Mobile Number</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="10-digit mobile"
              className="w-full px-4 py-3 bg-[#f6f9fc] border border-[#e7edf2] rounded-xl text-xs focus:outline-none focus:border-[#12A5B0]"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-[#092f55] text-white font-extrabold text-xs rounded-xl hover:bg-[#071E38] transition-colors"
        >
          {loading ? 'Searching...' : 'Track Order'}
        </button>

        {error && <p className="text-xs text-red-600 font-bold text-center">{error}</p>}
      </form>

      {trackingData && (
        <div className="bg-white p-8 rounded-3xl border border-[#e7edf2] space-y-6 shadow-xs">
          <div className="flex justify-between items-center border-b border-[#e7edf2] pb-4">
            <div>
              <h3 className="font-extrabold text-lg text-[#092f55]">Order #{trackingData.order_no}</h3>
              <p className="text-xs text-[#526d81]">Status: <strong className="uppercase text-[#12A5B0]">{trackingData.status}</strong></p>
            </div>
            {trackingData.tracking_url && (
              <a
                href={trackingData.tracking_url}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-[#12A5B0] text-white font-bold text-xs rounded-xl hover:bg-[#0f8fa5]"
              >
                Courier Link
              </a>
            )}
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-xs text-[#092f55] uppercase">Timeline Events</h4>
            <div className="space-y-3">
              {trackingData.events?.map((ev: any, idx: number) => (
                <div key={idx} className="flex items-start gap-3 text-xs">
                  <div className="w-6 h-6 rounded-full bg-[#12A5B0]/10 text-[#12A5B0] flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="font-bold text-[#092f55]">{ev.kind} — <span className="text-[#526d81] font-normal">{ev.note}</span></p>
                    <span className="text-[10px] text-slate-400">{new Date(ev.at).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
