import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const token = searchParams.get('token');
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [showPasswords, setShowPasswords] = useState(false);

  // Validate token on component mount
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setError('No reset token provided. Please check your email link.');
        setValidating(false);
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:8080/api/v1/auth/validate-reset-token?token=${token}`
        );
        const data = await response.json();
        
        if (data.valid) {
          setTokenValid(true);
        } else {
          setError('This reset link has expired or is invalid. Please request a new one.');
        }
      } catch (err) {
        setError('Error validating reset link. Please try again.');
        console.error('Token validation error:', err);
      } finally {
        setValidating(false);
      }
    };

    validateToken();
  }, [token]);

  // Check if passwords match
  useEffect(() => {
    if (formData.newPassword && formData.confirmPassword) {
      setPasswordsMatch(formData.newPassword === formData.confirmPassword);
    }
  }, [formData.newPassword, formData.confirmPassword]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Validate passwords
      if (formData.newPassword.length < 6) {
        setError('Password must be at least 6 characters');
        setLoading(false);
        return;
      }

      if (!passwordsMatch) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }

      // Send reset password request
      const response = await fetch('http://localhost:8080/api/v1/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess(data.message);
        setFormData({ newPassword: '', confirmPassword: '' });
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(data.message || 'Failed to reset password. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again later.');
      console.error('Reset password error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (validating) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{background: 'linear-gradient(135deg, #0B0B0B 0%, #1a1a1a 100%)'}}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{borderColor: '#C9A227'}}></div>
          <p className="text-white">Validating your reset link...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{background: 'linear-gradient(135deg, #0B0B0B 0%, #1a1a1a 100%)', backgroundImage: 'url(https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1000&h=1000&fit=crop)', backgroundSize: 'cover', backgroundPosition: 'center'}}>
      <div style={{background: 'linear-gradient(135deg, rgba(11,11,11,0.8) 0%, rgba(26,26,26,0.8) 100%)'}} className="absolute inset-0"></div>
      <div className="bg-white rounded-lg w-full max-w-md shadow-2xl p-0 relative z-10 overflow-hidden">
        {/* Gradient Header */}
        <div style={{background: 'linear-gradient(135deg, #C9A227 0%, #A67C1B 100%)'}} className="px-8 py-6">
          <h1 className="text-3xl font-bold text-white mb-2 text-center">
            Create New Password
          </h1>
          <p className="text-center text-white/90 text-sm">
            Please enter your new password
          </p>
        </div>

        <div className="p-8">

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg border border-red-300 flex items-start">
            <svg className="w-5 h-5 mr-3 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg border border-green-300 flex items-start">
            <svg className="w-5 h-5 mr-3 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>{success}</span>
          </div>
        )}

        {tokenValid ? (
          <form onSubmit={handleResetPassword}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords ? 'text' : 'password'}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Enter new password (min. 6 characters)"
                  className="w-full border-2 border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 transition pr-10"
                  style={{focusRingColor: '#C9A227'}}
                  onFocus={(e) => {e.target.style.borderColor = '#C9A227'; e.target.style.boxShadow = '0 0 0 2px rgba(201, 162, 39, 0.1)';}}
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(!showPasswords)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPasswords ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                type={showPasswords ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your password"
                className={`w-full border-2 rounded px-4 py-2 focus:outline-none focus:ring-2 transition ${
                  formData.confirmPassword && !passwordsMatch
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                    : 'border-gray-300'
                }`}
                style={formData.confirmPassword && !passwordsMatch ? {} : {focusRingColor: '#C9A227'}}
                onFocus={(e) => {if (!formData.confirmPassword || passwordsMatch) {e.target.style.borderColor = '#C9A227'; e.target.style.boxShadow = '0 0 0 2px rgba(201, 162, 39, 0.1)';}}}
                onBlur={(e) => {e.target.style.boxShadow = 'none';}}
                disabled={loading}
                required
              />
              {formData.confirmPassword && !passwordsMatch && (
                <p className="text-red-600 text-xs mt-1">Passwords do not match</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !passwordsMatch || !formData.newPassword || !formData.confirmPassword}
              className="w-full text-white py-2 rounded-lg transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
              style={{background: '#C9A227'}}
            >
              {loading ? 'Resetting Password...' : 'Reset Password'}
            </button>
          </form>
        ) : (
          <div className="text-center">
            <p className="text-red-600 mb-4">Unable to process your request</p>
            <button
              onClick={() => navigate('/login')}
              className="text-[#8b6a44] font-medium hover:underline"
            >
              Back to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
