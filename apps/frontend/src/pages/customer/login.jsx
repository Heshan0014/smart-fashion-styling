import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';
import sellerAPI from '../../services/sellerAPI';
import { HomeContent } from "./homepage";

export default function Login() {
  const navigate = useNavigate();
  const formRef = useRef(null);
  const [showLoginForm, setShowLoginForm] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [emailError, setEmailError] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Load saved email on component mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberMeEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const validateEmail = (emailValue) => {
    if (!emailValue) {
      setEmailError('Email is required');
      return false;
    }
    if (!emailRegex.test(emailValue)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

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

  const handleLoginClick = () => {
    setShowLoginForm(true);
  };

  const handleCloseForm = () => {
    navigate('/');
  };

  const handleSignupClick = () => {
    navigate('/signup');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Validate email
    if (!validateEmail(email)) {
      return;
    }

    if (!password) {
      setError('Please enter your password');
      return;
    }

    setLoading(true);

    try {
      // Check for admin credentials
      if (email === 'admin@gmail.com' && password === 'Admin@1234') {
        setSuccess('Admin login successful! Redirecting to dashboard...');
        
        // Generate mock tokens for admin (since we're using local validation)
        const mockToken = 'admin_token_' + Date.now() + '_' + Math.random().toString(36).substring(7);
        const mockRefreshToken = 'admin_refresh_' + Date.now() + '_' + Math.random().toString(36).substring(7);
        
        // Store auth tokens
        localStorage.setItem('accessToken', mockToken);
        localStorage.setItem('refreshToken', mockRefreshToken);
        
        // Store admin info in localStorage
        localStorage.setItem('adminUser', JSON.stringify({
          email: 'admin@gmail.com',
          role: 'admin',
          loginTime: new Date().toLocaleString(),
          userId: 'admin-001'
        }));

        // Store user as well for compatibility
        localStorage.setItem('user', JSON.stringify({
          id: 'admin-001',
          email: 'admin@gmail.com',
          username: 'admin',
          role: 'ADMIN'
        }));
        
        console.log('Admin authenticated successfully');
        
        // Redirect to admin dashboard
        setTimeout(() => {
          navigate('/admin/dashboard');
        }, 1000);
        return;
      }

      // Check if this email is a seller
      try {
        const sellerCheckResponse = await fetch(`http://localhost:8080/v1/auth/check-seller/${email}`);
        if (sellerCheckResponse.ok) {
          const sellerData = await sellerCheckResponse.json();
          
          if (sellerData.isApprovedSeller) {
            setError('❌ This email is registered as a seller. Please use the seller registration page to login.');
            setLoading(false);
            return;
          }
          
          if (sellerData.isPendingSellerRequest) {
            setError('⏳ Your seller registration is pending admin approval. Once approved, you can login as a seller.');
            setLoading(false);
            return;
          }
        }
      } catch (checkErr) {
        console.log("Could not check seller status, proceeding with login...");
      }

      // Try regular user login through API
      const response = await authAPI.login(email, password);
      setSuccess('Login successful! Redirecting...');
      
      // Handle Remember Me
      if (rememberMe) {
        localStorage.setItem('rememberMeEmail', email);
      } else {
        localStorage.removeItem('rememberMeEmail');
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
    <div className="min-h-screen bg-[#FFF0DB]">
      <HomeContent onLoginClick={handleLoginClick} isBlurred={showLoginForm} />

      {/* LOGIN FORM - Right Side */}
      {showLoginForm && (
        <div ref={formRef} className="fixed top-16 right-12 rounded-lg w-80 shadow-2xl z-50 border overflow-hidden" style={{background: 'rgba(255, 255, 255, 0.95)', borderColor: '#D0D0D0'}}>
          <div className="p-6 bg-linear-to-r" style={{background: 'linear-gradient(135deg, #0B0B0B 0%, #1a1a1a 100%)'}}>
            <h2 className="text-2xl font-bold text-white text-center">
              Welcome Back
            </h2>
          </div>
          <button
              onClick={handleCloseForm}
              className="absolute top-5 right-3 text-white hover:text-gray-200 text-3xl leading-none w-8 h-8 flex items-center justify-center z-10"
            >
              ×
            </button>
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
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailTouched) {
                      validateEmail(e.target.value);
                    }
                  }}
                  onBlur={() => {
                    setEmailTouched(true);
                    validateEmail(email);
                  }}
                  onFocus={() => setEmailTouched(true)}
                  placeholder="Enter your email"
                  className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 transition ${
                    emailTouched && emailError
                      ? 'border-red-500 focus:ring-red-400'
                      : 'border-gray-300 focus:ring-\'[#C9A227]\''
                  }`}
                  disabled={loading}
                />
                {emailTouched && emailError && (
                  <p className="text-red-500 text-xs mt-1">{emailError}</p>
                )}
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
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={loading}
                  />
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
                disabled={loading || (emailTouched && emailError) || !email || !password}
                className="w-full text-white py-2 rounded transition font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
                style={{background: '#C9A227'}}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            <p className="text-center text-xs mt-3">
              Don't have an account?{" "}
              <button
                onClick={handleSignupClick}
                className="font-medium bg-none border-none cursor-pointer hover:opacity-70"
                style={{color: '#C9A227'}}
              >
                Register
              </button>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}