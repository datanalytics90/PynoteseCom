import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from './Logo';
import { ShieldCheck, Truck, BookOpen, Clock } from 'lucide-react';

export const Footer: React.FC<{ settings?: any }> = ({ settings }) => {
  return (
    <footer className="bg-[#071E38] text-white pt-16 pb-12 mt-20 border-t border-[#092f55]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Trust points row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-12 border-b border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#12A5B0]/20 flex items-center justify-center text-[#12A5B0]">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm">Printed Books</h4>
              <p className="text-xs text-slate-400">Physical spiral-bound notes</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#12A5B0]/20 flex items-center justify-center text-[#12A5B0]">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm">Pan-India Shipping</h4>
              <p className="text-xs text-slate-400">Delivered in 3-7 business days</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#12A5B0]/20 flex items-center justify-center text-[#12A5B0]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm">Secure Checkout</h4>
              <p className="text-xs text-slate-400">Razorpay trusted gateway</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#12A5B0]/20 flex items-center justify-center text-[#12A5B0]">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm">48-Hour Support</h4>
              <p className="text-xs text-slate-400">Easy transit damage replacement</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-12 border-b border-white/10">
          <div className="space-y-4">
            <Logo className="h-8 text-white" />
            <p className="text-xs text-slate-300 leading-relaxed">
              {settings?.footer_about || 'PyNotes makes printed, handwritten coding notes: Python, Java, C and DSA, laid out the way a good student writes them.'}
            </p>
            <p className="text-xs text-slate-400">
              {settings?.store_address || 'Bengaluru, India'}
            </p>
          </div>

          <div>
            <h5 className="font-bold text-sm mb-4 text-[#12A5B0]">Quick Links</h5>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li><Link to="/subjects" className="hover:text-white transition-colors">All Subjects</Link></li>
              <li><Link to="/bundles" className="hover:text-white transition-colors">Programming Bundles</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors">Frequently Asked Questions</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Support</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-sm mb-4 text-[#12A5B0]">Customer Portal</h5>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li><Link to="/account" className="hover:text-white transition-colors">My Account & Orders</Link></li>
              <li><Link to="/track" className="hover:text-white transition-colors">Track Shipment</Link></li>
              <li><Link to="/admin" className="hover:text-white transition-colors text-slate-400">Admin Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-sm mb-4 text-[#12A5B0]">Legal & Policies</h5>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li><Link to="/policies/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/policies/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="/policies/refund-policy" className="hover:text-white transition-colors">Refund & Return Policy</Link></li>
              <li><Link to="/policies/shipping-policy" className="hover:text-white transition-colors">Shipping Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} PyNotes. All rights reserved. Printed notes across India.</p>
          <div className="flex items-center gap-4">
            <span>UPI</span>
            <span>Visa</span>
            <span>Mastercard</span>
            <span>RuPay</span>
            <span>Net Banking</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
