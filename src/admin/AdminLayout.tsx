import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, ShoppingBag, Package, Settings, LogOut,
  ShieldCheck, CheckCircle, ExternalLink, Menu, X, KeyRound
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { currentUser, userProfile, isAdmin, loginWithGoogle, loginWithPasscode, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Quick passcode login state
  const [passcode, setPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  const handlePasscodeLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasscodeError('');
    setLoggingIn(true);
    const success = await loginWithPasscode(passcode);
    setLoggingIn(false);
    if (!success) {
      setPasscodeError('Invalid passcode. Default code is PYNOTES2026');
    }
  };

  // If not admin, show login gate
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#f6f9fc] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 sm:p-10 max-w-md w-full border border-[#e7edf2] shadow-xl space-y-6">
          <div className="w-14 h-14 bg-[#092f55] rounded-2xl flex items-center justify-center mx-auto text-[#12A5B0]">
            <KeyRound className="w-7 h-7" />
          </div>

          <div className="text-center space-y-1">
            <h2 className="text-2xl font-black text-[#092f55] font-nunito">PyNotes Admin Portal</h2>
            <p className="text-xs text-[#526d81]">Enter the owner passcode or sign in with Google to manage the store.</p>
          </div>

          <form onSubmit={handlePasscodeLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#092f55] mb-1">Owner Passcode</label>
              <input
                type="password"
                required
                value={passcode}
                onChange={e => setPasscode(e.target.value)}
                placeholder="Enter passcode (default: PYNOTES2026)"
                className="w-full px-4 py-3 bg-[#f6f9fc] border border-[#e7edf2] rounded-xl text-xs focus:outline-none focus:border-[#12A5B0]"
              />
            </div>

            {passcodeError && (
              <p className="text-xs text-red-600 font-bold bg-red-50 p-2.5 rounded-xl text-center">
                {passcodeError}
              </p>
            )}

            <button
              type="submit"
              disabled={loggingIn}
              className="w-full py-3.5 bg-[#12A5B0] hover:bg-[#0f8fa5] text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors"
            >
              {loggingIn ? 'Verifying...' : 'Access Admin Dashboard'}
            </button>
          </form>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-[#e7edf2]"></div>
            <span className="flex-shrink mx-4 text-slate-400 text-[11px] uppercase font-bold">Or</span>
            <div className="flex-grow border-t border-[#e7edf2]"></div>
          </div>

          <button
            onClick={loginWithGoogle}
            className="w-full py-3 bg-[#092f55] hover:bg-[#071E38] text-white font-bold text-xs rounded-xl transition-colors"
          >
            Sign in with Google Account
          </button>

          <div className="pt-2 text-center">
            <Link to="/" className="text-xs text-[#12A5B0] font-bold hover:underline inline-flex items-center gap-1">
              &larr; Back to PyNotes Store
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const navItems = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/orders', icon: ShoppingBag, label: 'Orders & Fulfilment' },
    { to: '/admin/products', icon: Package, label: 'Products & Stock' },
    { to: '/admin/settings', icon: Settings, label: 'Content & Settings' },
    { to: '/admin/system-check', icon: CheckCircle, label: 'System Check (10 Tests)' },
    { to: '/admin/setup', icon: ShieldCheck, label: 'Owner Setup' },
  ];

  return (
    <div className="min-h-screen bg-[#f6f9fc] flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-[#071E38] text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#12A5B0] rounded-lg flex items-center justify-center font-black text-sm">PN</div>
          <span className="font-nunito font-black text-base">PyNotes Admin</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1 text-white hover:text-[#12A5B0]"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#071E38] text-white px-6 py-4 border-t border-white/10 space-y-2">
          {navItems.map(item => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                location.pathname === item.to ? 'bg-[#12A5B0] text-white' : 'text-slate-300 hover:bg-white/10'
              }`}
            >
              <item.icon className="w-4 h-4" /> {item.label}
            </Link>
          ))}
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:bg-white/10"
          >
            <ExternalLink className="w-4 h-4" /> View Storefront
          </Link>
          <button
            onClick={() => { logout(); navigate('/'); }}
            className="w-full text-left flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-red-400 hover:bg-white/10"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="w-64 bg-[#071E38] text-white p-6 hidden md:flex flex-col justify-between shrink-0 sticky top-0 h-screen">
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#12A5B0] rounded-xl flex items-center justify-center font-black">PN</div>
            <div>
              <span className="font-nunito font-black text-lg block leading-tight">PyNotes Admin</span>
              <span className="text-[10px] text-emerald-400 uppercase font-black tracking-wider">Store Active</span>
            </div>
          </div>

          <nav className="space-y-1.5 text-xs font-bold text-slate-300">
            {navItems.map(item => (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  location.pathname === item.to
                    ? 'bg-[#12A5B0] text-white shadow-xs'
                    : 'hover:bg-white/10 text-slate-300'
                }`}
              >
                <item.icon className="w-4 h-4" /> {item.label}
              </Link>
            ))}

            <Link
              to="/"
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 text-slate-300 transition-colors pt-4 border-t border-white/10"
            >
              <ExternalLink className="w-4 h-4 text-[#12A5B0]" /> View Storefront
            </Link>
          </nav>
        </div>

        <div className="pt-6 border-t border-white/10 space-y-3">
          <div className="text-[11px] text-slate-400 truncate">
            {userProfile?.email || currentUser?.email || 'admin@pynotes.in'}
          </div>
          <button
            onClick={() => { logout(); navigate('/'); }}
            className="w-full py-2.5 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors text-xs font-bold flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto min-w-0">
        <Outlet />
      </main>
    </div>
  );
};
