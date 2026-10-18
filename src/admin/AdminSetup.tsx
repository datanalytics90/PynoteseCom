import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Database, ArrowRight } from 'lucide-react';

export const AdminSetup: React.FC = () => {
  const { currentUser, loginWithGoogle, getIdToken } = useAuth();
  const [setupCode, setSetupCode] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [seeding, setSeeding] = useState(false);

  const handleClaimOwner = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMsg('');
    try {
      const token = await getIdToken();
      const res = await fetch('/api/admin/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ setup_code: setupCode })
      });
      const data = await res.json();
      if (res.ok) {
        setMsg(data.message || 'Owner role claimed successfully!');
      } else {
        setError(data.error || 'Setup failed');
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSeed = async () => {
    setSeeding(true);
    setError('');
    setMsg('');
    try {
      const token = await getIdToken();
      const res = await fetch('/api/admin/seed', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setMsg(data.message || 'Demo data seeded successfully!');
      } else {
        setError(data.error || 'Seeding failed');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-20 space-y-8">
      <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#e7edf2] shadow-xl space-y-6">
        <div className="w-16 h-16 bg-[#092f55] text-[#12A5B0] rounded-2xl flex items-center justify-center mx-auto shadow-md">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-black text-[#092f55] font-nunito">PyNotes Admin Setup</h1>
          <p className="text-xs text-[#526d81]">Claim store ownership and seed demo catalogue.</p>
        </div>

        {!currentUser ? (
          <button
            onClick={loginWithGoogle}
            className="w-full py-4 bg-[#092f55] text-white font-extrabold text-xs rounded-xl hover:bg-[#071E38] transition-colors shadow-md"
          >
            Sign in with Google First
          </button>
        ) : (
          <form onSubmit={handleClaimOwner} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#092f55] mb-1">Owner Setup Code (from Secrets)</label>
              <input
                type="password"
                required
                value={setupCode}
                onChange={e => setSetupCode(e.target.value)}
                placeholder="Enter OWNER_SETUP_CODE"
                className="w-full px-4 py-3 bg-[#f6f9fc] border border-[#e7edf2] rounded-xl text-xs focus:outline-none focus:border-[#12A5B0]"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3.5 bg-[#12A5B0] text-white font-extrabold text-xs rounded-xl hover:bg-[#0f8fa5] transition-colors shadow-md"
            >
              Claim Owner Role
            </button>
          </form>
        )}

        {msg && <p className="text-xs text-green-700 font-bold text-center bg-green-50 p-3 rounded-xl">{msg}</p>}
        {error && <p className="text-xs text-red-600 font-bold text-center bg-red-50 p-3 rounded-xl">{error}</p>}

        <div className="pt-6 border-t border-[#e7edf2] space-y-4">
          <h3 className="font-bold text-xs text-[#092f55]">Step 2: Seed Demo Catalogue</h3>
          <button
            onClick={handleSeed}
            disabled={seeding}
            className="w-full py-3.5 bg-[#092f55] text-white font-extrabold text-xs rounded-xl hover:bg-[#071E38] transition-colors flex items-center justify-center gap-2"
          >
            <Database className="w-4 h-4" /> {seeding ? 'Seeding...' : 'Seed Demo Data (Idempotent)'}
          </button>
        </div>
      </div>
    </div>
  );
};
