'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FiShoppingCart, FiHeart, FiUser, FiSearch, FiMenu, FiX,
  FiChevronDown, FiLogOut, FiPackage, FiSettings, FiMapPin
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { categoryAPI } from '../../lib/api';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [catMenuOpen, setCatMenuOpen] = useState(false);
  const { user, isLoggedIn, isAdmin, logout } = useAuth();
  const { itemCount } = useCart();
  const router = useRouter();
  const userMenuRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    categoryAPI.getAll().then(({ data }) => setCategories(data.categories)).catch(() => {});
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?keyword=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      {/* Top announcement bar */}
      <div className="bg-primary-600 text-white text-center py-2 text-sm font-medium hidden md:block">
        🎉 FREE shipping on orders above ₹499 | Use code <strong>WELCOME10</strong> for 10% off your first order!
      </div>

      <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-lg' : 'bg-white'}`}>
        <div className="container-custom">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center text-2xl shadow-orange group-hover:scale-105 transition-transform">
                🍿
              </div>
              <div className="hidden sm:block">
                <div className="font-display font-bold text-xl text-dark leading-none">Namkeen</div>
                <div className="text-xs text-primary-500 font-semibold tracking-widest uppercase">Store</div>
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center gap-1">
              <Link href="/" className="px-4 py-2 text-gray-700 hover:text-primary-500 font-semibold text-sm transition-colors rounded-lg hover:bg-primary-50">
                Home
              </Link>
              <div className="relative" onMouseEnter={() => setCatMenuOpen(true)} onMouseLeave={() => setCatMenuOpen(false)}>
                <button className="flex items-center gap-1 px-4 py-2 text-gray-700 hover:text-primary-500 font-semibold text-sm transition-colors rounded-lg hover:bg-primary-50">
                  Categories <FiChevronDown className={`transition-transform ${catMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                {catMenuOpen && (
                  <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-fade-in">
                    {categories.map((cat) => (
                      <Link key={cat._id} href={`/products?category=${cat._id}`}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-primary-50 text-gray-700 hover:text-primary-600 transition-colors font-medium text-sm"
                        onClick={() => setCatMenuOpen(false)}>
                        <span className="text-lg">{cat.icon}</span> {cat.name}
                      </Link>
                    ))}
                    <div className="border-t border-gray-100 mt-2 pt-2">
                      <Link href="/products" className="flex items-center gap-3 px-4 py-2.5 text-primary-500 font-semibold text-sm hover:bg-primary-50"
                        onClick={() => setCatMenuOpen(false)}>
                        View All Products →
                      </Link>
                    </div>
                  </div>
                )}
              </div>
              <Link href="/products?isBestSeller=true" className="px-4 py-2 text-gray-700 hover:text-primary-500 font-semibold text-sm transition-colors rounded-lg hover:bg-primary-50">
                Best Sellers
              </Link>
              <Link href="/products?isNew=true" className="px-4 py-2 text-gray-700 hover:text-primary-500 font-semibold text-sm transition-colors rounded-lg hover:bg-primary-50">
                New Arrivals
              </Link>
              <Link href="/#contact" className="px-4 py-2 text-gray-700 hover:text-primary-500 font-semibold text-sm transition-colors rounded-lg hover:bg-primary-50">
                Contact
              </Link>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-1 md:gap-2">
              {/* Search */}
              <button onClick={() => setSearchOpen(true)}
                className="p-2.5 rounded-xl hover:bg-gray-100 text-gray-600 hover:text-primary-500 transition-colors">
                <FiSearch size={20} />
              </button>

              {/* Wishlist */}
              {isLoggedIn && (
                <Link href="/wishlist" className="p-2.5 rounded-xl hover:bg-gray-100 text-gray-600 hover:text-primary-500 transition-colors hidden md:flex">
                  <FiHeart size={20} />
                </Link>
              )}

              {/* Cart */}
              <Link href="/cart" className="relative p-2.5 rounded-xl hover:bg-gray-100 text-gray-600 hover:text-primary-500 transition-colors">
                <FiShoppingCart size={20} />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-bounce-gentle">
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </Link>

              {/* User menu */}
              {isLoggedIn ? (
                <div className="relative" ref={userMenuRef}>
                  <button onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 p-2 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-sm">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden md:block text-sm font-semibold text-gray-700 max-w-20 truncate">{user?.name?.split(' ')[0]}</span>
                    <FiChevronDown className={`hidden md:block text-gray-400 transition-transform text-sm ${userMenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-fade-in">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="font-semibold text-gray-800 text-sm">{user?.name}</div>
                        <div className="text-xs text-gray-400 truncate">{user?.email}</div>
                      </div>
                      {[
                        { href: '/profile', icon: FiUser, label: 'My Profile' },
                        { href: '/orders', icon: FiPackage, label: 'My Orders' },
                        { href: '/wishlist', icon: FiHeart, label: 'Wishlist' },
                        { href: '/profile#addresses', icon: FiMapPin, label: 'Addresses' },
                      ].map(({ href, icon: Icon, label }) => (
                        <Link key={href} href={href}
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-gray-700 font-medium text-sm transition-colors"
                          onClick={() => setUserMenuOpen(false)}>
                          <Icon size={16} /> {label}
                        </Link>
                      ))}
                      {isAdmin && (
                        <>
                          <div className="border-t border-gray-100 my-1" />
                          <Link href="/admin" className="flex items-center gap-3 px-4 py-2.5 hover:bg-orange-50 text-primary-600 font-semibold text-sm"
                            onClick={() => setUserMenuOpen(false)}>
                            <FiSettings size={16} /> Admin Panel
                          </Link>
                        </>
                      )}
                      <div className="border-t border-gray-100 mt-1 pt-1">
                        <button onClick={() => { setUserMenuOpen(false); logout(); }}
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 text-red-500 font-medium text-sm w-full transition-colors">
                          <FiLogOut size={16} /> Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link href="/auth/login" className="hidden md:flex btn-primary py-2 px-4 text-sm items-center gap-2">
                  <FiUser size={16} /> Login
                </Link>
              )}

              {/* Mobile menu toggle */}
              <button onClick={() => setMenuOpen(!menuOpen)}
                className="p-2.5 rounded-xl hover:bg-gray-100 lg:hidden text-gray-600">
                {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg animate-slide-up">
            <div className="container-custom py-4 space-y-1">
              {[
                { href: '/', label: 'Home' },
                { href: '/products', label: 'All Products' },
                { href: '/products?isBestSeller=true', label: 'Best Sellers' },
                { href: '/products?isNew=true', label: 'New Arrivals' },
              ].map(({ href, label }) => (
                <Link key={href} href={href}
                  className="block px-4 py-3 rounded-xl font-semibold text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                  onClick={() => setMenuOpen(false)}>
                  {label}
                </Link>
              ))}
              <div className="border-t border-gray-100 pt-3 mt-3 space-y-1">
                <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Categories</p>
                {categories.slice(0, 5).map((cat) => (
                  <Link key={cat._id} href={`/products?category=${cat._id}`}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-600 text-sm transition-colors"
                    onClick={() => setMenuOpen(false)}>
                    <span className="text-base">{cat.icon}</span> {cat.name}
                  </Link>
                ))}
              </div>
              {!isLoggedIn && (
                <div className="pt-3 border-t border-gray-100">
                  <Link href="/auth/login" className="btn-primary w-full text-center block" onClick={() => setMenuOpen(false)}>
                    Login / Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Search overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-start justify-center pt-20 px-4 animate-fade-in"
          onClick={(e) => e.target === e.currentTarget && setSearchOpen(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 animate-slide-up">
            <form onSubmit={handleSearch} className="flex gap-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for bhujia, sev, mixture..."
                className="input-field flex-1 text-lg"
                autoFocus
              />
              <button type="submit" className="btn-primary flex-shrink-0">
                <FiSearch size={20} />
              </button>
            </form>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-sm text-gray-500 mr-1">Popular:</span>
              {['Bhujia', 'Sev', 'Mixture', 'Makhana', 'Mathri'].map((term) => (
                <button key={term}
                  onClick={() => { setSearchQuery(term); router.push(`/products?keyword=${term}`); setSearchOpen(false); }}
                  className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 hover:bg-primary-100 hover:text-primary-600 text-sm font-medium transition-colors">
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
