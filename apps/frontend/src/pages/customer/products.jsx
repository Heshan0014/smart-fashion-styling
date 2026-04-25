import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import Navbar from "../../components/Navbar";
import g1 from "../../assets/g1.jpg";
import g2 from "../../assets/g2.jpg";
import g3 from "../../assets/g3.jpg";
import g4 from "../../assets/g4.png";
import g5 from "../../assets/g5.png";
import g6 from "../../assets/g6.png";
import g7 from "../../assets/g7.png";
import g8 from "../../assets/g8.png";
import g9 from "../../assets/g9.png";
import g10 from "../../assets/g10.png";
import g11 from "../../assets/g11.png";
import g12 from "../../assets/g12.png";
import g13 from "../../assets/g13.png";
import m1 from "../../assets/m1.png";
import m2 from "../../assets/m2.png";
import m3 from "../../assets/m3.png";
import m5 from "../../assets/m5.png";
import m6 from "../../assets/m6.png";
import m7 from "../../assets/m7.png";
import m8 from "../../assets/m8.png";
import m9 from "../../assets/m9.png";
import m10 from "../../assets/m10.png";
import m11 from "../../assets/m11.png";

const productNames = [
  'Casual Denim Jacket', 'Floral Summer Dress', 'Classic White Shirt', 'Black Leather Jacket',
  'Vintage Sweater', 'Cotton T-Shirt', 'Evening Gown', 'Casual Blazer',
  'Yoga Pants', 'Silk Blouse', 'Denim Jeans', 'Striped Dress',
  'Hoodie Sweatshirt', 'Long Sleeve Tee', 'Cardigan', 'Linen Pants'
];

const categories = ['Jackets', 'Men', 'Kids', 'Dresses', 'Tops', 'Sweaters', 'Hoodies', 'Shirts'];

const products = new Array(50).fill(null).map((_, i) => ({
  id: i,
  name: productNames[i % productNames.length] + ` #${Math.ceil((i + 1) / 10)}`,
  category: categories[i % categories.length],
  price: Math.floor(Math.random() * (150 - 20 + 1)) + 20
}));

const productImages = [
  g1,
  g2,
  g3,
  g4,
  g5,
  g6,
  g7,
  g8,
  g9,
  g10,
  g11,
  g12,
  g13,
  m1,
  m2,
  m3,
  m5,
  m6,
  m7,
  m8,
  m9,
  m10,
  m11
];

