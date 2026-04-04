import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import { FiMapPin, FiMail, FiPhone } from "react-icons/fi";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for contacting us! We will get back to you soon.');
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar showFitOn={true} isDarkBg={true} />

      {/* Hero Section */}
      <div className="w-full h-40 relative overflow-hidden flex items-center justify-center pt-20" style={{background: '#E8E8E8'}}>
        <div className="text-center">
          <h1 className="text-4xl font-black mb-4" style={{color: '#0B0B0B'}}>CONTACT US</h1>
          
        </div>
      </div>

      {/* Contact Section */}
      <div className="px-8 py-20" style={{background: '#FFFFFF'}}>
        <div className="max-w-6xl mx-auto">
          {/* Contact Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {[
              {icon: FiMapPin, title: 'Location', content: '123 Fashion Street, New York, NY 10001'},
              {icon: FiMail, title: 'Email', content: 'info@smartfashion.com'},
              {icon: FiPhone, title: 'Phone', content: '+1 (800) 123-4567'}
            ].map((item, i) => {
              const IconComponent = item.icon;
              return (
              <div key={i} className="p-8 rounded-xl border-2 transition-all hover:shadow-lg" style={{borderColor: '#E8E8E8', background: '#FAFAFA'}}>
                <div className="flex items-center justify-center mb-4 w-12 h-12 rounded-lg" style={{background: '#C9A227', color: '#0B0B0B'}}>
                  <IconComponent size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2" style={{color: '#0B0B0B'}}>{item.title}</h3>
                <p style={{color: '#666', fontSize: '15px'}}>{item.content}</p>
              </div>
            );
            })}
          </div>

          {/* Contact Form Section */}
          <div className="max-w-3xl mx-auto">
            <div className="mb-12">
              <h2 className="text-4xl font-black mb-3" style={{color: '#0B0B0B'}}>Get in Touch</h2>
              <p style={{color: '#666', fontSize: '16px'}}>Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl border-2" style={{borderColor: '#E8E8E8'}}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold mb-2" style={{color: '#0B0B0B'}}>Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full border-2 rounded-lg px-4 py-3 focus:outline-none transition"
                    style={{borderColor: '#D0D0D0', color: '#0B0B0B'}}
                    onFocus={(e) => {e.target.style.borderColor = '#C9A227'; e.target.style.boxShadow = '0 0 0 2px rgba(201, 162, 39, 0.1)';}}
                    onBlur={(e) => {e.target.style.borderColor = '#D0D0D0'; e.target.style.boxShadow = 'none';}}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2" style={{color: '#0B0B0B'}}>Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full border-2 rounded-lg px-4 py-3 focus:outline-none transition"
                    style={{borderColor: '#D0D0D0', color: '#0B0B0B'}}
                    onFocus={(e) => {e.target.style.borderColor = '#C9A227'; e.target.style.boxShadow = '0 0 0 2px rgba(201, 162, 39, 0.1)';}}
                    onBlur={(e) => {e.target.style.borderColor = '#D0D0D0'; e.target.style.boxShadow = 'none';}}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold mb-2" style={{color: '#0B0B0B'}}>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+1 (555) 123-4567"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full border-2 rounded-lg px-4 py-3 focus:outline-none transition"
                    style={{borderColor: '#D0D0D0', color: '#0B0B0B'}}
                    onFocus={(e) => {e.target.style.borderColor = '#C9A227'; e.target.style.boxShadow = '0 0 0 2px rgba(201, 162, 39, 0.1)';}}
                    onBlur={(e) => {e.target.style.borderColor = '#D0D0D0'; e.target.style.boxShadow = 'none';}}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2" style={{color: '#0B0B0B'}}>Subject *</label>
                  <input
                    type="text"
                    name="subject"
                    placeholder="How can we help?"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full border-2 rounded-lg px-4 py-3 focus:outline-none transition"
                    style={{borderColor: '#D0D0D0', color: '#0B0B0B'}}
                    onFocus={(e) => {e.target.style.borderColor = '#C9A227'; e.target.style.boxShadow = '0 0 0 2px rgba(201, 162, 39, 0.1)';}}
                    onBlur={(e) => {e.target.style.borderColor = '#D0D0D0'; e.target.style.boxShadow = 'none';}}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2" style={{color: '#0B0B0B'}}>Message *</label>
                <textarea
                  name="message"
                  placeholder="Tell us more about your inquiry..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  className="w-full border-2 rounded-lg px-4 py-3 focus:outline-none transition resize-none"
                  style={{borderColor: '#D0D0D0', color: '#0B0B0B'}}
                  onFocus={(e) => {e.target.style.borderColor = '#C9A227'; e.target.style.boxShadow = '0 0 0 2px rgba(201, 162, 39, 0.1)';}}
                  onBlur={(e) => {e.target.style.borderColor = '#D0D0D0'; e.target.style.boxShadow = 'none';}}
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-lg text-white font-bold text-lg transition-all hover:shadow-lg"
                style={{background: '#C9A227', color: '#0B0B0B'}}
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Business Hours */}
          <div className="max-w-3xl mx-auto mt-20 p-8 rounded-xl border-2" style={{borderColor: '#E8E8E8', background: '#FAFAFA'}}>
            <h3 className="text-2xl font-black mb-6" style={{color: '#0B0B0B'}}>Business Hours</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="font-bold mb-2" style={{color: '#0B0B0B'}}>Weekdays</p>
                <p style={{color: '#666'}}>Monday - Friday<br />9:00 AM - 6:00 PM EST</p>
              </div>
              <div>
                <p className="font-bold mb-2" style={{color: '#0B0B0B'}}>Weekends</p>
                <p style={{color: '#666'}}>Saturday - Sunday<br />10:00 AM - 4:00 PM EST</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{background: '#0B0B0B', marginTop: '60px'}}>
        <div className="px-8 py-12 text-center">
          <p style={{color: '#808080'}}>© 2026 Smart Fashion Styling. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
