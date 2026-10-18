import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export const PolicyPage: React.FC = () => {
  const { slug } = useParams();
  const [page, setPage] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/pages/${slug}`)
      .then(res => res.json())
      .then(data => setPage(data))
      .catch(err => console.error(err));
  }, [slug]);

  if (!page) return <div className="text-center py-20 font-bold">Loading policy...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
      <h1 className="text-3xl font-black text-[#092f55] font-nunito">{page.title}</h1>
      <div className="bg-white p-8 rounded-3xl border border-[#e7edf2] shadow-xs text-xs text-[#526d81] leading-relaxed whitespace-pre-line">
        {page.body_md}
      </div>
    </div>
  );
};
