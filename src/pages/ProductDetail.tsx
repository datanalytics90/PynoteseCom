import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Star, CheckCircle2, Truck, ShieldCheck, Clock, Plus, Minus, ArrowRight, Sparkles } from 'lucide-react';

export const ProductDetail: React.FC<{ catalog: any }> = ({ catalog }) => {
  const { slug } = useParams();
  const { products = [], settings = {}, reviews = [] } = catalog || {};
  const { addToCart, setPaymentMethod } = useCart();
  const navigate = useNavigate();

  const product = products.find((p: any) => p.slug === slug);
  const [qty, setQty] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(slug || '');
  const [selectedImage, setSelectedImage] = useState(0);

  if (!product) {
    return <div className="text-center py-20 text-lg font-bold text-[#092f55]">Product not found</div>;
  }

  // Find bundles containing this book if product is a book
  const containingBundles = product.type === 'book'
    ? products.filter((p: any) => p.type === 'bundle' && p.status === 'active' && p.bundle_items?.some((bi: any) => bi.book_slug === product.slug))
    : [];

  const productReviews = reviews.filter((r: any) => r.product_slug === slug && r.status === 'approved');
  const avgRating = productReviews.length > 0
    ? (productReviews.reduce((acc: number, r: any) => acc + r.rating, 0) / productReviews.length).toFixed(1)
    : null;

  const handleBuyNow = () => {
    addToCart(selectedVariant || slug!, qty);
    setPaymentMethod('prepaid');
    navigate('/checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Top Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* Gallery */}
        <div className="space-y-4">
          <div className="aspect-4/3 bg-white rounded-3xl border border-[#e7edf2] overflow-hidden shadow-sm relative">
            {product.badge_text && (
              <span className="absolute top-4 left-4 bg-[#FFD54A] text-[#092f55] text-xs font-black px-3.5 py-1.5 rounded-full shadow-md z-10">
                {product.badge_text}
              </span>
            )}
            <img
              src={product.images?.[selectedImage] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>
          {product.images?.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 shrink-0 ${selectedImage === idx ? 'border-[#12A5B0]' : 'border-[#e7edf2]'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info & Buy */}
        <div className="space-y-6">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-[#12A5B0]">Printed Handwritten Notes</span>
            <h1 className="text-3xl sm:text-4xl font-black text-[#092f55] font-nunito mt-1">{product.title}</h1>
            
            {avgRating && (
              <div className="flex items-center gap-2 mt-3">
                <div className="flex items-center text-[#f3ad19]">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-bold text-sm text-[#092f55] ml-1">{avgRating}</span>
                </div>
                <span className="text-xs text-[#708596]">({productReviews.length} verified reviews)</span>
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#e7edf2] shadow-xs space-y-4">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-3xl font-black text-[#092f55]">₹{product.price_paise / 100}</span>
                <span className="text-sm text-slate-400 line-through ml-3">₹{product.mrp_paise / 100}</span>
              </div>
              <span className="text-xs font-bold text-green-700 bg-green-50 px-3 py-1 rounded-full">
                {product.badge_text || 'In Stock'}
              </span>
            </div>

            {/* Prepaid Offer strip */}
            <div className="p-3 bg-[#e4f8f9] rounded-2xl flex items-center gap-3 text-xs font-bold text-[#092f55]">
              <Sparkles className="w-4 h-4 text-[#12A5B0] shrink-0" />
              <span>{settings.prepaid_offer_text || 'Extra 10% instant off on prepaid orders'}</span>
            </div>

            {/* Variant picker (Book alone + Bundles containing it) */}
            {product.type === 'book' && containingBundles.length > 0 && (
              <div className="space-y-2 pt-2">
                <label className="block text-xs font-bold text-[#092f55]">Select Edition / Combo</label>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedVariant(product.slug)}
                    className={`w-full p-3 rounded-xl border text-left flex items-center justify-between text-xs font-bold transition-all ${selectedVariant === product.slug ? 'border-[#12A5B0] bg-[#e4f8f9]/50 text-[#092f55]' : 'border-[#e7edf2] bg-white text-[#526d81]'}`}
                  >
                    <span>{product.title} (Single Book)</span>
                    <span className="text-[#12A5B0]">₹{product.price_paise / 100}</span>
                  </button>
                  {containingBundles.map((bun: any) => (
                    <button
                      key={bun.slug}
                      onClick={() => setSelectedVariant(bun.slug)}
                      className={`w-full p-3 rounded-xl border text-left flex items-center justify-between text-xs font-bold transition-all ${selectedVariant === bun.slug ? 'border-[#12A5B0] bg-[#e4f8f9]/50 text-[#092f55]' : 'border-[#e7edf2] bg-white text-[#526d81]'}`}
                    >
                      <span>🔥 {bun.title} (Bundle Combo)</span>
                      <span className="text-[#12A5B0]">₹{bun.price_paise / 100}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-4 pt-2">
              <span className="text-xs font-bold text-[#092f55]">Quantity</span>
              <div className="flex items-center border border-[#e7edf2] rounded-xl bg-[#f6f9fc]">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-2 text-[#526d81]"><Minus className="w-4 h-4" /></button>
                <span className="px-4 text-xs font-bold">{qty}</span>
                <button onClick={() => setQty(Math.min(10, qty + 1))} className="p-2 text-[#526d81]"><Plus className="w-4 h-4" /></button>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => addToCart(selectedVariant || slug!, qty)}
                className="py-3.5 bg-[#092f55] text-white font-extrabold text-xs rounded-xl hover:bg-[#071E38] transition-colors shadow-md"
              >
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="py-3.5 bg-[#12A5B0] text-white font-extrabold text-xs rounded-xl hover:bg-[#0f8fa5] transition-colors shadow-md"
              >
                Buy It Now
              </button>
            </div>
          </div>

          {/* Delivery strip */}
          <div className="bg-white p-5 rounded-3xl border border-[#e7edf2] grid grid-cols-3 gap-2 text-center text-xs">
            <div className="space-y-1">
              <div className="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center mx-auto"><CheckCircle2 className="w-4 h-4" /></div>
              <span className="font-bold text-[#092f55]">Ordered</span>
              <p className="text-[10px] text-slate-400">Instant Confirmation</p>
            </div>
            <div className="space-y-1">
              <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto"><Clock className="w-4 h-4" /></div>
              <span className="font-bold text-[#092f55]">Ready</span>
              <p className="text-[10px] text-slate-400">{settings.processing_days_min || 1}-{settings.processing_days_max || 2} days</p>
            </div>
            <div className="space-y-1">
              <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mx-auto"><Truck className="w-4 h-4" /></div>
              <span className="font-bold text-[#092f55]">Delivered</span>
              <p className="text-[10px] text-slate-400">{settings.delivery_days_min || 3}-{settings.delivery_days_max || 7} days</p>
            </div>
          </div>

        </div>
      </div>

      {/* Description & Features */}
      <div className="space-y-12">
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#e7edf2] space-y-6">
          <h2 className="text-2xl font-black text-[#092f55] font-nunito">About the Notebook</h2>
          <p className="text-sm text-[#526d81] leading-relaxed">{product.description}</p>
          
          {product.features && product.features.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-[#e7edf2]">
              {product.features.map((f: any, idx: number) => (
                <div key={idx} className="space-y-2 p-5 bg-[#f6f9fc] rounded-2xl border border-[#e7edf2]">
                  <h4 className="font-bold text-sm text-[#092f55]">{f.heading}</h4>
                  <p className="text-xs text-[#526d81]">{f.body}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
