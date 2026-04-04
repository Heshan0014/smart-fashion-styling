import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import sellerAPI from "../../services/sellerAPI";
import { HomeContent } from "../customer/homepage";

export default function SellerLogin() {
  const navigate = useNavigate();
  const formRef = useRef(null);
  const [showLoginForm, setShowLoginForm] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Close form when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (formRef.current && !formRef.current.contains(event.target)) {
        navigate('/');
      }
    };

    if (showLoginForm) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showLoginForm, navigate]);

  const handleCloseForm = () => {
    navigate('/');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (!email || !password) {
        setError('Please enter email and password');
        return;
      }

      // Call seller login API
      const response = await sellerAPI.sellerLogin(email, password);
      
      setSuccess('✅ Seller login successful! Redirecting...');
      
      // Store seller info in localStorage
      localStorage.setItem('sellerUser', JSON.stringify({
        id: response.data.id,
        email: response.data.email,
        shopName: response.data.shopName,
        role: 'seller',
        loginTime: new Date().toLocaleString()
      }));

      // Store access token if provided
      if (response.accessToken) {
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
      }
      
      // Redirect to home after 1 second
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{background: '#F5F5F5', backgroundImage: 'url(https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1000&h=600&fit=crop)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed'}} className="min-h-screen flex flex-col">
      {/* Premium Navbar */}
      <div className="w-full shadow-lg z-50" style={{background: 'linear-gradient(135deg, #7a5a34 0%, #5a3f24 100%)'}}>
        <div className="flex justify-between items-center px-6 py-4 md:px-12">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <img 
              src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=40&h=40&fit=crop" 
              alt="Logo" 
              className="w-10 h-10 rounded-lg shadow-md"
            />
            <div>
              <h1 className="text-white font-bold text-lg md:text-xl">Smart Fashion</h1>
              <p className="text-[#e0d4bf] text-xs md:text-sm">Seller Portal</p>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={handleCloseForm}
            className="text-white text-3xl hover:opacity-70 transition-opacity cursor-pointer"
            title="Close"
          >
            ✕
          </button>
        </div>

        {/* Progress Bar */}
        <div className="h-1 w-full" style={{background: 'linear-gradient(90deg, #C9A227 0%, #e0d4bf 100%)'}}></div>
      </div>

      <div className="flex-1 flex items-center justify-end pr-12">
        <HomeContent isBlurred={showLoginForm} />

      {/* SELLER LOGIN FORM - Right Side */}
      {showLoginForm && (
        <div ref={formRef} className="fixed top-24 right-12 rounded-lg w-80 shadow-2xl z-50 border overflow-hidden" style={{background: 'rgba(255, 255, 255, 0.95)', borderColor: '#D0D0D0'}}>
          <div className="p-6 flex justify-between items-center" style={{background: 'linear-gradient(135deg, #C9A227 0%, #A67C1B 100%)'}}>
            <h2 className="text-2xl font-bold text-white">
              Seller Portal
            </h2>
            <button
              onClick={handleCloseForm}
              className="text-2xl text-white hover:opacity-60 transition-opacity cursor-pointer flex-shrink-0"
              title="Close"
            >
              ✕
            </button>
          </div>
          <div className="p-6">

            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 bg-green-100 text-green-700 rounded text-sm">
                {success}
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="block text-sm mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2"
                  style={{borderColor: '#D0D0D0'}}
                  onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px #C9A227'}
                  onBlur={(e) => e.target.style.boxShadow = 'none'}
                  disabled={loading}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2"
                  style={{borderColor: '#D0D0D0'}}
                  onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px #C9A227'}
                  onBlur={(e) => e.target.style.boxShadow = 'none'}
                  disabled={loading}
                />
              </div>

              <div className="flex justify-between items-center mb-4 text-xs">
                <label className="flex items-center gap-2">
                  <input type="checkbox" disabled={loading} />
                  Remember me
                </label>
                <button
                  type="button"
                  onClick={() => navigate('/forgot-password')}
                  className="cursor-pointer hover:opacity-70"
                  style={{color: '#C9A227'}}
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full text-white py-2 rounded transition font-medium disabled:opacity-50 hover:opacity-90"
                style={{background: '#C9A227'}}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            <p className="text-center text-xs mt-3">
              New seller?{" "}
              <button
                onClick={() => {
                  navigate('/seller-register');
                }}
                className="font-medium bg-none border-none cursor-pointer hover:opacity-70"
                style={{color: '#C9A227'}}
              >
                Register Here
              </button>
            </p>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
