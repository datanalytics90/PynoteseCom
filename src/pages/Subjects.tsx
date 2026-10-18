import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Code, Search } from 'lucide-react';

export const Subjects: React.FC<{ catalog: any }> = ({ catalog }) => {
  const { subjects = [], products = [] } = catalog || {};
  const [search, setSearch] = useState('');

  const books = products.filter((p: any) => p.type === 'book' && p.status === 'active');

  const filteredSubjects = subjects.filter((s: any) => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.seo_intro?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-black uppercase tracking-wider text-[#12A5B0]">Catalogue</span>
        <h1 className="text-3xl sm:text-4xl font-black text-[#092f55] font-nunito">All Subjects & Handwritten Notes</h1>
        <p className="text-xs text-[#526d81]">Explore our 13 core printed coding and engineering subjects.</p>
        
        <div className="relative max-w-md mx-auto pt-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#708596]" />
          <input
            type="text"
            placeholder="Search subjects..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-[#e7edf2] rounded-full text-xs font-medium focus:outline-none focus:border-[#12A5B0] shadow-xs"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSubjects.map((sub: any) => {
          const subBooks = books.filter((b: any) => b.subject_slug === sub.slug);
          return (
            <div key={sub.slug} className="bg-white rounded-3xl p-6 border border-[#e7edf2] shadow-xs hover:shadow-lg transition-all flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div 
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-md"
                    style={{ backgroundColor: sub.accent_color || '#12A5B0' }}
                  >
                    <Code className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-[#092f55]">{sub.name}</h3>
                    <span className="text-[11px] font-bold text-[#12A5B0]">{subBooks.length} Printed Book Available</span>
                  </div>
                </div>
                <p className="text-xs text-[#526d81] leading-relaxed">{sub.seo_intro}</p>
              </div>

              <Link
                to={`/subjects/${sub.slug}`}
                className="w-full py-3 bg-[#f6f9fc] text-[#092f55] font-extrabold text-xs rounded-xl hover:bg-[#092f55] hover:text-white transition-colors text-center block"
              >
                View Subject Notes
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};
