import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'horizontal' | 'stacked';
  inverted?: boolean; // When true (e.g. footer on dark bg), logo is 100% pure white
  customLogoUrl?: string;
  customLogoWhiteUrl?: string;
  heightPx?: number;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  variant = 'horizontal',
  inverted = false,
  customLogoUrl,
  customLogoWhiteUrl,
  heightPx
}) => {
  const [headerLogo, setHeaderLogo] = useState<string>(customLogoUrl || '/logo.svg');
  const [footerLogo, setFooterLogo] = useState<string>(customLogoWhiteUrl || '/logo-white.svg');
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (customLogoUrl) {
      setHeaderLogo(customLogoUrl);
    } else {
      const saved = localStorage.getItem('pynotes_custom_logo');
      if (saved) setHeaderLogo(saved);
      else setHeaderLogo('/logo.svg');
    }

    if (customLogoWhiteUrl) {
      setFooterLogo(customLogoWhiteUrl);
    } else {
      const savedWhite = localStorage.getItem('pynotes_custom_logo_white');
      if (savedWhite) {
        setFooterLogo(savedWhite);
      } else {
        const saved = localStorage.getItem('pynotes_custom_logo');
        if (saved && saved !== '/logo.svg') {
          // If admin uploaded a custom logo, we can use it with brightness-0 invert filter
          setFooterLogo(saved);
        } else {
          setFooterLogo('/logo-white.svg');
        }
      }
    }
  }, [customLogoUrl, customLogoWhiteUrl]);

  const activeSrc = inverted ? footerLogo : headerLogo;
  const computedHeight = heightPx 
    ? `${heightPx}px` 
    : size === 'sm' ? '28px' : size === 'lg' ? '46px' : '34px';

  // If image fails to load, fallback to clean inline SVG
  if (imageError) {
    if (inverted) {
      // 100% Pure White inline fallback for dark footer
      return (
        <Link
          to="/"
          aria-label="PyNotes Home"
          className={`inline-flex items-center gap-2.5 font-nunito tracking-tight text-white transition-opacity hover:opacity-90 active:scale-95 ${
            variant === 'stacked' ? 'flex-col items-center text-center' : ''
          } ${className}`}
        >
          <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/30 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" stroke="#ffffff" />
              <path d="m8.5 9-2 3 2 3" stroke="#ffffff" />
              <path d="m15.5 9 2 3-2 3" stroke="#ffffff" />
              <line x1="12" y1="7" x2="12" y2="17" stroke="#ffffff" strokeDasharray="2 2" />
            </svg>
          </div>
          <div className="flex flex-col leading-none">
            <div className="flex items-center text-2xl font-black tracking-tight text-white">
              PyNotes<span className="w-1.5 h-1.5 rounded-full bg-white ml-0.5 mb-2 inline-block"></span>
            </div>
            <span className="text-[8.5px] uppercase tracking-wider font-extrabold text-white/80 -mt-0.5">
              Handwritten Coding Notes
            </span>
          </div>
        </Link>
      );
    }

    // Default inline fallback with brand colors
    return (
      <Link
        to="/"
        aria-label="PyNotes Home"
        className={`inline-flex items-center gap-2.5 font-nunito tracking-tight transition-transform active:scale-95 ${
          variant === 'stacked' ? 'flex-col items-center text-center' : ''
        } ${className}`}
      >
        <div className="w-9 h-9 rounded-xl bg-[#092f55] border border-[#13a5bd]/40 flex items-center justify-center shrink-0 shadow-sm">
          <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" stroke="#ffffff" />
            <path d="m8.5 9-2 3 2 3" stroke="#13a5bd" />
            <path d="m15.5 9 2 3-2 3" stroke="#13a5bd" />
            <line x1="12" y1="7" x2="12" y2="17" stroke="#f3ad19" strokeDasharray="2 2" />
          </svg>
        </div>
        <div className="flex flex-col leading-none">
          <div className="flex items-center text-2xl font-black tracking-tight">
            <span className="text-[#092f55]">Py</span>
            <span className="text-[#13a5bd]">Notes</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#f3ad19] ml-0.5 mb-2 inline-block"></span>
          </div>
          <span className="text-[8.5px] uppercase tracking-wider font-extrabold text-[#708596] -mt-0.5">
            Handwritten Coding Notes
          </span>
        </div>
      </Link>
    );
  }

  // Render the uploaded or static logo file
  const isWhiteSvg = activeSrc.includes('white');
  const needsWhiteFilter = inverted && !isWhiteSvg;

  return (
    <Link
      to="/"
      aria-label="PyNotes Home"
      className={`inline-flex items-center transition-all hover:opacity-95 active:scale-95 ${className}`}
    >
      <img
        src={activeSrc}
        alt="PyNotes Logo"
        onError={() => setImageError(true)}
        style={{
          height: computedHeight,
          filter: needsWhiteFilter ? 'brightness(0) invert(1)' : undefined,
        }}
        className={`object-contain max-w-[220px] transition-all select-none ${
          inverted ? 'brightness-0 invert' : ''
        }`}
      />
    </Link>
  );
};
