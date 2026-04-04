import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar showFitOn={true} isDarkBg={true} />

      {/* Hero Section */}
      <div className="w-full h-40 relative overflow-hidden flex items-center justify-center pt-20" style={{background: '#E8E8E8'}}>
        <div className="text-center">
          <h1 className="text-4xl font-black mb-4" style={{color: '#0B0B0B'}}>ABOUT US</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-8 py-20">
        <div className="max-w-4xl mx-auto">
          {/* Our Story */}
          <div className="mb-16">
            <h2 className="text-4xl font-black mb-6" style={{color: '#0B0B0B'}}>Our Story</h2>
            <p className="text-lg leading-relaxed mb-4" style={{color: '#404040'}}>
              Smart Fashion Styling is revolutionizing the way people discover and wear fashion. Founded with a vision to make style accessible to everyone, we combine cutting-edge AI technology with expert fashion curation.
            </p>
            <p className="text-lg leading-relaxed" style={{color: '#404040'}}>
              Every customer deserves personalized styling that matches their unique preferences, body type, and lifestyle. Our mission is to empower individuals to feel confident and beautiful in what they wear.
            </p>
          </div>

          {/* Mission & Vision */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            <div className="p-8 rounded-xl" style={{background: '#F5F5F5', borderLeft: '4px solid #C9A227'}}>
              <h3 className="text-2xl font-black mb-4" style={{color: '#C9A227'}}>Our Mission</h3>
              <p style={{color: '#404040', lineHeight: '1.8'}}>
                To provide intelligent, personalized fashion recommendations that help every individual discover their unique style and express themselves authentically.
              </p>
            </div>
            <div className="p-8 rounded-xl" style={{background: '#F5F5F5', borderLeft: '4px solid #C9A227'}}>
              <h3 className="text-2xl font-black mb-4" style={{color: '#C9A227'}}>Our Vision</h3>
              <p style={{color: '#404040', lineHeight: '1.8'}}>
                To be the world's most trusted AI-powered fashion platform, where technology and style converge to create a seamless shopping experience.
              </p>
            </div>
          </div>

          {/* Core Values */}
          <div className="mb-16">
            <h2 className="text-4xl font-black mb-8" style={{color: '#0B0B0B'}}>Core Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {title: 'Innovation', desc: 'We leverage AI and ML to revolutionize fashion discovery'},
                {title: 'Quality', desc: 'Premium brands and curated collections for discerning customers'},
                {title: 'Inclusivity', desc: 'Fashion for everyone, celebrating diversity and individuality'}
              ].map((value, i) => (
                <div key={i} className="text-center">
                  <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{background: '#C9A227', color: '#0B0B0B', fontSize: '28px'}}>
                    {i === 0 ? '⚡' : i === 1 ? '✨' : '🌈'}
                  </div>
                  <h4 className="text-xl font-bold mb-2" style={{color: '#0B0B0B'}}>{value.title}</h4>
                  <p style={{color: '#666'}}>{value.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-12 border-t border-b" style={{borderColor: '#E8E8E8'}}>
            {[
              {num: '10K+', label: 'Happy Customers'},
              {num: '500+', label: 'Premium Brands'},
              {num: '100K+', label: 'Products'},
              {num: '24/7', label: 'Customer Support'}
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-4xl font-black mb-2" style={{color: '#C9A227'}}>{stat.num}</p>
                <p style={{color: '#666', fontWeight: '600'}}>{stat.label}</p>
              </div>
            ))}
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
