import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck } from 'lucide-react';

export const CartPage: React.FC<{ catalog: any }> = ({ catalog }) => {
  const { cart, removeFromCart, updateQty, quote, paymentMethod, setPaymentMethod } = useCart();
  const navigate = useNavigate();
  const productsMap = new Map<string, any>();
  catalog?.products?.forEach((p: any) => productsMap.set(p.slug, p));

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-6">
        <h2 className="text-3xl font-black text-[#092f55] font-nunito">Your Shopping Cart is Empty</h2>
        <p className="text-xs text-[#526d81]">Explore our handwritten notes and multi-subject bundles.</p>
        <Link to="/subjects" className="inline-block px-8 py-3.5 bg-[#12A5B0] text-white font-extrabold text-xs rounded-full hover:bg-[#0f8fa5]">
          Browse Subjects
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <h1 className="text-3xl font-black text-[#092f55] font-nunito">Review Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-4">
          {cart.map(item => {
            const prod = productsMap.get(item.slug);
            if (!prod) return null;
            return (
              <div key={item.slug} className="bg-white p-6 rounded-3xl border border-[#e7edf2] shadow-xs flex items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <img src={prod.images?.[0]} alt={prod.title} className="w-20 h-24 object-cover rounded-2xl border border-[#e7edf2]" />
                  <div>
                    <h3 className="font-extrabold text-sm text-[#092f55]">{prod.title}</h3>
                    <p className="text-xs font-black text-[#12A5B0] mt-1">₹{prod.price_paise / 100}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex items-center border border-[#e7edf2] rounded-xl bg-[#f6f9fc]">
                    <button onClick={() => updateQty(item.slug, item.qty - 1)} className="p-2 text-[#526d81]"><Minus className="w-4 h-4" /></button>
                    <span className="px-3 text-xs font-bold">{item.qty}</span>
                    <button onClick={() => updateQty(item.slug, item.qty + 1)} className="p-2 text-[#526d81]"><Plus className="w-4 h-4" /></button>
                  </div>
                  <button onClick={() => removeFromCart(item.slug)} className="text-red-500 hover:text-red-700 p-2"><Trash2 className="w-5 h-5" /></button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-white p-8 rounded-3xl border border-[#e7edf2] shadow-xs space-y-6 h-fit">
          <h3 className="font-extrabold text-lg text-[#092f55]">Order Summary</h3>
          
          <div className="grid grid-cols-2 gap-2 p-1 bg-[#f6f9fc] rounded-xl border border-[#e7edf2]">
            <button
              onClick={() => setPaymentMethod('prepaid')}
              className={`py-2 text-xs font-bold rounded-lg ${paymentMethod === 'prepaid' ? 'bg-[#092f55] text-white shadow-xs' : 'text-[#526d81]'}`}
            >
              Prepaid (10% Off)
            </button>
            <button
              onClick={() => setPaymentMethod('cod')}
              className={`py-2 text-xs font-bold rounded-lg ${paymentMethod === 'cod' ? 'bg-[#092f55] text-white shadow-xs' : 'text-[#526d81]'}`}
            >
              COD
            </button>
          </div>

          <div className="space-y-2 text-xs text-[#526d81]">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-bold text-[#102943]">₹{(quote?.subtotal_paise || 0) / 100}</span>
            </div>
            {quote?.coupon_discount_paise > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Coupon Discount</span>
                <span>-₹{quote.coupon_discount_paise / 100}</span>
              </div>
            )}
            {quote?.prepaid_discount_paise > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Prepaid Discount</span>
                <span>-₹{quote.prepaid_discount_paise / 100}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="font-bold text-[#12A5B0]">{quote?.shipping_paise === 0 ? 'FREE' : `₹${(quote?.shipping_paise || 0) / 100}`}</span>
            </div>
            <div className="flex justify-between pt-3 border-t border-[#e7edf2] text-sm font-black text-[#092f55]">
              <span>Total</span>
              <span>₹{(quote?.total_paise || 0) / 100}</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full py-4 bg-[#12A5B0] text-white font-extrabold text-sm rounded-xl hover:bg-[#0f8fa5] transition-colors flex items-center justify-center gap-2 shadow-md"
          >
            Proceed to Checkout <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
