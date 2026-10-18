import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Code, Search, Layers, BookOpen, ArrowRight, Sparkles } from 'lucide-react';
import { ALL_13_SUBJECTS } from '../data/subjects';

export const Subjects: React.FC<{ catalog: any }> = ({ catalog }) => {
  const { subjects = [], products = [] } = catalog || {};
  const [search, setSearch] = useState('');

  // Always make sure all 13 subjects are present
  const baseSubjects = subjects && subjects.length >= 13 ? subjects : ALL_13_SUBJECTS;
  const books = products.filter((p: any) => p.type === 'book' && p.status === 'active');

  const filteredSubjects = baseSubjects.filter((s: any) => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    (s.menu_label && s.menu_label.toLowerCase().includes(search.toLowerCase())) ||
    (s.seo_intro && s.seo_intro.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#13a5bd]/10 text-[#13a5bd] rounded-full text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" /> All 13 Core Subjects
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#092f55] font-nunito tracking-tight">
          Handwritten Coding Notes Catalogue
        </h1>
        <p className="text-sm sm:text-base text-[#526d81] font-medium max-w-2xl mx-auto">
          Explore our complete collection of 13 printed handwritten subjects. Every book contains illustrated diagrams, interview shortcuts, and clean memory maps.
        </p>
        
        {/* Search Bar - Fixed: Search icon is cleanly vertically centered inside input, not above it */}
        <div className="pt-4 max-w-md mx-auto w-full">
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-4 h-4 text-[#708596] pointer-events-none" />
            <input
              type="text"
              placeholder="Search by subject name or topic..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-[#e7edf2] rounded-full text-xs sm:text-sm font-medium focus:outline-none focus:border-[#13a5bd] focus:ring-2 focus:ring-[#13a5bd]/20 shadow-xs transition-all text-[#102943]"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-4 text-xs font-bold text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grid of All 13 Subject Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSubjects.map((sub: any, idx: number) => {
          const subBooks = books.filter((b: any) => b.subject_slug === sub.slug);
          const bookCount = subBooks.length > 0 ? subBooks.length : 1;
          const displayPrice = subBooks.length > 0 ? `₹${subBooks[0].price_paise / 100}` : '₹499';
          const mrpPrice = subBooks.length > 0 ? `₹${subBooks[0].mrp_paise / 100}` : '₹799';

          return (
            <div 
              key={sub.slug || idx} 
              className="bg-white rounded-3xl p-6 sm:p-7 border border-[#e7edf2] shadow-xs hover:shadow-xl hover:border-[#13a5bd]/40 transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                {/* Header row with icon badge and title */}
                <div className="flex items-start gap-4">
                  <div 
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-md shrink-0 transition-transform group-hover:scale-105 duration-200"
                    style={{ backgroundColor: sub.accent_color || '#13a5bd' }}
                  >
                    <Code className="w-7 h-7" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h2 className="font-extrabold text-lg text-[#092f55] truncate group-hover:text-[#13a5bd] transition-colors font-nunito">
                        {sub.name}
                      </h2>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[11px] font-bold text-[#13a5bd] bg-[#e4f8f9] px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                        <BookOpen className="w-3 h-3" /> {bookCount} Printed Book
                      </span>
                      <span className="text-[11px] font-extrabold text-[#092f55]">
                        {displayPrice} <span className="text-[10px] text-slate-400 line-through font-normal">{mrpPrice}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-[#526d81] leading-relaxed line-clamp-3 font-medium">
                  {sub.seo_intro || 'Comprehensive handwritten coding notes with visual diagrams, memory charts, and solved interview problems.'}
                </p>

                {/* Features Pill row */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[10px] font-bold bg-[#f6f9fc] text-[#526d81] px-2 py-0.5 rounded-md border border-[#e7edf2]">
                    100% Printed Book
                  </span>
                  <span className="text-[10px] font-bold bg-[#f6f9fc] text-[#526d81] px-2 py-0.5 rounded-md border border-[#e7edf2]">
                    Hand-drawn Diagrams
                  </span>
                  <span className="text-[10px] font-bold bg-[#f6f9fc] text-[#526d81] px-2 py-0.5 rounded-md border border-[#e7edf2]">
                    Spiral Bound
                  </span>
                </div>
              </div>

              {/* Action Link */}
              <div className="pt-6">
                <Link
                  to={`/subjects/${sub.slug}`}
                  className="w-full py-3 bg-[#f6f9fc] text-[#092f55] font-extrabold text-xs rounded-xl hover:bg-[#092f55] hover:text-white transition-all flex items-center justify-center gap-2 group-hover:bg-[#13a5bd] group-hover:text-white shadow-xs"
                >
                  <span>View Subject Notes</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {filteredSubjects.length === 0 && (
        <div className="text-center py-16 bg-white rounded-3xl border border-[#e7edf2] p-8 space-y-4">
          <BookOpen className="w-12 h-12 text-[#708596] mx-auto opacity-50" />
          <h3 className="font-bold text-lg text-[#092f55]">No subjects found matching "{search}"</h3>
          <p className="text-xs text-[#708596]">Try searching for Python, Java, DSA, C++, SQL, or Web Development.</p>
          <button
            onClick={() => setSearch('')}
            className="px-4 py-2 bg-[#092f55] text-white text-xs font-bold rounded-xl hover:bg-[#071E38]"
          >
            Show All 13 Subjects
          </button>
        </div>
      )}
    </div>
  );
};
