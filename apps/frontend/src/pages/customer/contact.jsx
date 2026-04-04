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
      <style>{`
        .contact-shell {
          background:
            radial-gradient(circle at top right, rgba(201, 162, 39, 0.22), transparent 28%),
            radial-gradient(circle at bottom left, rgba(201, 162, 39, 0.12), transparent 30%),
            linear-gradient(180deg, #ffffff 0%, #fff8e8 52%, #f9efcf 100%);
        }
        .contact-hero {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(251, 239, 203, 0.98) 55%, rgba(201, 162, 39, 0.96) 100%);
          border-bottom: 1px solid rgba(201, 162, 39, 0.34);
          box-shadow: 0 16px 30px rgba(0, 0, 0, 0.16);
        }
        .hero-ash-band {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 22px;
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.22) 0%, rgba(232, 232, 232, 0.5) 100%);
          clip-path: polygon(4% 0, 96% 0, 100% 100%, 0 100%);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.28);
          opacity: 0.9;
        }
        .glass-panel {
          background: rgba(255, 255, 255, 0.78);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(201, 162, 39, 0.16);
          box-shadow: 0 14px 34px rgba(15, 23, 42, 0.08);
        }
        .section-title {
          color: #111827;
          letter-spacing: -0.03em;
        }
        .soft-text {
          color: rgba(17, 24, 39, 0.72);
          line-height: 1.8;
        }
        .info-icon {
          background: linear-gradient(135deg, #C9A227, #E2C85A);
          color: #0B0B0B;
        }
        .form-field {
          width: 100%;
          border: 1px solid rgba(17, 24, 39, 0.16);
          border-radius: 14px;
          padding: 0.85rem 1rem;
          background: rgba(255, 255, 255, 0.9);
          color: #111827;
          transition: all 0.2s ease;
        }
        .form-field::placeholder {
          color: rgba(17, 24, 39, 0.45);
        }
        .form-field:focus {
          outline: none;
          border-color: rgba(201, 162, 39, 0.78);
          box-shadow: 0 0 0 3px rgba(201, 162, 39, 0.16);
        }
      `}</style>
      <Navbar showFitOn={true} isDarkBg={true} />

      {/* Hero Section */}
      <div className="contact-hero w-full h-44 relative overflow-hidden flex items-center justify-center pt-20">
        <div className="text-center px-6">
          <p className="text-xs uppercase tracking-[0.35em] mb-3" style={{color: 'rgba(118, 83, 18, 0.9)'}}>We’re here to help</p>
          <h1 className="text-4xl md:text-5xl font-black mb-2" style={{color: '#111827', letterSpacing: '1px'}}>CONTACT US</h1>
          <p className="text-sm md:text-base" style={{color: 'rgba(17, 24, 39, 0.72)'}}>Reach out for support, partnerships, or styling assistance</p>
        </div>
        <div className="hero-ash-band" aria-hidden="true" />
      </div>

      {/* Contact Section */}
      <div className="contact-shell px-8 py-20">
        <div className="max-w-6xl mx-auto">
          {/* Contact Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {[
              {icon: FiMapPin, title: 'Location', content: '123 Fashion Street, New York, NY 10001'},
              {icon: FiMail, title: 'Email', content: 'info@smartfashion.com'},
              {icon: FiPhone, title: 'Phone', content: '+1 (800) 123-4567'}
            ].map((item, i) => {
              const IconComponent = item.icon;
              return (
              <div key={i} className="glass-panel p-8 rounded-3xl transition-all hover:-translate-y-1 hover:shadow-xl">
                <div className="flex items-center justify-center mb-4 w-12 h-12 rounded-2xl info-icon">
                  <IconComponent size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2 section-title">{item.title}</h3>
                <p className="soft-text" style={{fontSize: '15px'}}>{item.content}</p>
              </div>
            );
            })}
          </div>

          {/* Contact Form Section */}
          <div className="max-w-3xl mx-auto">
            <div className="mb-12">
              <h2 className="text-3xl md:text-4xl font-black mb-3 section-title">Get in Touch</h2>
              <p className="soft-text" style={{fontSize: '16px'}}>Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 glass-panel p-8 rounded-3xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold mb-2 section-title">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="form-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2 section-title">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="form-field"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold mb-2 section-title">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+1 (555) 123-4567"
                    value={formData.phone}
                    onChange={handleChange}
                    className="form-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2 section-title">Subject *</label>
                  <input
                    type="text"
                    name="subject"
                    placeholder="How can we help?"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="form-field"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2 section-title">Message *</label>
                <textarea
                  name="message"
                  placeholder="Tell us more about your inquiry..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  className="form-field resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-2xl text-white font-bold text-lg transition-all hover:shadow-lg"
                style={{background: 'linear-gradient(135deg, #C9A227, #E2C85A)', color: '#0B0B0B'}}
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Business Hours */}
          <div className="max-w-3xl mx-auto mt-16 p-8 rounded-3xl glass-panel">
            <h3 className="text-2xl font-black mb-6 section-title">Business Hours</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="font-bold mb-2 section-title">Weekdays</p>
                <p className="soft-text">Monday - Friday<br />9:00 AM - 6:00 PM EST</p>
              </div>
              <div>
                <p className="font-bold mb-2 section-title">Weekends</p>
                <p className="soft-text">Saturday - Sunday<br />10:00 AM - 4:00 PM EST</p>
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
