import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import image1 from "../../assets/image1.jpg";
import image2 from "../../assets/image2.jpg";

const categories = [
  "Jackets","Men","Kids","Dresses","Tops","Sweaters",
  "Hoodies","Shirts"
];

const productNames = [
  'Casual Denim Jacket', 'Floral Summer Dress', 'Classic White Shirt', 'Black Leather Jacket',
  'Vintage Sweater', 'Cotton T-Shirt', 'Evening Gown', 'Casual Blazer',
  'Yoga Pants', 'Silk Blouse', 'Denim Jeans', 'Striped Dress',
  'Hoodie Sweatshirt', 'Long Sleeve Tee', 'Cardigan', 'Linen Pants',
  'Polka Dot Dress', 'Bomber Jacket', 'Tank Top', 'Wide Leg Pants'
];

const products = new Array(100).fill(null).map((_, i) => ({
  id: i,
  name: productNames[i % productNames.length] + ` #${Math.ceil((i + 1) / 20)}`,
  category: categories[i % categories.length],
  price: Math.floor(Math.random() * (150 - 20 + 1)) + 20
}));

export function HomeContent({ onLoginClick, isBlurred = false }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [hoveredProductId, setHoveredProductId] = useState(null);
  const navigate = useNavigate();
  const profileMenuRef = useRef(null);
  
  const heroBannerImages = [image1, image2];
  
  const productsPerPage = 15;
  const totalProducts = 100; // Total number of products available
  const totalPages = Math.ceil(totalProducts / productsPerPage);

  useEffect(() => {
    // Check if user is logged in by checking for accessToken
    const token = localStorage.getItem('accessToken');
    setIsLoggedIn(!!token);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto-rotate hero banner images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroBannerImages.length);
    }, 5500); // Change image every 5.5 seconds
    
    return () => clearInterval(interval);
  }, [heroBannerImages.length]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setShowProfileMenu(false);
    navigate('/');
  };

  const handleProfile = () => {
    setShowProfileMenu(false);
    navigate('/profile');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const query = searchQuery.toLowerCase().trim();
    
    if (query === '') {
      setFilteredProducts(products);
    } else {
      const results = products.filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.price.toString().includes(query)
      );
      setFilteredProducts(results);
    }
    setCurrentPage(1);
  };

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
      cart.push({
        ...product,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=200&h=200&fit=crop'
      });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Product added to cart!');
  };

  return (
    <div className="w-full mx-auto" style={{ background: '#ffffff' }}>
      <style>{`
        @keyframes scaleDown {
          0% { transform: scale(1.1); opacity: 0.9; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes marqueeLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .hero-banner-animated { animation: scaleDown 1.5s ease-out forwards; }
        .brands-marquee { animation: marqueeLeft 25s linear infinite; will-change: transform; }
        .brands-marquee:hover { animation-play-state: paused; }
        .brand-item { transition: all 0.3s ease; }
        .brand-item:hover { transform: scale(1.1); color: #C9A227; }
        .group .banner-text { transition: color 0.3s ease; }
        .group:hover .banner-text { color: #C9A227 !important; }
        .group:hover .banner-text h3, .group:hover .banner-text p { color: #C9A227 !important; }
      `}</style>
      <Navbar showFitOn={true} isDarkBg={false} />

      {/* Blurred Content Area */}
      <div className={isBlurred ? 'blur-sm pointer-events-none' : ''}>

        {/* Hero Banner - Image Carousel */}
        <div className="w-full relative overflow-hidden flex items-center justify-center transition-all duration-1000 hero-banner-animated" key={currentImageIndex} style={{backgroundImage: `url(${heroBannerImages[currentImageIndex]})`, backgroundSize: 'cover', backgroundPosition: 'center', height: '100vh'}}>
          <div className="absolute inset-0" style={{background: 'linear-gradient(135deg, rgba(11, 11, 11, 0.3) 0%, rgba(26, 26, 26, 0.3) 100%)'}}></div>

          {/* Carousel Indicators */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
            {heroBannerImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentImageIndex ? 'bg-yellow-400 w-8' : 'bg-white/50 hover:bg-white/75'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Featured Collections Banners - Enhanced */}
        <div className="px-8 py-16">
          <div className="mb-12">
            <h2 className="text-4xl font-black text-center mb-3" style={{color: '#0B0B0B'}}>Trending Collections</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'New Arrivals', subtitle: 'Fresh & Fashion Forward', image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=500&h=400&fit=crop', count: '200+ Items' },
              { title: 'Best Sellers', subtitle: 'Customer Favorites', image: 'https://images.unsplash.com/photo-1595959911670-2757e42f7f90?w=500&h=250&fit=crop', count: '150+ Items' },
              { title: 'Exclusive Sale', subtitle: 'Up to 60% OFF', image: 'https://images.unsplash.com/photo-1494756481156-3dfc6a3f2b71?w=500&h=250&fit=crop', count: '300+ Items' }
            ].map((banner, i) => (
              <div key={i} className={`group relative overflow-hidden rounded-2xl cursor-pointer transform transition-all duration-300 hover:scale-105 h-48 shadow-lg ${i === 0 ? 'md:col-span-1' : ''}`}>
                {i === 0 ? (
                  // First box - Text on left, Image on right
                  <div className="flex h-full" onMouseEnter={(e) => {
                    const leftSide = e.currentTarget.querySelector('[data-left-side]');
                    if (leftSide) {
                      leftSide.style.background = '#0B0B0B';
                      leftSide.querySelectorAll('p, h3').forEach(el => {
                        el.style.color = '#C9A227';
                      });
                      const btn = leftSide.querySelector('button');
                      if (btn) btn.style.opacity = '1';
                    }
                  }} onMouseLeave={(e) => {
                    const leftSide = e.currentTarget.querySelector('[data-left-side]');
                    if (leftSide) {
                      leftSide.style.background = 'rgba(201, 162, 39, 0.9)';
                      leftSide.querySelectorAll('p, h3').forEach(el => {
                        el.style.color = '#0B0B0B';
                      });
                      const btn = leftSide.querySelector('button');
                      if (btn) btn.style.opacity = '0';
                    }
                  }}>
                    {/* Left side - Text */}
                    <div data-left-side className="w-1/2 relative flex flex-col justify-between p-6 transition-all duration-300 cursor-pointer" style={{background: 'rgba(201, 162, 39, 0.9)'}}>
                      <div>
                        <p className="text-sm font-semibold tracking-wider transition-colors duration-300" style={{color: '#0B0B0B'}}>{banner.count}</p>
                        <h3 className="text-2xl font-black mt-2 transition-colors duration-300" style={{color: '#0B0B0B'}}>{banner.title}</h3>
                        <p className="text-xs mt-1 font-semibold transition-colors duration-300" style={{color: '#0B0B0B'}}>{banner.subtitle}</p>
                      </div>
                      <button className="self-start px-4 py-2 rounded-lg font-bold text-sm transition-all" style={{background: '#0B0B0B', color: '#C9A227', opacity: 0}}>
                        Explore →
                      </button>
                    </div>
                    {/* Right side - Image */}
                    <div className="w-1/2" style={{backgroundImage: `url(${banner.image})`, backgroundSize: 'cover', backgroundPosition: 'center'}}></div>
                  </div>
                ) : (
                  // Other boxes - Full background image with overlay
                  <>
                    <div style={{backgroundImage: `url(${banner.image})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'absolute', inset: 0}}></div>
                    <div className="absolute inset-0 transition-all duration-300 group-hover:opacity-0" style={{background: 'rgba(201, 162, 39, 0.85)'}}></div>
                    <div className="absolute inset-0 transition-all duration-300 opacity-0 group-hover:opacity-100" style={{background: 'rgba(11, 11, 11, 0.85)'}}></div>
                    <div className="banner-text relative z-10 h-full flex flex-col justify-between p-8 transition-colors duration-300" style={{color: '#0B0B0B', fontWeight: 'bold'}}>
                      <div>
                        <p className="text-sm font-semibold tracking-wider">{banner.count}</p>
                        <h3 className="text-3xl font-black mt-2">{banner.title}</h3>
                        <p className="text-sm mt-1 font-semibold">{banner.subtitle}</p>
                      </div>
                      <button className="self-start px-6 py-2 rounded-lg font-bold text-sm transition-all opacity-0 group-hover:opacity-100" style={{background: '#C9A227', color: '#0B0B0B'}}>
                        Explore →
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

      {/* Filters Section - Enhanced */}
      <div className="px-8 py-8 border-t" style={{borderColor: '#E8E8E8', background: '#FFFFFF'}}>
          <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative flex items-center flex-1" style={{minWidth: '200px'}}>
              <svg className="absolute left-3 w-5 h-5 pointer-events-none" style={{color: '#0B0B0B'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                className="border-2 rounded-lg pl-10 pr-12 py-3 text-sm w-full font-semibold focus:outline-none transition-all"
                placeholder="Search products..."
                value={searchQuery}
                onChange={handleSearchInputChange}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
                style={{borderColor: '#D0D0D0', color: '#0B0B0B'}}
                onFocus={(e) => {e.target.style.borderColor = '#C9A227'; e.target.style.boxShadow = '0 0 0 2px rgba(201, 162, 39, 0.1)';}}
                onBlur={(e) => {e.target.style.borderColor = '#D0D0D0'; e.target.style.boxShadow = 'none';}}
              />
              <button
                onClick={handleSearch}
                className="absolute right-2 px-3 py-2 rounded-lg transition-all hover:opacity-70 text-xs font-semibold"
                style={{background: '#C9A227', color: '#0B0B0B'}}
                title="Search"
              >
                Search
              </button>
            </div>

            <select className="border-2 rounded-lg px-5 py-3 text-sm font-semibold bg-white hover:border-yellow-400 transition-all focus:outline-none" style={{borderColor: '#D0D0D0', color: '#0B0B0B'}} onFocus={(e) => {e.target.style.borderColor = '#C9A227'; e.target.style.boxShadow = '0 0 0 2px rgba(201, 162, 39, 0.1)';}} onBlur={(e) => {e.target.style.borderColor = '#D0D0D0'; e.target.style.boxShadow = 'none';}}>
              <option>All Categories</option>
              <option>Dresses</option>
              <option>Tops</option>
              <option>Bottoms</option>
            </select>

            <select className="border-2 rounded-lg px-5 py-3 text-sm font-semibold bg-white hover:border-yellow-400 transition-all focus:outline-none" style={{borderColor: '#D0D0D0', color: '#0B0B0B'}} onFocus={(e) => {e.target.style.borderColor = '#C9A227'; e.target.style.boxShadow = '0 0 0 2px rgba(201, 162, 39, 0.1)';}} onBlur={(e) => {e.target.style.borderColor = '#D0D0D0'; e.target.style.boxShadow = 'none';}}>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>

            <select className="border-2 rounded-lg px-5 py-3 text-sm font-semibold bg-white hover:border-yellow-400 transition-all focus:outline-none" style={{borderColor: '#D0D0D0', color: '#0B0B0B'}} onFocus={(e) => {e.target.style.borderColor = '#C9A227'; e.target.style.boxShadow = '0 0 0 2px rgba(201, 162, 39, 0.1)';}} onBlur={(e) => {e.target.style.borderColor = '#D0D0D0'; e.target.style.boxShadow = 'none';}}>
              <option>Sort By: Featured</option>
              <option>Newest</option>
              <option>Most Popular</option>
              <option>Top Rated</option>
            </select>
          </div>
          </div>
       
      </div>

        {/* Product Grid - Enhanced */}
        <div className=" py-16" style={{background: '#FFFFFF'}}>
        <div className="max-w-7xl mx-auto">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-xl font-bold" style={{color: '#0B0B0B'}}>No products found</h3>
            <p className="text-sm mt-2" style={{color: '#666'}}>Try adjusting your search terms</p>
          </div>
        ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-12">

          {filteredProducts.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage).map((product, i) => {
            const productImages = [
              'https://images.unsplash.com/photo-1567450489212-d37b5ba1b639?w=300&h=300&fit=crop',
              'https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=300&fit=crop',
              'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=300&h=300&fit=crop',
              'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=300&h=300&fit=crop',
              'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop',
            ];

            const isHovered = hoveredProductId === i;
            const currentImage = isHovered ? productImages[(i + 1) % productImages.length] : productImages[i % productImages.length];

            return (
            <div key={i} className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
              onMouseEnter={() => setHoveredProductId(i)}
              onMouseLeave={() => setHoveredProductId(null)}>
              <div className="relative h-64 rounded-xl mb-4 transition overflow-hidden shadow-md hover:shadow-2xl" style={{background: `url(${currentImage}})`, backgroundSize: 'cover', backgroundPosition: 'center'}}>
                {i % 3 === 0 && (
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold text-white z-10" style={{background: '#D4423D'}}>
                    SALE
                  </div>
                )}
              </div>
              <h3 className="text-sm font-bold group-hover:text-yellow-500 transition" style={{color: '#0B0B0B'}}>
                {product.name}
              </h3>
              <p className="text-xs mt-2" style={{color: '#808080'}}>{product.category}</p>
              <p className="text-lg font-black mt-2" style={{color: '#0B0B0B'}}>${product.price.toFixed(2)}</p>
              <button 
                onClick={() => addToCart(product)}
                className="w-full text-white py-2 rounded-lg text-sm font-bold transition-all hover:opacity-90 mt-3" 
                style={{background: '#C9A227', color: '#0B0B0B'}}
              >
                Add to Cart
              </button>
            </div>
            );
          })}

        </div>
        )}
        </div>
        </div>

        {/* View All Products Arrow */}
        {filteredProducts.length > 0 && (
        <div className="px-8 py-8 -mt-20 ml-28" style={{background: '#FFFFFF'}}>
          <div className="max-w-6xl mx-auto flex items-center justify-end">
            <button
              onClick={() => navigate('/products')}
              className="flex items-center justify-center w-12 h-12 rounded-full border-2 transition hover:bg-yellow-100"
              style={{borderColor: '#D0D0D0', color: '#0B0B0B'}}
              title="View all products"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
        )}

      </div>

      {/* Footer - Enhanced */}
      <footer style={{background: '#0B0B0B'}}>
        <div className="px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-10 max-w-6xl mx-auto mb-12">
            {/* Brand Section */}
            <div>
              <h3 className="text-2xl font-black mb-4" style={{color: '#C9A227'}}>SFS</h3>
              <p className="text-sm text-gray-400 mb-6 leading-relaxed">Elevating fashion with AI-powered style recommendations for the modern you.</p>
              <div className="flex gap-4">
                <button className="w-10 h-10 rounded-full flex items-center justify-center hover:scale-110 transition" style={{background: '#C9A227', color: '#0B0B0B'}}>
                  📱
                </button>
                <button className="w-10 h-10 rounded-full flex items-center justify-center hover:scale-110 transition" style={{background: '#C9A227', color: '#0B0B0B'}}>
                  📷
                </button>
                <button className="w-10 h-10 rounded-full flex items-center justify-center hover:scale-110 transition" style={{background: '#C9A227', color: '#0B0B0B'}}>
                  𝕏
                </button>
              </div>
            </div>
            
            {/* Shop */}
            <div>
              <h4 className="font-bold mb-4 text-white">Shop</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><Link to="/products" className="hover:text-yellow-400 transition font-medium" style={{color: 'inherit'}}>All Products</Link></li>
                <li><a href="#" className="hover:text-yellow-400 transition font-medium">Best Sellers</a></li>
                <li><a href="#" className="hover:text-yellow-400 transition font-medium">Sale Items</a></li>
                <li><a href="#" className="hover:text-yellow-400 transition font-medium">Gift Cards</a></li>
              </ul>
            </div>

            {/* Help */}
            <div>
              <h4 className="font-bold mb-4 text-white">Help</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><Link to="/contact" className="hover:text-yellow-400 transition font-medium" style={{color: 'inherit'}}>Contact Us</Link></li>
                <li><a href="#" className="hover:text-yellow-400 transition font-medium">FAQs</a></li>
                <li><a href="#" className="hover:text-yellow-400 transition font-medium">Shipping Info</a></li>
                <li><a href="#" className="hover:text-yellow-400 transition font-medium">Returns</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-bold mb-4 text-white">Company</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><Link to="/about" className="hover:text-yellow-400 transition font-medium" style={{color: 'inherit'}}>About Us</Link></li>
                <li><a href="#" className="hover:text-yellow-400 transition font-medium">Careers</a></li>
                <li><a href="#" className="hover:text-yellow-400 transition font-medium">Blog</a></li>
                <li><a href="#" className="hover:text-yellow-400 transition font-medium">Press</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-bold mb-4 text-white">Legal</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><a href="#" className="hover:text-yellow-400 transition font-medium">Privacy</a></li>
                <li><a href="#" className="hover:text-yellow-400 transition font-medium">Terms</a></li>
                <li><a href="#" className="hover:text-yellow-400 transition font-medium">Cookies</a></li>
                <li><a href="#" className="hover:text-yellow-400 transition font-medium">Accessibility</a></li>
              </ul>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="max-w-6xl mx-auto mb-12 pb-12 border-t" style={{borderColor: '#2A2A2A'}}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 text-center">
              <div>
                <p className="text-2xl mb-2">🚚</p>
                <p className="text-sm font-semibold text-white">Free Shipping</p>
                <p className="text-xs text-gray-500">On orders over $100</p>
              </div>
              <div>
                <p className="text-2xl mb-2">↩️</p>
                <p className="text-sm font-semibold text-white">Easy Returns</p>
                <p className="text-xs text-gray-500">30-day guarantee</p>
              </div>
              <div>
                <p className="text-2xl mb-2">🔒</p>
                <p className="text-sm font-semibold text-white">Secure Checkout</p>
                <p className="text-xs text-gray-500">SSL encrypted</p>
              </div>
              <div>
                <p className="text-2xl mb-2">💬</p>
                <p className="text-sm font-semibold text-white">24/7 Support</p>
                <p className="text-xs text-gray-500">Chat with us</p>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="px-8 py-6 border-t text-center text-sm" style={{borderColor: '#2A2A2A', color: '#808080'}}>
          <p>© 2026 Smart Fashion Styling. All rights reserved. Crafted with ❤️ for fashion lovers.</p>
        </div>
      </footer>

    </div>
  );
}

export default function FashionHome() {

  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-white">
      <HomeContent onLoginClick={handleLoginClick} />
    </div>
  );
}