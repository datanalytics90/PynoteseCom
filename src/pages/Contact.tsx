import React, { useState } from 'react';

export const Contact: React.FC = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    if (res.ok) setSent(true);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black text-[#092f55] font-nunito">Contact Support</h1>
        <p className="text-xs text-[#526d81]">We're here to help with your printed notes and orders.</p>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-[#e7edf2] shadow-xs">
        {sent ? (
          <div className="p-6 bg-green-50 text-green-800 text-center font-bold rounded-2xl text-xs">
            Message sent successfully! Our team will reply shortly.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#092f55] mb-1">Your Name</label>
              <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 bg-[#f6f9fc] border border-[#e7edf2] rounded-xl text-xs" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#092f55] mb-1">Email Address</label>
              <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-3 bg-[#f6f9fc] border border-[#e7edf2] rounded-xl text-xs" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#092f55] mb-1">Message</label>
              <textarea rows={4} required value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} className="w-full px-4 py-3 bg-[#f6f9fc] border border-[#e7edf2] rounded-xl text-xs" />
            </div>
            <button type="submit" className="w-full py-3.5 bg-[#092f55] text-white font-extrabold text-xs rounded-xl hover:bg-[#071E38]">Send Message</button>
          </form>
        )}
      </div>
    </div>
  );
};
