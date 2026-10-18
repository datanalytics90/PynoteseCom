import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Logo } from './Logo';
import { Search, ShoppingBag, User as UserIcon, ChevronDown, Menu, X, BookOpen, Layers } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ALL_13_SUBJECTS } from '../data/subjects';

interface HeaderProps {
  subjects?: any[];
  products?: any[];
  settings?: any;
}

export const Header: React.FC<HeaderProps> = ({
  subjects = [],
  products = [],
  settings = {}
}) => {
  const { cartCount, setIsDrawerOpen } = useCart();
  const { currentUser, userProfile } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSubjectsOpen, setIsMobileSubjectsOpen] = useState(false);
  const [isSubjectsDropdownOpen, setIsSubjectsDropdownOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Ensure all 13 subjects are available even if server is seeding/loading
  const effectiveSubjects = subjects && subjects.length >= 13 ? subjects : ALL_13_SUBJECTS;

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
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Logo */}
        <div className="flex items-center gap-8">
          <Logo
            customLogoUrl={settings?.logo_url}
            heightPx={settings?.logo_height}
            className="h-8"
          />

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 font-semibold text-sm text-[#526d81]">
            <Link to="/" className="hover:text-[#13a5bd] transition-colors">Home</Link>
            
            {/* Subjects Dropdown - Exactly 13 Subjects */}
            <div 
              className="relative" 
              onMouseEnter={() => setIsSubjectsDropdownOpen(true)}
              onMouseLeave={() => setIsSubjectsDropdownOpen(false)}
            >
              <button 
                onClick={() => setIsSubjectsDropdownOpen(!isSubjectsDropdownOpen)}
                className="flex items-center gap-1 hover:text-[#13a5bd] transition-colors py-2"
              >
                Subjects <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isSubjectsDropdownOpen ? 'rotate-180 text-[#13a5bd]' : ''}`} />
              </button>

              {isSubjectsDropdownOpen && (
                <div className="absolute top-full left-0 w-72 bg-white rounded-2xl shadow-2xl border border-[#e7edf2] py-3 mt-0 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-1.5 flex items-center justify-between border-b border-[#f0f4f8] mb-1">
                    <span className="text-[11px] font-black text-[#13a5bd] uppercase tracking-wider">All 13 Subjects</span>
                    <Link 
                      to="/subjects" 
                      onClick={() => setIsSubjectsDropdownOpen(false)}
                      className="text-[11px] font-bold text-[#708596] hover:text-[#092f55]"
                    >
                      View All →
                    </Link>
                  </div>
                  
                  <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-50 py-1">
                    {effectiveSubjects.map((sub: any, idx: number) => (
                      <Link
                        key={sub.slug || idx}
                        to={`/subjects/${sub.slug}`}
                        onClick={() => setIsSubjectsDropdownOpen(false)}
                        className="flex items-center justify-between px-4 py-2 text-xs font-semibold text-[#102943] hover:bg-[#e4f8f9] hover:text-[#13a5bd] transition-colors group"
                      >
                        <div className="flex items-center gap-2.5">
                          <span 
                            className="w-2 h-2 rounded-full shrink-0" 
                            style={{ backgroundColor: sub.accent_color || '#13a5bd' }}
                          />
                          <span>{sub.menu_label || sub.name}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 group-hover:text-[#13a5bd] font-medium">Notes</span>
                      </Link>
                    ))}
                  </div>
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
          
          {/* Search bar with accurately centered search icon */}
          <div className="relative hidden sm:block w-48 lg:w-64" ref={searchRef}>
            <div className="relative flex items-center">
              <Search className="absolute left-3.5 w-4 h-4 text-[#708596] pointer-events-none" />
              <input
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); setIsSearchOpen(true); }}
                onFocus={() => setIsSearchOpen(true)}
                className="w-full pl-9 pr-4 py-2 bg-[#f6f9fc] border border-[#e7edf2] rounded-full text-xs font-medium focus:outline-none focus:border-[#13a5bd] transition-colors"
              />
            </div>

            {isSearchOpen && searchQuery.trim() && filteredSuggestions.length > 0 && (
              <div className="absolute top-full right-0 left-0 bg-white rounded-xl shadow-xl border border-[#e7edf2] mt-1.5 py-2 z-50">
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
            to="/account"
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
            className="relative bg-[#092f55] text-white p-2.5 rounded-xl hover:bg-[#071E38] transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
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
        <div className="absolute top-16 left-0 right-0 bg-white border-b border-[#e7edf2] shadow-xl p-4 md:hidden z-50 flex flex-col gap-2 max-h-[85vh] overflow-y-auto">
          {/* Mobile search bar */}
          <div className="relative flex items-center mb-2">
            <Search className="absolute left-3.5 w-4 h-4 text-[#708596] pointer-events-none" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-[#f6f9fc] border border-[#e7edf2] rounded-full text-xs font-medium focus:outline-none focus:border-[#13a5bd]"
            />
          </div>

          <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="py-2 font-semibold text-[#092f55] border-b border-slate-100">
            Home
          </Link>

          {/* Expandable 13 Subjects for mobile */}
          <div>
            <button 
              onClick={() => setIsMobileSubjectsOpen(!isMobileSubjectsOpen)}
              className="w-full flex items-center justify-between py-2 font-semibold text-[#092f55] border-b border-slate-100"
            >
              <span>Subjects ({effectiveSubjects.length})</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${isMobileSubjectsOpen ? 'rotate-180' : ''}`} />
            </button>
            {isMobileSubjectsOpen && (
              <div className="pl-3 py-2 space-y-1 bg-slate-50 rounded-xl my-1">
                {effectiveSubjects.map((sub: any) => (
                  <Link
                    key={sub.slug}
                    to={`/subjects/${sub.slug}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-1.5 text-xs font-medium text-[#526d81] hover:text-[#13a5bd]"
                  >
                    • {sub.menu_label || sub.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link to="/bundles" onClick={() => setIsMobileMenuOpen(false)} className="py-2 font-semibold text-[#092f55] border-b border-slate-100">
            Bundles & Combos
          </Link>
          <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="py-2 font-semibold text-[#092f55] border-b border-slate-100">
            About
          </Link>
          <Link to="/faq" onClick={() => setIsMobileMenuOpen(false)} className="py-2 font-semibold text-[#092f55] border-b border-slate-100">
            FAQ
          </Link>
          <Link to="/account" onClick={() => setIsMobileMenuOpen(false)} className="py-2 font-semibold text-[#092f55]">
            Account & Orders
          </Link>
        </div>
      )}
    </header>
  );
};
