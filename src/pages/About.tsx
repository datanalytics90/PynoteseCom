import React, { useEffect, useState } from 'react';

export const About: React.FC = () => {
  const [content, setContent] = useState<any>(null);

  useEffect(() => {
    fetch('/api/pages/about')
      .then(res => res.json())
      .then(data => setContent(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
      <h1 className="text-3xl font-black text-[#092f55] font-nunito">{content?.title || 'About PyNotes'}</h1>
      <div className="bg-white p-8 rounded-3xl border border-[#e7edf2] shadow-xs prose text-sm text-[#526d81] leading-relaxed">
        {content?.body_md || 'PyNotes makes printed, handwritten coding notes: Python, Java, C and DSA, laid out the way a good student writes them.'}
      </div>
    </div>
  );
};
