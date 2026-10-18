import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Logo } from '../components/Logo';
import {
  Settings, Megaphone, Tag, HelpCircle, Save, Plus, Trash2,
  CheckCircle2, AlertCircle, ShieldAlert, Check, RefreshCw,
  Upload, Image, RotateCcw
} from 'lucide-react';

export const ContentAdmin: React.FC = () => {
  const { getIdToken } = useAuth();
  const [activeTab, setActiveTab] = useState<'announcements' | 'settings' | 'coupons' | 'integrations'>('announcements');
  const [settings, setSettings] = useState<any>({
    store_name: 'PyNotes',
    support_email: 'support@pynotes.in',
    support_phone: '+91 98765 43210',
    support_hours: 'Mon-Sat 10am - 7pm IST',
    gstin: '29ABCDE1234F1Z5',
    free_shipping_threshold_paise: 99900,
    cod_fee_paise: 4900,
    store_address: 'PyNotes Publications, Tech Hub, Koramangala, Bengaluru, Karnataka 560034',
    announcement_messages: [
      { text: '🚚 FREE Shipping across India on orders above ₹999!', highlight: 'FREE Shipping' },
      { text: '⚡ COD Available with doorstep delivery in 3-5 days!', highlight: 'COD Available' },
      { text: '🎉 Use coupon PY10 for 10% OFF your first order!', highlight: 'PY10' }
    ]
  });

  const [coupons, setCoupons] = useState<any[]>([]);
  const [health, setHealth] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // New coupon modal
  const [newCoupon, setNewCoupon] = useState<{
    code: string;
    type: 'percent' | 'flat';
    value: number;
    min_order_inr: number;
    max_discount_inr: number;
    active: boolean;
  }>({
    code: '',
    type: 'percent',
    value: 10,
    min_order_inr: 499,
    max_discount_inr: 200,
    active: true
  });

  const loadAll = async () => {
    try {
      const token = await getIdToken();
      const headers = { Authorization: `Bearer ${token}` };

      const [sRes, cRes, hRes] = await Promise.all([
        fetch('/api/admin/settings', { headers }),
        fetch('/api/admin/coupons', { headers }),
        fetch('/api/health')
      ]);

      if (sRes.ok) {
        const sData = await sRes.json();
        if (sData && Object.keys(sData).length > 0) {
          setSettings((prev: any) => ({ ...prev, ...sData }));
        }
      }
      if (cRes.ok) {
        const cData = await cRes.json();
        setCoupons(Array.isArray(cData) ? cData : []);
      }
      if (hRes.ok) {
        const hData = await hRes.json();
        setHealth(hData);
      }
    } catch (err) {
      console.error('Failed to load admin content:', err);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert('Logo file size must be under 2MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setSettings((prev: any) => ({ ...prev, logo_url: base64 }));
      localStorage.setItem('pynotes_custom_logo', base64);
    };
    reader.readAsDataURL(file);
  };

  const handleWhiteLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert('Logo file size must be under 2MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setSettings((prev: any) => ({ ...prev, logo_white_url: base64 }));
      localStorage.setItem('pynotes_custom_logo_white', base64);
    };
    reader.readAsDataURL(file);
  };

  const handleResetLogo = () => {
    setSettings((prev: any) => ({ ...prev, logo_url: '/logo.svg', logo_white_url: '/logo-white.svg' }));
    localStorage.removeItem('pynotes_custom_logo');
    localStorage.removeItem('pynotes_custom_logo_white');
  };

  const handleSaveSettings = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);
    try {
      const token = await getIdToken();
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        setSavedSuccess(true);
        if (settings.logo_url) {
          localStorage.setItem('pynotes_custom_logo', settings.logo_url);
        } else {
          localStorage.removeItem('pynotes_custom_logo');
        }
        if (settings.logo_white_url) {
          localStorage.setItem('pynotes_custom_logo_white', settings.logo_white_url);
        } else {
          localStorage.removeItem('pynotes_custom_logo_white');
        }
        setTimeout(() => setSavedSuccess(false), 3000);
      } else {
        alert('Failed to save settings');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  const handleAddAnnouncement = () => {
    const updated = [
      ...(settings.announcement_messages || []),
      { text: '✨ New study guide updates released for semester exams!', highlight: 'New study guide' }
    ];
    setSettings({ ...settings, announcement_messages: updated });
  };

  const handleRemoveAnnouncement = (index: number) => {
    const updated = [...(settings.announcement_messages || [])];
    updated.splice(index, 1);
    setSettings({ ...settings, announcement_messages: updated });
  };

  const handleAddCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCoupon.code) return;
    try {
      const token = await getIdToken();
      const res = await fetch('/api/admin/coupons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          code: newCoupon.code.toUpperCase().trim(),
          type: newCoupon.type,
          value: Number(newCoupon.value),
          min_order_paise: Number(newCoupon.min_order_inr) * 100,
          max_discount_paise: Number(newCoupon.max_discount_inr) * 100,
          active: newCoupon.active,
          created_at: new Date().toISOString()
        })
      });

      if (res.ok) {
        setNewCoupon({
          code: '',
          type: 'percent',
          value: 10,
          min_order_inr: 499,
          max_discount_inr: 200,
          active: true
        });
        loadAll();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCoupon = async (code: string) => {
    if (!confirm(`Delete coupon ${code}?`)) return;
    try {
      const token = await getIdToken();
      const res = await fetch(`/api/admin/coupons/${code}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) loadAll();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#092f55] font-nunito">Store Content & Settings</h1>
          <p className="text-xs text-[#526d81] mt-1">Configure announcement banners, store details, discount coupons, and payment credentials.</p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold animate-fade-in">
            <Check className="w-4 h-4 text-emerald-600" /> Changes saved and published!
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-[#e7edf2]">
        <button
          onClick={() => setActiveTab('announcements')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'announcements' ? 'bg-[#092f55] text-white shadow-xs' : 'text-[#526d81] hover:bg-slate-100'
          }`}
        >
          <Megaphone className="w-4 h-4" /> Announcement Bar
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'settings' ? 'bg-[#092f55] text-white shadow-xs' : 'text-[#526d81] hover:bg-slate-100'
          }`}
        >
          <Settings className="w-4 h-4" /> Store Details & Shipping
        </button>
        <button
          onClick={() => setActiveTab('coupons')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'coupons' ? 'bg-[#092f55] text-white shadow-xs' : 'text-[#526d81] hover:bg-slate-100'
          }`}
        >
          <Tag className="w-4 h-4" /> Discount Coupons ({coupons.length})
        </button>
        <button
          onClick={() => setActiveTab('integrations')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'integrations' ? 'bg-[#092f55] text-white shadow-xs' : 'text-[#526d81] hover:bg-slate-100'
          }`}
        >
          <ShieldAlert className="w-4 h-4" /> Gateway & Integrations
        </button>
      </div>

      {/* Announcements Manager */}
      {activeTab === 'announcements' && (
        <div className="bg-white p-8 rounded-3xl border border-[#e7edf2] shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base text-[#092f55]">Top Announcement Bar Messages</h3>
              <p className="text-xs text-[#526d81]">These messages rotate automatically at the very top of all pages.</p>
            </div>
            <button
              onClick={handleAddAnnouncement}
              className="px-4 py-2 bg-[#12A5B0] text-white text-xs font-bold rounded-xl hover:bg-[#0f8fa5] flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" /> Add Message
            </button>
          </div>

          <div className="space-y-4">
            {settings.announcement_messages?.map((msg: any, idx: number) => (
              <div key={idx} className="flex items-center gap-4 p-4 bg-[#f6f9fc] rounded-2xl border border-[#e7edf2]">
                <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center font-bold text-xs text-[#092f55] border border-[#e7edf2]">
                  {idx + 1}
                </div>
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={msg.text}
                    onChange={e => {
                      const updated = [...settings.announcement_messages];
                      updated[idx].text = e.target.value;
                      setSettings({ ...settings, announcement_messages: updated });
                    }}
                    placeholder="Full announcement message"
                    className="w-full px-3 py-2 bg-white border border-[#e7edf2] rounded-xl text-xs"
                  />
                  <input
                    type="text"
                    value={msg.highlight || ''}
                    onChange={e => {
                      const updated = [...settings.announcement_messages];
                      updated[idx].highlight = e.target.value;
                      setSettings({ ...settings, announcement_messages: updated });
                    }}
                    placeholder="Keyword to highlight in bold/teal"
                    className="w-full px-3 py-2 bg-white border border-[#e7edf2] rounded-xl text-xs font-bold text-[#12A5B0]"
                  />
                </div>
                <button
                  onClick={() => handleRemoveAnnouncement(idx)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-[#e7edf2] flex justify-end">
            <button
              onClick={handleSaveSettings}
              disabled={saving}
              className="px-6 py-3 bg-[#092f55] hover:bg-[#071E38] text-white font-extrabold text-xs rounded-xl flex items-center gap-2 shadow-xs transition-colors"
            >
              <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save & Publish Announcements'}
            </button>
          </div>
        </div>
      )}

      {/* Store Settings & Shipping */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="bg-white p-8 rounded-3xl border border-[#e7edf2] shadow-xs space-y-8">
          
          {/* Logo & Brand Identity Card */}
          <div className="p-6 bg-gradient-to-r from-[#f6f9fc] via-white to-[#e4f8f9]/50 rounded-2xl border border-[#e7edf2] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#13a5bd]/10 text-[#13a5bd] flex items-center justify-center">
                  <Image className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-[#092f55]">Store Logo & Brand Identity</h4>
                  <p className="text-[11px] text-[#526d81]">Upload your custom PyNotes brand logo image or change the remote logo URL.</p>
                </div>
              </div>
              {settings.logo_url && (
                <button
                  type="button"
                  onClick={handleResetLogo}
                  className="text-xs text-red-600 hover:text-red-700 font-bold flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Reset to Default Logo
                </button>
              )}
            </div>

            {/* Live Previews */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              <div className="bg-white p-4 rounded-xl border border-[#e7edf2] flex flex-col justify-between shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#708596]">Header Logo (Light Background)</span>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono font-bold">Standard</span>
                </div>
                <div className="h-16 flex items-center px-4 bg-white/95 border border-dashed border-[#d1d5db] rounded-lg">
                  <Logo customLogoUrl={settings.logo_url} heightPx={settings.logo_height || 36} />
                </div>
              </div>

              <div className="bg-[#092f55] p-4 rounded-xl border border-[#0B3561] flex flex-col justify-between text-white shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">Footer Logo (Dark Background)</span>
                  <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded font-mono font-bold">100% Full White</span>
                </div>
                <div className="h-16 flex items-center px-4 bg-[#071E38] border border-dashed border-slate-700 rounded-lg">
                  <Logo customLogoUrl={settings.logo_url} customLogoWhiteUrl={settings.logo_white_url} heightPx={settings.logo_height || 36} inverted={true} />
                </div>
              </div>
            </div>

            {/* File Upload Button & URL field */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-[#092f55] mb-1.5">Upload Header Logo</label>
                <label className="cursor-pointer bg-white hover:bg-slate-50 border-2 border-dashed border-[#13a5bd]/40 hover:border-[#13a5bd] rounded-xl px-4 py-3 flex items-center justify-center gap-2.5 text-xs font-bold text-[#092f55] shadow-xs transition-all">
                  <Upload className="w-4 h-4 text-[#13a5bd]" />
                  <span>Choose Header Logo</span>
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/svg+xml, image/webp"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </label>
                <p className="text-[10px] text-slate-400 mt-1">Light background version (PNG or SVG under 2MB).</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#092f55] mb-1.5">Upload Dedicated White Logo</label>
                <label className="cursor-pointer bg-white hover:bg-slate-50 border-2 border-dashed border-slate-300 hover:border-[#092f55] rounded-xl px-4 py-3 flex items-center justify-center gap-2.5 text-xs font-bold text-[#092f55] shadow-xs transition-all">
                  <Upload className="w-4 h-4 text-slate-600" />
                  <span>Choose White Logo</span>
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/svg+xml, image/webp"
                    onChange={handleWhiteLogoUpload}
                    className="hidden"
                  />
                </label>
                <p className="text-[10px] text-slate-400 mt-1">Optional. If empty, the header logo is auto-inverted to full white.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#092f55] mb-1.5">Or Direct Logo Image URL</label>
                <input
                  type="text"
                  placeholder="https://example.com/logo.png"
                  value={settings.logo_url || ''}
                  onChange={e => {
                    const val = e.target.value;
                    setSettings({ ...settings, logo_url: val });
                    if (val) localStorage.setItem('pynotes_custom_logo', val);
                  }}
                  className="w-full px-4 py-2.5 bg-white border border-[#e7edf2] rounded-xl text-xs focus:outline-none focus:border-[#13a5bd]"
                />
                <p className="text-[10px] text-slate-400 mt-1">Can be any hosted image link or CDN URL.</p>
              </div>
            </div>

            {/* Height Slider */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <label className="text-xs font-bold text-[#092f55]">Header Display Height: {settings.logo_height || 36}px</label>
              <input
                type="range"
                min="24"
                max="60"
                value={settings.logo_height || 36}
                onChange={e => setSettings({ ...settings, logo_height: Number(e.target.value) })}
                className="w-48 accent-[#13a5bd] cursor-pointer"
              />
              <span className="text-[11px] text-[#708596]">(Adjust how tall the logo appears in the top navigation)</span>
            </div>
          </div>

          <h3 className="font-extrabold text-base text-[#092f55] pt-2">Store Details, GSTIN & Support</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-[#092f55] mb-1">Store Name</label>
              <input
                type="text"
                value={settings.store_name}
                onChange={e => setSettings({ ...settings, store_name: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#f6f9fc] border border-[#e7edf2] rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#092f55] mb-1">Support Email</label>
              <input
                type="email"
                value={settings.support_email}
                onChange={e => setSettings({ ...settings, support_email: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#f6f9fc] border border-[#e7edf2] rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#092f55] mb-1">Support Phone / WhatsApp</label>
              <input
                type="text"
                value={settings.support_phone}
                onChange={e => setSettings({ ...settings, support_phone: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#f6f9fc] border border-[#e7edf2] rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#092f55] mb-1">Operating Hours</label>
              <input
                type="text"
                value={settings.support_hours}
                onChange={e => setSettings({ ...settings, support_hours: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#f6f9fc] border border-[#e7edf2] rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#092f55] mb-1">GSTIN Number</label>
              <input
                type="text"
                value={settings.gstin}
                onChange={e => setSettings({ ...settings, gstin: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#f6f9fc] border border-[#e7edf2] rounded-xl text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#092f55] mb-1">Free Shipping Threshold (INR)</label>
              <input
                type="number"
                value={settings.free_shipping_threshold_paise ? settings.free_shipping_threshold_paise / 100 : 999}
                onChange={e => setSettings({ ...settings, free_shipping_threshold_paise: Number(e.target.value) * 100 })}
                className="w-full px-4 py-2.5 bg-[#f6f9fc] border border-[#e7edf2] rounded-xl text-xs font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#092f55] mb-1">Additional COD Handling Fee (INR)</label>
              <input
                type="number"
                value={settings.cod_fee_paise ? settings.cod_fee_paise / 100 : 49}
                onChange={e => setSettings({ ...settings, cod_fee_paise: Number(e.target.value) * 100 })}
                className="w-full px-4 py-2.5 bg-[#f6f9fc] border border-[#e7edf2] rounded-xl text-xs font-bold"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#092f55] mb-1">Store Dispatch & Return Address</label>
              <textarea
                rows={2}
                value={settings.store_address}
                onChange={e => setSettings({ ...settings, store_address: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#f6f9fc] border border-[#e7edf2] rounded-xl text-xs"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-[#e7edf2] flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-[#092f55] hover:bg-[#071E38] text-white font-extrabold text-xs rounded-xl flex items-center gap-2 shadow-xs transition-colors"
            >
              <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      )}

      {/* Coupons Manager */}
      {activeTab === 'coupons' && (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#e7edf2] shadow-xs space-y-4">
            <h3 className="font-extrabold text-base text-[#092f55]">Create New Coupon</h3>
            <form onSubmit={handleAddCoupon} className="grid grid-cols-1 sm:grid-cols-6 gap-3 items-end">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#092f55] mb-1">Coupon Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. EXAM20"
                  value={newCoupon.code}
                  onChange={e => setNewCoupon({ ...newCoupon, code: e.target.value })}
                  className="w-full px-3 py-2 bg-[#f6f9fc] border border-[#e7edf2] rounded-xl text-xs uppercase font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#092f55] mb-1">Type</label>
                <select
                  value={newCoupon.type}
                  onChange={e => setNewCoupon({ ...newCoupon, type: e.target.value as any })}
                  className="w-full px-3 py-2 bg-[#f6f9fc] border border-[#e7edf2] rounded-xl text-xs font-bold"
                >
                  <option value="percent">Percentage (%)</option>
                  <option value="flat">Flat Amount (₹)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#092f55] mb-1">Discount Value</label>
                <input
                  type="number"
                  required
                  value={newCoupon.value}
                  onChange={e => setNewCoupon({ ...newCoupon, value: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-[#f6f9fc] border border-[#e7edf2] rounded-xl text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#092f55] mb-1">Min Order (₹)</label>
                <input
                  type="number"
                  value={newCoupon.min_order_inr}
                  onChange={e => setNewCoupon({ ...newCoupon, min_order_inr: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-[#f6f9fc] border border-[#e7edf2] rounded-xl text-xs"
                />
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full py-2 bg-[#12A5B0] hover:bg-[#0f8fa5] text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                >
                  Add Coupon
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white rounded-3xl border border-[#e7edf2] overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#f6f9fc] border-b border-[#e7edf2] text-[#092f55]">
                  <th className="py-4 px-6 font-bold">Code</th>
                  <th className="py-4 px-6 font-bold">Discount</th>
                  <th className="py-4 px-6 font-bold">Min Order</th>
                  <th className="py-4 px-6 font-bold">Status</th>
                  <th className="py-4 px-6 text-right font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e7edf2]">
                {coupons.map((c: any) => (
                  <tr key={c.code} className="hover:bg-[#f6f9fc]/50">
                    <td className="py-4 px-6 font-mono font-black text-[#092f55] text-sm">
                      {c.code}
                    </td>
                    <td className="py-4 px-6 font-bold">
                      {c.type === 'percent' ? `${c.value}% OFF` : `₹${c.value} OFF`}
                    </td>
                    <td className="py-4 px-6 text-slate-600">
                      ₹{c.min_order_paise ? c.min_order_paise / 100 : 0}
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] uppercase">
                        Active
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleDeleteCoupon(c.code)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Integrations Health */}
      {activeTab === 'integrations' && (
        <div className="bg-white p-8 rounded-3xl border border-[#e7edf2] shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base text-[#092f55]">External Service Integrations Status</h3>
              <p className="text-xs text-[#526d81]">Checks if Razorpay, Shiprocket, and Nodemailer SMTP secrets are loaded securely from environment variables.</p>
            </div>
            <button
              onClick={loadAll}
              className="text-xs text-[#12A5B0] hover:underline font-bold flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Re-check
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 bg-[#f6f9fc] rounded-2xl border border-[#e7edf2] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-[#092f55]">Razorpay Payment Gateway</span>
                {health?.integrations?.razorpay ? (
                  <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4" /> Connected
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-amber-600 font-bold text-xs">
                    <AlertCircle className="w-4 h-4" /> Simulated / COD Only
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#526d81]">
                {health?.integrations?.razorpay_test_mode ? 'Running in TEST MODE (rzp_test_ key)' : 'Prepaid UPI/Cards/Netbanking'}
              </p>
            </div>

            <div className="p-5 bg-[#f6f9fc] rounded-2xl border border-[#e7edf2] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-[#092f55]">Shiprocket Courier API</span>
                {health?.integrations?.shiprocket ? (
                  <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4" /> Connected
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-amber-600 font-bold text-xs">
                    <AlertCircle className="w-4 h-4" /> Manual Dispatch Active
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#526d81]">
                {health?.integrations?.shiprocket ? 'Automatic AWB & label generation ready' : 'Manual AWB courier tracking entry enabled'}
              </p>
            </div>

            <div className="p-5 bg-[#f6f9fc] rounded-2xl border border-[#e7edf2] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-[#092f55]">SMTP Email Notifications</span>
                {health?.integrations?.smtp ? (
                  <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4" /> Connected
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-amber-600 font-bold text-xs">
                    <AlertCircle className="w-4 h-4" /> Graceful Fallback
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#526d81]">Order confirmations & status update emails</p>
            </div>

            <div className="p-5 bg-[#f6f9fc] rounded-2xl border border-[#e7edf2] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-[#092f55]">Cloud Firestore Security</span>
                <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4" /> Strict Server-Only (100% Secure)
                </span>
              </div>
              <p className="text-[11px] text-[#526d81]">Client direct reads/writes strictly DENIED by security rules</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
