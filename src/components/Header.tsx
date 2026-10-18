import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Logo } from './Logo';
import { Search, ShoppingBag, User as UserIcon, ChevronDown, Menu, X, BookOpen, Layers } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export const Header: React.FC<{ subjects?: any[]; products?: any[] }> = ({ subjects = [], products = [] }) => {
  const { cartCount, setIsDrawerOpen } = useCart();
  const { currentUser, userProfile } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSubjectsDropdownOpen, setIsSubjectsDropdownOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const filteredSuggestions = searchQuery.trim()
    ? products.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5)
    : [];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#e7edf2] h-16 flex items-center shadow-xs">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        
        {/* Mobile menu button */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-[#092f55] p-2 hover:bg-[#f6f9fc] rounded-lg"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Logo */}
        <div className="flex items-center gap-8">
          <Logo className="h-7" />

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 font-semibold text-sm text-[#526d81]">
            <Link to="/" className="hover:text-[#13a5bd] transition-colors">Home</Link>
            
            {/* Subjects Dropdown */}
            <div className="relative" onMouseLeave={() => setIsSubjectsDropdownOpen(false)}>
              <button 
                onMouseEnter={() => setIsSubjectsDropdownOpen(true)}
                onClick={() => setIsSubjectsDropdownOpen(!isSubjectsDropdownOpen)}
                className="flex items-center gap-1 hover:text-[#13a5bd] transition-colors py-2"
              >
                Subjects <ChevronDown className="w-4 h-4" />
              </button>

              {isSubjectsDropdownOpen && (
                <div className="absolute top-full left-0 w-64 bg-white rounded-xl shadow-xl border border-[#e7edf2] py-2 mt-1 z-50 max-h-96 overflow-y-auto">
                  <div className="px-3 py-1.5 text-xs font-bold text-[#708596] uppercase tracking-wider">All 13 Subjects</div>
                  {subjects.map((sub: any) => (
                    <Link
                      key={sub.slug}
                      to={`/subjects/${sub.slug}`}
                      onClick={() => setIsSubjectsDropdownOpen(false)}
                      className="block px-4 py-2 text-sm text-[#102943] hover:bg-[#e4f8f9] hover:text-[#13a5bd] transition-colors"
                    >
                      {sub.menu_label || sub.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link to="/bundles" className="hover:text-[#13a5bd] transition-colors">Bundles</Link>
            <Link to="/about" className="hover:text-[#13a5bd] transition-colors">About</Link>
            <Link to="/faq" className="hover:text-[#13a5bd] transition-colors">FAQ</Link>
          </nav>
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          
          {/* Search bar */}
          <div className="relative hidden sm:block w-48 lg:w-64" ref={searchRef}>
            <div className="relative flex items-center">
              <Search className="absolute left-3 w-4 h-4 text-[#708596]" />
              <input
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); setIsSearchOpen(true); }}
                onFocus={() => setIsSearchOpen(true)}
                className="w-full pl-9 pr-4 py-2 bg-[#f6f9fc] border border-[#e7edf2] rounded-full text-xs font-medium focus:outline-none focus:border-[#13a5bd]"
              />
            </div>

            {isSearchOpen && searchQuery.trim() && filteredSuggestions.length > 0 && (
              <div className="absolute top-full right-0 left-0 bg-white rounded-xl shadow-xl border border-[#e7edf2] mt-1 py-2 z-50">
                {filteredSuggestions.map((prod: any) => (
                  <button
                    key={prod.slug}
                    onClick={() => { navigate(`/product/${prod.slug}`); setIsSearchOpen(false); setSearchQuery(''); }}
                    className="w-full text-left px-4 py-2 text-xs text-[#102943] hover:bg-[#e4f8f9] flex items-center justify-between"
                  >
                    <span className="font-semibold truncate">{prod.title}</span>
                    <span className="text-[#13a5bd] font-bold">₹{prod.price_paise / 100}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Account */}
          <Link
            to={currentUser ? "/account" : "/account"}
            className="flex items-center gap-2 p-2 rounded-xl text-[#092f55] hover:bg-[#f6f9fc] transition-colors"
            title="Account"
          >
            <UserIcon className="w-5 h-5" />
            <span className="hidden lg:inline text-xs font-semibold">
              {currentUser ? (userProfile?.name?.split(' ')[0] || 'Account') : 'Sign In'}
            </span>
          </Link>

          {/* Cart Button */}
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="relative bg-[#092f55] text-white p-2.5 rounded-xl hover:bg-[#071E38] transition-colors flex items-center gap-2 shadow-xs"
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="hidden sm:inline text-xs font-bold">Cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#13a5bd] text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white border-b border-[#e7edf2] shadow-xl p-4 md:hidden z-50 flex flex-col gap-3">
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="py-2 font-semibold text-[#092f55]">Home</Link>
          <Link to="/subjects" onClick={() => setIsMobileMenuOpen(false)} className="py-2 font-semibold text-[#092f55]">All Subjects</Link>
          <Link to="/bundles" onClick={() => setIsMobileMenuOpen(false)} className="py-2 font-semibold text-[#092f55]">Bundles</Link>
          <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="py-2 font-semibold text-[#092f55]">About</Link>
          <Link to="/faq" onClick={() => setIsMobileMenuOpen(false)} className="py-2 font-semibold text-[#092f55]">FAQ</Link>
          <Link to="/account" onClick={() => setIsMobileMenuOpen(false)} className="py-2 font-semibold text-[#092f55]">Account & Orders</Link>
        </div>
      )}
    </header>
  );
};
