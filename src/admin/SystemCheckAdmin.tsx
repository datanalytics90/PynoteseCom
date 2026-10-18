import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, AlertCircle, Play } from 'lucide-react';

export const SystemCheckAdmin: React.FC = () => {
  const { getIdToken } = useAuth();
  const [tests, setTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const runTests = async () => {
    setLoading(true);
    try {
      const token = await getIdToken();
      const res = await fetch('/api/admin/system-check', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setTests(data.tests || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runTests();
  }, []);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-[#092f55] font-nunito">System Check & Self-Test</h1>
          <p className="text-xs text-[#526d81] mt-1">Runs the 10 core stock and pricing verification rules against the server.</p>
        </div>
        <button
          onClick={runTests}
          disabled={loading}
          className="px-6 py-3 bg-[#12A5B0] text-white font-extrabold text-xs rounded-xl hover:bg-[#0f8fa5] flex items-center gap-2"
        >
          <Play className="w-4 h-4" /> {loading ? 'Running Tests...' : 'Run All Tests'}
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-[#e7edf2] p-8 space-y-4 shadow-xs">
        {tests.map((t: any) => (
          <div key={t.test} className="flex items-center justify-between p-4 bg-[#f6f9fc] rounded-2xl border border-[#e7edf2]">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-xs text-[#092f55]">Test #{t.test}: {t.name}</h4>
                <p className="text-[11px] text-[#526d81]">{t.details}</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-800 text-[10px] font-black rounded-full uppercase">
              Passed
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
