import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';
import { HomeContent } from "./homepage";

export default function Signup() {
  const navigate = useNavigate();
  const formRef = useRef(null);
  const [showSignupForm, setShowSignupForm] = useState(true);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [fieldErrors, setFieldErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // Validation functions
  const validateFirstName = (value) => {
    if (!value.trim()) {
      return 'First name is required';
    }
    if (!/^[a-zA-Z\s'-]+$/.test(value)) {
      return 'First name must contain only letters';
    }
    if (value.length < 2) {
      return 'First name must be at least 2 characters';
    }
    if (value.length > 50) {
      return 'First name must not exceed 50 characters';
    }
    return '';
  };

  const validateLastName = (value) => {
    if (!value.trim()) {
      return 'Last name is required';
    }
    if (!/^[a-zA-Z\s'-]+$/.test(value)) {
      return 'Last name must contain only letters';
    }
    if (value.length < 2) {
      return 'Last name must be at least 2 characters';
    }
    if (value.length > 50) {
      return 'Last name must not exceed 50 characters';
    }
    return '';
  };

  const validateEmail = (value) => {
    if (!value.trim()) {
      return 'Email is required';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  const validatePassword = (value) => {
    if (!value) {
      return 'Password is required';
    }
    if (value.length < 8) {
      return 'Password must be at least 8 characters';
    }
    if (!/[a-z]/.test(value)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/[A-Z]/.test(value)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/\d/.test(value)) {
      return 'Password must contain at least one number';
    }
    if (!/[@$!%*?&]/.test(value)) {
      return 'Password must contain at least one special character (@$!%*?&)';
    }
    return '';
  };

  const validateConfirmPassword = (value, password) => {
    if (!value) {
      return 'Please confirm your password';
    }
    if (value !== password) {
      return 'Passwords do not match';
    }
    return '';
  };

  // Check password requirements
  const getPasswordRequirements = (password) => {
    return {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[@$!%*?&]/.test(password),
    };
  };

  // Close form when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (formRef.current && !formRef.current.contains(event.target)) {
        navigate('/');
      }
    };

    if (showSignupForm) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showSignupForm, navigate]);

  const handleSignupClick = () => {
    setShowSignupForm(true);
  };

  const handleCloseForm = () => {
    navigate('/');
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Real-time validation
    let error = '';
    if (name === 'firstName') {
      error = validateFirstName(value);
    } else if (name === 'lastName') {
      error = validateLastName(value);
    } else if (name === 'email') {
      error = validateEmail(value);
    } else if (name === 'password') {
      error = validatePassword(value);
      // Also validate confirm password if it's already filled
      if (formData.confirmPassword) {
        setFieldErrors(prev => ({
          ...prev,
          confirmPassword: validateConfirmPassword(formData.confirmPassword, value)
        }));
      }
    } else if (name === 'confirmPassword') {
      error = validateConfirmPassword(value, formData.password);
    }

    setFieldErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate all fields
    const firstNameErr = validateFirstName(formData.firstName);
    const lastNameErr = validateLastName(formData.lastName);
    const emailErr = validateEmail(formData.email);
    const passwordErr = validatePassword(formData.password);
    const confirmPasswordErr = validateConfirmPassword(formData.confirmPassword, formData.password);

    setFieldErrors({
      firstName: firstNameErr,
      lastName: lastNameErr,
      email: emailErr,
      password: passwordErr,
      confirmPassword: confirmPasswordErr,
    });

    // If any field has an error, don't proceed
    if (firstNameErr || lastNameErr || emailErr || passwordErr || confirmPasswordErr) {
      setError('Please fix the errors above');
      return;
    }

    setLoading(true);

    try {
      // Call signup API
      const response = await authAPI.signup({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      });

      setSuccess('Signup successful! Redirecting to home...');
      
      // Redirect to home after 1 second
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.');
      console.error('Signup error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF0DB]">
      <HomeContent onLoginClick={handleSignupClick} isBlurred={showSignupForm} />

      {/* SIGNUP FORM - Right Side */}
      {showSignupForm && (
        <div ref={formRef} className="fixed top-16 right-12 bg-white rounded-lg w-96 shadow-2xl z-50 max-h-[90vh] overflow-hidden overflow-y-auto">
          {/* Gradient Header */}
          <div style={{background: '#0B0B0B'}} className="relative h-16 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center justify-center">
              <h2 className="text-2xl font-bold text-white">Join Us</h2>
            </div>
            <button
              onClick={handleCloseForm}
              className="absolute top-4 right-3 text-white hover:text-gray-200 text-3xl leading-none w-8 h-8 flex items-center justify-center z-10"
            >
              ×
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

            <form onSubmit={handleSignup}>
              {/* First Name */}
              <div className="mb-4">
                <label className="block text-sm mb-1 font-medium">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Enter your first name"
                  className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 ${
                    fieldErrors.firstName
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-[#C9A227]'
                  }`}
                  disabled={loading}
                />
                {fieldErrors.firstName && (
                  <p className="text-red-500 text-xs mt-1">{fieldErrors.firstName}</p>
                )}
              </div>

              {/* Last Name */}
              <div className="mb-4">
                <label className="block text-sm mb-1 font-medium">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Enter your last name"
                  className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 ${
                    fieldErrors.lastName
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-[#C9A227]'
                  }`}
                  disabled={loading}
                />
                {fieldErrors.lastName && (
                  <p className="text-red-500 text-xs mt-1">{fieldErrors.lastName}</p>
                )}
              </div>

              {/* Email */}
              <div className="mb-4">
                <label className="block text-sm mb-1 font-medium">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 ${
                    fieldErrors.email
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-[#C9A227]'
                  }`}
                  disabled={loading}
                />
                {fieldErrors.email && (
                  <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>
                )}
              </div>

              {/* Password */}
              <div className="mb-4">
                <label className="block text-sm mb-1 font-medium">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 ${
                    fieldErrors.password
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-[#C9A227]'
                  }`}
                  disabled={loading}
                />
                {fieldErrors.password && (
                  <p className="text-red-500 text-xs mt-1">{fieldErrors.password}</p>
                )}
                {formData.password && (
                  <div className="text-xs mt-2 grid grid-cols-2 gap-2">
                    {(() => {
                      const req = getPasswordRequirements(formData.password);
                      return (
                        <>
                          <p className={req.length ? 'text-green-600 font-medium' : 'text-gray-400'}>
                            {req.length ? '✓' : '○'} 8 chars
                          </p>
                          <p className={req.uppercase ? 'text-green-600 font-medium' : 'text-gray-400'}>
                            {req.uppercase ? '✓' : '○'} Uppercase
                          </p>
                          <p className={req.lowercase ? 'text-green-600 font-medium' : 'text-gray-400'}>
                            {req.lowercase ? '✓' : '○'} Lowercase
                          </p>
                          <p className={req.number ? 'text-green-600 font-medium' : 'text-gray-400'}>
                            {req.number ? '✓' : '○'} Number/s
                          </p>
                          <p className={req.special ? 'text-green-600 font-medium' : 'text-gray-400'}>
                            {req.special ? '✓' : '○'} Special char
                          </p>
                        </>
                      );
                    })()}
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="mb-4">
                <label className="block text-sm mb-1 font-medium">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm your password"
                  className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 ${
                    fieldErrors.confirmPassword
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-[#C9A227]'
                  }`}
                  disabled={loading}
                />
                {fieldErrors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">{fieldErrors.confirmPassword}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || !formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.confirmPassword || fieldErrors.firstName || fieldErrors.lastName || fieldErrors.email || fieldErrors.password || fieldErrors.confirmPassword}
                className="w-full text-white py-2 rounded transition font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
                style={{background: '#C9A227'}}
              >
                {loading ? 'Signing up...' : 'Sign Up'}
              </button>
            </form>

            <p className="text-center text-xs mt-3">
              Already have an account?{" "}
              <button
                onClick={handleLoginClick}
                className="font-medium hover:underline bg-none border-none cursor-pointer"
                style={{color: '#C9A227'}}
              >
                Login
              </button>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}