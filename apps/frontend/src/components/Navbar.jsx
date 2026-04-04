import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiSearch, FiX } from 'react-icons/fi';
import logoImg from '../assets/logo.png';

export default function Navbar({ showFitOn = true, isDarkBg = false }) {
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSellerOptions, setShowSellerOptions] = useState(false);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [currentScrollY, setCurrentScrollY] = useState(0);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const profileMenuRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('accessToken');
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      
      // Show navbar when scrolling up, hide when scrolling down
      if (scrollY < lastScrollY) {
        setIsNavbarVisible(true); // Scrolling up
      } else if (scrollY > 100) {
        setIsNavbarVisible(false); // Scrolling down
      }
      
      setLastScrollY(scrollY);
      setCurrentScrollY(scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setShowProfileMenu(false);
    navigate('/');
  };

  const handleProfile = () => {
    setShowProfileMenu(false);
    navigate('/profile');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setShowSearch(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearch(false);
      }
    };

    if (showSearch) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showSearch]);

  return (
    <>
      {/* Top Header Bar */}
      <div className="w-full h-1" style={{background: 'linear-gradient(to right, #0B0B0B, #2A2A2A, #0B0B0B)'}}></div>

      {/* Navbar */}
      <div 
        className="flex justify-center fixed top-0 left-0 right-0 z-40 transition-all duration-300" 
        style={{height: '70px', transform: isNavbarVisible ? 'translateY(0)' : 'translateY(-100%)'}}
      >
        <div className={`w-full flex items-center justify-between px-10 py-2 transition-all duration-300 ${
          isDarkBg || currentScrollY > 0 ? 'bg-black' : 'bg-transparent'
        }`}>

          {/* Logo */}
          <Link 
            to="/"
            className="cursor-pointer transition-all duration-300 hover:opacity-90"
          >
            <img 
              src={logoImg} 
              alt="Logo" 
              className="h-56 object-contain"
            />
          </Link>

          {/* Right Section - Menu and Icons */}
          <div className="flex items-center gap-8">
            {/* Menu */}
            <div className="hidden md:flex gap-10 text-[14px] font-light" style={{
              color: '#FFFFFF',
              letterSpacing: '0.5px',
              textTransform: 'uppercase'
            }}>
              <Link 
                to="/"
                className="cursor-pointer transition-colors hover:opacity-70"
                style={{color: 'inherit', textDecoration: 'none'}}
              >
                Home
              </Link>
              <Link 
                to="/about"
                className="cursor-pointer transition-colors hover:opacity-70"
                style={{color: 'inherit', textDecoration: 'none'}}
              >
                About
              </Link>
              <Link 
                to="/products"
                className="cursor-pointer transition-colors hover:opacity-70"
                style={{color: 'inherit', textDecoration: 'none'}}
              >
                Products
              </Link>
              <Link 
                to="/contact"
                className="cursor-pointer transition-colors hover:opacity-70"
                style={{color: 'inherit', textDecoration: 'none'}}
              >
                Contact
              </Link>
              
              {/* Fit On - Only visible when logged in and showFitOn is true */}
              {isLoggedIn && showFitOn && (
                <span className="cursor-pointer font-semibold transition-colors hover:opacity-70" style={{color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.5px'}}>
                  Fit On
                </span>
              )}
            </div>

            {/* Icons */}
            <div className="flex gap-6 text-2xl relative" style={{color: '#FFFFFF'}}>
            {/* Search */}
            <div ref={searchRef} className="relative">
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="cursor-pointer transition-all duration-300 hover:opacity-70 w-4 h-4 flex items-center justify-center rounded-lg hover:bg-opacity-10"
                style={{background: isDarkBg || currentScrollY > 0 ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}}
                title="Search"
              >
                {showSearch ? <FiX size={20} /> : <FiSearch size={20} />}
              </button>
              
              {showSearch && (
                <form onSubmit={handleSearch} className="absolute right-0 mt-3 w-screen md:w-96 rounded-xl shadow-2xl p-4" style={{background: '#FFFFFF', border: '2px solid #E8E8E8', zIndex: 50, maxWidth: 'calc(100vw - 32px)'}}>
                  <div className="space-y-3">
                    <label className="block text-xs font-bold uppercase tracking-wider" style={{color: '#0B0B0B'}}>Search Products</label>
                    <div className="flex items-center gap-2 bg-gray-50 rounded-lg border-2 transition-all" style={{borderColor: '#E8E8E8'}}>
                      <FiSearch size={18} style={{color: '#999', marginLeft: '12px'}} />
                      <input
                        type="text"
                        placeholder="Find your perfect style..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        autoFocus
                        className="flex-1 px-3 py-3 bg-transparent focus:outline-none text-sm font-medium"
                        style={{color: '#0B0B0B'}}
                        onFocus={(e) => {
                          e.target.parentElement.style.borderColor = '#C9A227';
                          e.target.parentElement.style.background = '#FFFEF5';
                        }}
                        onBlur={(e) => {
                          e.target.parentElement.style.borderColor = '#E8E8E8';
                          e.target.parentElement.style.background = '#F5F5F5';
                        }}
                      />
                      <button
                        type="submit"
                        className="flex items-center justify-center w-10 h-10 rounded-lg transition-all font-bold hover:shadow-lg"
                        style={{background: '#C9A227', color: '#0B0B0B', marginRight: '4px'}}
                        title="Search"
                      >
                        →
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
            
            {isLoggedIn ? (
              // Profile menu dropdown when logged in
              <div ref={profileMenuRef} className="relative">
                <div
                  className="cursor-pointer transition-colors duration-300 hover:opacity-70"
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  title="Profile Menu"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-40 rounded-lg shadow-xl z-50" style={{background: 'rgba(255, 255, 255, 0.2)', border: '1px solid rgba(255, 255, 255, 0.3)'}}>
                    {/* Triangle pointing up - directly under profile icon */}
                    <div className="absolute -top-2 right-4 w-4 h-4 border-l border-t rotate-45" style={{background: 'rgba(255, 255, 255, 0.2)', borderColor: 'rgba(255, 255, 255, 0.3)'}}></div>
                    
                    <Link
                      to="/profile"
                      onClick={() => setShowProfileMenu(false)}
                      className="w-full text-left px-4 py-2.5 font-medium text-sm rounded-t-lg transition-colors inline-block" 
                      style={{color: '#0B0B0B', background: 'rgba(255, 255, 255, 0.3)', textDecoration: 'none', width: '100%'}}
                    >
                      👤 Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 font-medium text-sm rounded-b-lg transition-colors" 
                      style={{color: '#D9534F', background: 'rgba(217, 83, 79, 0.1)', borderTop: '1px solid rgba(255, 255, 255, 0.2)'}}
                    >
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // Profile menu dropdown when not logged in
              <div ref={profileMenuRef} className="relative">
                <div
                  className="cursor-pointer transition-colors duration-300 hover:opacity-70"
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  title="Menu"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 shadow-xl z-50" style={{background: '#FFFFFF', border: '1px solid #E0E0E0'}}>
                    {/* Triangle pointing up - directly under profile icon */}
                    <div className="absolute -top-2 right-4 w-4 h-4 border-l border-t rotate-45" style={{background: '#FFFFFF', borderColor: '#E0E0E0'}}></div>
                    
                    <Link
                      to="/login"
                      onClick={() => setShowProfileMenu(false)}
                      className="w-full text-left px-4 py-2.5 font-medium text-sm transition-colors inline-block" 
                      style={{color: '#0B0B0B', background: '#FFFFFF', borderBottom: '1px solid #E0E0E0', textDecoration: 'none', display: 'block'}}
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setShowProfileMenu(false)}
                      className="w-full text-left px-4 py-2.5 font-medium text-sm transition-colors inline-block" 
                      style={{color: '#0B0B0B', background: '#FFFFFF', borderBottom: '1px solid #E0E0E0', textDecoration: 'none', display: 'block'}}
                    >
                      Sign Up
                    </Link>
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        setShowSellerOptions(true);
                      }}
                      className="w-full text-left px-4 py-2.5 font-medium text-sm transition-colors" 
                      style={{color: '#27AE60', background: '#FFFFFF'}}
                    >
                      Become a Seller
                    </button>
                  </div>
                )}
              </div>
            )}
            
            <button
              onClick={() => navigate('/cart')}
              className="cursor-pointer transition-colors duration-300 hover:opacity-70 w-4 h-4 flex items-center justify-center"
              title="Shopping Cart"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </button>
          </div>
        </div>
        </div>
      </div>

      {/* Seller Options Modal - Positioned near profile icon */}
      {showSellerOptions && (
        <>
          {/* Backdrop - blurs and darkens background */}
          <div 
            className="fixed inset-0 z-40 backdrop-blur-sm"
            onClick={() => setShowSellerOptions(false)}
            style={{background: 'rgba(0, 0, 0, 0.3)'}}
          />
          
          {/* Dropdown Menu - appears near profile icon */}
          <div className="fixed top-24 right-8 w-80 rounded-2xl shadow-2xl z-50" style={{background: '#FFFFFF', border: '1px solid #E0E0E0'}}>
            <div className="text-white p-6 relative rounded-t-2xl" style={{background: 'linear-gradient(to right, #0B0B0B, #1a1a1a, #0B0B0B)', borderBottom: '1px solid rgba(255, 255, 255, 0.2)'}}>
              <h2 className="text-2xl font-bold text-center">Become a Seller</h2>
              <button
                onClick={() => setShowSellerOptions(false)}
                className="absolute top-3 right-4 text-white text-2xl hover:opacity-60 transition-opacity cursor-pointer"
                title="Close"
              >
                ✕
              </button>
            </div>

            <div className="p-8">
              <p className="text-sm mb-8 text-center font-medium" style={{color: '#0B0B0B'}}>
                Join our seller community and start selling your products! Choose an option below:
              </p>

              <div className="space-y-3">
                <Link
                  to="/seller-login"
                  onClick={() => setShowSellerOptions(false)}
                  className="w-full text-white py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:opacity-90 text-center" 
                  style={{background: 'linear-gradient(to right, #C9A227, #A67C1B)', textDecoration: 'none', display: 'block'}}
                >
                  Seller Login
                </Link>
                <Link
                  to="/seller-register"
                  onClick={() => setShowSellerOptions(false)}
                  className="w-full text-white py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:opacity-90 text-center" 
                  style={{background: 'linear-gradient(to right, #1a1a1a, #2a2a2a)', textDecoration: 'none', display: 'block'}}
                >
                  Send Registration Request
                </Link>
              </div>

              <div className="mt-8 p-4 bg-gray-100 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-800 font-medium">
                  <strong>ℹ️ Note:</strong> Fill out the seller registration form and wait for admin approval to start selling.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
