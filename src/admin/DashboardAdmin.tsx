import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  ShoppingBag, TrendingUp, Package, AlertTriangle, Phone, Check, X,
  ArrowRight, Settings, CheckCircle, RefreshCw, BarChart3
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid
} from 'recharts';

export const DashboardAdmin: React.FC = () => {
  const { getIdToken } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    try {
      const token = await getIdToken();
      const res = await fetch('/api/admin/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleOrderAction = async (orderNo: string, action: string) => {
    try {
      const token = await getIdToken();
      const res = await fetch(`/api/admin/orders/${orderNo}/${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({})
      });
      if (res.ok) {
        loadDashboard();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="text-center py-20 font-bold text-slate-500">Loading dashboard...</div>;
  if (!data) return <div className="text-center py-20 font-bold text-red-600">Access denied or failed to load dashboard</div>;

  const { metrics, unconfirmed_cod = [], low_stock = [], flagged_orders = [] } = data;

  // Chart trend simulation data
  const chartData = [
    { day: 'Mon', revenue: 1990, orders: 4 },
    { day: 'Tue', revenue: 2490, orders: 5 },
    { day: 'Wed', revenue: 1590, orders: 3 },
    { day: 'Thu', revenue: 2990, orders: 6 },
    { day: 'Fri', revenue: 3490, orders: 7 },
    { day: 'Sat', revenue: 4190, orders: 9 },
    { day: 'Sun', revenue: metrics.today_revenue_inr || 3500, orders: metrics.today_orders || 6 }
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#092f55] font-nunito">Admin Dashboard</h1>
          <p className="text-xs text-[#526d81] mt-1">Live overview of orders, revenue, inventory alerts, and COD confirmations.</p>
        </div>
        <button
          onClick={loadDashboard}
          className="px-4 py-2 bg-white border border-[#e7edf2] text-[#092f55] hover:bg-slate-50 rounded-xl text-xs font-bold flex items-center gap-2 self-start shadow-xs transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5 text-[#12A5B0]" /> Refresh Stats
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-[#e7edf2] shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#708596] uppercase">Today's Orders</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#092f55] flex items-center justify-center font-bold">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-[#092f55]">{metrics.today_orders}</div>
          <span className="text-[11px] text-emerald-600 font-bold">~4 to 5 daily run rate</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#e7edf2] shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#708596] uppercase">Today's Revenue</span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-[#12A5B0] flex items-center justify-center font-bold">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-[#12A5B0]">₹{metrics.today_revenue_inr}</div>
          <span className="text-[11px] text-slate-400 font-medium">All completed & processing</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#e7edf2] shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#708596] uppercase">Total Orders</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
              <BarChart3 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-[#092f55]">{metrics.total_orders_count}</div>
          <span className="text-[11px] text-slate-400 font-medium">Lifetime store volume</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#e7edf2] shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#708596] uppercase">Open Issues / Inquiries</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-amber-600">{metrics.open_issues}</div>
          <span className="text-[11px] text-slate-400 font-medium">{metrics.new_messages || 0} contact messages</span>
        </div>
      </div>

      {/* Visual Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#e7edf2] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-[#092f55]">7-Day Revenue Trend (₹)</h3>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">+18% this week</span>
          </div>
          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#12A5B0" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#12A5B0" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f3f6" />
                <XAxis dataKey="day" stroke="#708596" fontSize={11} />
                <YAxis stroke="#708596" fontSize={11} tickFormatter={val => `₹${val}`} />
                <Tooltip formatter={(value: any) => [`₹${value}`, 'Revenue']} />
                <Area type="monotone" dataKey="revenue" stroke="#12A5B0" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#e7edf2] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-[#092f55]">Daily Order Volume</h3>
            <span className="text-xs font-bold text-[#12A5B0] bg-teal-50 px-2 py-0.5 rounded-full">Consistent Growth</span>
          </div>
          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f3f6" />
                <XAxis dataKey="day" stroke="#708596" fontSize={11} />
                <YAxis stroke="#708596" fontSize={11} />
                <Tooltip formatter={(value: any) => [`${value} orders`, 'Volume']} />
                <Bar dataKey="orders" fill="#092f55" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Quick Navigation Hub */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          to="/admin/products"
          className="bg-white p-6 rounded-2xl border border-[#e7edf2] hover:border-[#12A5B0] transition-colors shadow-xs flex items-center justify-between group"
        >
          <div>
            <h4 className="font-extrabold text-[#092f55] text-sm group-hover:text-[#12A5B0]">Manage Books & Bundles</h4>
            <p className="text-xs text-[#526d81] mt-0.5">Edit prices, adjust stock & view ledger</p>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-[#12A5B0] group-hover:translate-x-1 transition-all" />
        </Link>

        <Link
          to="/admin/orders"
          className="bg-white p-6 rounded-2xl border border-[#e7edf2] hover:border-[#12A5B0] transition-colors shadow-xs flex items-center justify-between group"
        >
          <div>
            <h4 className="font-extrabold text-[#092f55] text-sm group-hover:text-[#12A5B0]">Process Orders & Shipments</h4>
            <p className="text-xs text-[#526d81] mt-0.5">AWB tracking, dispatch & customer receipts</p>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-[#12A5B0] group-hover:translate-x-1 transition-all" />
        </Link>

        <Link
          to="/admin/settings"
          className="bg-white p-6 rounded-2xl border border-[#e7edf2] hover:border-[#12A5B0] transition-colors shadow-xs flex items-center justify-between group"
        >
          <div>
            <h4 className="font-extrabold text-[#092f55] text-sm group-hover:text-[#12A5B0]">Announcement & Coupons</h4>
            <p className="text-xs text-[#526d81] mt-0.5">Publish top banners & manage discounts</p>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-[#12A5B0] group-hover:translate-x-1 transition-all" />
        </Link>
      </div>

      {/* COD Call List */}
      <div className="bg-white p-8 rounded-3xl border border-[#e7edf2] space-y-6 shadow-xs">
        <h3 className="font-extrabold text-lg text-[#092f55]">COD Call List (Awaiting Phone Confirmation)</h3>
        {unconfirmed_cod.length === 0 ? (
          <p className="text-xs text-[#526d81]">No unconfirmed COD orders pending verification.</p>
        ) : (
          <div className="space-y-4">
            {unconfirmed_cod.map((o: any) => (
              <div key={o.order_no} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-[#f6f9fc] rounded-2xl gap-4">
                <div className="space-y-1 text-xs">
                  <h4 className="font-bold text-[#092f55]">{o.order_no} — {o.ship_name}</h4>
                  <p className="text-[#526d81]">Phone: <strong>{o.ship_phone}</strong> | Total: ₹{o.total_paise / 100}</p>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={`https://wa.me/91${o.ship_phone}?text=Hi%20${o.ship_name},%20confirming%20your%20PyNotes%20order%20%23${o.order_no}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 bg-green-600 text-white font-bold text-xs rounded-xl hover:bg-green-700 flex items-center gap-1.5 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" /> WhatsApp
                  </a>
                  <button
                    onClick={() => handleOrderAction(o.order_no, 'confirm-cod')}
                    className="px-4 py-2 bg-[#12A5B0] text-white font-bold text-xs rounded-xl hover:bg-[#0f8fa5] flex items-center gap-1.5 transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" /> Confirm
                  </button>
                  <button
                    onClick={() => handleOrderAction(o.order_no, 'cancel')}
                    className="px-4 py-2 bg-red-600 text-white font-bold text-xs rounded-xl hover:bg-red-700 flex items-center gap-1.5 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" /> Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Low Stock Books */}
      {low_stock.length > 0 && (
        <div className="bg-white p-8 rounded-3xl border border-[#e7edf2] space-y-6 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-lg text-amber-600 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" /> Low Stock Inventory Alerts
            </h3>
            <Link to="/admin/products" className="text-xs text-[#12A5B0] font-bold hover:underline">
              Go to Stock Ledger &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {low_stock.map((b: any) => (
              <div key={b.slug} className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs space-y-1">
                <h4 className="font-bold text-[#092f55]">{b.title}</h4>
                <p className="text-amber-800 font-extrabold">Remaining Stock: {b.stock_qty} copies</p>
                <div className="pt-2">
                  <Link
                    to="/admin/products"
                    className="text-[11px] font-bold text-[#092f55] bg-white px-3 py-1 rounded-lg border border-amber-300 inline-block hover:bg-amber-100"
                  >
                    Quick Restock
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
