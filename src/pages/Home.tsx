import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight, CheckCircle2, Star, Sparkles, BookOpen, Code,
  ShieldCheck, Truck, Clock, ShoppingBag, Zap, ChevronDown,
  Layers, MessageSquare, PhoneCall, HelpCircle, HeartHandshake, Eye
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { ALL_13_SUBJECTS } from '../data/subjects';

export const Home: React.FC<{ catalog: any }> = ({ catalog }) => {
  const { subjects = [], products = [], settings = {}, faqs = [], reviews = [] } = catalog || {};
  const { addToCart } = useCart();
  const navigate = useNavigate();

  // Ensure all 13 subjects are rendered
  const effectiveSubjects = subjects && subjects.length >= 13 ? subjects : ALL_13_SUBJECTS;

  const books = products.filter((p: any) => p.type === 'book' && p.status === 'active');
  const bundles = products.filter((p: any) => p.type === 'bundle' && p.status === 'active');
  
  const [bestsellerTab, setBestsellerTab] = useState<'all' | 'books' | 'bundles'>('all');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [contactSent, setContactSent] = useState(false);

  const displayedProducts = (
    bestsellerTab === 'books'
      ? books
      : bestsellerTab === 'bundles'
      ? bundles
      : [...bundles.slice(0, 2), ...books.slice(0, 6)]
  ).slice(0, 8);

  const handleBuyNow = (slug: string) => {
    addToCart(slug, 1);
    navigate('/checkout');
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm)
      });
      if (res.ok) setContactSent(true);
    } catch (err) {
      console.error(err);
    }
  };

  const defaultTrustItems = [
    { icon: BookOpen, title: '100% Printed Books', subtitle: 'Physical spiral-bound notes, no screen fatigue' },
    { icon: Sparkles, title: 'Hand-Drawn Clarity', subtitle: 'Illustrated diagrams, memory maps & colored code' },
    { icon: Truck, title: 'Pan-India Free Delivery', subtitle: 'Dispatched in 1-2 days to 20,000+ pincodes' },
    { icon: ShieldCheck, title: '48-Hr Replacement', subtitle: 'Hassle-free guarantee for any transit issues' }
  ];

  const defaultComparisonRows = [
    { label: 'Learning Medium', ours: 'Physical spiral notebook on your desk', others: 'Screen fatigue PDF / eBook' },
    { label: 'Visual Explanations', ours: 'Hand-drawn color code sketches & memory maps', others: 'Dry monochrome text & UML' },
    { label: 'Revision Efficiency', ours: 'Optimized for 2-hour exam or interview brush-up', others: '800-page dense theoretical reference' },
    { label: 'Student Insights', ours: 'Handwritten gotchas, shortcuts & margin notes', others: 'Formal academic definitions' },
    { label: 'Portability & Focus', ours: 'Distraction-free physical study companion', others: 'Distracting browser notifications' }
  ];

  const defaultFaqsList = [
    {
      q: 'Are these digital downloads or printed physical books?',
      a: 'PyNotes are 100% physical printed books! They are high-quality, spiral-bound books printed on premium paper and delivered directly to your doorstep across India.'
    },
    {
      q: 'How long does delivery take across India?',
      a: 'Orders are processed within 1 to 2 business days. Delivery typically takes 3 to 7 business days depending on your location, with tracking details sent to your SMS and email.'
    },
    {
      q: 'Is Cash on Delivery (COD) available?',
      a: 'Yes, Cash on Delivery is available across most pincodes in India with a nominal COD fee. You can also pay online via UPI, Cards, or Net Banking for instant prepaid discounts.'
    },
    {
      q: 'What if my book arrives damaged?',
      a: 'We offer a 48-Hour Transit Replacement Guarantee. If your book arrives damaged or misprinted, simply report it via our support page with photos for an immediate replacement.'
    }
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-20 overflow-x-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#e8fbfc] via-[#f1fcfd] to-[#f6f9fc] pt-12 pb-20 border-b border-[#e7edf2]">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#13a5bd]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#f3ad19]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Left Column: Headline & Action */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#13a5bd]/10 border border-[#13a5bd]/20 text-[#13a5bd] rounded-full text-xs font-bold uppercase tracking-wider shadow-xs">
              <Sparkles className="w-3.5 h-3.5" /> 100% Printed Handwritten Coding Notes
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#092f55] tracking-tight font-nunito leading-[1.12]">
              Code, written <br className="hidden sm:inline" />
              the way you <span className="text-[#13a5bd] underline decoration-[#f3ad19] decoration-4 underline-offset-4">learn it.</span>
            </h1>

            <p className="text-base sm:text-lg text-[#526d81] max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed">
              Python, Java, C, and DSA laid out the way a top student writes them—with shortcuts, hand-drawn memory maps, and margin notes that textbooks leave out.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                to="/subjects"
                className="w-full sm:w-auto px-8 py-4 bg-[#092f55] text-white font-black text-sm rounded-full hover:bg-[#071E38] transition-all flex items-center justify-center gap-2.5 shadow-xl shadow-[#092f55]/20 active:scale-95"
              >
                <span>Browse All 13 Subjects</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/bundles"
                className="w-full sm:w-auto px-8 py-4 bg-white text-[#092f55] border-2 border-[#092f55]/20 font-black text-sm rounded-full hover:border-[#13a5bd] hover:text-[#13a5bd] transition-all flex items-center justify-center gap-2 active:scale-95 shadow-xs"
              >
                <Layers className="w-4 h-4 text-[#13a5bd]" />
                <span>Combo Bundles (Save Up To 40%)</span>
              </Link>
            </div>

            {/* Micro Trust Indicators */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-[#526d81] font-semibold">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Printed Physical Books Only</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Free Pan-India Delivery</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="flex text-[#f3ad19]">
                  {'★★★★★'.split('').map((s, i) => <span key={i}>{s}</span>)}
                </div>
                <span className="font-bold text-[#092f55]">4.9/5 Rating (1,240+ Reviews)</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Mockup Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-[#e7edf2] transform hover:-translate-y-1 transition-all duration-300">
              
              {/* Badges */}
              <div className="absolute -top-3.5 -right-2 bg-[#f3ad19] text-[#092f55] text-xs font-black px-4 py-1.5 rounded-full shadow-lg uppercase tracking-wider border-2 border-white">
                140+ Illustrated Pages
              </div>

              <div className="relative rounded-2xl overflow-hidden mb-5 border border-[#e7edf2] bg-[#f6f9fc] aspect-4/3 flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=700&q=80"
                  alt="Python Handwritten Master Notebook"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-3 left-3 bg-[#092f55]/90 backdrop-blur-xs text-white text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-[#13a5bd]" /> Physical Printed Book
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-wider text-[#13a5bd]">Bestseller #1</span>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">SAVE 37%</span>
                </div>
                <h3 className="font-black text-[#092f55] text-xl font-nunito">Python Handwritten Notes</h3>
                <p className="text-xs text-[#526d81] leading-relaxed">
                  From first <code className="bg-slate-100 text-[#092f55] px-1 rounded font-mono">print()</code> to advanced OOP, data structures, and dry-run code maps.
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-[#e7edf2] flex items-center justify-between">
                <div>
                  <span className="text-2xl font-black text-[#092f55]">₹499</span>
                  <span className="text-xs text-slate-400 line-through ml-2 font-medium">₹799</span>
                </div>
                <button
                  onClick={() => handleBuyNow('python')}
                  className="px-5 py-2.5 bg-[#092f55] hover:bg-[#071E38] text-white text-xs font-black rounded-xl transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-2"
                >
                  <ShoppingBag className="w-3.5 h-3.5" /> Buy Now
                </button>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. DYNAMIC TICKER / TOPICS MARQUEE */}
      <div className="bg-[#092f55] text-white py-3.5 overflow-hidden shadow-inner -mt-16">
        <div className="flex whitespace-nowrap animate-marquee gap-8 text-xs font-bold uppercase tracking-widest text-[#13a5bd]">
          {Array(2).fill(null).map((_, groupIdx) => (
            <div key={groupIdx} className="flex items-center gap-8 shrink-0">
              <span>Python</span> <span>•</span>
              <span className="text-white">Java</span> <span>•</span>
              <span>DSA with Java</span> <span>•</span>
              <span className="text-[#f3ad19]">DSA with Python</span> <span>•</span>
              <span>C Programming</span> <span>•</span>
              <span className="text-white">C++</span> <span>•</span>
              <span>JavaScript</span> <span>•</span>
              <span className="text-white">HTML & CSS</span> <span>•</span>
              <span>SQL</span> <span>•</span>
              <span className="text-[#f3ad19]">DBMS</span> <span>•</span>
              <span>Operating Systems</span> <span>•</span>
              <span className="text-white">Data Science</span> <span>•</span>
              <span className="text-emerald-400">100% Printed Books</span> <span>•</span>
              <span className="text-white">Free Pan-India Delivery</span> <span>•</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. TRUST & FOUR PILLARS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {defaultTrustItems.map((t, idx) => {
            const Icon = t.icon;
            return (
              <div key={idx} className="bg-white p-6 rounded-3xl border border-[#e7edf2] shadow-xs hover:shadow-md transition-all flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#e4f8f9] text-[#13a5bd] flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-[#092f55] font-nunito">{t.title}</h4>
                  <p className="text-xs text-[#526d81] mt-1 leading-relaxed font-medium">{t.subtitle}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. ALL 13 SUBJECTS SHOWCASE (Exact copy of handwrittencode.com subjects) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#13a5bd]/10 text-[#13a5bd] rounded-full text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Complete Curriculum
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#092f55] font-nunito tracking-tight">
              All 13 Core Subjects
            </h2>
            <p className="text-xs sm:text-sm text-[#526d81] mt-1 font-medium">
              Handwritten by top engineers with illustrated flowcharts, shortcuts, and memory maps.
            </p>
          </div>
          <Link 
            to="/subjects" 
            className="text-xs sm:text-sm font-extrabold text-[#13a5bd] hover:text-[#092f55] flex items-center gap-1.5 transition-colors self-start sm:self-end"
          >
            <span>View All Subject Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 13 Subject Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {effectiveSubjects.map((sub: any, idx: number) => {
            const subBooks = books.filter((b: any) => b.subject_slug === sub.slug);
            const count = subBooks.length > 0 ? subBooks.length : 1;
            return (
              <Link
                key={sub.slug || idx}
                to={`/subjects/${sub.slug}`}
                className="group bg-white p-5 rounded-2xl border border-[#e7edf2] shadow-xs hover:shadow-xl hover:border-[#13a5bd]/50 transition-all text-center flex flex-col items-center justify-between gap-3 relative overflow-hidden"
              >
                <div 
                  className="w-13 h-13 rounded-2xl flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-200"
                  style={{ backgroundColor: sub.accent_color || '#13a5bd' }}
                >
                  <Code className="w-6 h-6" />
                </div>
                
                <div>
                  <h3 className="font-extrabold text-xs sm:text-sm text-[#092f55] group-hover:text-[#13a5bd] transition-colors line-clamp-1 font-nunito">
                    {sub.menu_label || sub.name}
                  </h3>
                  <span className="text-[10px] text-[#708596] font-medium block mt-0.5">
                    {count} Printed Book
                  </span>
                </div>

                <span className="text-[10px] font-black text-[#13a5bd] group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-0.5">
                  View Notes →
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 5. BEST SELLERS & COMBO DEALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-[#13a5bd]">Top Recommendations</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#092f55] font-nunito mt-1">
              Best-Selling Printed Notes & Combos
            </h2>
            <p className="text-xs sm:text-sm text-[#526d81] mt-1 font-medium">
              High-quality physical books with spiral binding, delivered safely to your home.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 bg-[#f0f4f8] p-1 rounded-xl self-start sm:self-end">
            <button
              onClick={() => setBestsellerTab('all')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                bestsellerTab === 'all' ? 'bg-[#092f55] text-white shadow-xs' : 'text-[#526d81] hover:text-[#092f55]'
              }`}
            >
              All Top Picks
            </button>
            <button
              onClick={() => setBestsellerTab('books')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                bestsellerTab === 'books' ? 'bg-[#092f55] text-white shadow-xs' : 'text-[#526d81] hover:text-[#092f55]'
              }`}
            >
              Individual Books
            </button>
            <button
              onClick={() => setBestsellerTab('bundles')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                bestsellerTab === 'bundles' ? 'bg-[#092f55] text-white shadow-xs' : 'text-[#526d81] hover:text-[#092f55]'
              }`}
            >
              Combo Packs
            </button>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayedProducts.map((prod: any) => (
            <div 
              key={prod.slug} 
              className="bg-white rounded-3xl border border-[#e7edf2] overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              {/* Image Preview Container */}
              <div className="relative aspect-4/3 bg-[#f6f9fc] overflow-hidden">
                <img
                  src={prod.images?.[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80'}
                  alt={prod.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {prod.badge_text && (
                  <span className="absolute top-3 left-3 bg-[#f3ad19] text-[#092f55] text-[10px] font-black px-2.5 py-1 rounded-full shadow-md uppercase tracking-wider">
                    {prod.badge_text}
                  </span>
                )}
                <span className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-xs text-[#092f55] text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                  {prod.type === 'bundle' ? 'Combo Box' : '140+ Pages'}
                </span>
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-1 text-[#f3ad19] text-xs mb-1">
                    {'★★★★★'.split('').map((s, i) => <span key={i}>{s}</span>)}
                    <span className="text-[10px] text-slate-400 font-semibold ml-1">(4.9)</span>
                  </div>
                  <Link 
                    to={`/product/${prod.slug}`} 
                    className="font-black text-sm text-[#092f55] hover:text-[#13a5bd] transition-colors line-clamp-2 font-nunito"
                  >
                    {prod.title}
                  </Link>
                  <p className="text-xs text-[#526d81] mt-1 line-clamp-2 font-medium">
                    {prod.short_desc || 'Comprehensive handwritten printed study notes.'}
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-[#e7edf2]">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-lg font-black text-[#092f55]">₹{prod.price_paise / 100}</span>
                      <span className="text-xs text-slate-400 line-through ml-2 font-medium">₹{prod.mrp_paise / 100}</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      SAVE {Math.round(((prod.mrp_paise - prod.price_paise) / prod.mrp_paise) * 100)}%
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => addToCart(prod.slug, 1)}
                      className="py-2.5 bg-[#f6f9fc] hover:bg-[#e4f8f9] text-[#092f55] hover:text-[#13a5bd] font-extrabold text-xs rounded-xl transition-colors border border-[#e7edf2] cursor-pointer flex items-center justify-center gap-1"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" /> Cart
                    </button>
                    <button
                      onClick={() => handleBuyNow(prod.slug)}
                      className="py-2.5 bg-[#092f55] hover:bg-[#071E38] text-white font-extrabold text-xs rounded-xl transition-all shadow-xs active:scale-95 cursor-pointer flex items-center justify-center gap-1"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. WHY CHOOSE PYNOTES (Comparison Matrix) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 bg-white rounded-3xl border border-[#e7edf2] shadow-xs">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-[#13a5bd]">The Handwritten Advantage</span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#092f55] font-nunito">
            Why PyNotes Beats Dry Textbooks & PDF Downloads
          </h2>
          <p className="text-xs sm:text-sm text-[#526d81] font-medium">
            Engineered specifically to help you understand complex algorithms and crack technical placements faster.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#e7edf2]">
                <th className="py-4 px-6 text-xs font-bold text-[#708596] uppercase tracking-wider">Feature</th>
                <th className="py-4 px-6 text-xs font-black text-[#13a5bd] uppercase tracking-wider bg-[#e4f8f9] rounded-t-2xl">
                  PyNotes Printed Books
                </th>
                <th className="py-4 px-6 text-xs font-bold text-[#526d81] uppercase tracking-wider">Standard Textbooks & PDFs</th>
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-[#e7edf2]">
              {defaultComparisonRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-[#f6f9fc]/50 transition-colors">
                  <td className="py-4 px-6 font-bold text-[#092f55]">{row.label}</td>
                  <td className="py-4 px-6 font-bold text-[#13a5bd] bg-[#e4f8f9]/40 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#13a5bd] shrink-0" /> {row.ours}
                  </td>
                  <td className="py-4 px-6 text-[#526d81]">{row.others}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 7. STUDENT RESULT STATS & SOCIAL PROOF */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#092f55] to-[#071E38] text-white p-8 sm:p-12 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#13a5bd]/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2 relative z-10">
            <span className="text-xs font-black uppercase tracking-wider text-[#13a5bd]">Student Track Record</span>
            <h2 className="text-2xl sm:text-3xl font-black font-nunito text-white">
              Trusted by 15,000+ Students Across India
            </h2>
            <p className="text-xs text-slate-300">
              From first-year B.Tech & BCA college learners to final-year candidates preparing for FAANG placement drives.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center relative z-10">
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-xs">
              <div className="text-3xl sm:text-4xl font-black font-nunito text-[#f3ad19]">15,000+</div>
              <p className="text-xs text-slate-300 mt-1 font-semibold">Physical Books Shipped</p>
            </div>
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-xs">
              <div className="text-3xl sm:text-4xl font-black font-nunito text-[#13a5bd]">94%</div>
              <p className="text-xs text-slate-300 mt-1 font-semibold">Exam & Placement Boost</p>
            </div>
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-xs">
              <div className="text-3xl sm:text-4xl font-black font-nunito text-emerald-400">13 Core</div>
              <p className="text-xs text-slate-300 mt-1 font-semibold">Subjects Fully Covered</p>
            </div>
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-xs">
              <div className="text-3xl sm:text-4xl font-black font-nunito text-[#f3ad19]">4.9 / 5</div>
              <p className="text-xs text-slate-300 mt-1 font-semibold">Verified Student Reviews</p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FREQUENTLY ASKED QUESTIONS (ACCORDION) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2 mb-8">
          <span className="text-xs font-black uppercase tracking-wider text-[#13a5bd]">Got Questions?</span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#092f55] font-nunito">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-[#526d81]">Everything you need to know about our printed handwritten notes and doorstep shipping.</p>
        </div>

        <div className="space-y-3">
          {defaultFaqsList.map((faq, idx) => (
            <div 
              key={idx} 
              className="bg-white rounded-2xl border border-[#e7edf2] overflow-hidden shadow-xs transition-colors"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full px-6 py-4 text-left font-extrabold text-sm text-[#092f55] flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-[#13a5bd] transition-transform duration-200 shrink-0 ${openFaq === idx ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === idx && (
                <div className="px-6 pb-4 pt-1 text-xs text-[#526d81] leading-relaxed font-medium border-t border-slate-50">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 9. CONTACT & ASSISTANCE */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white rounded-3xl border border-[#e7edf2] shadow-xs">
        <div className="text-center space-y-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-[#e4f8f9] text-[#13a5bd] flex items-center justify-center mx-auto">
            <MessageSquare className="w-5 h-5" />
          </div>
          <h3 className="text-2xl font-black text-[#092f55] font-nunito">Need Help Choosing Your Subject?</h3>
          <p className="text-xs text-[#526d81]">Send us a message and our academic team will guide you on the best notes for your semester or placement goals.</p>
        </div>

        {contactSent ? (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-6 rounded-2xl text-center font-bold text-sm">
            Thank you! Your message has been received. Our team will contact you shortly.
          </div>
        ) : (
          <form onSubmit={handleContactSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#092f55] mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={contactForm.name}
                  onChange={e => setContactForm({ ...contactForm, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#f6f9fc] border border-[#e7edf2] rounded-xl text-xs focus:outline-none focus:border-[#13a5bd]"
                  placeholder="Aakash Verma"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#092f55] mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={contactForm.email}
                  onChange={e => setContactForm({ ...contactForm, email: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#f6f9fc] border border-[#e7edf2] rounded-xl text-xs focus:outline-none focus:border-[#13a5bd]"
                  placeholder="aakash@example.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#092f55] mb-1">Phone Number (Optional)</label>
              <input
                type="tel"
                value={contactForm.phone}
                onChange={e => setContactForm({ ...contactForm, phone: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#f6f9fc] border border-[#e7edf2] rounded-xl text-xs focus:outline-none focus:border-[#13a5bd]"
                placeholder="+91 98765 43210"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#092f55] mb-1">Your Question or Subject Query</label>
              <textarea
                required
                rows={3}
                value={contactForm.message}
                onChange={e => setContactForm({ ...contactForm, message: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#f6f9fc] border border-[#e7edf2] rounded-xl text-xs focus:outline-none focus:border-[#13a5bd]"
                placeholder="Which book is best for 3rd semester DSA and campus placements?"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3.5 bg-[#092f55] text-white font-extrabold text-xs rounded-xl hover:bg-[#071E38] transition-all shadow-md active:scale-95 cursor-pointer"
            >
              Submit Query
            </button>
          </form>
        )}
      </section>

    </div>
  );
};
