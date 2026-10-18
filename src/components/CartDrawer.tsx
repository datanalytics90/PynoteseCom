import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const CartDrawer: React.FC<{ products: any[] }> = ({ products }) => {
  const {
    cart, isDrawerOpen, setIsDrawerOpen, removeFromCart, updateQty,
    couponCode, setCouponCode, appliedCoupon, setAppliedCoupon,
    paymentMethod, setPaymentMethod, quote, loadingQuote
  } = useCart();
  const [couponError, setCouponError] = useState('');
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const navigate = useNavigate();

  const productsMap = new Map<string, any>();
  products.forEach(p => productsMap.set(p.slug, p));

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setValidatingCoupon(true);
    setCouponError('');
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: couponCode.trim(),
          subtotal_paise: quote?.subtotal_paise || 0,
          payment_method: paymentMethod
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAppliedCoupon(data.coupon);
        setCouponError('');
      } else {
        setCouponError(data.error || 'Invalid coupon');
      }
    } catch (err) {
      setCouponError('Failed to validate coupon');
    } finally {
      setValidatingCoupon(false);
    }
  };

  if (!isDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={() => setIsDrawerOpen(false)}
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="px-6 py-4 border-b border-[#e7edf2] flex items-center justify-between bg-[#f6f9fc]">
            <h3 className="font-extrabold text-[#092f55] text-lg flex items-center gap-2">
              Your Shopping Cart ({cart.reduce((a, b) => a + b.qty, 0)})
            </h3>
            <button 
              onClick={() => setIsDrawerOpen(false)}
              className="p-2 text-[#708596] hover:text-[#092f55] rounded-xl hover:bg-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 bg-[#e4f8f9] rounded-full flex items-center justify-center mx-auto text-[#13a5bd]">
                  <Tag className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-[#092f55]">Your cart is empty</h4>
                <p className="text-xs text-[#526d81]">Explore our 13 printed handwritten notes and multi-subject bundles.</p>
                <button
                  onClick={() => { setIsDrawerOpen(false); navigate('/subjects'); }}
                  className="mt-4 px-6 py-2.5 bg-[#13a5bd] text-white font-bold text-xs rounded-full hover:bg-[#0f8fa5] transition-colors"
                >
                  Browse Notes
                </button>
              </div>
            ) : (
              cart.map(item => {
                const prod = productsMap.get(item.slug);
                if (!prod) return null;
                return (
                  <div key={item.slug} className="flex gap-4 p-4 rounded-2xl bg-[#f6f9fc] border border-[#e7edf2] items-center">
                    <img 
                      src={prod.images?.[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=200&q=80'} 
                      alt={prod.title}
                      className="w-16 h-20 object-cover rounded-xl border border-[#e7edf2]"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-xs text-[#092f55] truncate">{prod.title}</h4>
                      <p className="text-xs font-black text-[#13a5bd] mt-1">₹{prod.price_paise / 100}</p>
                      
                      <div className="flex items-center gap-3 mt-3">
                        <div className="flex items-center border border-[#e7edf2] rounded-lg bg-white">
                          <button 
                            onClick={() => updateQty(item.slug, item.qty - 1)}
                            className="p-1 hover:bg-[#f6f9fc] text-[#526d81]"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-2.5 text-xs font-bold">{item.qty}</span>
                          <button 
                            onClick={() => updateQty(item.slug, item.qty + 1)}
                            className="p-1 hover:bg-[#f6f9fc] text-[#526d81]"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.slug)}
                          className="text-red-500 hover:text-red-700 p-1"
                          title="Remove"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Quote & Checkout */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-[#e7edf2] bg-[#f6f9fc] space-y-4">
              
              {/* Payment choice toggle */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-white rounded-xl border border-[#e7edf2]">
                <button
                  onClick={() => setPaymentMethod('prepaid')}
                  className={`py-2 text-xs font-bold rounded-lg transition-colors ${paymentMethod === 'prepaid' ? 'bg-[#092f55] text-white shadow-xs' : 'text-[#526d81]'}`}
                >
                  Prepaid (10% Off)
                </button>
                <button
                  onClick={() => setPaymentMethod('cod')}
                  className={`py-2 text-xs font-bold rounded-lg transition-colors ${paymentMethod === 'cod' ? 'bg-[#092f55] text-white shadow-xs' : 'text-[#526d81]'}`}
                >
                  Cash on Delivery
                </button>
              </div>

              {/* Coupon Box */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Coupon Code (e.g. PY10)"
                  value={couponCode}
                  onChange={e => setCouponCode(e.target.value)}
                  className="flex-1 px-3 py-2 bg-white border border-[#e7edf2] rounded-xl text-xs font-medium focus:outline-none focus:border-[#13a5bd]"
                />
                <button
                  onClick={handleApplyCoupon}
                  disabled={validatingCoupon}
                  className="px-4 py-2 bg-[#092f55] text-white text-xs font-bold rounded-xl hover:bg-[#071E38] transition-colors"
                >
                  Apply
                </button>
              </div>
              {couponError && <p className="text-[11px] text-red-600 font-medium">{couponError}</p>}
              {appliedCoupon && <p className="text-[11px] text-green-600 font-bold">Coupon {appliedCoupon.code} applied successfully!</p>}

              {/* Totals */}
              <div className="space-y-1.5 text-xs text-[#526d81]">
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
                    <span>Prepaid Discount (10%)</span>
                    <span>-₹{quote.prepaid_discount_paise / 100}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-bold text-[#13a5bd]">{quote?.shipping_paise === 0 ? 'FREE' : `₹${(quote?.shipping_paise || 0) / 100}`}</span>
                </div>
                {quote?.cod_fee_paise > 0 && (
                  <div className="flex justify-between">
                    <span>COD Fee</span>
                    <span>₹{quote.cod_fee_paise / 100}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-[#e7edf2] text-sm font-black text-[#092f55]">
                  <span>Total Amount</span>
                  <span>₹{(quote?.total_paise || 0) / 100}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => { setIsDrawerOpen(false); navigate('/checkout'); }}
                className="w-full py-3.5 bg-[#13a5bd] text-white font-extrabold text-sm rounded-xl hover:bg-[#0f8fa5] transition-colors flex items-center justify-center gap-2 shadow-md shadow-[#13a5bd]/20"
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-[#708596] pt-1">
                <ShieldCheck className="w-4 h-4 text-[#13a5bd]" />
                <span>Secure 30-minute stock hold on checkout</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
