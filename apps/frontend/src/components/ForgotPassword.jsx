import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

export default function ForgotPassword({ isOpen, onClose }) {
  const navigate = useNavigate();
  const formRef = useRef(null);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  // Close form when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (formRef.current && !formRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onClose]);

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
        
        // Auto close after 3 seconds or give user time to read
        setTimeout(() => {
          setEmail('');
          setEmailSent(false);
          onClose();
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
    setEmail('');
    setError('');
    setSuccess('');
    setEmailSent(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center">
      <div
        ref={formRef}
        className="bg-white rounded-lg w-96 shadow-2xl z-50 border-2 border-[#e8dcc8]"
      >
        <div className="p-6">
          <div className="relative mb-6">
            <h2 className="text-2xl font-semibold text-center text-[#8b6a44]">
              Reset Password
            </h2>
            <button
              onClick={handleBackToLogin}
              className="absolute top-0 right-0 text-gray-500 hover:text-gray-800 text-2xl leading-none w-6 h-6 flex items-center justify-center"
            >
              ×
            </button>
          </div>

          {!emailSent ? (
            <>
              <p className="text-sm text-gray-600 mb-4 text-center">
                Enter your email address and we'll send you a link to reset your password.
              </p>

              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm border border-red-300">
                  {error}
                </div>
              )}

              <form onSubmit={handleForgotPassword}>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full border-2 border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#8b6a44] focus:ring-2 focus:ring-[#8b6a44]/20 transition"
                    disabled={loading}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#8b6a44] text-white py-2 rounded hover:bg-[#755835] transition font-medium disabled:opacity-50 mb-3"
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>

              <p className="text-center text-xs">
                Remember your password?{" "}
                <button
                  onClick={handleBackToLogin}
                  className="text-[#8b6a44] font-medium hover:underline bg-none border-none cursor-pointer"
                >
                  Back to Login
                </button>
              </p>
            </>
          ) : (
            <div className="text-center">
              <div className="mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-green-700 mb-2">Check Your Email</h3>
              <p className="text-sm text-gray-600 mb-4">
                We've sent a password reset link to<br />
                <strong>{email}</strong>
              </p>
              <p className="text-xs text-gray-500 mb-4">
                The link will expire in 1 hour. If you don't see the email, please check your spam folder.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
