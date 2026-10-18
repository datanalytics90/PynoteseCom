import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Layers, CheckCircle2, ArrowRight } from 'lucide-react';

export const Bundles: React.FC<{ catalog: any }> = ({ catalog }) => {
  const { products = [] } = catalog || {};
  const { addToCart } = useCart();

  const bundles = products.filter((p: any) => p.type === 'bundle' && p.status === 'active');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-black uppercase tracking-wider text-[#12A5B0]">Super Savings</span>
        <h1 className="text-3xl sm:text-4xl font-black text-[#092f55] font-nunito">Multi-Subject Programming Bundles</h1>
        <p className="text-xs text-[#526d81]">Combine top subjects together and save big on printed handwritten notes.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {bundles.map((bundle: any) => (
          <div key={bundle.slug} className="bg-white rounded-3xl border border-[#e7edf2] p-8 shadow-xs hover:shadow-xl transition-all flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="bg-[#12A5B0]/10 text-[#12A5B0] text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
                  {bundle.badge_text || 'Bundle Combo'}
                </span>
                <span className="text-xs font-bold text-green-700 bg-green-50 px-3 py-1 rounded-full">
                  Available: {bundle.available_qty > 0 ? `${bundle.available_qty} in stock` : 'Sold Out'}
                </span>
              </div>

              <h3 className="text-2xl font-black text-[#092f55] font-nunito">{bundle.title}</h3>
              <p className="text-xs text-[#526d81] leading-relaxed">{bundle.description}</p>

              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-[#092f55]">Includes Books:</span>
                <div className="flex flex-wrap gap-2">
                  {bundle.bundle_items?.map((bi: any, idx: number) => (
                    <span key={idx} className="bg-[#f6f9fc] text-[#092f55] text-xs font-bold px-3 py-1 rounded-xl border border-[#e7edf2]">
                      ✓ {bi.book_slug} (qty {bi.qty})
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-[#e7edf2] flex items-center justify-between">
              <div>
                <span className="text-2xl font-black text-[#092f55]">₹{bundle.price_paise / 100}</span>
                <span className="text-xs text-slate-400 line-through ml-2">₹{bundle.mrp_paise / 100}</span>
              </div>
              <button
                onClick={() => addToCart(bundle.slug)}
                disabled={bundle.available_qty <= 0}
                className="px-6 py-3.5 bg-[#092f55] text-white font-extrabold text-xs rounded-xl hover:bg-[#071E38] transition-colors disabled:opacity-50"
              >
                {bundle.available_qty > 0 ? 'Add Bundle to Cart' : 'Sold Out'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
