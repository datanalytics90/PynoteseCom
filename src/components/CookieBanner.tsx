import React, { useState, useEffect } from 'react';

export const CookieBanner: React.FC<{ settings?: any }> = ({ settings }) => {
  const [accepted, setAccepted] = useState(() => {
    return localStorage.getItem('pynotes_cookie_consent') === 'true';
  });

  const handleAccept = () => {
    localStorage.setItem('pynotes_cookie_consent', 'true');
    setAccepted(true);
  };

  if (accepted) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#092f55] text-white p-4 shadow-2xl border-t border-[#13a5bd]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
      <p className="text-xs text-slate-300 max-w-3xl">
        We use cookies and analytics (GA4 and Meta Pixel) to improve your shopping experience and measure site performance. By clicking "Accept", you consent to our use of cookies in accordance with our privacy policy.
      </p>
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={handleAccept}
          className="px-5 py-2 bg-[#13a5bd] text-white text-xs font-bold rounded-xl hover:bg-[#0f8fa5] transition-colors"
        >
          Accept
        </button>
      </div>
    </div>
  );
};
