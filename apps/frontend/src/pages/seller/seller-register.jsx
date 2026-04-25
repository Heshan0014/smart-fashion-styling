import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import sellerAPI from "../../services/sellerAPI";

export default function SellerRegister() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    shopName: "",
    shopDescription: "",
    category: "",
    customCategory: "",
    businessType: "",
    email: "",
    phone: "+94",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    bankAccountName: "",
    bankAccountNumber: "",
    bankIFSC: "",
    averagePriceRange: "",
    website: "",
    instagram: "",
    facebook: "",
    twitter: "",
    linkedin: "",
    password: "",
    confirmPassword: ""
  });

  const [additionalSocialMedia, setAdditionalSocialMedia] = useState([]);

  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);
  const [fieldErrors, setFieldErrors] = useState({});

  // Sri Lankan cities mapping by province
  const citiesByProvince = {
    central: ["Kandy", "Matale", "Nuwara Eliya"],
    eastern: ["Batticaloa", "Trincomalee", "Ampara"],
    northCentral: ["Anuradhapura", "Polonnaruwa"],
    northern: ["Jaffna", "Mullaitivu", "Vavuniya"],
    northWestern: ["Kurunegala", "Puttalam"],
    sabaragamuwa: ["Ratnapura", "Kegalle"],
    southern: ["Galle", "Matara", "Hambantota"],
    uva: ["Badulla", "Monaragala"],
    western: ["Colombo", "Gampaha", "Kalutara"]
  };

  const getInputClass = (fieldName) => {
    const hasError = !!fieldErrors[fieldName];
    return `w-full border-2 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 ${
      hasError
        ? "border-red-500 focus:border-red-500 focus:ring-red-200"
        : "border-gray-300 focus:border-[#7a5a34] focus:ring-[#7a5a34]/20"
    }`;
  };

  const handlePhoneChange = (e) => {
    let value = e.target.value;
    // Only allow +94 followed by digits
    if (!value.startsWith("+94")) {
      value = "+94";
    }
    // Extract only digits after +94
    const digitsAfterCode = value.slice(3).replace(/\D/g, "");
    // Limit to 9 digits (total 10 with country code)
    const limitedDigits = digitsAfterCode.slice(0, 9);
    const finalValue = "+94" + limitedDigits;
    
    setFieldErrors((prev) => {
      if (!prev.phone) {
        return prev;
      }
      const next = { ...prev };
      delete next.phone;
      return next;
    });
    setFormData(prev => ({
      ...prev,
      phone: finalValue
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFieldErrors((prev) => {
      if (!prev[name]) {
        return prev;
      }
      const next = { ...prev };
      delete next[name];
      return next;
    });
    setFormData(prev => {
      const updated = {
        ...prev,
        [name]: value
      };

      // Clear custom category when a predefined category is selected
      if (name === "category" && value !== "other") {
        updated.customCategory = "";
      }

      return updated;
    });
  };

  const addSocialMediaField = () => {
    setAdditionalSocialMedia([...additionalSocialMedia, { platform: "", url: "" }]);
  };

  const removeSocialMediaField = (index) => {
    setAdditionalSocialMedia(additionalSocialMedia.filter((_, i) => i !== index));
  };

  const handleAdditionalSocialMediaChange = (index, field, value) => {
    const updated = [...additionalSocialMedia];
    updated[index][field] = value;
    setAdditionalSocialMedia(updated);
  };

  const isValidUrl = (url) => {
    try {
      const parsed = new URL(url);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      return false;
    }
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

  const validateField = (name, rawValue, currentData) => {
    const value = typeof rawValue === "string" ? rawValue.trim() : rawValue;

    const requiredFieldNames = new Set([
      "category",
      "businessType",
      "email",
      "phone",
      "address",
      "city",
      "state",
      "zipCode",
      "bankAccountName",
      "bankAccountNumber",
      "bankIFSC",
      "averagePriceRange",
      "password",
      "confirmPassword"
    ]);

    if (requiredFieldNames.has(name) && !value) {
      return "This field is required.";
    }

    if (name === "shopDescription" && value && value.length > 500) {
      return "Shop Description cannot exceed 500 characters.";
    }

    if (name === "customCategory" && currentData.category === "other" && !value) {
      return "Please type your category.";
    }

    if (name === "customCategory" && value && (value.length < 2 || value.length > 50)) {
      return "Custom category must be between 2 and 50 characters.";
    }

    if (name === "email" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return "Please enter a valid email address.";
    }

    if (name === "phone" && value) {
      const digitsOnly = value.replace(/\D/g, "");
      if (digitsOnly.length !== 10 || !value.startsWith("+94")) {
        return "Phone number must be exactly 10 digits (e.g., +94XXXXXXXXX).";
      }
    }

    if (name === "zipCode" && value && !/^[A-Za-z0-9\s-]{3,12}$/.test(value)) {
      return "Please enter a valid Zip Code.";
    }

    if (name === "bankAccountName" && value && value.length < 3) {
      return "Account Holder Name must be at least 3 characters.";
    }

    if (name === "bankAccountName" && value && !/^[A-Za-z\s]+$/.test(value)) {
      return "Account Holder Name should contain only letters.";
    }

    if (name === "bankAccountNumber" && value && !/^\d{8,20}$/.test(value)) {
      return "Account Number must be 8 to 20 digits.";
    }

    if (name === "bankIFSC" && value && !/^[A-Za-z]{4}0[A-Za-z0-9]{6}$/.test(value)) {
      return "Please enter a valid IFSC Code (e.g., HDFC0123456).";
    }

    if (name === "password" && value) {
      const passwordError = validatePassword(value);
      if (passwordError) {
        return passwordError;
      }
    }

    if (name === "confirmPassword" && value && value !== (currentData.password || "").trim()) {
      return "Passwords do not match.";
    }

    if ((name === "website" || name === "facebook" || name === "linkedin") && value && !isValidUrl(value)) {
      return "URL must start with http:// or https://";
    }

    if (name === "facebook" && value && !/^https?:\/\/(www\.)?facebook\.com\/.+/i.test(value)) {
      return "Please enter a valid Facebook URL (e.g., https://facebook.com/yourpage).";
    }

    if (name === "linkedin" && value && !/^https?:\/\/(www\.)?linkedin\.com\/.+/i.test(value)) {
      return "Please enter a valid LinkedIn URL (e.g., https://linkedin.com/company/yourcompany).";
    }

    if ((name === "instagram" || name === "twitter") && value && !/^[A-Za-z0-9._]{2,30}$/.test(value)) {
      return "Handle should be 2-30 characters and use letters, numbers, . or _ only.";
    }

    if ((name === "instagram" || name === "twitter") && value && value.startsWith("@")) {
      return "Please enter handle without @ symbol.";
    }

    return "";
  };

  const handleFieldBlur = (e) => {
    const target = e.target;
    const { name, value } = target;

    if (!name) {
      return;
    }

    const currentData = {
      ...formData,
      [name]: value
    };

    const errorMessage = validateField(name, value, currentData);
    setFieldErrors((prev) => {
      const next = { ...prev };
      if (errorMessage) {
        next[name] = errorMessage;
      } else {
        delete next[name];
      }
      return next;
    });
  };

  const validateForm = () => {
    const errors = [];
    const errorsByField = {};
    const trimmed = Object.fromEntries(
      Object.entries(formData).map(([key, value]) => [key, typeof value === "string" ? value.trim() : value])
    );

    const addError = (field, message) => {
      errors.push(message);
      if (!errorsByField[field]) {
        errorsByField[field] = message;
      }
    };

    const requiredFields = [
      ["category", "Category"],
      ["businessType", "Business Type"],
      ["email", "Email"],
      ["phone", "Phone"],
      ["address", "Full Address"],
      ["city", "City"],
      ["state", "State"],
      ["zipCode", "Zip Code"],
      ["bankAccountName", "Account Holder Name"],
      ["bankAccountNumber", "Account Number"],
      ["bankIFSC", "IFSC Code"],
      ["averagePriceRange", "Average Price Range"],
      ["password", "Password"],
      ["confirmPassword", "Confirm Password"]
    ];

    requiredFields.forEach(([field, label]) => {
      if (!trimmed[field]) {
        addError(field, `${label} is required.`);
      }
    });

    if (trimmed.shopDescription && trimmed.shopDescription.length > 500) {
      addError("shopDescription", "Shop Description cannot exceed 500 characters.");
    }

    if (trimmed.category === "other" && !trimmed.customCategory) {
      addError("customCategory", "Please type your category.");
    }

    if (trimmed.customCategory && (trimmed.customCategory.length < 2 || trimmed.customCategory.length > 50)) {
      addError("customCategory", "Custom category must be between 2 and 50 characters.");
    }

    if (trimmed.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed.email)) {
      addError("email", "Please enter a valid email address.");
    }

    if (trimmed.phone) {
      const digitsOnly = trimmed.phone.replace(/\D/g, "");
      if (digitsOnly.length !== 10 || !trimmed.phone.startsWith("+94")) {
        addError("phone", "Phone number must be exactly 10 digits (e.g., +94XXXXXXXXX).");
      }
    }

    if (trimmed.zipCode && !/^[A-Za-z0-9\s-]{3,12}$/.test(trimmed.zipCode)) {
      addError("zipCode", "Please enter a valid Zip Code.");
    }

    if (trimmed.bankAccountName && trimmed.bankAccountName.length < 3) {
      addError("bankAccountName", "Account Holder Name must be at least 3 characters.");
    }

    if (trimmed.bankAccountName && !/^[A-Za-z\s]+$/.test(trimmed.bankAccountName)) {
      addError("bankAccountName", "Account Holder Name should contain only letters.");
    }

    if (trimmed.bankAccountNumber && !/^\d{8,20}$/.test(trimmed.bankAccountNumber)) {
      addError("bankAccountNumber", "Account Number must be 8 to 20 digits.");
    }

    if (trimmed.bankIFSC && !/^[A-Za-z]{4}0[A-Za-z0-9]{6}$/.test(trimmed.bankIFSC)) {
      addError("bankIFSC", "Please enter a valid IFSC Code (e.g., HDFC0123456).");
    }

    if (trimmed.password) {
      const passwordError = validatePassword(trimmed.password);
      if (passwordError) {
        addError("password", passwordError);
      }
    }

    if (trimmed.password && trimmed.confirmPassword && trimmed.password !== trimmed.confirmPassword) {
      addError("confirmPassword", "Passwords do not match.");
    }

    if (trimmed.website && !isValidUrl(trimmed.website)) {
      addError("website", "Website URL must start with http:// or https://");
    }

    if (trimmed.facebook && !isValidUrl(trimmed.facebook)) {
      addError("facebook", "Facebook URL must start with http:// or https://");
    }

    if (trimmed.facebook && !/^https?:\/\/(www\.)?facebook\.com\/.+/i.test(trimmed.facebook)) {
      addError("facebook", "Please enter a valid Facebook URL (e.g., https://facebook.com/yourpage).");
    }

    if (trimmed.linkedin && !isValidUrl(trimmed.linkedin)) {
      addError("linkedin", "LinkedIn URL must start with http:// or https://");
    }

    if (trimmed.linkedin && !/^https?:\/\/(www\.)?linkedin\.com\/.+/i.test(trimmed.linkedin)) {
      addError("linkedin", "Please enter a valid LinkedIn URL (e.g., https://linkedin.com/company/yourcompany).");
    }

    if (trimmed.instagram && !/^[A-Za-z0-9._]{2,30}$/.test(trimmed.instagram)) {
      addError("instagram", "Instagram handle should be 2-30 characters and use letters, numbers, . or _ only.");
    }

    if (trimmed.instagram && trimmed.instagram.startsWith("@")) {
      addError("instagram", "Please enter handle without @ symbol.");
    }

    if (trimmed.twitter && !/^[A-Za-z0-9._]{2,30}$/.test(trimmed.twitter)) {
      addError("twitter", "Twitter/X handle should be 2-30 characters and use letters, numbers, . or _ only.");
    }

    if (trimmed.twitter && trimmed.twitter.startsWith("@")) {
      addError("twitter", "Please enter handle without @ symbol.");
    }

    additionalSocialMedia.forEach((social, index) => {
      const platform = (social.platform || "").trim();
      const url = (social.url || "").trim();

      if ((platform && !url) || (!platform && url)) {
        addError(`additionalSocialMedia.${index}.platform`, `Additional Social Media #${index + 1}: both platform and URL are required.`);
      }

      if (platform && platform.length < 2) {
        addError(`additionalSocialMedia.${index}.platform`, `Additional Social Media #${index + 1}: platform name is too short.`);
      }

      if (url && !isValidUrl(url)) {
        addError(`additionalSocialMedia.${index}.url`, `Additional Social Media #${index + 1}: URL must start with http:// or https://`);
      }
    });

    setValidationErrors(errors);
    setFieldErrors(errorsByField);
    return errors.length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (!validateForm()) {
        alert('Please fix validation errors before submitting.');
        setLoading(false);
        return;
      }

      // Prepare data for API
      const { customCategory, ...formPayload } = formData;
      const sellerData = {
        ...formPayload,
        category: formData.category === "other" ? customCategory.trim() : formData.category,
        // Convert field names to match backend entity (camelCase to snake_case)
        // Backend will handle the conversion via Jackson
      };
      
      console.log("Submitting seller registration:", sellerData);
      
      // Submit to backend API
      const response = await sellerAPI.submitRegistration(sellerData);
      
      console.log("Registration response:", response);
      
      alert('✅ Shop registration submitted successfully! Your request is pending admin approval.');
      
      // Reset form
      setFormData({
        shopName: "",
        shopDescription: "",
        category: "",
        customCategory: "",
        businessType: "",
        email: "",
        phone: "+94",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        bankAccountName: "",
        bankAccountNumber: "",
        bankIFSC: "",
        averagePriceRange: "",
        website: "",
        instagram: "",
        facebook: "",
        twitter: "",
        linkedin: "",
        password: "",
        confirmPassword: ""
      });
      setAdditionalSocialMedia([]);
      setValidationErrors([]);
      
      // Redirect to home after 2 seconds
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error('Error registering shop:', error);
      alert('❌ Failed to register shop: ' + (error.message || 'Please try again later'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{background: 'linear-gradient(135deg, #faf8f5 0%, #f5f0eb 50%, #ede5db 100%)', minHeight: '100vh'}}>
      {/* Premium Navbar */}
      <div className="sticky top-0 z-50 w-full shadow-lg" style={{background: 'linear-gradient(135deg, #7a5a34 0%, #5a3f24 100%)'}}>
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
              <p className="text-[#e0d4bf] text-xs md:text-sm">Seller Registration</p>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={() => navigate('/')}
            className="text-white text-3xl hover:opacity-70 transition-opacity cursor-pointer"
            title="Close"
          >
            ✕
          </button>
        </div>

        {/* Progress Bar */}
        <div className="h-1 w-full" style={{background: 'linear-gradient(90deg, #C9A227 0%, #e0d4bf 100%)'}}></div>
      </div>

      {/* Page Content */}
      <div className="w-full py-12 px-4 sm:px-8 relative z-20">
        {/* Header */}
        <div className="text-center mb-6 relative">
          <button
            onClick={() => navigate('/')}
            className="absolute top-0 right-0 text-2xl text-[#7a5a34] hover:opacity-60 transition-opacity cursor-pointer"
            title="Close"
          >
            ✕
          </button>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#4f3824] mb-2 tracking-tight">Become a Seller</h1>
          <p className="text-[#7b6550] text-base md:text-lg">Register your shop and start selling on Smart Fashion</p>
        </div>

        {/* Registration Form */}
        <div className="max-w-6xl mx-auto bg-white/90 backdrop-blur-md rounded-3xl shadow-[0_16px_40px_rgba(122,90,52,0.16)] p-6 md:p-10 border border-[#eadccf]">
          <form onSubmit={handleSubmit} onBlur={handleFieldBlur} className="space-y-8">
            {/* SHOP INFORMATION SECTION */}
            <div className="bg-[#fffaf4] rounded-2xl border border-[#dac5af] p-6 shadow-[0_8px_20px_rgba(122,90,52,0.08)]">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-12 h-12 bg-[#7a5a34] rounded-full flex items-center justify-center text-2xl shadow-lg">
                  📋
                </div>
                <h2 className="text-2xl font-bold text-[#7a5a34]">Shop Information</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2 bg-white rounded-xl p-4 border-l-4 border-[#7a5a34] shadow-sm hover:shadow-md transition">
                  <label className="block text-sm font-semibold text-[#7a5a34] mb-2">Shop Name *</label>
                  <input
                    type="text"
                    name="shopName"
                    value={formData.shopName}
                    onChange={handleChange}
                    className={getInputClass("shopName")}
                    placeholder="Enter your shop name"
                  />
                  {fieldErrors.shopName && <p className="mt-1 text-sm text-red-600">{fieldErrors.shopName}</p>}
                </div>

                <div className="md:col-span-2 bg-white rounded-xl p-4 border-l-4 border-[#7a5a34] shadow-sm hover:shadow-md transition">
                  <label className="block text-sm font-semibold text-[#7a5a34] mb-2">Shop Description</label>
                  <textarea
                    name="shopDescription"
                    value={formData.shopDescription}
                    onChange={handleChange}
                    className={`${getInputClass("shopDescription")} resize-none`}
                    placeholder="Describe your shop"
                    rows="4"
                  ></textarea>
                  {fieldErrors.shopDescription && <p className="mt-1 text-sm text-red-600">{fieldErrors.shopDescription}</p>}
                </div>

                <div className="bg-white rounded-xl p-4 border-l-4 border-[#7a5a34] shadow-sm hover:shadow-md transition">
                  <label className="block text-sm font-semibold text-[#7a5a34] mb-2">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className={getInputClass("category")}
                  >
                    <option value="" disabled>Select a category</option>
                    <option value="clothing">Clothing</option>
                    <option value="accessories">Accessories</option>
                    <option value="footwear">Footwear</option>
                    <option value="beauty">Beauty</option>
                    <option value="other">Other</option>
                  </select>
                  {fieldErrors.category && <p className="mt-1 text-sm text-red-600">{fieldErrors.category}</p>}

                  {formData.category === "other" && (
                    <div className="mt-3">
                      <input
                        type="text"
                        name="customCategory"
                        value={formData.customCategory}
                        onChange={handleChange}
                        className={getInputClass("customCategory")}
                        placeholder="Type your category"
                      />
                      {fieldErrors.customCategory && <p className="mt-1 text-sm text-red-600">{fieldErrors.customCategory}</p>}
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-xl p-4 border-l-4 border-[#7a5a34] shadow-sm hover:shadow-md transition">
                  <label className="block text-sm font-semibold text-[#7a5a34] mb-2">Business Type *</label>
                  <select
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleChange}
                    required
                    className={getInputClass("businessType")}
                  >
                    <option value="" disabled>Select business type</option>
                    <option value="individual">Individual</option>
                    <option value="partnership">Partnership</option>
                    <option value="company">Company</option>
                  </select>
                  {fieldErrors.businessType && <p className="mt-1 text-sm text-red-600">{fieldErrors.businessType}</p>}
                </div>
              </div>
            </div>

            {/* CONTACT INFORMATION SECTION */}
            <div className="bg-[#fffaf4] rounded-2xl border border-[#dac5af] p-6 shadow-[0_8px_20px_rgba(122,90,52,0.08)]">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-12 h-12 bg-[#7a5a34] rounded-full flex items-center justify-center text-2xl shadow-lg">
                  📞
                </div>
                <h2 className="text-2xl font-bold text-[#7a5a34]">Contact Information</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-4 border-l-4 border-[#7a5a34] shadow-sm hover:shadow-md transition">
                  <label className="block text-sm font-semibold text-[#7a5a34] mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={getInputClass("email")}
                    placeholder="your@email.com"
                  />
                  {fieldErrors.email && <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>}
                </div>

                <div className="bg-white rounded-xl p-4 border-l-4 border-[#7a5a34] shadow-sm hover:shadow-md transition">
                  <label className="block text-sm font-semibold text-[#7a5a34] mb-2">Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    required
                    className={getInputClass("phone")}
                    placeholder="+94XXXXXXXXX"
                  />
                  {fieldErrors.phone && <p className="mt-1 text-sm text-red-600">{fieldErrors.phone}</p>}
                </div>
              </div>
            </div>

            {/* ACCOUNT CREDENTIALS SECTION */}
            <div className="bg-[#fffaf4] rounded-2xl border border-[#dac5af] p-6 shadow-[0_8px_20px_rgba(122,90,52,0.08)]">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-12 h-12 bg-[#7a5a34] rounded-full flex items-center justify-center text-2xl shadow-lg">
                  🔐
                </div>
                <h2 className="text-2xl font-bold text-[#7a5a34]">Account Credentials</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-4 border-l-4 border-[#7a5a34] shadow-sm hover:shadow-md transition">
                  <label className="block text-sm font-semibold text-[#7a5a34] mb-2">Password *</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className={getInputClass("password")}
                    placeholder="Enter password (min 6 characters)"
                  />
                  {fieldErrors.password && <p className="mt-1 text-sm text-red-600">{fieldErrors.password}</p>}
                </div>

                <div className="bg-white rounded-xl p-4 border-l-4 border-[#7a5a34] shadow-sm hover:shadow-md transition">
                  <label className="block text-sm font-semibold text-[#7a5a34] mb-2">Confirm Password *</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className={getInputClass("confirmPassword")}
                    placeholder="Confirm password"
                  />
                  {fieldErrors.confirmPassword && <p className="mt-1 text-sm text-red-600">{fieldErrors.confirmPassword}</p>}
                </div>
              </div>
              <p className="text-sm text-[#7a5a34] mt-3 italic">Password requires: 8+ characters, uppercase, lowercase, number, and special character (@$!%*?&)</p>
            </div>

            {/* ADDRESS INFORMATION SECTION */}
            <div className="bg-[#fffaf4] rounded-2xl border border-[#dac5af] p-6 shadow-[0_8px_20px_rgba(122,90,52,0.08)]">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-12 h-12 bg-[#7a5a34] rounded-full flex items-center justify-center text-2xl shadow-lg">
                  📍
                </div>
                <h2 className="text-2xl font-bold text-[#7a5a34]">Address Information</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2 bg-white rounded-xl p-4 border-l-4 border-[#7a5a34] shadow-sm hover:shadow-md transition">
                  <label className="block text-sm font-semibold text-[#7a5a34] mb-2">Street Address *</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    className={getInputClass("address")}
                    placeholder="Street address"
                  />
                  {fieldErrors.address && <p className="mt-1 text-sm text-red-600">{fieldErrors.address}</p>}
                </div>

                <div className="bg-white rounded-xl p-4 border-l-4 border-[#7a5a34] shadow-sm hover:shadow-md transition">
                  <label className="block text-sm font-semibold text-[#7a5a34] mb-2">City *</label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className={getInputClass("city")}
                  >
                    <option value="" disabled>Select a city</option>
                    {[...new Set(Object.values(citiesByProvince).flat())]
                      .sort((a, b) => a.localeCompare(b))
                      .map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                  {fieldErrors.city && <p className="mt-1 text-sm text-red-600">{fieldErrors.city}</p>}
                </div>

                <div className="bg-white rounded-xl p-4 border-l-4 border-[#7a5a34] shadow-sm hover:shadow-md transition">
                  <label className="block text-sm font-semibold text-[#7a5a34] mb-2">Province *</label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    className={getInputClass("state")}
                  >
                    <option value="" disabled>Select a province</option>
                    <option value="central">Central Province</option>
                    <option value="eastern">Eastern Province</option>
                    <option value="northCentral">North Central Province</option>
                    <option value="northern">Northern Province</option>
                    <option value="northWestern">North Western Province</option>
                    <option value="sabaragamuwa">Sabaragamuwa Province</option>
                    <option value="southern">Southern Province</option>
                    <option value="uva">Uva Province</option>
                    <option value="western">Western Province</option>
                  </select>
                  {fieldErrors.state && <p className="mt-1 text-sm text-red-600">{fieldErrors.state}</p>}
                </div>

                <div className="bg-white rounded-xl p-4 border-l-4 border-[#7a5a34] shadow-sm hover:shadow-md transition">
                  <label className="block text-sm font-semibold text-[#7a5a34] mb-2">Zip Code *</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    required
                    className={getInputClass("zipCode")}
                    placeholder="12345"
                  />
                  {fieldErrors.zipCode && <p className="mt-1 text-sm text-red-600">{fieldErrors.zipCode}</p>}
                </div>
              </div>
            </div>

            {/* PAYMENT INFORMATION SECTION */}
            <div className="bg-[#fffaf4] rounded-2xl border border-[#dac5af] p-6 shadow-[0_8px_20px_rgba(122,90,52,0.08)]">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-12 h-12 bg-[#7a5a34] rounded-full flex items-center justify-center text-2xl shadow-lg">
                  💳
                </div>
                <h2 className="text-2xl font-bold text-[#7a5a34]">Bank Account Information</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2 bg-white rounded-xl p-4 border-l-4 border-[#7a5a34] shadow-sm hover:shadow-md transition">
                  <label className="block text-sm font-semibold text-[#7a5a34] mb-2">Account Holder Name *</label>
                  <input
                    type="text"
                    name="bankAccountName"
                    value={formData.bankAccountName}
                    onChange={handleChange}
                    required
                    pattern="[A-Za-z ]+"
                    title="Account Holder Name should contain only letters"
                    className={getInputClass("bankAccountName")}
                    placeholder="Account holder name"
                  />
                  {fieldErrors.bankAccountName && <p className="mt-1 text-sm text-red-600">{fieldErrors.bankAccountName}</p>}
                </div>

                <div className="bg-white rounded-xl p-4 border-l-4 border-[#7a5a34] shadow-sm hover:shadow-md transition">
                  <label className="block text-sm font-semibold text-[#7a5a34] mb-2">Account Number *</label>
                  <input
                    type="text"
                    name="bankAccountNumber"
                    value={formData.bankAccountNumber}
                    onChange={handleChange}
                    required
                    className={getInputClass("bankAccountNumber")}
                    placeholder="Bank account number"
                  />
                  {fieldErrors.bankAccountNumber && <p className="mt-1 text-sm text-red-600">{fieldErrors.bankAccountNumber}</p>}
                </div>

                <div className="bg-white rounded-xl p-4 border-l-4 border-[#7a5a34] shadow-sm hover:shadow-md transition">
                  <label className="block text-sm font-semibold text-[#7a5a34] mb-2">Bank Name *</label>
                  <input
                    type="text"
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleChange}
                    required
                    className={getInputClass("bankName")}
                    placeholder="Bank name"
                  />
                  {fieldErrors.bankName && <p className="mt-1 text-sm text-red-600">{fieldErrors.bankName}</p>}
                </div>
              </div>
            </div>

            {/* SOCIAL MEDIA & WEBSITE SECTION */}
            <div className="bg-[#fffaf4] rounded-2xl border border-[#dac5af] p-6 shadow-[0_8px_20px_rgba(122,90,52,0.08)]">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-12 h-12 bg-[#7a5a34] rounded-full flex items-center justify-center text-2xl shadow-lg">
                  🌐
                </div>
                <h2 className="text-2xl font-bold text-[#7a5a34]">Social Media & Website</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2 bg-white rounded-xl p-4 border-l-4 border-[#7a5a34] shadow-sm hover:shadow-md transition">
                  <label className="block text-sm font-semibold text-[#7a5a34] mb-2">Website</label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    className={getInputClass("website")}
                    placeholder="https://www.yourshop.com"
                  />
                  {fieldErrors.website && <p className="mt-1 text-sm text-red-600">{fieldErrors.website}</p>}
                </div>

                <div className="bg-white rounded-xl p-4 border-l-4 border-[#7a5a34] shadow-sm hover:shadow-md transition">
                  <label className="block text-sm font-semibold text-[#7a5a34] mb-2">Instagram</label>
                  <div className={`flex items-center border-2 rounded-lg px-4 py-2 focus-within:ring-2 ${fieldErrors.instagram ? "border-red-500 focus-within:border-red-500 focus-within:ring-red-200" : "border-gray-300 focus-within:border-[#7a5a34] focus-within:ring-[#7a5a34]/20"}`}>
                    <span className="text-[#7a5a34] mr-2 font-semibold">@</span>
                    <input
                      type="text"
                      name="instagram"
                      value={formData.instagram}
                      onChange={handleChange}
                      className="flex-1 outline-none"
                      placeholder="instagram_handle"
                    />
                  </div>
                  {fieldErrors.instagram && <p className="mt-1 text-sm text-red-600">{fieldErrors.instagram}</p>}
                </div>

                <div className="bg-white rounded-xl p-4 border-l-4 border-[#7a5a34] shadow-sm hover:shadow-md transition">
                  <label className="block text-sm font-semibold text-[#7a5a34] mb-2">Facebook</label>
                  <input
                    type="url"
                    name="facebook"
                    value={formData.facebook}
                    onChange={handleChange}
                    className={getInputClass("facebook")}
                    placeholder="https://facebook.com/yourpage"
                  />
                  {fieldErrors.facebook && <p className="mt-1 text-sm text-red-600">{fieldErrors.facebook}</p>}
                </div>

                <div className="md:col-span-2 bg-white rounded-xl p-4 border-l-4 border-[#7a5a34] shadow-sm hover:shadow-md transition">
                  <label className="block text-sm font-semibold text-[#7a5a34] mb-2">LinkedIn</label>
                  <input
                    type="url"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleChange}
                    className={getInputClass("linkedin")}
                    placeholder="https://linkedin.com/company/yourcompany"
                  />
                  {fieldErrors.linkedin && <p className="mt-1 text-sm text-red-600">{fieldErrors.linkedin}</p>}
                </div>

                {/* Other Social Media Accounts */}
                <div className="md:col-span-2">
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-semibold text-[#7a5a34]">Other Social Media Accounts</label>
                    <button
                      type="button"
                      onClick={addSocialMediaField}
                      className="bg-[#7a5a34] hover:bg-[#6a4a24] text-white px-3 py-1 rounded-lg font-medium text-sm transition"
                    >
                      + Add
                    </button>
                  </div>

                  {additionalSocialMedia.length > 0 && (
                    <div className="space-y-3">
                      {additionalSocialMedia.map((social, index) => (
                        <div key={index} className="bg-white rounded-xl p-3 border-l-4 border-[#7a5a34] shadow-sm">
                          <div className="flex gap-2 items-start">
                            <div className="flex-1">
                              <input
                                type="text"
                                placeholder="Platform Name(e.g., TikTok, YouTube, Pinterest)"
                                value={social.platform}
                                onChange={(e) => {
                                  handleAdditionalSocialMediaChange(index, 'platform', e.target.value);
                                  setFieldErrors((prev) => {
                                    const key = `additionalSocialMedia.${index}.platform`;
                                    if (!prev[key]) return prev;
                                    const next = { ...prev };
                                    delete next[key];
                                    return next;
                                  });
                                }}
                                onBlur={(e) => {
                                  const platform = (e.target.value || '').trim();
                                  const url = (social.url || '').trim();
                                  let message = '';
                                  if ((platform && !url) || (!platform && url)) {
                                    message = `Additional Social Media #${index + 1}: both platform and URL are required.`;
                                  } else if (platform && platform.length < 2) {
                                    message = `Additional Social Media #${index + 1}: platform name is too short.`;
                                  }
                                  setFieldErrors((prev) => {
                                    const key = `additionalSocialMedia.${index}.platform`;
                                    const next = { ...prev };
                                    if (message) next[key] = message;
                                    else delete next[key];
                                    return next;
                                  });
                                }}
                                className={`w-full border-2 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 ${fieldErrors[`additionalSocialMedia.${index}.platform`] ? "border-red-500 focus:border-red-500 focus:ring-red-200" : "border-gray-300 focus:border-[#7a5a34] focus:ring-[#7a5a34]/20"}`}
                              />
                              {fieldErrors[`additionalSocialMedia.${index}.platform`] && (
                                <p className="mt-1 text-xs text-red-600">{fieldErrors[`additionalSocialMedia.${index}.platform`]}</p>
                              )}
                            </div>
                            <div className="flex-1">
                              <input
                                type="url"
                                placeholder="URL (e.g., https://...)"
                                value={social.url}
                                onChange={(e) => {
                                  handleAdditionalSocialMediaChange(index, 'url', e.target.value);
                                  setFieldErrors((prev) => {
                                    const key = `additionalSocialMedia.${index}.url`;
                                    if (!prev[key]) return prev;
                                    const next = { ...prev };
                                    delete next[key];
                                    return next;
                                  });
                                }}
                                onBlur={(e) => {
                                  const platform = (social.platform || '').trim();
                                  const url = (e.target.value || '').trim();
                                  let message = '';
                                  if ((platform && !url) || (!platform && url)) {
                                    message = `Additional Social Media #${index + 1}: both platform and URL are required.`;
                                  } else if (url && !isValidUrl(url)) {
                                    message = `Additional Social Media #${index + 1}: URL must start with http:// or https://`;
                                  }
                                  setFieldErrors((prev) => {
                                    const key = `additionalSocialMedia.${index}.url`;
                                    const next = { ...prev };
                                    if (message) next[key] = message;
                                    else delete next[key];
                                    return next;
                                  });
                                }}
                                className={`w-full border-2 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 ${fieldErrors[`additionalSocialMedia.${index}.url`] ? "border-red-500 focus:border-red-500 focus:ring-red-200" : "border-gray-300 focus:border-[#7a5a34] focus:ring-[#7a5a34]/20"}`}
                              />
                              {fieldErrors[`additionalSocialMedia.${index}.url`] && (
                                <p className="mt-1 text-xs text-red-600">{fieldErrors[`additionalSocialMedia.${index}.url`]}</p>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => removeSocialMediaField(index)}
                              className="bg-red-500 hover:bg-red-600 text-white px-2.5 py-1.5 rounded-lg font-medium text-sm transition shrink-0 self-start mt-0.5"
                              aria-label={`Remove additional social media row ${index + 1}`}
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <p className="text-sm text-[#7a5a34] mt-3 italic">Optional: Add your social media handles to help customers find and follow your shop</p>
            </div>

            {/* Action Buttons */}
            <div className="border-t border-[#e5d6c8] pt-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-linear-to-r from-[#2f8f44] to-[#1e7a33] text-white py-3 rounded-xl hover:from-[#287d3a] hover:to-[#17662a] font-semibold tracking-wide shadow-md hover:shadow-lg transition-all disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Send Request'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="flex-1 bg-linear-to-r from-[#d25a49] to-[#bc3f2f] hover:from-[#bf4e3e] hover:to-[#a23427] text-white py-3 rounded-xl font-semibold tracking-wide shadow-md hover:shadow-lg transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
