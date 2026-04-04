import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <style>{`
        .about-shell {
          background:
            radial-gradient(circle at top left, rgba(201, 162, 39, 0.22), transparent 28%),
            radial-gradient(circle at bottom right, rgba(201, 162, 39, 0.12), transparent 30%),
            linear-gradient(180deg, #ffffff 0%, #fff8e8 52%, #f9efcf 100%);
        }
        .about-hero {
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
          line-height: 1.85;
        }
        .metric-card {
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.9), rgba(250, 250, 250, 0.95));
          border: 1px solid rgba(201, 162, 39, 0.18);
          box-shadow: 0 12px 24px rgba(15, 23, 42, 0.08);
        }
      `}</style>
      <Navbar showFitOn={true} isDarkBg={true} />

      {/* Hero Section */}
      <div className="about-hero w-full h-44 relative overflow-hidden flex items-center justify-center pt-20">
        <div className="text-center px-6">
          <p className="text-xs uppercase tracking-[0.35em] mb-3" style={{color: 'rgba(118, 83, 18, 0.9)'}}>Smart Fashion Styling</p>
          <h1 className="text-4xl md:text-5xl font-black mb-2" style={{color: '#111827', letterSpacing: '1px'}}>ABOUT US</h1>
          <p className="text-sm md:text-base" style={{color: 'rgba(17, 24, 39, 0.72)'}}>A refined fashion platform powered by style intelligence</p>
        </div>
        <div className="hero-ash-band" aria-hidden="true" />
      </div>

      {/* Main Content */}
      <div className="about-shell px-8 py-20">
        <div className="max-w-4xl mx-auto">
          {/* Our Story */}
          <div className="glass-panel rounded-3xl p-8 md:p-10 mb-10">
            <h2 className="text-3xl md:text-4xl font-black mb-6 section-title">Our Story</h2>
            <p className="text-lg leading-relaxed mb-4 soft-text">
              Smart Fashion Styling is revolutionizing the way people discover and wear fashion. Founded with a vision to make style accessible to everyone, we combine cutting-edge AI technology with expert fashion curation.
            </p>
            <p className="text-lg leading-relaxed soft-text">
              Every customer deserves personalized styling that matches their unique preferences, body type, and lifestyle. Our mission is to empower individuals to feel confident and beautiful in what they wear.
            </p>
          </div>

          {/* Mission & Vision */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div className="metric-card p-8 rounded-3xl">
              <p className="text-xs uppercase tracking-[0.25em] mb-3" style={{color: '#C9A227'}}>Our Mission</p>
              <h3 className="text-2xl font-black mb-4 section-title">Design with precision</h3>
              <p className="soft-text">
                To provide intelligent, personalized fashion recommendations that help every individual discover their unique style and express themselves authentically.
              </p>
            </div>
            <div className="metric-card p-8 rounded-3xl">
              <p className="text-xs uppercase tracking-[0.25em] mb-3" style={{color: '#C9A227'}}>Our Vision</p>
              <h3 className="text-2xl font-black mb-4 section-title">Elevate the styling journey</h3>
              <p className="soft-text">
                To be the world's most trusted AI-powered fashion platform, where technology and style converge to create a seamless shopping experience.
              </p>
            </div>
          </div>

          {/* Core Values */}
          <div className="mb-10">
            <h2 className="text-3xl md:text-4xl font-black mb-8 section-title">Core Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {title: 'Innovation', desc: 'We leverage AI and ML to revolutionize fashion discovery'},
                {title: 'Quality', desc: 'Premium brands and curated collections for discerning customers'},
                {title: 'Inclusivity', desc: 'Fashion for everyone, celebrating diversity and individuality'}
              ].map((value, i) => (
                <div key={i} className="glass-panel text-center p-8 rounded-3xl">
                  <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{background: 'linear-gradient(135deg, #C9A227, #E2C85A)', color: '#0B0B0B', fontSize: '28px'}}>
                    {i === 0 ? '⚡' : i === 1 ? '✨' : '🌈'}
                  </div>
                  <h4 className="text-xl font-bold mb-2 section-title">{value.title}</h4>
                  <p className="soft-text">{value.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 py-10 border-t border-b" style={{borderColor: 'rgba(17, 24, 39, 0.08)'}}>
            {[
              {num: '10K+', label: 'Happy Customers'},
              {num: '500+', label: 'Premium Brands'},
              {num: '100K+', label: 'Products'},
              {num: '24/7', label: 'Customer Support'}
            ].map((stat, i) => (
              <div key={i} className="text-center glass-panel rounded-3xl py-8 px-4">
                <p className="text-4xl font-black mb-2" style={{color: '#C9A227'}}>{stat.num}</p>
                <p style={{color: 'rgba(17, 24, 39, 0.72)', fontWeight: '600'}}>{stat.label}</p>
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
