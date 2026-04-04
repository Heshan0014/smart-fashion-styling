import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiTrash2, FiMinus, FiPlus } from "react-icons/fi";
import Navbar from "../../components/Navbar";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);

  // Load cart items from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Save cart items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const removeItem = (itemId) => {
    setCartItems(cartItems.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
    } else {
      setCartItems(cartItems.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
  const shipping = subtotal > 100 ? 0 : 10;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <div className="min-h-screen bg-white">
      <Navbar showFitOn={true} isDarkBg={true} />

      {/* Hero Section */}
      <div className="w-full h-40 relative overflow-hidden flex items-center justify-center pt-20" style={{background: '#E8E8E8'}}>
        <div className="text-center">
          <h1 className="text-4xl font-black mb-4" style={{color: '#0B0B0B'}}>SHOPPING CART</h1>
        </div>
      </div>

      {/* Cart Content */}
      <div className="px-8 py-20">
        <div className="max-w-6xl mx-auto">
          {cartItems.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-4xl mb-6" style={{color: '#0B0B0B'}}>🛒</p>
              <h2 className="text-3xl font-black mb-4" style={{color: '#0B0B0B'}}>Your Cart is Empty</h2>
              <p className="text-xl mb-8" style={{color: '#666'}}>Ready to find some amazing fashion items?</p>
              <Link
                to="/products"
                className="px-8 py-4 rounded-lg text-white font-bold text-lg transition-all hover:shadow-2xl inline-block"
                style={{background: '#C9A227', color: '#0B0B0B', textDecoration: 'none'}}
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <h2 className="text-2xl font-black mb-6" style={{color: '#0B0B0B'}}>Shopping Bag ({cartItems.length} items)</h2>
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-4 p-6 rounded-lg border-2 transition-all hover:shadow-lg" style={{borderColor: '#E8E8E8'}}>
                      {/* Product Image */}
                      <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0" style={{background: '#F5F5F5'}}>
                        <img
                          src={item.image || 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=200&h=200&fit=crop'}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <h3 className="font-bold text-lg" style={{color: '#0B0B0B'}}>{item.name}</h3>
                        <p style={{color: '#666', fontSize: '14px'}}>Category: {item.category}</p>
                        <p className="font-bold text-lg mt-2" style={{color: '#C9A227'}}>${item.price.toFixed(2)}</p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex flex-col items-center justify-between">
                        <div className="flex items-center gap-2 p-2 rounded-lg" style={{background: '#F5F5F5'}}>
                          <button
                            onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}
                            className="transition-all hover:opacity-70"
                          >
                            <FiMinus size={16} style={{color: '#0B0B0B'}} />
                          </button>
                          <span className="w-8 text-center font-bold" style={{color: '#0B0B0B'}}>
                            {item.quantity || 1}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                            className="transition-all hover:opacity-70"
                          >
                            <FiPlus size={16} style={{color: '#0B0B0B'}} />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:opacity-70 transition-all mt-2"
                          title="Remove item"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>

                      {/* Item Total */}
                      <div className="text-right">
                        <p style={{color: '#0B0B0B', fontSize: '12px'}}>Total</p>
                        <p className="font-black text-lg" style={{color: '#0B0B0B'}}>
                          ${(item.price * (item.quantity || 1)).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="p-8 rounded-xl h-fit sticky top-24" style={{background: '#F5F5F5', border: '2px solid #E8E8E8'}}>
                <h3 className="text-2xl font-black mb-6" style={{color: '#0B0B0B'}}>Order Summary</h3>
                <div className="space-y-4">
                  <div className="flex justify-between" style={{color: '#0B0B0B'}}>
                    <span>Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between" style={{color: '#0B0B0B'}}>
                    <span>Shipping:</span>
                    <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between" style={{color: '#0B0B0B'}}>
                    <span>Tax (8%):</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-4 border-t" style={{color: '#0B0B0B', borderColor: '#D0D0D0'}}>
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
                <button
                  className="w-full py-4 rounded-lg text-white font-bold mt-6 transition-all hover:shadow-lg active:scale-95"
                  style={{background: '#C9A227', color: '#0B0B0B'}}
                >
                  Proceed to Checkout
                </button>
                <Link
                  to="/products"
                  className="w-full py-3 rounded-lg font-bold mt-3 transition-all border-2 inline-block text-center"
                  style={{borderColor: '#D0D0D0', color: '#0B0B0B', background: '#FFFFFF', textDecoration: 'none'}}
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Benefits */}
      <div className="px-8 py-16" style={{background: '#F5F5F5'}}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {[
            {icon: '🚚', title: 'Free Shipping', desc: 'On orders over $100'},
            {icon: '↩️', title: 'Easy Returns', desc: '30-day guarantee'},
            {icon: '🔒', title: 'Secure Checkout', desc: 'SSL encrypted'}
          ].map((benefit, i) => (
            <div key={i}>
              <p className="text-4xl mb-2">{benefit.icon}</p>
              <h4 className="font-bold mb-1" style={{color: '#0B0B0B'}}>{benefit.title}</h4>
              <p style={{color: '#666'}}>{benefit.desc}</p>
            </div>
          ))}
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
