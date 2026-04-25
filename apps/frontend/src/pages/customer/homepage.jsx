import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import image1 from "../../assets/image1.jpg";
import image2 from "../../assets/image2.jpg";
import image3 from "../../assets/image3.jpg";
import i2 from "../../assets/i2.jpg";
import image16 from "../../assets/16.jpg";
import logo2 from "../../assets/logo2.jpeg";
import logo from "../../assets/logo.png";
import logoAlt from "../../assets/logo.jpeg";
import g1 from "../../assets/g1.jpg";
import g2 from "../../assets/g2.jpg";
import g3 from "../../assets/g3.jpg";
import g4 from "../../assets/g4.png";
import g5 from "../../assets/g5.png";
import m1 from "../../assets/m1.png";
import m2 from "../../assets/m2.png";
import m3 from "../../assets/m3.png";

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
  
  const heroBannerImages = [image1, image2, image3];
  
  const bannerContent = [
    {
      image: image1,
    
    },
    {
      image: image2,
      title: "SUMMER CLARITY",
      subtitle: "Light • Fresh • Radiant",
      description: "Embrace the season with our latest collection",
      position: "right", // Text on right
      textColor: "#FFFFFF",
      accentColor: "#FFD700"
    },
    {
      image: image3,
      title: "AVANT-GARDE",
      subtitle: "Where Fashion Meets Art",
      description: "Exclusive pieces for the trendsetter",
      position: "left", // Text centered creatively
      textColor: "#FFFFFF",
      accentColor: "#C9A227"
    }
  ];
  
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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
        @keyframes slideInLeft {
          0% { transform: translateX(-50px); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideInRight {
          0% { transform: translateX(50px); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        @keyframes fadeInUp {
          0% { transform: translateY(30px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        .hero-banner-animated { animation: scaleDown 1.5s ease-out forwards; }
        .banner-title {
          font-family: 'Playfair Display', 'Garamond', serif;
          font-weight: 900;
          letter-spacing: 3px;
          animation: slideInLeft 1s ease-out forwards;
        }
        .banner-subtitle {
          font-family: 'Montserrat', sans-serif;
          font-weight: 300;
          letter-spacing: 2px;
          margin-top: 12px;
          animation: slideInLeft 1s ease-out 0.2s forwards;
          opacity: 0;
        }
        .banner-description {
          font-family: 'Lato', sans-serif;
          font-weight: 400;
          letter-spacing: 1px;
          margin-top: 16px;
          animation: slideInLeft 1s ease-out 0.4s forwards;
          opacity: 0;
        }
        .banner-cta {
          display: inline-block;
          margin-top: 24px;
          padding: 14px 32px;
          font-family: 'Montserrat', sans-serif;
          font-weight: 600;
          letter-spacing: 2px;
          border: 2px solid;
          transition: all 0.4s ease;
          cursor: pointer;
          animation: slideInLeft 1s ease-out 0.6s forwards;
          opacity: 0;
        }
        .banner-cta:hover {
          transform: translateX(8px);
        }
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
        <div className="w-full relative overflow-hidden flex items-center justify-center transition-all duration-1000 hero-banner-animated" key={currentImageIndex} style={{backgroundImage: `url(${heroBannerImages[currentImageIndex]})`, backgroundSize: 'cover', backgroundPosition: 'center', height: '90vh'}}>
          
          {/* Text Overlay - Dynamic Positioning */}
          <div
            className="absolute inset-0 flex items-center"
            style={{
              backgroundImage:
                currentImageIndex === 0
                  ? "none"
                  : "linear-gradient(90deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0) 50%)"
            }}
          >
            {bannerContent[currentImageIndex].position === "left" && (
              <div className="w-1/2 pl-16 z-10 pt-32">
                <h1 className="banner-title" style={{fontSize: '64px', color: bannerContent[currentImageIndex].textColor}}>
                  {bannerContent[currentImageIndex].title}
                </h1>
                <div 
                  className="banner-subtitle" 
                  style={{color: bannerContent[currentImageIndex].accentColor, fontSize: '18px'}}
                >
                  {bannerContent[currentImageIndex].subtitle}
                </div>
                <p 
                  className="banner-description" 
                  style={{color: bannerContent[currentImageIndex].textColor, fontSize: '14px', maxWidth: '300px'}}
                >
                  {bannerContent[currentImageIndex].description}
                </p>
                <button
                  className="banner-cta"
                  style={{
                    color: bannerContent[currentImageIndex].textColor,
                    borderColor: bannerContent[currentImageIndex].accentColor,
                    backgroundColor: 'transparent'
                  }}
                >
                  EXPLORE NOW →
                </button>
              </div>
            )}
            
            {bannerContent[currentImageIndex].position === "right" && (
              <div className="w-1/2 ml-auto pr-16 z-10 text-right">
                <h1 className="banner-title" style={{fontSize: '64px', color: bannerContent[currentImageIndex].textColor, animation: 'slideInRight 1s ease-out forwards'}}>
                  {bannerContent[currentImageIndex].title}
                </h1>
                <div 
                  className="banner-subtitle" 
                  style={{color: bannerContent[currentImageIndex].accentColor, fontSize: '18px', justifyContent: 'flex-end', display: 'flex', animation: 'slideInRight 1s ease-out 0.2s forwards', opacity: 0}}
                >
                  {bannerContent[currentImageIndex].subtitle}
                </div>
                <p 
                  className="banner-description" 
                  style={{color: bannerContent[currentImageIndex].textColor, fontSize: '14px', maxWidth: '300px', marginLeft: 'auto', animation: 'slideInRight 1s ease-out 0.4s forwards', opacity: 0}}
                >
                  {bannerContent[currentImageIndex].description}
                </p>
                <button
                  className="banner-cta"
                  style={{
                    color: bannerContent[currentImageIndex].textColor,
                    borderColor: bannerContent[currentImageIndex].accentColor,
                    backgroundColor: 'transparent',
                    animation: 'slideInRight 1s ease-out 0.6s forwards',
                    opacity: 0
                  }}
                >
                  ← EXPLORE NOW
                </button>
              </div>
            )}
            
            {bannerContent[currentImageIndex].position === "center" && (
              <div
                className="w-full h-full flex flex-col items-center justify-center z-10"
                style={{
                  backgroundImage:
                    currentImageIndex === 0
                      ? "none"
                      : "linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.4) 100%)"
                }}
              >
                <h1 className="banner-title text-center" style={{fontSize: '72px', color: bannerContent[currentImageIndex].textColor, maxWidth: '800px'}}>
                  {bannerContent[currentImageIndex].title}
                </h1>
                <div 
                  className="banner-subtitle text-center" 
                  style={{color: bannerContent[currentImageIndex].accentColor, fontSize: '22px'}}
                >
                  {bannerContent[currentImageIndex].subtitle}
                </div>
                <p 
                  className="banner-description text-center" 
                  style={{color: bannerContent[currentImageIndex].textColor, fontSize: '15px', maxWidth: '400px'}}
                >
                  {bannerContent[currentImageIndex].description}
                </p>
                <button
                  className="banner-cta"
                  style={{
                    color: bannerContent[currentImageIndex].textColor,
                    borderColor: bannerContent[currentImageIndex].accentColor,
                    backgroundColor: 'transparent'
                  }}
                >
                  DISCOVER COLLECTION
                </button>
              </div>
            )}
          </div>

          {/* Centered STYLE HUB Text - Only on image1 */}
          {currentImageIndex === 0 && (
            <div
              className="absolute left-1/2 transform -translate-x-1/2 z-10"
              style={{
                bottom: '120px',
                fontFamily: "'Great Vibes', cursive",
                fontSize: '60px',
                fontWeight: 'light',
                color: '#FFD700',
                letterSpacing: '4px',
                textShadow: '2px 2px 8px rgba(0,0,0,0.3)',
                animation: 'fadeInUp 1.2s ease-out 0.8s forwards',
                opacity: 0
              }}
            >
              STYLE HUB
            </div>
          )}

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
              { title: 'New Arrivals', subtitle: 'Fresh & Fashion Forward', image: image1, count: '200+ Items' },
              { title: 'Best Sellers', subtitle: 'Customer Favorites', image: i2, count: '150+ Items' },
              { title: 'Exclusive Sale', subtitle: 'Up to 60% OFF', image: image16, count: '300+ Items' }
            ].map((banner, i) => (
              <div key={i} className={`group relative overflow-hidden rounded-2xl cursor-pointer transform transition-all duration-300 hover:scale-105 h-48 shadow-lg ${i === 0 ? 'md:col-span-1' : ''}`}>
                {/* All boxes - Text on left, Image on right */}
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
          <>
            <style>{`
              @keyframes shimmer {
                0% { background-position: -1000px 0; }
                100% { background-position: 1000px 0; }
              }
              @keyframes float {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-8px); }
              }
              @keyframes fadeInUp {
                0% { opacity: 0; transform: translateY(20px); }
                100% { opacity: 1; transform: translateY(0); }
              }
              @keyframes glow {
                0%, 100% { box-shadow: 0 0 20px rgba(201, 162, 39, 0.1); }
                50% { box-shadow: 0 0 30px rgba(201, 162, 39, 0.3); }
              }
              @keyframes floatUpDown {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-8px); }
              }
              @keyframes goSideways {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); }
              }
              .product-card {
                animation: fadeInUp 0.6s ease-out forwards;
                opacity: 0;
                backdrop-filter: blur(10px);
                background: rgba(255, 255, 255, 0.7);
                border: 1px solid rgba(201, 162, 39, 0.1);
                border-radius: 16px;
                transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
                position: relative;
                overflow: hidden;
              }
              .product-card:nth-child(1) { animation-delay: 0.1s; }
              .product-card:nth-child(2) { animation-delay: 0.15s; }
              .product-card:nth-child(3) { animation-delay: 0.2s; }
              .product-card:nth-child(4) { animation-delay: 0.25s; }
              .product-card:nth-child(5) { animation-delay: 0.3s; }
              .product-card:nth-child(n+6) { animation-delay: 0.35s; }
              .product-card::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
                transition: left 0.5s;
                z-index: 1;
              }
              .product-card:hover::before {
                left: 100%;
              }
              .product-card:hover {
                transform: translateY(-12px) scale(1.02);
                background: rgba(255, 255, 255, 0.85);
                border-color: rgba(201, 162, 39, 0.3);
                box-shadow: 0 20px 40px rgba(201, 162, 39, 0.2), 0 0 40px rgba(201, 162, 39, 0.15);
              }
              .product-image-wrapper {
                position: relative;
                height: 280px;
                border-radius: 12px;
                overflow: hidden;
                margin-bottom: 16px;
                background: linear-gradient(135deg, #f0e8dc 0%, #ede5db 100%);
                transition: all 0.4s ease;
              }
              .product-image-wrapper::after {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(135deg, rgba(201,162,39,0) 0%, rgba(201,162,39,0.1) 100%);
                pointer-events: none;
                z-index: 2;
              }
              .product-card:hover .product-image-wrapper {
                box-shadow: 0 12px 24px rgba(201, 162, 39, 0.25);
              }
              .product-badge {
                position: absolute;
                top: 12px;
                right: 12px;
                padding: 6px 12px;
                border-radius: 8px;
                font-size: 10px;
                font-weight: 700;
                letter-spacing: 1px;
                background: linear-gradient(135deg, #D4423D 0%, #E8544D 100%);
                color: white;
                z-index: 3;
                box-shadow: 0 4px 12px rgba(212, 66, 61, 0.25);
                animation: pulse 2s infinite;
              }
              @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
              }
              .product-info {
                position: relative;
                z-index: 2;
              }
              .product-name {
                font-family: 'Sora', 'Manrope', sans-serif;
                font-size: 14px;
                font-weight: 600;
                color: #0B0B0B;
                letter-spacing: 0.1px;
                line-height: 1.4;
                transition: color 0.3s ease;
              }
              .product-card:hover .product-name {
                color: #C9A227;
              }
              .product-category {
                font-family: 'Manrope', sans-serif;
                font-size: 11px;
                color: #999;
                text-transform: uppercase;
                letter-spacing: 1.2px;
                margin-top: 8px;
              }
              .product-price {
                font-family: 'Sora', 'Manrope', sans-serif;
                font-size: 18px;
                font-weight: 700;
                color: #0B0B0B;
                margin-top: 12px;
                letter-spacing: -0.3px;
              }
              .product-price::before {
                content: '$ ';
                font-size: 13px;
              }
              .add-to-cart-btn {
                width: 100%;
                padding: 12px 14px;
                border: 1px solid rgba(11, 11, 11, 0.08);
                border-radius: 12px;
                margin-top: 14px;
                font-family: 'Manrope', sans-serif;
                font-size: 12px;
                font-weight: 700;
                letter-spacing: 0.9px;
                cursor: pointer;
                transition: all 0.24s ease;
                background: linear-gradient(135deg, #111111 0%, #2A2A2A 100%);
                color: #F5F1E8;
                text-transform: uppercase;
                position: relative;
                overflow: hidden;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
              }
              .add-to-cart-btn::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(110deg, transparent 20%, rgba(255, 255, 255, 0.25) 45%, transparent 70%);
                transition: left 0.4s ease;
                z-index: 1;
              }
              .add-to-cart-btn:hover::before {
                left: 100%;
              }
              .add-to-cart-btn:hover {
                transform: translateY(-2px);
                border-color: rgba(201, 162, 39, 0.45);
                box-shadow: 0 8px 20px rgba(11, 11, 11, 0.25);
                background: linear-gradient(135deg, #1A1A1A 0%, #3A3A3A 100%);
              }
              .add-to-cart-btn:active {
                transform: translateY(0);
              }
              .add-to-cart-btn .btn-icon {
                font-size: 13px;
                line-height: 1;
                transition: transform 0.24s ease;
              }
              .add-to-cart-btn:hover .btn-icon {
                transform: translateX(2px);
              }
              .floating-top-btn {
                position: fixed;
                right: 24px;
                bottom: 28px;
                width: 54px;
                height: 54px;
                border-radius: 9999px;
                border: 1px solid rgba(201, 162, 39, 0.35);
                background: linear-gradient(135deg, rgba(11, 11, 11, 0.96) 0%, rgba(42, 42, 42, 0.96) 100%);
                color: #C9A227;
                box-shadow: 0 12px 26px rgba(0, 0, 0, 0.28);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 80;
                cursor: pointer;
                animation: floatUpDown 2.5s ease-in-out infinite;
              }
              .floating-top-btn:hover {
                transform: translateY(-3px) scale(1.05);
                box-shadow: 0 16px 32px rgba(201, 162, 39, 0.24);
              }
              .brand-strip {
                background: linear-gradient(90deg, rgba(201, 162, 39, 0.95) 0%, rgba(255, 255, 255, 0.95) 52%, rgba(201, 162, 39, 0.95) 100%);
                overflow: hidden;
                border-top: 1px solid rgba(201, 162, 39, 0.35);
                border-bottom: 1px solid rgba(201, 162, 39, 0.35);
              }
              .brand-strip-track {
                display: flex;
                width: max-content;
                animation: goSideways 24s linear infinite;
                will-change: transform;
                gap: 0;
              }
              .brand-strip:hover .brand-strip-track {
                animation-play-state: paused;
              }
              .brand-chip {
                width: 170px;
                flex: 0 0 170px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 18px 22px;
                gap: 8px;
                flex-shrink: 0;
              }
              .brand-circle {
                width: 66px;
                height: 66px;
                border-radius: 9999px;
                padding: 4px;
                background: rgba(255, 255, 255, 0.85);
                box-shadow: 0 8px 18px rgba(11, 11, 11, 0.12);
                display: flex;
                align-items: center;
                justify-content: center;
                overflow: hidden;
                border: 1px solid rgba(11, 11, 11, 0.08);
              }
              .brand-circle img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                border-radius: 9999px;
              }
              .brand-name {
                font-family: 'Sora', 'Manrope', sans-serif;
                font-size: 12px;
                font-weight: 700;
                letter-spacing: 1.8px;
                text-transform: uppercase;
                color: #000000;
                white-space: nowrap;
              }
              .brand-subtext {
                font-family: 'Manrope', sans-serif;
                font-size: 10px;
                letter-spacing: 1.2px;
                text-transform: uppercase;
                color: rgba(0, 0, 0, 0.72);
                white-space: nowrap;
              }
              .brand-strip-header {
                text-align: center;
                margin-bottom: 14px;
              }
              .brand-strip-heading {
                font-family: 'Sora', 'Manrope', sans-serif;
                font-size: 14px;
                font-weight: 800;
                letter-spacing: 4px;
                text-transform: uppercase;
                color: #000000;
              }
              .brand-strip-caption {
                font-family: 'Manrope', sans-serif;
                font-size: 11px;
                letter-spacing: 2px;
                text-transform: uppercase;
                color: rgba(0, 0, 0, 0.7);
                margin-top: 4px;
              }
            `}</style>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-12">
              {filteredProducts.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage).map((product, i) => {
                const productImages = [g1, g2, g3, g4, g5, m1, m2, m3];
                const currentImage = productImages[i % productImages.length];

                return (
                  <div 
                    key={i} 
                    className="product-card"
                    onMouseEnter={() => setHoveredProductId(i)}
                    onMouseLeave={() => setHoveredProductId(null)}
                  >
                    <div 
                      className="product-image-wrapper"
                      style={{
                        backgroundImage: `url(${currentImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                    >
                      {i % 3 === 0 && (
                        <div className="product-badge">SALE</div>
                      )}
                    </div>

                    <div className="product-info px-4 pb-4">
                      <h3 className="product-name">
                        {product.name}
                      </h3>
                      <p className="product-category">{product.category}</p>
                      <p className="product-price">{product.price.toFixed(2)}</p>
                      <button 
                        onClick={() => addToCart(product)}
                        className="add-to-cart-btn"
                      >
                        <span className="btn-label">Add to Cart</span>
                        <span className="btn-icon">+</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
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

        {/* Brand Strip */}
        <div className="brand-strip-header">
          <div className="brand-strip-heading">Common Brands</div>
          <div className="brand-strip-caption">Trusted style labels</div>
        </div>
        <div className="brand-strip py-6 mb-10">
          <div className="brand-strip-track">
            {[
              { name: 'Style Hub', image: logo2, text: 'Luxury' },
              { name: 'Fashion Lane', image: logo, text: 'Modern' },
              { name: 'Urban Edit', image: logoAlt, text: 'Premium' },
              { name: 'Gold Thread', image: logo2, text: 'Global' },
              { name: 'Avenue 9', image: logo, text: 'Curated' },
              { name: 'Nova Wear', image: logoAlt, text: 'Signature' },
            ].concat([
              { name: 'Style Hub', image: logo2, text: 'Luxury' },
              { name: 'Fashion Lane', image: logo, text: 'Modern' },
              { name: 'Urban Edit', image: logoAlt, text: 'Premium' },
              { name: 'Gold Thread', image: logo2, text: 'Global' },
              { name: 'Avenue 9', image: logo, text: 'Curated' },
              { name: 'Nova Wear', image: logoAlt, text: 'Signature' },
            ]).map((brand, index) => (
              <div key={index} className="brand-chip">
                <div className="brand-name">{brand.name}</div>
                <div className="brand-circle">
                  <img src={brand.image} alt={brand.name} />
                </div>
                <div className="brand-subtext">{brand.text}</div>
              </div>
            ))}
          </div>
        </div>

      </div>

      <button
        type="button"
        className="floating-top-btn"
        onClick={scrollToTop}
        aria-label="Go to top"
        title="Go to top"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      </button>

      {/* Footer - Professional Global Design */}
      <footer style={{background: '#0B0B0B', overflow: 'hidden'}}>
        <style>{`
          .footer-gradient-accent {
            background: linear-gradient(135deg, #C9A227 0%, #D4B537 100%);
            border-radius: 2px;
          }
          .footer-link-hover:hover {
            color: #C9A227 !important;
            transform: translateX(4px);
            transition: all 0.3s ease;
          }
          .footer-section-title {
            position: relative;
            display: inline-block;
            padding-bottom: 12px;
          }
          .footer-section-title::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 40px;
            height: 2.5px;
            background: linear-gradient(90deg, #C9A227 0%, transparent 100%);
          }
          .payment-method {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 44px;
            height: 28px;
            border: 1px solid #2A2A2A;
            border-radius: 4px;
            background: rgba(255,255,255,0.03);
            font-size: 13px;
            font-weight: 600;
            color: #999;
            transition: all 0.3s ease;
          }
          .payment-method:hover {
            border-color: #C9A227;
            color: #C9A227;
            background: rgba(201, 162, 39, 0.1);
          }
          .footer-divider {
            height: 1px;
            background: linear-gradient(90deg, transparent, #2A2A2A 20%, #2A2A2A 80%, transparent);
          }
          .newsletter-input {
            background: rgba(255,255,255,0.05);
            border: 1px solid #2A2A2A;
            padding: 12px 16px;
            border-radius: 4px;
            color: white;
            font-size: 14px;
            transition: all 0.3s ease;
          }
          .newsletter-input:focus {
            outline: none;
            border-color: #C9A227;
            background: rgba(255,255,255,0.08);
          }
          .newsletter-input::placeholder {
            color: #666;
          }
          .newsletter-btn {
            background: linear-gradient(135deg, #C9A227 0%, #D4B537 100%);
            color: #0B0B0B;
            padding: 12px 24px;
            border-radius: 4px;
            border: none;
            font-weight: 600;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.3s ease;
          }
          .newsletter-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 16px rgba(201, 162, 39, 0.3);
          }
          .social-icon {
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            background: rgba(201, 162, 39, 0.1);
            color: #C9A227;
            cursor: pointer;
            transition: all 0.3s ease;
            border: 1px solid rgba(201, 162, 39, 0.2);
          }
          .social-icon:hover {
            background: #C9A227;
            color: #0B0B0B;
            transform: translateY(-4px);
          }
          .footer-tag {
            display: inline-block;
            background: rgba(201, 162, 39, 0.1);
            color: #C9A227;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: 600;
            margin-bottom: 4px;
          }
        `}</style>

        {/* Top Newsletter Section */}
        <div className="px-8 py-12 border-b" style={{borderColor: '#1A1A1A', background: 'rgba(201, 162, 39, 0.03)'}}>
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Join Our Community</h3>
                <p className="text-sm text-gray-400">Get exclusive access to latest collections, style tips, and members-only sales.</p>
              </div>
              <div className="flex gap-3">
                <input type="email" placeholder="Enter your email" className="newsletter-input flex-1" />
                <button className="newsletter-btn">Subscribe</button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="px-8 py-16">
          <div className="max-w-6xl mx-auto">
            {/* Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-16">
              {/* Brand Section */}
              <div className="md:col-span-1">
                <div className="mb-6">
                  <h3 className="text-2xl font-black mb-2" style={{color: '#C9A227'}}>STYLE HUB</h3>
                  <p className="text-xs text-gray-500 uppercase tracking-widest">Fashion Reimagined</p>
                </div>
                <p className="text-sm text-gray-400 mb-6 leading-relaxed">AI-powered styling for the global fashion enthusiast. Curated collections delivered worldwide.</p>
                
                {/* Social Links */}
                <div className="flex gap-3 mb-6">
                  <div className="social-icon">f</div>
                  <div className="social-icon">𝕏</div>
                  <div className="social-icon">📷</div>
                  <div className="social-icon">▶</div>
                </div>
              </div>

              {/* Shop */}
              <div>
                <h4 className="footer-section-title text-white font-bold mb-6">SHOP</h4>
                <ul className="space-y-3">
                  <li><Link to="/products" className="text-sm text-gray-400 footer-link-hover">All Collections</Link></li>
                  <li><a href="#" className="text-sm text-gray-400 footer-link-hover">New Arrivals</a></li>
                  <li><a href="#" className="text-sm text-gray-400 footer-link-hover">Bestsellers</a></li>
                  <li><a href="#" className="text-sm text-gray-400 footer-link-hover">Sale & Outlet</a></li>
                  <li><a href="#" className="text-sm text-gray-400 footer-link-hover">Gift Cards</a></li>
                </ul>
              </div>

              {/* Support */}
              <div>
                <h4 className="footer-section-title text-white font-bold mb-6">SUPPORT</h4>
                <ul className="space-y-3">
                  <li><Link to="/contact" className="text-sm text-gray-400 footer-link-hover">Contact Us</Link></li>
                  <li><a href="#" className="text-sm text-gray-400 footer-link-hover">Track Order</a></li>
                  <li><a href="#" className="text-sm text-gray-400 footer-link-hover">Returns & Exchanges</a></li>
                  <li><a href="#" className="text-sm text-gray-400 footer-link-hover">Shipping Info</a></li>
                  <li><a href="#" className="text-sm text-gray-400 footer-link-hover">Size Guide</a></li>
                </ul>
              </div>

              {/* Company */}
              <div>
                <h4 className="footer-section-title text-white font-bold mb-6">COMPANY</h4>
                <ul className="space-y-3">
                  <li><Link to="/about" className="text-sm text-gray-400 footer-link-hover">About Us</Link></li>
                  <li><a href="#" className="text-sm text-gray-400 footer-link-hover">Sustainability</a></li>
                  <li><a href="#" className="text-sm text-gray-400 footer-link-hover">Press & Media</a></li>
                  <li><a href="#" className="text-sm text-gray-400 footer-link-hover">Careers</a></li>
                  <li><a href="#" className="text-sm text-gray-400 footer-link-hover">Blog</a></li>
                </ul>
              </div>

              {/* Global */}
              <div>
                <h4 className="footer-section-title text-white font-bold mb-6">GLOBAL</h4>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Language</p>
                    <select className="w-full bg-transparent border border-gray-600 text-gray-300 text-sm px-3 py-2 rounded hover:border-gray-400 transition cursor-pointer">
                      <option>English</option>
                      <option>Español</option>
                      <option>Français</option>
                      <option>Deutsch</option>
                    </select>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Currency</p>
                    <select className="w-full bg-transparent border border-gray-600 text-gray-300 text-sm px-3 py-2 rounded hover:border-gray-400 transition cursor-pointer">
                      <option>USD ($)</option>
                      <option>EUR (€)</option>
                      <option>GBP (£)</option>
                      <option>CAD ($)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="footer-divider mb-12"></div>

            {/* Trust & Security Section */}
            <div className="mb-12">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="text-center">
                  <p className="text-2xl mb-3">🚚</p>
                  <p className="text-sm font-semibold text-white mb-1">Fast Shipping</p>
                  <p className="text-xs text-gray-500">Delivered worldwide</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl mb-3">🔒</p>
                  <p className="text-sm font-semibold text-white mb-1">Secure Payment</p>
                  <p className="text-xs text-gray-500">256-bit SSL encrypted</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl mb-3">↩️</p>
                  <p className="text-sm font-semibold text-white mb-1">Easy Returns</p>
                  <p className="text-xs text-gray-500">60-day policy</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl mb-3">⭐</p>
                  <p className="text-sm font-semibold text-white mb-1">Award Winning</p>
                  <p className="text-xs text-gray-500">Trusted by millions</p>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="footer-divider mb-12"></div>

            {/* Payment Methods & Certifications */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-6">Payment Methods</p>
                <div className="flex flex-wrap gap-3">
                  <div className="payment-method">Visa</div>
                  <div className="payment-method">MC</div>
                  <div className="payment-method">Amex</div>
                  <div className="payment-method">PayPal</div>
                  <div className="payment-method">Apple</div>
                  <div className="payment-method">Google</div>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-6">Certifications</p>
                <div className="flex flex-wrap gap-2">
                  <span className="footer-tag">ISO 27001</span>
                  <span className="footer-tag">PCI DSS</span>
                  <span className="footer-tag">GDPR</span>
                  <span className="footer-tag">SSL Secure</span>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="footer-divider mb-8"></div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="px-8 py-8 border-t" style={{borderColor: '#1A1A1A'}}>
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
              <div className="text-xs text-gray-500">
                © 2026 Style Hub. All rights reserved.
              </div>
              <div className="flex justify-center gap-6 text-xs">
                <a href="#" className="text-gray-500 hover:text-gray-300 transition">Privacy Policy</a>
                <a href="#" className="text-gray-500 hover:text-gray-300 transition">Terms of Service</a>
                <a href="#" className="text-gray-500 hover:text-gray-300 transition">Cookie Settings</a>
              </div>
              <div className="text-xs text-gray-500 md:text-right">
                <span className="inline-block">🌍 Operating in 195+ countries</span>
              </div>
            </div>
          </div>
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