export default function Products() {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Get search query from URL parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search');
    if (searchParam) {
      setSearchQuery(searchParam);
    }
  }, [location.search]);

  const addToCart = (product) => {
    // Check if user is logged in
    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('Please sign in to add items to your cart');
      navigate('/login');
      return;
    }
    
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

  const filteredProducts = products.filter(p => {
    const matchCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                       p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="min-h-screen bg-white">
      <style>{`
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes floatUpDown {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .products-shell {
          background:
            radial-gradient(circle at top left, rgba(201, 162, 39, 0.22), transparent 28%),
            radial-gradient(circle at bottom right, rgba(201, 162, 39, 0.12), transparent 30%),
            linear-gradient(180deg, #ffffff 0%, #fff8e8 52%, #f9efcf 100%);
        }
        .products-hero {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(251, 239, 203, 0.98) 55%, rgba(201, 162, 39, 0.96) 100%);
          border-bottom: 1px solid rgba(201, 162, 39, 0.34);
          box-shadow: 0 16px 30px rgba(0, 0, 0, 0.12);
        }
        .products-hero-title {
          color: #111827;
          letter-spacing: 2px;
        }
        .hero-ash-band {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 22px;
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.22) 0%, rgba(232, 232, 232, 0.5) 100%);
          clip-path: polygon(4% 0, 96% 0, 100% 100%, 0 100%);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.28);
          opacity: 0.9;
        }
        .filters-shell {
          border: 1px solid rgba(201, 162, 39, 0.18);
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.82);
          backdrop-filter: blur(10px);
          box-shadow: 0 16px 38px rgba(0, 0, 0, 0.12);
          padding: 22px;
        }
        .search-wrapper {
          position: relative;
        }
        .search-field {
          width: 100%;
          border: 1px solid rgba(17, 24, 39, 0.16);
          border-radius: 14px;
          padding: 13px 14px 13px 44px;
          font-size: 15px;
          color: #111827;
          background: rgba(255, 255, 255, 0.9);
          box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.2);
          transition: all 0.2s ease;
        }
        .search-field::placeholder {
          color: rgba(17, 24, 39, 0.45);
        }
        .search-field:focus {
          outline: none;
          border-color: rgba(201, 162, 39, 0.75);
          box-shadow: 0 0 0 3px rgba(201, 162, 39, 0.15);
        }
        .category-chip {
          padding: 10px 16px;
          border-radius: 9999px;
          border: 1px solid rgba(17, 24, 39, 0.16);
          background: rgba(255, 255, 255, 0.9);
          color: #111827;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.3px;
          transition: all 0.2s ease;
        }
        .category-chip:hover {
          border-color: rgba(201, 162, 39, 0.55);
          background: rgba(251, 239, 203, 0.75);
        }
        .category-chip.active {
          border-color: #c9a227;
          background: linear-gradient(135deg, #c9a227 0%, #e2c85a 100%);
          color: #121212;
          box-shadow: 0 8px 20px rgba(201, 162, 39, 0.26);
        }
        .product-card {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
          backdrop-filter: blur(10px);
          background: rgba(255, 255, 255, 0.84);
          border: 1px solid rgba(201, 162, 39, 0.14);
          border-radius: 16px;
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
          overflow: hidden;
        }
        .product-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.32), transparent);
          transition: left 0.5s;
          z-index: 1;
        }
        .product-card:hover::before {
          left: 100%;
        }
        .product-card:hover {
          transform: translateY(-12px) scale(1.02);
          background: rgba(255, 255, 255, 0.88);
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
          background: linear-gradient(135deg, rgba(201, 162, 39, 0) 0%, rgba(201, 162, 39, 0.12) 100%);
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
          background: linear-gradient(135deg, #d4423d 0%, #e8544d 100%);
          color: #ffffff;
          z-index: 3;
          box-shadow: 0 4px 12px rgba(212, 66, 61, 0.25);
        }
        .product-info {
          position: relative;
          z-index: 2;
        }
        .product-name {
          font-family: 'Sora', 'Manrope', sans-serif;
          font-size: 14px;
          font-weight: 600;
          color: #0b0b0b;
          letter-spacing: 0.1px;
          line-height: 1.4;
          transition: color 0.3s ease;
        }
        .product-card:hover .product-name {
          color: #c9a227;
        }
        .product-category {
          font-family: 'Manrope', sans-serif;
          font-size: 11px;
          color: #999999;
          text-transform: uppercase;
          letter-spacing: 1.2px;
          margin-top: 8px;
        }
        .product-price {
          font-family: 'Sora', 'Manrope', sans-serif;
          font-size: 18px;
          font-weight: 700;
          color: #0b0b0b;
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
          background: linear-gradient(135deg, #111111 0%, #2a2a2a 100%);
          color: #f5f1e8;
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
          background: linear-gradient(135deg, #1a1a1a 0%, #3a3a3a 100%);
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
          color: #c9a227;
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
      `}</style>
      <Navbar showFitOn={true} isDarkBg={true} />

      {/* Hero Section */}
      <div className="products-hero w-full h-44 relative overflow-hidden flex items-center justify-center pt-20">
        <div className="text-center px-6">
          <p className="text-xs uppercase tracking-[0.35em] mb-3" style={{color: 'rgba(118, 83, 18, 0.9)'}}>Smart Fashion Styling</p>
          <h1 className="text-4xl font-black mb-2 products-hero-title">PRODUCTS</h1>
          <p className="text-sm" style={{color: 'rgba(17, 24, 39, 0.72)'}}>Premium styles curated for your look</p>
          
        </div>
        <div className="hero-ash-band" aria-hidden="true" />
      </div>

      {/* Filters Section */}
      <div className="products-shell px-8 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Search + Category Filters */}
          <div className="filters-shell mb-12">
            <div className="search-wrapper mb-5">
              <input
                type="text"
                placeholder="Search by name or category"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-field"
              />
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-lg pointer-events-none" style={{color: 'rgba(255, 255, 255, 0.72)'}} />
            </div>

            <div className="flex flex-wrap gap-3">
              {['All', ...categories].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`category-chip ${selectedCategory === cat ? 'active' : ''}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-12">
            {filteredProducts.map((product, i) => (
              <div key={i} className="product-card">
                <div
                  className="product-image-wrapper"
                  style={{
                    backgroundImage: `url(${productImages[i % productImages.length]})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  {i % 3 === 0 && (
                    <div className="product-badge">
                      SALE
                    </div>
                  )}
                </div>

                <div className="product-info px-4 pb-4">
                  <h3 className="product-name">{product.name}</h3>
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
            ))}
          </div>

          {/* Empty State */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-20">
              <p className="text-xl" style={{color: '#0B0B0B'}}>No products found</p>
              <button
                onClick={() => {setSelectedCategory('All'); setSearchQuery('');}}
                className="mt-6 px-6 py-3 rounded-lg font-bold"
                style={{background: '#C9A227', color: '#0B0B0B'}}
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer style={{background: '#0B0B0B'}}>
        <div className="px-8 py-12 text-center">
          <p style={{color: '#808080'}}>© 2026 Smart Fashion Styling. All rights reserved.</p>
        </div>
      </footer>

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
    </div>
  );
}
