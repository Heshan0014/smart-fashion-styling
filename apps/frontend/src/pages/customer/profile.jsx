import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MdKeyboardArrowDown, MdKeyboardArrowRight } from "react-icons/md";
import Navbar from "../../components/Navbar";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const [saveLoading, setSaveLoading] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null);
  
  // Expandable sections state
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    fashion: false,
    measurements: false
  });

  useEffect(() => {
    // Get user from localStorage
    const userJson = localStorage.getItem('user');
    const token = localStorage.getItem('accessToken');

    if (!token || !userJson) {
      // Redirect to login if not authenticated
      navigate('/login');
      return;
    }

    try {
      const userData = JSON.parse(userJson);
      setUser(userData);
      setEditData(userData);
    } catch (error) {
      console.error('Error parsing user data:', error);
      navigate('/login');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF0DB] flex items-center justify-center">
        <div className="text-2xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Calculate completion for each section
  const getBasicCompletion = () => {
    const fields = [user.firstName, user.lastName, user.email, user.phone, user.age, user.gender];
    const filled = fields.filter(f => f && f.toString().trim()).length;
    return Math.round((filled / fields.length) * 100);
  };

  const getFashionCompletion = () => {
    const fields = [user.bodyType, user.skinTone, user.stylePreference];
    const filled = fields.filter(f => f && f.toString().trim()).length;
    return Math.round((filled / fields.length) * 100);
  };

  const getMeasurementsCompletion = () => {
    const fields = [user.height, user.weight, user.chest, user.waist, user.hips, user.shoulders];
    const filled = fields.filter(f => f && f.toString().trim()).length;
    return Math.round((filled / fields.length) * 100);
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleEditChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveProfile = async () => {
    setSaveLoading(true);
    try {
      // Save to localStorage (in production, this would be an API call)
      localStorage.setItem('user', JSON.stringify(editData));
      setUser(editData);
      setIsEditMode(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setShowProfileMenu(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen" style={{background: '#FFFFFF'}}>
      <Navbar showFitOn={true} isDarkBg={true} />

      {/* Profile Header Background */}
      <div style={{background: 'linear-gradient(135deg, #0B0B0B 0%, #2A2A2A 100%)'}}>
        <div className="max-w-5xl mx-auto pt-24 pb-8 px-4">
          {/* Top spacing */}
        </div>
      </div>

      {/* Profile Content */}
      <div className="max-w-5xl mx-auto px-4 -mt-16 relative z-10 mb-12">
        {/* Header Section - Professional Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
          <div className="flex items-center gap-8 mb-8">
            <div className="w-32 h-32 rounded-full flex items-center justify-center text-6xl shadow-lg" style={{background: 'linear-gradient(135deg, #C9A227 0%, #A67C1B 100%)'}}>
              👤
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-black mb-2" style={{color: '#0B0B0B'}}>
                {user.firstName || "User"} {user.lastName || "Profile"}
              </h1>
              <p className="text-lg mb-1" style={{color: '#C9A227'}}>Member Profile</p>
              <p className="text-gray-600">{user.email}</p>
            </div>
            {!isEditMode && (
              <button
                onClick={() => setIsEditMode(true)}
                className="text-white px-8 py-3 rounded-lg font-bold whitespace-nowrap transition-all hover:scale-105 active:scale-95" 
                style={{background: '#C9A227', color: '#0B0B0B'}}
              >
                ✏️ Edit Profile
              </button>
            )}
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 pt-6" style={{borderTop: '1px solid #E8E8E8'}}>
            <div className="text-center">
              <p className="text-2xl font-bold" style={{color: '#0B0B0B'}}>{getBasicCompletion()}%</p>
              <p className="text-sm" style={{color: '#808080'}}>Basic Info</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold" style={{color: '#0B0B0B'}}>{getFashionCompletion()}%</p>
              <p className="text-sm" style={{color: '#808080'}}>Fashion Prefs</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold" style={{color: '#0B0B0B'}}>{getMeasurementsCompletion()}%</p>
              <p className="text-sm" style={{color: '#808080'}}>Measurements</p>
            </div>
          </div>
        </div>

        {/* Collapsible Sections */}
        {!isEditMode ? (
          // VIEW MODE
          <div className="space-y-6">
            {/* BASIC INFORMATION SECTION */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <button
                onClick={() => toggleSection('basic')}
                className="w-full p-6 flex items-center justify-between transition" style={{background: 'linear-gradient(135deg, #FFFFFF 0%, #F9F9F9 100%)'}}
              >
                <div className="flex items-center gap-4 flex-1">
                  <span className="text-4xl">📋</span>
                  <div className="text-left">
                    <h3 className="text-xl font-black" style={{color: '#0B0B0B'}}>Basic Information</h3>
                    <p className="text-sm" style={{color: '#808080'}}>
                      {getBasicCompletion()}% Complete
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-28 h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{width: `${getBasicCompletion()}%`, background: '#C9A227'}}
                    ></div>
                  </div>
                  {expandedSections.basic ? (
                    <MdKeyboardArrowDown className="text-4xl" style={{color: '#C9A227'}} />
                  ) : (
                    <MdKeyboardArrowRight className="text-4xl" style={{color: '#C9A227'}} />
                  )}
                </div>
              </button>

              {expandedSections.basic && (
                <div className="border-t px-8 py-8" style={{borderColor: '#E8E8E8', background: '#F9F9F9'}}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="text-sm font-bold uppercase" style={{color: '#808080', letterSpacing: '0.5px'}}>First Name</label>
                      <p className="text-xl font-bold mt-2" style={{color: '#0B0B0B'}}>
                        {user.firstName || <span className="italic" style={{color: '#D0D0D0'}}>Not provided</span>}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-bold uppercase" style={{color: '#808080', letterSpacing: '0.5px'}}>Last Name</label>
                      <p className="text-xl font-bold mt-2" style={{color: '#0B0B0B'}}>
                        {user.lastName || <span className="italic" style={{color: '#D0D0D0'}}>Not provided</span>}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-bold uppercase" style={{color: '#808080', letterSpacing: '0.5px'}}>Email</label>
                      <p className="text-xl font-bold mt-2" style={{color: '#0B0B0B'}}>{user.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-bold uppercase" style={{color: '#808080', letterSpacing: '0.5px'}}>Phone</label>
                      <p className="text-xl font-bold mt-2" style={{color: '#0B0B0B'}}>
                        {user.phone || <span className="italic" style={{color: '#D0D0D0'}}>Not provided</span>}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-bold uppercase" style={{color: '#808080', letterSpacing: '0.5px'}}>Age</label>
                      <p className="text-xl font-bold mt-2" style={{color: '#0B0B0B'}}>
                        {user.age || <span className="italic" style={{color: '#D0D0D0'}}>Not provided</span>}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-bold uppercase" style={{color: '#808080', letterSpacing: '0.5px'}}>Gender</label>
                      <p className="text-xl font-bold mt-2" style={{color: '#0B0B0B'}}>
                        {user.gender ? <span className="capitalize">{user.gender}</span> : <span className="italic" style={{color: '#D0D0D0'}}>Not provided</span>}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* FASHION PREFERENCES SECTION */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <button
                onClick={() => toggleSection('fashion')}
                className="w-full p-6 flex items-center justify-between transition" style={{background: 'linear-gradient(135deg, #FFFFFF 0%, #F9F9F9 100%)'}}
              >
                <div className="flex items-center gap-4 flex-1">
                  <span className="text-4xl">👗</span>
                  <div className="text-left">
                    <h3 className="text-xl font-black" style={{color: '#0B0B0B'}}>Fashion Preferences</h3>
                    <p className="text-sm" style={{color: '#808080'}}>
                      {getFashionCompletion()}% Complete
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-28 h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{width: `${getFashionCompletion()}%`, background: '#C9A227'}}
                    ></div>
                  </div>
                  {expandedSections.fashion ? (
                    <MdKeyboardArrowDown className="text-4xl" style={{color: '#C9A227'}} />
                  ) : (
                    <MdKeyboardArrowRight className="text-4xl" style={{color: '#C9A227'}} />
                  )}
                </div>
              </button>

              {expandedSections.fashion && (
                <div className="border-t px-8 py-8" style={{borderColor: '#E8E8E8', background: '#F9F9F9'}}>
                  <div className="space-y-8">
                    <div>
                      <label className="text-sm font-bold uppercase" style={{color: '#808080', letterSpacing: '0.5px'}}>Body Type</label>
                      <p className="text-xl font-bold mt-2" style={{color: '#0B0B0B'}}>
                        {user.bodyType ? <span className="capitalize">{user.bodyType}</span> : <span className="italic" style={{color: '#D0D0D0'}}>Not provided</span>}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-bold uppercase mb-3 block" style={{color: '#808080', letterSpacing: '0.5px'}}>Skin Tone</label>
                      <div className="flex items-center gap-4">
                        {user.skinTone && (
                          <>
                            <div
                              className="w-16 h-16 rounded-xl shadow-md border-4"
                              style={{backgroundColor: user.skinTone, borderColor: '#C9A227'}}
                            ></div>
                            <p className="font-mono text-lg font-bold" style={{color: '#0B0B0B'}}>{user.skinTone}</p>
                          </>
                        )}
                        {!user.skinTone && <span className="italic" style={{color: '#D0D0D0'}}>Not provided</span>}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-bold uppercase" style={{color: '#808080', letterSpacing: '0.5px'}}>Style Preference</label>
                      <p className="text-xl font-bold mt-2" style={{color: '#0B0B0B'}}>
                        {user.stylePreference ? <span className="capitalize">{user.stylePreference}</span> : <span className="italic" style={{color: '#D0D0D0'}}>Not provided</span>}
                      </p>
                    </div>

                    {user.favoriteColors && (
                      <div>
                        <label className="text-sm font-bold uppercase mb-3 block" style={{color: '#808080', letterSpacing: '0.5px'}}>Favorite Colors</label>
                        <div className="flex items-center gap-3 flex-wrap">
                          {user.favoriteColors.split(',').filter(c => c).map((color, idx) => (
                            <div
                              key={idx}
                              className="w-14 h-14 rounded-lg shadow-md border-4"
                              style={{backgroundColor: color, borderColor: '#C9A227'}}
                              title={color}
                            ></div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* BODY MEASUREMENTS SECTION */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <button
                onClick={() => toggleSection('measurements')}
                className="w-full p-6 flex items-center justify-between transition" style={{background: 'linear-gradient(135deg, #FFFFFF 0%, #F9F9F9 100%)'}}
              >
                <div className="flex items-center gap-4 flex-1">
                  <span className="text-4xl">📏</span>
                  <div className="text-left">
                    <h3 className="text-xl font-black" style={{color: '#0B0B0B'}}>Body Measurements</h3>
                    <p className="text-sm" style={{color: '#808080'}}>
                      {getMeasurementsCompletion()}% Complete
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-28 h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{width: `${getMeasurementsCompletion()}%`, background: '#C9A227'}}
                    ></div>
                  </div>
                  {expandedSections.measurements ? (
                    <MdKeyboardArrowDown className="text-4xl" style={{color: '#C9A227'}} />
                  ) : (
                    <MdKeyboardArrowRight className="text-4xl" style={{color: '#C9A227'}} />
                  )}
                </div>
              </button>

              {expandedSections.measurements && (
                <div className="border-t px-8 py-8" style={{borderColor: '#E8E8E8', background: '#F9F9F9'}}>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div>
                      <label className="text-sm font-bold uppercase" style={{color: '#808080', letterSpacing: '0.5px'}}>Height</label>
                      <p className="text-xl font-bold mt-2" style={{color: '#0B0B0B'}}>
                        {user.height ? <span>{user.height} cm</span> : <span className="italic" style={{color: '#D0D0D0'}}>Not provided</span>}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-bold uppercase" style={{color: '#808080', letterSpacing: '0.5px'}}>Weight</label>
                      <p className="text-xl font-bold mt-2" style={{color: '#0B0B0B'}}>
                        {user.weight ? <span>{user.weight} kg</span> : <span className="italic" style={{color: '#D0D0D0'}}>Not provided</span>}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-bold uppercase" style={{color: '#808080', letterSpacing: '0.5px'}}>Chest</label>
                      <p className="text-xl font-bold mt-2" style={{color: '#0B0B0B'}}>
                        {user.chest ? <span>{user.chest} cm</span> : <span className="italic" style={{color: '#D0D0D0'}}>Not provided</span>}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-bold uppercase" style={{color: '#808080', letterSpacing: '0.5px'}}>Waist</label>
                      <p className="text-xl font-bold mt-2" style={{color: '#0B0B0B'}}>
                        {user.waist ? <span>{user.waist} cm</span> : <span className="italic" style={{color: '#D0D0D0'}}>Not provided</span>}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-bold uppercase" style={{color: '#808080', letterSpacing: '0.5px'}}>Hips</label>
                      <p className="text-xl font-bold mt-2" style={{color: '#0B0B0B'}}>
                        {user.hips ? <span>{user.hips} cm</span> : <span className="italic" style={{color: '#D0D0D0'}}>Not provided</span>}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-bold uppercase" style={{color: '#808080', letterSpacing: '0.5px'}}>Shoulders</label>
                      <p className="text-xl font-bold mt-2" style={{color: '#0B0B0B'}}>
                        {user.shoulders ? <span>{user.shoulders} cm</span> : <span className="italic" style={{color: '#D0D0D0'}}>Not provided</span>}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-bold uppercase" style={{color: '#808080', letterSpacing: '0.5px'}}>Inseam</label>
                      <p className="text-xl font-bold mt-2" style={{color: '#0B0B0B'}}>
                        {user.inseam ? <span>{user.inseam} cm</span> : <span className="italic" style={{color: '#D0D0D0'}}>Not provided</span>}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-bold uppercase" style={{color: '#808080', letterSpacing: '0.5px'}}>Shoe Size</label>
                      <p className="text-xl font-bold mt-2" style={{color: '#0B0B0B'}}>
                        {user.shoeSize ? <span>{user.shoeSize}</span> : <span className="italic" style={{color: '#D0D0D0'}}>Not provided</span>}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          // EDIT MODE
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-3xl font-black mb-8" style={{color: '#0B0B0B'}}>Edit Your Profile</h2>
              <form className="space-y-8">
                {/* BASIC INFORMATION */}
                <div>
                  <h3 className="text-xl font-black mb-6 px-6 py-3 rounded-lg" style={{background: 'rgba(201, 162, 39, 0.1)', color: '#0B0B0B'}}>📋 Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold uppercase mb-3" style={{color: '#808080', letterSpacing: '0.5px'}}>First Name *</label>
                      <input
                        type="text"
                        value={editData.firstName || ''}
                        onChange={(e) => handleEditChange('firstName', e.target.value)}
                        className="w-full border-2 rounded-lg px-4 py-3 focus:outline-none font-medium"
                        style={{borderColor: '#D0D0D0', color: '#0B0B0B'}}
                        onFocus={(e) => e.target.style.borderColor = '#C9A227'}
                        onBlur={(e) => e.target.style.borderColor = '#D0D0D0'}
                        placeholder="Enter first name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold uppercase mb-3" style={{color: '#808080', letterSpacing: '0.5px'}}>Last Name *</label>
                      <input
                        type="text"
                        value={editData.lastName || ''}
                        onChange={(e) => handleEditChange('lastName', e.target.value)}
                        className="w-full border-2 rounded-lg px-4 py-3 focus:outline-none font-medium"
                        style={{borderColor: '#D0D0D0', color: '#0B0B0B'}}
                        onFocus={(e) => e.target.style.borderColor = '#C9A227'}
                        onBlur={(e) => e.target.style.borderColor = '#D0D0D0'}
                        placeholder="Enter last name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold uppercase mb-3" style={{color: '#808080', letterSpacing: '0.5px'}}>Email (Read-only)</label>
                      <input
                        type="email"
                        value={editData.email || ''}
                        disabled
                        className="w-full border-2 rounded-lg px-4 py-3 font-medium"
                        style={{borderColor: '#E8E8E8', color: '#808080', background: '#F9F9F9'}}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold uppercase mb-3" style={{color: '#808080', letterSpacing: '0.5px'}}>Phone *</label>
                      <input
                        type="tel"
                        value={editData.phone || ''}
                        onChange={(e) => handleEditChange('phone', e.target.value)}
                        className="w-full border-2 rounded-lg px-4 py-3 focus:outline-none font-medium"
                        style={{borderColor: '#D0D0D0', color: '#0B0B0B'}}
                        onFocus={(e) => e.target.style.borderColor = '#C9A227'}
                        onBlur={(e) => e.target.style.borderColor = '#D0D0D0'}
                        placeholder="Enter phone number"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold uppercase mb-3" style={{color: '#808080', letterSpacing: '0.5px'}}>Age *</label>
                      <input
                        type="number"
                        min="13"
                        max="120"
                        value={editData.age || ''}
                        onChange={(e) => handleEditChange('age', e.target.value)}
                        className="w-full border-2 rounded-lg px-4 py-3 focus:outline-none font-medium"
                        style={{borderColor: '#D0D0D0', color: '#0B0B0B'}}
                        onFocus={(e) => e.target.style.borderColor = '#C9A227'}
                        onBlur={(e) => e.target.style.borderColor = '#D0D0D0'}
                        placeholder="Enter age"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold uppercase mb-3" style={{color: '#808080', letterSpacing: '0.5px'}}>Gender *</label>
                      <select
                        value={editData.gender || ''}
                        onChange={(e) => handleEditChange('gender', e.target.value)}
                        className="w-full border-2 rounded-lg px-4 py-3 focus:outline-none font-medium"
                        style={{borderColor: '#D0D0D0', color: '#0B0B0B'}}
                        onFocus={(e) => e.target.style.borderColor = '#C9A227'}
                        onBlur={(e) => e.target.style.borderColor = '#D0D0D0'}
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="prefer-not-to-say">Prefer not to say</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* FASHION PREFERENCES */}
                <div>
                  <h3 className="text-xl font-black mb-6 px-6 py-3 rounded-lg" style={{background: 'rgba(201, 162, 39, 0.1)', color: '#0B0B0B'}}>👗 Fashion Preferences</h3>
                  <div className="space-y-8 p-6" style={{background: '#F9F9F9', borderRadius: '12px'}}>
                    <div>
                      <label className="block text-sm font-bold uppercase mb-3" style={{color: '#808080', letterSpacing: '0.5px'}}>Body Type</label>
                      <select
                        value={editData.bodyType || ''}
                        onChange={(e) => handleEditChange('bodyType', e.target.value)}
                        className="w-full border-2 rounded-lg px-4 py-3 focus:outline-none font-medium"
                        style={{borderColor: '#D0D0D0', color: '#0B0B0B'}}
                        onFocus={(e) => e.target.style.borderColor = '#C9A227'}
                        onBlur={(e) => e.target.style.borderColor = '#D0D0D0'}
                      >
                        <option value="">Select body type</option>
                        <option value="pear">Pear</option>
                        <option value="apple">Apple</option>
                        <option value="hourglass">Hourglass</option>
                        <option value="rectangle">Rectangle</option>
                        <option value="triangle">Triangle</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold uppercase mb-3" style={{color: '#808080', letterSpacing: '0.5px'}}>Skin Tone</label>
                      <div className="space-y-4">
                        {editData.skinTone && (
                          <div className="flex items-center gap-4 p-4" style={{background: '#FFFFFF', borderRadius: '8px'}}>
                            <div
                              className="w-16 h-16 rounded-lg shadow-md border-4"
                              style={{backgroundColor: editData.skinTone, borderColor: '#C9A227'}}
                            ></div>
                            <div>
                              <p className="text-sm font-bold" style={{color: '#808080'}}>Selected:</p>
                              <p className="font-mono text-lg font-bold" style={{color: '#0B0B0B'}}>{editData.skinTone}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleEditChange('skinTone', '')}
                              className="text-xl ml-auto hover:scale-110 transition"
                            >
                              ✕
                            </button>
                          </div>
                        )}
                        <div className="flex items-center gap-4">
                          <input
                            type="color"
                            id="skinTonePicker"
                            value={editData.skinTone || '#f1c27d'}
                            onChange={(e) => handleEditChange('skinTone', e.target.value)}
                            className="w-20 h-16 rounded-lg cursor-pointer border-4"
                            style={{borderColor: '#C9A227'}}
                          />
                          <div>
                            <p className="text-sm font-bold" style={{color: '#0B0B0B'}}>Pick your skin tone</p>
                            <p className="text-xs" style={{color: '#808080'}}>The color updates in real-time</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold uppercase mb-3" style={{color: '#808080', letterSpacing: '0.5px'}}>Style Preference</label>
                      <select
                        value={editData.stylePreference || ''}
                        onChange={(e) => handleEditChange('stylePreference', e.target.value)}
                        className="w-full border-2 rounded-lg px-4 py-3 focus:outline-none font-medium"
                        style={{borderColor: '#D0D0D0', color: '#0B0B0B'}}
                        onFocus={(e) => e.target.style.borderColor = '#C9A227'}
                        onBlur={(e) => e.target.style.borderColor = '#D0D0D0'}
                      >
                        <option value="">Select style</option>
                        <option value="casual">Casual</option>
                        <option value="formal">Formal</option>
                        <option value="sporty">Sporty</option>
                        <option value="bohemian">Bohemian</option>
                        <option value="vintage">Vintage</option>
                        <option value="minimalist">Minimalist</option>
                        <option value="classic">Classic</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold uppercase mb-3" style={{color: '#808080', letterSpacing: '0.5px'}}>Favorite Colors (Select up to 5)</label>
                      <div className="space-y-4">
                        {editData.favoriteColors && (
                          <div className="flex items-center gap-3 flex-wrap p-4" style={{background: '#FFFFFF', borderRadius: '8px'}}>
                            {editData.favoriteColors.split(',').filter(c => c).map((color, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <div
                                  className="w-12 h-12 rounded-lg shadow-md border-4"
                                  style={{backgroundColor: color, borderColor: '#C9A227'}}
                                ></div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const colors = editData.favoriteColors.split(',').filter(c => c);
                                    colors.splice(idx, 1);
                                    handleEditChange('favoriteColors', colors.join(','));
                                  }}
                                  className="text-xl hover:scale-110 transition"
                                >
                                  ✕
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                        {(!editData.favoriteColors || editData.favoriteColors.split(',').filter(c => c).length < 5) && (
                          <div className="flex items-center gap-4">
                            <input
                              type="color"
                              id="colorPicker"
                              defaultValue="#000000"
                              className="w-20 h-12 rounded-lg cursor-pointer border-4"
                              style={{borderColor: '#C9A227'}}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const colorInput = document.getElementById('colorPicker');
                                const colors = editData.favoriteColors ? editData.favoriteColors.split(',').filter(c => c) : [];
                                if (!colors.includes(colorInput.value)) {
                                  colors.push(colorInput.value);
                                  handleEditChange('favoriteColors', colors.join(','));
                                }
                              }}
                              className="px-6 py-2 rounded-lg font-bold transition-all hover:scale-105"
                              style={{background: '#C9A227', color: '#0B0B0B'}}
                            >
                              Add Color
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* BODY MEASUREMENTS */}
                <div>
                  <h3 className="text-xl font-black mb-6 px-6 py-3 rounded-lg" style={{background: 'rgba(201, 162, 39, 0.1)', color: '#0B0B0B'}}>📏 Body Measurements</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div>
                      <label className="block text-sm font-bold uppercase mb-3" style={{color: '#808080', letterSpacing: '0.5px'}}>Height (cm)</label>
                      <input
                        type="number"
                        value={editData.height || ''}
                        onChange={(e) => handleEditChange('height', e.target.value)}
                        className="w-full border-2 rounded-lg px-4 py-3 focus:outline-none font-medium"
                        style={{borderColor: '#D0D0D0', color: '#0B0B0B'}}
                        onFocus={(e) => e.target.style.borderColor = '#C9A227'}
                        onBlur={(e) => e.target.style.borderColor = '#D0D0D0'}
                        placeholder="e.g., 170"
                        min="100"
                        max="250"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold uppercase mb-3" style={{color: '#808080', letterSpacing: '0.5px'}}>Weight (kg)</label>
                      <input
                        type="number"
                        value={editData.weight || ''}
                        onChange={(e) => handleEditChange('weight', e.target.value)}
                        className="w-full border-2 rounded-lg px-4 py-3 focus:outline-none font-medium"
                        style={{borderColor: '#D0D0D0', color: '#0B0B0B'}}
                        onFocus={(e) => e.target.style.borderColor = '#C9A227'}
                        onBlur={(e) => e.target.style.borderColor = '#D0D0D0'}
                        placeholder="e.g., 65"
                        min="20"
                        max="300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold uppercase mb-3" style={{color: '#808080', letterSpacing: '0.5px'}}>Chest (cm)</label>
                      <input
                        type="number"
                        value={editData.chest || ''}
                        onChange={(e) => handleEditChange('chest', e.target.value)}
                        className="w-full border-2 rounded-lg px-4 py-3 focus:outline-none font-medium"
                        style={{borderColor: '#D0D0D0', color: '#0B0B0B'}}
                        onFocus={(e) => e.target.style.borderColor = '#C9A227'}
                        onBlur={(e) => e.target.style.borderColor = '#D0D0D0'}
                        placeholder="e.g., 92"
                        min="50"
                        max="200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold uppercase mb-3" style={{color: '#808080', letterSpacing: '0.5px'}}>Waist (cm)</label>
                      <input
                        type="number"
                        value={editData.waist || ''}
                        onChange={(e) => handleEditChange('waist', e.target.value)}
                        className="w-full border-2 rounded-lg px-4 py-3 focus:outline-none font-medium"
                        style={{borderColor: '#D0D0D0', color: '#0B0B0B'}}
                        onFocus={(e) => e.target.style.borderColor = '#C9A227'}
                        onBlur={(e) => e.target.style.borderColor = '#D0D0D0'}
                        placeholder="e.g., 76"
                        min="40"
                        max="200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold uppercase mb-3" style={{color: '#808080', letterSpacing: '0.5px'}}>Hips (cm)</label>
                      <input
                        type="number"
                        value={editData.hips || ''}
                        onChange={(e) => handleEditChange('hips', e.target.value)}
                        className="w-full border-2 rounded-lg px-4 py-3 focus:outline-none font-medium"
                        style={{borderColor: '#D0D0D0', color: '#0B0B0B'}}
                        onFocus={(e) => e.target.style.borderColor = '#C9A227'}
                        onBlur={(e) => e.target.style.borderColor = '#D0D0D0'}
                        placeholder="e.g., 94"
                        min="50"
                        max="200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold uppercase mb-3" style={{color: '#808080', letterSpacing: '0.5px'}}>Shoulders (cm)</label>
                      <input
                        type="number"
                        value={editData.shoulders || ''}
                        onChange={(e) => handleEditChange('shoulders', e.target.value)}
                        className="w-full border-2 rounded-lg px-4 py-3 focus:outline-none font-medium"
                        style={{borderColor: '#D0D0D0', color: '#0B0B0B'}}
                        onFocus={(e) => e.target.style.borderColor = '#C9A227'}
                        onBlur={(e) => e.target.style.borderColor = '#D0D0D0'}
                        placeholder="e.g., 38"
                        min="20"
                        max="100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold uppercase mb-3" style={{color: '#808080', letterSpacing: '0.5px'}}>Inseam (cm)</label>
                      <input
                        type="number"
                        value={editData.inseam || ''}
                        onChange={(e) => handleEditChange('inseam', e.target.value)}
                        className="w-full border-2 rounded-lg px-4 py-3 focus:outline-none font-medium"
                        style={{borderColor: '#D0D0D0', color: '#0B0B0B'}}
                        onFocus={(e) => e.target.style.borderColor = '#C9A227'}
                        onBlur={(e) => e.target.style.borderColor = '#D0D0D0'}
                        placeholder="e.g., 82"
                        min="40"
                        max="150"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold uppercase mb-3" style={{color: '#808080', letterSpacing: '0.5px'}}>Shoe Size</label>
                      <input
                        type="text"
                        value={editData.shoeSize || ''}
                        onChange={(e) => handleEditChange('shoeSize', e.target.value)}
                        className="w-full border-2 rounded-lg px-4 py-3 focus:outline-none font-medium"
                        style={{borderColor: '#D0D0D0', color: '#0B0B0B'}}
                        onFocus={(e) => e.target.style.borderColor = '#C9A227'}
                        onBlur={(e) => e.target.style.borderColor = '#D0D0D0'}
                        placeholder="e.g., 8, 9, 10"
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-6" style={{borderTop: '2px solid #E8E8E8'}}>
                  <button
                    type="button"
                    onClick={handleSaveProfile}
                    disabled={saveLoading}
                    className="flex-1 text-white py-3 rounded-lg font-bold transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                    style={{background: '#C9A227', color: '#0B0B0B'}}
                  >
                    {saveLoading ? '💾 Saving...' : '💾 Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditMode(false);
                      setEditData(user);
                    }}
                    className="flex-1 py-3 rounded-lg font-bold transition-all hover:opacity-80"
                    style={{background: '#F0F0F0', color: '#0B0B0B'}}
                  >
                    ✕ Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
