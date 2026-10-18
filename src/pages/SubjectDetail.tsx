import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ArrowLeft, BookOpen, CheckCircle2 } from 'lucide-react';

export const SubjectDetail: React.FC<{ catalog: any }> = ({ catalog }) => {
  const { slug } = useParams();
  const { subjects = [], products = [] } = catalog || {};
  const { addToCart } = useCart();

  const subject = subjects.find((s: any) => s.slug === slug);
  const subjectBooks = products.filter((p: any) => p.type === 'book' && p.subject_slug === slug && p.status === 'active');

  if (!subject) {
    return <div className="text-center py-20 text-lg font-bold text-[#092f55]">Subject not found</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <Link to="/subjects" className="inline-flex items-center gap-2 text-xs font-bold text-[#526d81] hover:text-[#092f55]">
        <ArrowLeft className="w-4 h-4" /> Back to All Subjects
      </Link>

      <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#e7edf2] shadow-xs flex flex-col md:flex-row items-center gap-8">
        <div 
          className="w-24 h-24 rounded-3xl flex items-center justify-center text-white shadow-xl shrink-0"
          style={{ backgroundColor: subject.accent_color || '#12A5B0' }}
        >
          <BookOpen className="w-12 h-12" />
        </div>
        <div className="space-y-3 text-center md:text-left">
          <span className="text-xs font-black uppercase tracking-wider text-[#12A5B0]">Subject Notes</span>
          <h1 className="text-3xl sm:text-4xl font-black text-[#092f55] font-nunito">{subject.name}</h1>
          <p className="text-xs sm:text-sm text-[#526d81] max-w-2xl">{subject.seo_intro}</p>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-black text-[#092f55] font-nunito">Available Printed Books ({subjectBooks.length})</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjectBooks.map((book: any) => (
            <div key={book.slug} className="bg-white rounded-3xl border border-[#e7edf2] overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col">
              <div className="relative aspect-4/3 bg-[#f6f9fc]">
                <img src={book.images?.[0]} alt={book.title} className="w-full h-full object-cover" />
                {book.badge_text && (
                  <span className="absolute top-3 left-3 bg-[#FFD54A] text-[#092f55] text-[10px] font-black px-2.5 py-1 rounded-full shadow-xs">
                    {book.badge_text}
                  </span>
                )}
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <Link to={`/product/${book.slug}`} className="font-extrabold text-base text-[#092f55] hover:text-[#12A5B0]">
                    {book.title}
                  </Link>
                  <p className="text-xs text-[#526d81] mt-1">{book.short_desc}</p>
                </div>
                <div className="pt-4 border-t border-[#e7edf2] flex items-center justify-between">
                  <div>
                    <span className="text-lg font-black text-[#092f55]">₹{book.price_paise / 100}</span>
                    <span className="text-xs text-slate-400 line-through ml-2">₹{book.mrp_paise / 100}</span>
                  </div>
                  <button
                    onClick={() => addToCart(book.slug)}
                    className="px-5 py-2.5 bg-[#092f55] text-white font-extrabold text-xs rounded-xl hover:bg-[#071E38] transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
