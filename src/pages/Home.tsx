import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Star, Sparkles, BookOpen, Code, ShieldCheck, Truck, Clock } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const Home: React.FC<{ catalog: any }> = ({ catalog }) => {
  const { subjects = [], products = [], settings = {}, faqs = [], reviews = [] } = catalog || {};
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const books = products.filter((p: any) => p.type === 'book' && p.status === 'active');
  const bundles = products.filter((p: any) => p.type === 'bundle' && p.status === 'active');
  const featuredBooks = books.slice(0, settings.featured_collection_count || 8);

  const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [contactSent, setContactSent] = useState(false);

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

  return (
    <div className="space-y-16 pb-20">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#e8fbfc] to-[#dff7fa] pt-12 pb-20 border-b border-[#e7edf2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#12A5B0]/10 text-[#12A5B0] rounded-full text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> Printed Handwritten Coding Notes
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#092f55] tracking-tight font-nunito leading-[1.1]">
              Code, written <br />
              the way you <span className="text-[#12A5B0] underline decoration-[#FFD54A] decoration-4">learn it.</span>
            </h1>
            <p className="text-base sm:text-lg text-[#526d81] max-w-xl mx-auto lg:mx-0 font-medium">
              Python, Java, C, and DSA laid out the way a good student writes them—with shortcuts, hand-drawn diagrams, and margin notes that textbooks leave out.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                to="/subjects"
                className="w-full sm:w-auto px-8 py-4 bg-[#092f55] text-white font-extrabold rounded-full hover:bg-[#071E38] transition-colors flex items-center justify-center gap-3 shadow-lg shadow-[#092f55]/20"
              >
                Browse All Notes <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/bundles"
                className="w-full sm:w-auto px-8 py-4 bg-white text-[#092f55] border-2 border-[#092f55]/20 font-extrabold rounded-full hover:border-[#092f55] transition-colors flex items-center justify-center gap-2"
              >
                View Bundles & Combos
              </Link>
            </div>
          </div>

          <div className="relative flex justify-center">
            <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-[#e7edf2] transform rotate-1 hover:rotate-0 transition-transform duration-300">
              <div className="absolute -top-3 -right-3 bg-[#FFD54A] text-[#092f55] text-xs font-black px-3 py-1 rounded-full shadow-md uppercase tracking-wider">
                140+ Pages
              </div>
              <img
                src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80"
                alt="PyNotes Handwritten Notebook"
                className="w-full h-80 object-cover rounded-2xl mb-4 border border-[#e7edf2]"
              />
              <h3 className="font-extrabold text-[#092f55] text-lg">Python Masterclass Notebook</h3>
              <p className="text-xs text-[#526d81] mt-1">From first print() to advanced OOP & async programming.</p>
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <span className="text-sm font-black text-[#092f55]">₹499</span>
                  <span className="text-xs text-slate-400 line-through ml-2">₹799</span>
                </div>
                <span className="text-xs font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-full">SAVE 37%</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Trust Row */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {settings.trust_row?.map((t: any, idx: number) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-[#e7edf2] shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#e4f8f9] text-[#12A5B0] flex items-center justify-center shrink-0">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#092f55]">{t.title}</h4>
                <p className="text-xs text-[#526d81] mt-0.5">{t.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Subject Tiles */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-[#12A5B0]">Explore By Subject</span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#092f55] font-nunito mt-1">All 13 Core Subjects</h2>
          </div>
          <Link to="/subjects" className="text-xs font-extrabold text-[#12A5B0] hover:underline flex items-center gap-1">
            View All Subjects <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {subjects.map((sub: any) => (
            <Link
              key={sub.slug}
              to={`/subjects/${sub.slug}`}
              className="group bg-white p-5 rounded-2xl border border-[#e7edf2] shadow-xs hover:shadow-md hover:border-[#12A5B0] transition-all text-center flex flex-col items-center justify-center gap-3"
            >
              <div 
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-xs group-hover:scale-110 transition-transform"
                style={{ backgroundColor: sub.accent_color || '#12A5B0' }}
              >
                <Code className="w-6 h-6" />
              </div>
              <span className="font-extrabold text-xs text-[#092f55] group-hover:text-[#12A5B0] transition-colors">{sub.menu_label || sub.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Collection */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-[#12A5B0]">Top Best-Sellers</span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#092f55] font-nunito mt-1">Featured Printed Notebooks</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredBooks.map((book: any) => (
            <div key={book.slug} className="bg-white rounded-2xl border border-[#e7edf2] overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col">
              <div className="relative aspect-4/3 bg-[#f6f9fc] overflow-hidden group">
                <img
                  src={book.images?.[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80'}
                  alt={book.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {book.badge_text && (
                  <span className="absolute top-3 left-3 bg-[#FFD54A] text-[#092f55] text-[10px] font-black px-2.5 py-1 rounded-full shadow-xs">
                    {book.badge_text}
                  </span>
                )}
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <Link to={`/product/${book.slug}`} className="font-extrabold text-sm text-[#092f55] hover:text-[#12A5B0] transition-colors line-clamp-1">
                    {book.title}
                  </Link>
                  <p className="text-xs text-[#526d81] mt-1 line-clamp-2">{book.short_desc}</p>
                </div>

                <div className="space-y-3 pt-3 border-t border-[#e7edf2]">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-base font-black text-[#092f55]">₹{book.price_paise / 100}</span>
                      <span className="text-xs text-slate-400 line-through ml-2">₹{book.mrp_paise / 100}</span>
                    </div>
                    {book.stock_qty <= book.low_stock_threshold && settings.show_low_stock_badge && (
                      <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">Only {book.stock_qty} left</span>
                    )}
                  </div>

                  <button
                    onClick={() => addToCart(book.slug)}
                    className="w-full py-2.5 bg-[#092f55] text-white font-extrabold text-xs rounded-xl hover:bg-[#071E38] transition-colors flex items-center justify-center gap-2"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison Table */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white rounded-3xl border border-[#e7edf2] shadow-xs">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-[#12A5B0]">Why PyNotes</span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#092f55] font-nunito">Built Differently for Students</h2>
          <p className="text-xs text-[#526d81]">See how our printed handwritten notes compare to traditional textbooks and digital PDFs.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#e7edf2]">
                <th className="py-4 px-6 text-xs font-bold text-[#708596] uppercase">Feature</th>
                <th className="py-4 px-6 text-xs font-black text-[#12A5B0] uppercase bg-[#e4f8f9] rounded-t-xl">PyNotes Printed Books</th>
                <th className="py-4 px-6 text-xs font-bold text-[#526d81] uppercase">Standard Textbooks</th>
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-[#e7edf2]">
              {settings.default_comparison_rows?.map((row: any, idx: number) => (
                <tr key={idx} className="hover:bg-[#f6f9fc]/50">
                  <td className="py-4 px-6 font-bold text-[#092f55]">{row.label}</td>
                  <td className="py-4 px-6 font-bold text-[#12A5B0] bg-[#e4f8f9]/50 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#12A5B0]" /> {row.ours}
                  </td>
                  <td className="py-4 px-6 text-[#526d81]">{row.others}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Result Stats (Only when filled) */}
      {settings.result_stats && settings.result_stats.length > 0 && settings.result_stats[0].value && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {settings.result_stats.map((stat: any, idx: number) => (
              <div key={idx} className="bg-[#092f55] text-white p-8 rounded-3xl space-y-3 relative overflow-hidden">
                <div className="text-4xl font-black font-nunito text-[#FFD54A]">{stat.value}</div>
                <h4 className="font-bold text-base">{stat.label}</h4>
                <p className="text-xs text-slate-300">{stat.source_note} ({stat.sample_size}, {stat.survey_date})</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white rounded-3xl border border-[#e7edf2] shadow-xs">
        <div className="text-center space-y-2 mb-8">
          <h3 className="text-2xl font-black text-[#092f55] font-nunito">Have a Question?</h3>
          <p className="text-xs text-[#526d81]">Send us a message and our team will get back to you promptly.</p>
        </div>

        {contactSent ? (
          <div className="bg-green-50 border border-green-200 text-green-800 p-6 rounded-2xl text-center font-bold text-sm">
            Thank you! Your message has been sent successfully.
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
                  className="w-full px-4 py-2.5 bg-[#f6f9fc] border border-[#e7edf2] rounded-xl text-xs focus:outline-none focus:border-[#12A5B0]"
                  placeholder="Rahul Sharma"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#092f55] mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={contactForm.email}
                  onChange={e => setContactForm({ ...contactForm, email: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#f6f9fc] border border-[#e7edf2] rounded-xl text-xs focus:outline-none focus:border-[#12A5B0]"
                  placeholder="rahul@example.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#092f55] mb-1">Mobile Number (Optional)</label>
              <input
                type="tel"
                value={contactForm.phone}
                onChange={e => setContactForm({ ...contactForm, phone: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#f6f9fc] border border-[#e7edf2] rounded-xl text-xs focus:outline-none focus:border-[#12A5B0]"
                placeholder="9876543210"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#092f55] mb-1">Message</label>
              <textarea
                required
                rows={4}
                value={contactForm.message}
                onChange={e => setContactForm({ ...contactForm, message: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#f6f9fc] border border-[#e7edf2] rounded-xl text-xs focus:outline-none focus:border-[#12A5B0]"
                placeholder="Ask us anything about our printed notes or delivery..."
              />
            </div>
            <button
              type="submit"
              className="w-full py-3.5 bg-[#092f55] text-white font-extrabold text-xs rounded-xl hover:bg-[#071E38] transition-colors"
            >
              Send Message
            </button>
          </form>
        )}
      </section>

    </div>
  );
};
