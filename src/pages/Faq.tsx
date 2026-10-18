import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export const Faq: React.FC<{ catalog: any }> = ({ catalog }) => {
  const { faqs = [] } = catalog || {};
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black text-[#092f55] font-nunito">Frequently Asked Questions</h1>
        <p className="text-xs text-[#526d81]">Everything you need to know about our printed handwritten notes and delivery.</p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq: any) => (
          <div key={faq.id} className="bg-white rounded-2xl border border-[#e7edf2] overflow-hidden shadow-xs">
            <button
              onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
              className="w-full p-5 text-left font-extrabold text-sm text-[#092f55] flex justify-between items-center hover:bg-[#f6f9fc]"
            >
              <span>{faq.question}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${openId === faq.id ? 'rotate-180' : ''}`} />
            </button>
            {openId === faq.id && (
              <div className="p-5 pt-0 text-xs text-[#526d81] leading-relaxed border-t border-[#e7edf2] bg-[#f6f9fc]/50">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
