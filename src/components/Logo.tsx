import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'horizontal' | 'stacked';
  inverted?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  variant = 'horizontal',
  inverted = false
}) => {
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
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0B3561] to-[#071E38] border border-[#13a5bd]/40 shadow-sm flex items-center justify-center">
          <svg
            className="w-5 h-5 text-[#13a5bd]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Notebook spine & cover */}
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
            {/* Code / handwritten bracket flourish */}
            <path d="m9 9-2 3 2 3" stroke="#13a5bd" strokeWidth="2.2" />
            <path d="m15 9 2 3-2 3" stroke="#13a5bd" strokeWidth="2.2" />
            <line x1="13" y1="8" x2="11" y2="16" stroke="#f3ad19" strokeWidth="2" />
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
          Printed Coding Notes
        </span>
      </div>
    </Link>
  );
};
