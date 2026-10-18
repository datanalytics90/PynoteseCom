import React, { useEffect, useState } from 'react';

export const AnnouncementBar: React.FC<{ messages: { text: string; highlight?: string }[] }> = ({ messages }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!messages || messages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % messages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [messages]);

  if (!messages || messages.length === 0) return null;
  const current = messages[currentIndex];

  return (
    <div className="bg-[#092f55] text-white text-xs sm:text-sm py-2 px-4 text-center font-medium transition-all duration-500 overflow-hidden relative">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
        <span>{current.text}</span>
      </div>
    </div>
  );
};
