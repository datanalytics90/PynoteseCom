import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ArrowLeft, BookOpen, CheckCircle2, ShoppingBag, Sparkles } from 'lucide-react';
import { ALL_13_SUBJECTS } from '../data/subjects';

export const SubjectDetail: React.FC<{ catalog: any }> = ({ catalog }) => {
  const { slug } = useParams();
  const { subjects = [], products = [] } = catalog || {};
  const { addToCart } = useCart();

  const effectiveSubjects = subjects && subjects.length >= 13 ? subjects : ALL_13_SUBJECTS;
  const subject = effectiveSubjects.find((s: any) => s.slug === slug);

  let subjectBooks = products.filter((p: any) => p.type === 'book' && p.subject_slug === slug && p.status === 'active');
  
  // If books are still loading or empty, provide standard fallback book for this subject
  if (subjectBooks.length === 0 && subject) {
    subjectBooks = [{
      slug: subject.slug,
      title: `${subject.name} Handwritten Notes`,
      subject_slug: subject.slug,
      price_paise: 49900,
      mrp_paise: 79900,
      type: 'book',
      badge_text: 'SAVE 37%',
      short_desc: subject.seo_intro,
      images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80']
    }];
  }

  if (!subject) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4">
        <h2 className="text-xl font-black text-[#092f55]">Subject not found</h2>
        <Link to="/subjects" className="text-xs font-bold text-[#13a5bd] hover:underline">
          ← View All 13 Subjects
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <Link to="/subjects" className="inline-flex items-center gap-2 text-xs font-bold text-[#526d81] hover:text-[#092f55] transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to All 13 Subjects
      </Link>

      {/* Subject Header Banner */}
      <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#e7edf2] shadow-xs flex flex-col md:flex-row items-center gap-8">
        <div 
          className="w-24 h-24 rounded-3xl flex items-center justify-center text-white shadow-xl shrink-0"
          style={{ backgroundColor: subject.accent_color || '#13a5bd' }}
        >
          <BookOpen className="w-12 h-12" />
        </div>
        <div className="space-y-3 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#13a5bd]/10 text-[#13a5bd] rounded-full text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> 100% Printed Handwritten Notes
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#092f55] font-nunito">{subject.name}</h1>
          <p className="text-xs sm:text-sm text-[#526d81] max-w-2xl font-medium leading-relaxed">{subject.seo_intro}</p>
        </div>
      </div>

      {/* Books List */}
      <div className="space-y-6">
        <h2 className="text-xl font-black text-[#092f55] font-nunito">Available Printed Books ({subjectBooks.length})</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjectBooks.map((book: any) => (
            <div key={book.slug} className="bg-white rounded-3xl border border-[#e7edf2] overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col">
              <div className="relative aspect-4/3 bg-[#f6f9fc]">
                <img src={book.images?.[0]} alt={book.title} className="w-full h-full object-cover" />
                {book.badge_text && (
                  <span className="absolute top-3 left-3 bg-[#f3ad19] text-[#092f55] text-[10px] font-black px-2.5 py-1 rounded-full shadow-xs uppercase tracking-wider">
                    {book.badge_text}
                  </span>
                )}
                <span className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-xs text-[#092f55] text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                  Physical Spiral Book
                </span>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <Link to={`/product/${book.slug}`} className="font-extrabold text-base text-[#092f55] hover:text-[#13a5bd] transition-colors font-nunito">
                    {book.title}
                  </Link>
                  <p className="text-xs text-[#526d81] mt-1 line-clamp-2">{book.short_desc}</p>
                </div>
                <div className="pt-4 border-t border-[#e7edf2] flex items-center justify-between">
                  <div>
                    <span className="text-lg font-black text-[#092f55]">₹{book.price_paise / 100}</span>
                    <span className="text-xs text-slate-400 line-through ml-2">₹{book.mrp_paise / 100}</span>
                  </div>
                  <button
                    onClick={() => addToCart(book.slug, 1)}
                    className="px-5 py-2.5 bg-[#092f55] text-white font-extrabold text-xs rounded-xl hover:bg-[#071E38] transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs active:scale-95"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" /> Add to Cart
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
