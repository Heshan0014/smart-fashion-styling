import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import Navbar from "../../components/Navbar";

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

export default function Products() {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

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
      <Navbar showFitOn={true} isDarkBg={true} />

      {/* Hero Section */}
      <div className="w-full h-40 relative overflow-hidden flex items-center justify-center pt-20" style={{background: '#E8E8E8'}}>
        <div className="text-center">
          <h1 className="text-4xl font-black mb-4" style={{color: '#0B0B0B'}}>PRODUCTS</h1>
          
        </div>
      </div>

      {/* Filters Section */}
      <div className="px-8 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Search Bar */}
          <div className="mb-8 relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border-2 rounded-lg px-6 py-3 pl-12 text-lg focus:outline-none"
              style={{borderColor: '#D0D0D0', color: '#0B0B0B'}}
              onFocus={(e) => {e.target.style.borderColor = '#C9A227'; e.target.style.boxShadow = '0 0 0 2px rgba(201, 162, 39, 0.1)';}}
              onBlur={(e) => {e.target.style.borderColor = '#D0D0D0'; e.target.style.boxShadow = 'none';}}
            />
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-xl pointer-events-none" style={{color: '#808080'}} />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-3 mb-12">
            {['All', ...categories].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className="px-6 py-3 rounded-lg font-bold transition-all"
                style={{
                  background: selectedCategory === cat ? '#C9A227' : '#F5F5F5',
                  color: selectedCategory === cat ? '#0B0B0B' : '#0B0B0B',
                  border: selectedCategory === cat ? '2px solid #C9A227' : '2px solid #E8E8E8'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-12">
            {filteredProducts.map((product, i) => (
              <div key={i} className="group cursor-pointer transform transition-all duration-300 hover:scale-105">
                <div className="relative h-64 rounded-xl mb-4 transition overflow-hidden shadow-md hover:shadow-2xl" style={{background: `url(${[
                  'https://images.unsplash.com/photo-1567450489212-d37b5ba1b639?w=300&h=300&fit=crop',
                  'https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=300&fit=crop',
                  'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=300&h=300&fit=crop',
                  'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=300&h=300&fit=crop',
                ][i % 4]})`, backgroundSize: 'cover', backgroundPosition: 'center'}}>
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
    </div>
  );
}
