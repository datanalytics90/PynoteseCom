import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Lock, ArrowRight } from 'lucide-react';

export const Checkout: React.FC<{ catalog: any }> = ({ catalog }) => {
  const { cart, quote, paymentMethod, setPaymentMethod, appliedCoupon, couponCode, clearCart } = useCart();
  const { currentUser, userProfile } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: userProfile?.name || '',
    email: currentUser?.email || '',
    phone: userProfile?.phone || '',
    line1: '',
    line2: '',
    pincode: '',
    city: '',
    state: ''
  });

  const [loadingPincode, setLoadingPincode] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handlePincodeBlur = async () => {
    if (form.pincode.length !== 6) return;
    setLoadingPincode(true);
    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${form.pincode}`);
      const data = await res.json();
      if (data && data[0]?.Status === 'Success') {
        const postOffice = data[0].PostOffice[0];
        setForm(prev => ({
          ...prev,
          city: postOffice.District || postOffice.Division || '',
          state: postOffice.State || ''
        }));
      }
    } catch (e) {
      console.error('Pincode lookup failed:', e);
    } finally {
      setLoadingPincode(false);
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);

    // Validate phone
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(form.phone.replace(/\D/g, '').slice(-10))) {
      setErrorMsg('Please enter a valid 10-digit Indian mobile number starting 6 to 9.');
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          phone: form.phone,
          ship_name: form.name,
          ship_line1: form.line1,
          ship_line2: form.line2,
          ship_pincode: form.pincode,
          ship_city: form.city,
          ship_state: form.state,
          items: cart,
          coupon_code: appliedCoupon?.code || couponCode,
          payment_method: paymentMethod
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to place order');
      }

      if (paymentMethod === 'prepaid' && data.razorpay_order_id && (window as any).Razorpay) {
        const options = {
          key: data.razorpay_key_id,
          amount: data.total_paise,
          currency: 'INR',
          name: 'PyNotes',
          description: `Order #${data.order_no}`,
          order_id: data.razorpay_order_id,
          handler: async (response: any) => {
            const verifyRes = await fetch('/api/payments/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                order_no: data.order_no,
                razorpay_order_id: data.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            });
            if (verifyRes.ok) {
              clearCart();
              navigate(`/order/${data.order_no}/thank-you?t=${data.token}`);
            } else {
              setErrorMsg('Payment verification failed');
            }
          },
          prefill: {
            name: form.name,
            email: form.email,
            contact: form.phone
          },
          theme: { color: '#092f55' }
        };
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } else {
        clearCart();
        navigate(`/order/${data.order_no}/thank-you?t=${data.token}`);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Checkout failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <h1 className="text-3xl font-black text-[#092f55] font-nunito">Secure Checkout</h1>

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs font-bold">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Form Inputs */}
        <div className="lg:col-span-2 space-y-8">
          
          <div className="bg-white p-8 rounded-3xl border border-[#e7edf2] space-y-6 shadow-xs">
            <h3 className="font-extrabold text-base text-[#092f55]">1. Contact Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#092f55] mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 bg-[#f6f9fc] border border-[#e7edf2] rounded-xl text-xs focus:outline-none focus:border-[#12A5B0]"
                  placeholder="Rahul Sharma"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#092f55] mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-3 bg-[#f6f9fc] border border-[#e7edf2] rounded-xl text-xs focus:outline-none focus:border-[#12A5B0]"
                  placeholder="rahul@example.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#092f55] mb-1">Indian Mobile Number (10 digits starting 6-9)</label>
              <input
                type="tel"
                required
                maxLength={10}
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                className="w-full px-4 py-3 bg-[#f6f9fc] border border-[#e7edf2] rounded-xl text-xs focus:outline-none focus:border-[#12A5B0]"
                placeholder="9876543210"
              />
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-[#e7edf2] space-y-6 shadow-xs">
            <h3 className="font-extrabold text-base text-[#092f55]">2. Shipping Address</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#092f55] mb-1">Pincode (6 digits)</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={form.pincode}
                  onChange={e => setForm({ ...form, pincode: e.target.value })}
                  onBlur={handlePincodeBlur}
                  className="w-full px-4 py-3 bg-[#f6f9fc] border border-[#e7edf2] rounded-xl text-xs focus:outline-none focus:border-[#12A5B0]"
                  placeholder="560034"
                />
                {loadingPincode && <span className="text-[10px] text-[#12A5B0]">Auto-filling location...</span>}
              </div>
              <div>
                <label className="block text-xs font-bold text-[#092f55] mb-1">City</label>
                <input
                  type="text"
                  required
                  value={form.city}
                  onChange={e => setForm({ ...form, city: e.target.value })}
                  className="w-full px-4 py-3 bg-[#f6f9fc] border border-[#e7edf2] rounded-xl text-xs focus:outline-none focus:border-[#12A5B0]"
                  placeholder="Bengaluru"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#092f55] mb-1">Address Line 1</label>
              <input
                type="text"
                required
                value={form.line1}
                onChange={e => setForm({ ...form, line1: e.target.value })}
                className="w-full px-4 py-3 bg-[#f6f9fc] border border-[#e7edf2] rounded-xl text-xs focus:outline-none focus:border-[#12A5B0]"
                placeholder="House / Flat No., Street, Landmark"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#092f55] mb-1">Address Line 2 (Optional)</label>
              <input
                type="text"
                value={form.line2}
                onChange={e => setForm({ ...form, line2: e.target.value })}
                className="w-full px-4 py-3 bg-[#f6f9fc] border border-[#e7edf2] rounded-xl text-xs focus:outline-none focus:border-[#12A5B0]"
                placeholder="Apartment, Suite, Unit"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#092f55] mb-1">State</label>
              <input
                type="text"
                required
                value={form.state}
                onChange={e => setForm({ ...form, state: e.target.value })}
                className="w-full px-4 py-3 bg-[#f6f9fc] border border-[#e7edf2] rounded-xl text-xs focus:outline-none focus:border-[#12A5B0]"
                placeholder="Karnataka"
              />
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-[#e7edf2] space-y-6 shadow-xs">
            <h3 className="font-extrabold text-base text-[#092f55]">3. Payment Method</h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setPaymentMethod('prepaid')}
                className={`p-4 rounded-2xl border-2 text-left space-y-2 transition-all ${paymentMethod === 'prepaid' ? 'border-[#12A5B0] bg-[#e4f8f9]/30' : 'border-[#e7edf2]'}`}
              >
                <div className="font-extrabold text-sm text-[#092f55]">Prepaid (10% OFF)</div>
                <p className="text-xs text-[#526d81]">Pay online via UPI, Cards, Net Banking</p>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`p-4 rounded-2xl border-2 text-left space-y-2 transition-all ${paymentMethod === 'cod' ? 'border-[#12A5B0] bg-[#e4f8f9]/30' : 'border-[#e7edf2]'}`}
              >
                <div className="font-extrabold text-sm text-[#092f55]">Cash on Delivery</div>
                <p className="text-xs text-[#526d81]">Pay at doorstep (+₹49 COD fee)</p>
              </button>
            </div>
          </div>

        </div>

        {/* Sidebar Summary */}
        <div className="bg-white p-8 rounded-3xl border border-[#e7edf2] shadow-xs space-y-6 h-fit">
          <h3 className="font-extrabold text-lg text-[#092f55]">Order Summary</h3>

          <div className="space-y-3 text-xs text-[#526d81]">
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
            {quote?.cod_fee_paise > 0 && (
              <div className="flex justify-between">
                <span>COD Fee</span>
                <span>₹{quote.cod_fee_paise / 100}</span>
              </div>
            )}
            <div className="flex justify-between pt-3 border-t border-[#e7edf2] text-sm font-black text-[#092f55]">
              <span>Total Payable</span>
              <span>₹{(quote?.total_paise || 0) / 100}</span>
            </div>
          </div>

          <p className="text-[11px] text-[#708596] italic bg-[#f6f9fc] p-3 rounded-xl border border-[#e7edf2]">
            We hold your books for 30 minutes while you complete payment.
          </p>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 bg-[#12A5B0] text-white font-extrabold text-sm rounded-xl hover:bg-[#0f8fa5] transition-colors flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
          >
            {submitting ? 'Processing...' : `Place Order (₹${(quote?.total_paise || 0) / 100})`} <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </form>
    </div>
  );
};
