import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (!email) {
        setError('Please enter your email address');
        setLoading(false);
        return;
      }

      // Call the forgot password API
      const response = await fetch('http://localhost:8080/api/v1/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message || 'Password reset link has been sent to your email');
        setEmailSent(true);
        
        // Auto redirect after 3 seconds
        setTimeout(() => {
          setEmail('');
          setEmailSent(false);
          navigate('/login');
        }, 3000);
      } else {
        setError(data.message || 'Failed to send reset link. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again later.');
      console.error('Forgot password error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{background: 'linear-gradient(135deg, #0B0B0B 0%, #1a1a1a 100%)', backgroundImage: 'url(https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1000&h=1000&fit=crop)', backgroundSize: 'cover', backgroundPosition: 'center'}}>
      <div style={{background: 'linear-gradient(135deg, rgba(11,11,11,0.8) 0%, rgba(26,26,26,0.8) 100%)', backdropFilter: 'blur(10px)'}} className="absolute inset-0"></div>
      <div className="w-full max-w-md relative z-10">
        {/* Back Button */}
        <button
          onClick={handleBackToLogin}
          className="mb-6 flex items-center transition font-medium"
          style={{color: '#C9A227'}}
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Login
        </button>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Gradient Header */}
          <div style={{background: 'linear-gradient(135deg, #C9A227 0%, #A67C1B 100%)'}} className="-m-8 mb-6 px-8 py-6 rounded-t-2xl">
            <h1 className="text-3xl font-bold text-white mb-2 text-center">
              Reset Password
            </h1>
            <p className="text-center text-white/90 text-sm">
              Enter your email and we'll send you a reset link
            </p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg border border-red-300 flex items-start">
              <svg className="w-5 h-5 mr-3 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {!emailSent ? (
            <form onSubmit={handleForgotPassword}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 transition"
                  style={{focusColor: '#C9A227', boxShadow: 'none'}}
                  onFocus={(e) => {e.target.style.borderColor = '#C9A227'; e.target.style.boxShadow = '0 0 0 2px rgba(201, 162, 39, 0.1)';}}
                  onBlur={(e) => {e.target.style.borderColor = '#D0D0D0'; e.target.style.boxShadow = 'none';}}
                  disabled={loading}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full text-white py-3 rounded-lg transition font-semibold disabled:opacity-50 mb-4 hover:opacity-90"
                style={{background: '#C9A227'}}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </span>
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </form>
          ) : (
            <div className="text-center py-8">
              <div className="mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-green-700 mb-2">Check Your Email</h3>
              <p className="text-sm text-gray-600 mb-2">
                We've sent a password reset link to<br />
                <strong>{email}</strong>
              </p>
              <p className="text-xs text-gray-500 mb-6">
                The link will expire in 1 hour. If you don't see the email, please check your spam folder.
              </p>
              <p className="text-xs text-gray-600 mb-4">
                Redirecting to login in 3 seconds...
              </p>
            </div>
          )}

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or</span>
            </div>
          </div>

          {/* Additional Links */}
          <div className="space-y-2 text-center text-sm">
            <p className="text-gray-600">
              Remember your password?{" "}
              <button
                onClick={handleBackToLogin}
                className="text-[#8b6a44] font-semibold hover:underline bg-none border-none cursor-pointer"
              >
                Login here
              </button>
            </p>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>Need help? Contact our support team at support@smartfashion.com</p>
        </div>
      </div>
    </div>
  );
}
