import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Package, MapPin, FileText, AlertCircle, LogOut } from 'lucide-react';

export const Account: React.FC = () => {
  const { currentUser, userProfile, loginWithGoogle, logout, getIdToken } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'profile'>('orders');

  useEffect(() => {
    if (!currentUser) return;
    getIdToken().then(token => {
      if (!token) return;
      fetch('/api/me/orders', { headers: { Authorization: `Bearer ${token}` } })
        .then(res => res.json())
        .then(data => setOrders(Array.isArray(data) ? data : []))
        .catch(err => console.error(err));

      fetch('/api/me/addresses', { headers: { Authorization: `Bearer ${token}` } })
        .then(res => res.json())
        .then(data => setAddresses(Array.isArray(data) ? data : []))
        .catch(err => console.error(err));
    });
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6">
        <h1 className="text-3xl font-black text-[#092f55] font-nunito">Sign in to PyNotes</h1>
        <p className="text-xs text-[#526d81]">Access your orders, saved addresses, and review history.</p>
        <button
          onClick={loginWithGoogle}
          className="w-full py-4 bg-[#092f55] text-white font-extrabold text-xs rounded-xl hover:bg-[#071E38] transition-colors shadow-md flex items-center justify-center gap-2"
        >
          Sign in with Google
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="bg-white p-8 rounded-3xl border border-[#e7edf2] shadow-xs flex flex-col sm:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#12A5B0]/10 text-[#12A5B0] flex items-center justify-center font-black text-2xl">
            {currentUser.displayName?.[0] || 'U'}
          </div>
          <div>
            <h1 className="text-xl font-black text-[#092f55]">{currentUser.displayName || 'Student'}</h1>
            <p className="text-xs text-[#526d81]">{currentUser.email}</p>
            <span className="inline-block mt-1 px-2.5 py-0.5 bg-[#e4f8f9] text-[#12A5B0] text-[10px] font-bold rounded-full uppercase">
              Role: {userProfile?.role || 'customer'}
            </span>
          </div>
        </div>
        <button
          onClick={logout}
          className="px-5 py-2.5 bg-red-50 text-red-600 font-bold text-xs rounded-xl hover:bg-red-100 transition-colors flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>

      <div className="flex gap-2 border-b border-[#e7edf2] pb-2">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-colors ${activeTab === 'orders' ? 'bg-[#092f55] text-white' : 'text-[#526d81] hover:bg-white'}`}
        >
          My Orders ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('addresses')}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-colors ${activeTab === 'addresses' ? 'bg-[#092f55] text-white' : 'text-[#526d81] hover:bg-white'}`}
        >
          Saved Addresses ({addresses.length})
        </button>
      </div>

      {activeTab === 'orders' && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-[#e7edf2] text-center text-xs text-[#526d81]">
              No orders placed yet.
            </div>
          ) : (
            orders.map((order: any) => (
              <div key={order.order_no} className="bg-white p-6 rounded-3xl border border-[#e7edf2] shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-1">
                  <h4 className="font-extrabold text-sm text-[#092f55]">Order #{order.order_no}</h4>
                  <p className="text-xs text-[#526d81]">Placed on: {new Date(order.placed_at).toLocaleDateString()}</p>
                  <span className="inline-block px-2.5 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-full uppercase">
                    Status: {order.status}
                  </span>
                </div>
                <div className="text-right space-y-2">
                  <span className="font-black text-base text-[#092f55]">₹{order.total_paise / 100}</span>
                  <div>
                    <a href={`/track`} className="text-xs font-bold text-[#12A5B0] hover:underline">Track Order</a>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'addresses' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {addresses.map((addr: any, idx: number) => (
            <div key={idx} className="bg-white p-6 rounded-3xl border border-[#e7edf2] space-y-2 text-xs text-[#526d81]">
              <h4 className="font-bold text-[#092f55] text-sm">{addr.label || 'Home'}</h4>
              <p className="font-semibold">{addr.full_name}</p>
              <p>{addr.line1}, {addr.line2}</p>
              <p>{addr.city}, {addr.state} - {addr.pincode}</p>
              <p>Phone: {addr.phone}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
