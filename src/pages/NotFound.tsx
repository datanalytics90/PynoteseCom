import React from 'react';
import { Link } from 'react-router-dom';

export const NotFound: React.FC = () => {
  return (
    <div className="max-w-md mx-auto px-4 py-32 text-center space-y-6">
      <h1 className="text-6xl font-black text-[#092f55] font-nunito">404</h1>
      <h2 className="text-xl font-bold text-[#092f55]">Page Not Found</h2>
      <p className="text-xs text-[#526d81]">The page you are looking for does not exist or has been moved.</p>
      <Link to="/" className="inline-block px-8 py-3.5 bg-[#092f55] text-white font-extrabold text-xs rounded-full hover:bg-[#071E38]">
        Back to Home
      </Link>
    </div>
  );
};
