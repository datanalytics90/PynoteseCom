import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'horizontal' | 'stacked';
  inverted?: boolean;
  customLogoUrl?: string;
  heightPx?: number;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  variant = 'horizontal',
  inverted = false,
  customLogoUrl,
  heightPx
}) => {
  const [logoSrc, setLogoSrc] = useState<string | null>(customLogoUrl || null);

  useEffect(() => {
    if (customLogoUrl) {
      setLogoSrc(customLogoUrl);
      return;
    }
    // Check localStorage for any admin-uploaded custom logo
    const saved = localStorage.getItem('pynotes_custom_logo');
    if (saved) {
      setLogoSrc(saved);
    }
  }, [customLogoUrl]);

  // If a custom logo image has been uploaded or configured by admin
  if (logoSrc) {
    return (
      <Link
        to="/"
        aria-label="PyNotes Home"
        className={`inline-flex items-center gap-2.5 transition-transform active:scale-95 ${className}`}
      >
        <img
          src={logoSrc}
          alt="PyNotes Logo"
          style={{ height: heightPx ? `${heightPx}px` : size === 'sm' ? '28px' : size === 'lg' ? '48px' : '36px' }}
          className="object-contain max-w-[200px]"
        />
      </Link>
    );
  }

  // Brand PyNotes Logo: Handcrafted calligraphy pen + code flourish + notebook badge
  return (
    <Link
      to="/"
      aria-label="PyNotes Home"
      className={`inline-flex items-center gap-2.5 font-nunito tracking-tight transition-transform active:scale-95 ${
        variant === 'stacked' ? 'flex-col items-center text-center' : ''
      } ${className}`}
    >
      {/* Brand Icon Badge */}
      <div className="relative flex items-center justify-center shrink-0">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#092f55] via-[#0B3561] to-[#071E38] border border-[#13a5bd]/40 shadow-md flex items-center justify-center relative overflow-hidden group">
          {/* Subtle notebook ruled lines in background */}
          <div className="absolute inset-0 opacity-15 flex flex-col justify-evenly pointer-events-none px-1">
            <div className="h-[1px] bg-white w-full" />
            <div className="h-[1px] bg-white w-full" />
            <div className="h-[1px] bg-white w-full" />
          </div>

          <svg
            className="w-5 h-5 relative z-10 text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Book / Notebook Base */}
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" stroke="#ffffff" />
            {/* Code Brackets & Pen Nib */}
            <path d="m8.5 9-2 3 2 3" stroke="#13a5bd" strokeWidth="2.2" />
            <path d="m15.5 9 2 3-2 3" stroke="#13a5bd" strokeWidth="2.2" />
            <path d="M12 7v10" stroke="#f3ad19" strokeWidth="2" strokeDasharray="2 2" />
          </svg>
        </div>
      </div>

      {/* Brand Wordmark */}
      <div className="flex flex-col leading-none">
        <div className="flex items-center text-2xl font-black tracking-tight font-nunito">
          <span className={inverted ? 'text-white' : 'text-[#092f55]'}>Py</span>
          <span className="text-[#13a5bd]">Notes</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#f3ad19] ml-0.5 mb-2 inline-block"></span>
        </div>
        <span className="text-[9px] uppercase tracking-wider font-extrabold text-[#708596] -mt-0.5">
          Handwritten Coding Notes
        </span>
      </div>
    </Link>
  );
};
