import React, { createContext, useContext, useEffect, useState } from 'react';
import { CartItem } from '../types';

interface CartContextType {
  cart: CartItem[];
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
  addToCart: (slug: string, qty?: number) => void;
  removeFromCart: (slug: string) => void;
  updateQty: (slug: string, qty: number) => void;
  clearCart: () => void;
  couponCode: string;
  setCouponCode: (code: string) => void;
  appliedCoupon: any;
  setAppliedCoupon: (coupon: any) => void;
  paymentMethod: 'prepaid' | 'cod';
  setPaymentMethod: (method: 'prepaid' | 'cod') => void;
  quote: any;
  loadingQuote: boolean;
  cartCount: number;
}

const CartContext = createContext<CartContextType>({
  cart: [],
  isDrawerOpen: false,
  setIsDrawerOpen: () => {},
  addToCart: () => {},
  removeFromCart: () => {},
  updateQty: () => {},
  clearCart: () => {},
  couponCode: '',
  setCouponCode: () => {},
  appliedCoupon: null,
  setAppliedCoupon: () => {},
  paymentMethod: 'prepaid',
  setPaymentMethod: () => {},
  quote: null,
  loadingQuote: false,
  cartCount: 0,
});

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('pynotes_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<'prepaid' | 'cod'>('prepaid');
  const [quote, setQuote] = useState<any>(null);
  const [loadingQuote, setLoadingQuote] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('pynotes_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart:', e);
    }
  }, [cart]);

  // Fetch quote whenever cart, coupon, or payment method changes
  useEffect(() => {
    const fetchQuote = async () => {
      if (cart.length === 0) {
        setQuote(null);
        return;
      }
      setLoadingQuote(true);
      try {
        const res = await fetch('/api/quote', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: cart,
            coupon_code: appliedCoupon?.code || couponCode,
            payment_method: paymentMethod
          })
        });
        if (res.ok) {
          const data = await res.json();
          setQuote(data);
        } else {
          setQuote(null);
        }
      } catch (err) {
        console.error('Failed to fetch quote:', err);
      } finally {
        setLoadingQuote(false);
      }
    };
    fetchQuote();
  }, [cart, appliedCoupon, couponCode, paymentMethod]);

  const addToCart = (slug: string, qty = 1) => {
    setCart(prev => {
      const existing = prev.find(i => i.slug === slug);
      if (existing) {
        return prev.map(i => i.slug === slug ? { ...i, qty: Math.min(10, i.qty + qty) } : i);
      }
      return [...prev, { slug, qty }];
    });
    setIsDrawerOpen(true);
  };

  const removeFromCart = (slug: string) => {
    setCart(prev => prev.filter(i => i.slug !== slug));
  };

  const updateQty = (slug: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(slug);
      return;
    }
    setCart(prev => prev.map(i => i.slug === slug ? { ...i, qty: Math.min(10, qty) } : i));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
    setCouponCode('');
  };

  const cartCount = cart.reduce((acc, item) => acc + item.qty, 0);

  return (
    <CartContext.Provider value={{
      cart, isDrawerOpen, setIsDrawerOpen, addToCart, removeFromCart, updateQty, clearCart,
      couponCode, setCouponCode, appliedCoupon, setAppliedCoupon, paymentMethod, setPaymentMethod,
      quote, loadingQuote, cartCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
