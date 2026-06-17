import React from 'react';
import { Link } from 'react-router-dom';
import './Landing.css';

export default function Landing() {
  return (
    <div className="landing">

      {/* NAV */}
      <nav className="l-nav">
        <div className="l-nav-inner">
          <div className="l-logo">⭐ RateMyStore</div>
          <div className="l-nav-links">
            <Link to="/login" className="l-btn-ghost">Log in</Link>
            <Link to="/register" className="l-btn-solid">Get started</Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="l-hero">
        <div className="l-hero-overlay" />
        <div className="l-hero-inner">
          <div className="l-hero-text">
            <span className="l-badge">🌟 Trusted by thousands</span>
            <h1>Find & Rate the Best<br />Stores Around You</h1>
            <p>Real reviews from real people. Discover top-rated stores, share your experience, and make smarter choices every day.</p>
            <div className="l-hero-actions">
              <Link to="/register" className="l-btn-solid l-btn-lg">Create free account</Link>
              <Link to="/login" className="l-btn-ghost-white l-btn-lg">Sign in →</Link>
            </div>
            <div className="l-stats">
              <div className="l-stat"><strong>10K+</strong><span>Stores listed</span></div>
              <div className="l-stat-divider" />
              <div className="l-stat"><strong>50K+</strong><span>Reviews</span></div>
              <div className="l-stat-divider" />
              <div className="l-stat"><strong>4.8★</strong><span>Avg rating</span></div>
            </div>
          </div>
          <div className="l-hero-cards">
            <div className="l-review-card">
              <div className="l-rc-top">
                <div className="l-rc-avatar" style={{background:'#4f46e5'}}>TC</div>
                <div>
                  <div className="l-rc-name">The Coffee Corner</div>
                  <div className="l-rc-stars">★★★★★</div>
                </div>
              </div>
              <p className="l-rc-text">"Best coffee in town — the staff are incredibly welcoming!"</p>
              <div className="l-rc-meta">📍 Downtown • 2 hours ago</div>
            </div>
            <div className="l-review-card l-review-card--shift">
              <div className="l-rc-top">
                <div className="l-rc-avatar" style={{background:'#10b981'}}>FM</div>
                <div>
                  <div className="l-rc-name">Fresh Mart</div>
                  <div className="l-rc-stars">★★★★<span className="l-star-empty">★</span></div>
                </div>
              </div>
              <p className="l-rc-text">"Always fresh produce and unbeatable prices every week."</p>
              <div className="l-rc-meta">📍 Midtown • Yesterday</div>
            </div>
            <div className="l-review-card">
              <div className="l-rc-top">
                <div className="l-rc-avatar" style={{background:'#f59e0b'}}>BK</div>
                <div>
                  <div className="l-rc-name">Baker's Delight</div>
                  <div className="l-rc-stars">★★★★★</div>
                </div>
              </div>
              <p className="l-rc-text">"Their sourdough is absolutely divine. Highly recommend!"</p>
              <div className="l-rc-meta">📍 Westside • 3 days ago</div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="l-how">
        <div className="l-section-inner">
          <div className="l-section-label">How it works</div>
          <h2 className="l-section-title">Simple, fast, and free</h2>
          <div className="l-steps">
            <div className="l-step">
              <div className="l-step-num">1</div>
              <h3>Create an account</h3>
              <p>Sign up as a User, Store Owner, or Admin in seconds.</p>
            </div>
            <div className="l-step-arrow">→</div>
            <div className="l-step">
              <div className="l-step-num">2</div>
              <h3>Browse stores</h3>
              <p>Search and filter stores by name or location.</p>
            </div>
            <div className="l-step-arrow">→</div>
            <div className="l-step">
              <div className="l-step-num">3</div>
              <h3>Rate & review</h3>
              <p>Share your experience and help the community.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="l-features">
        <div className="l-section-inner">
          <div className="l-section-label">Features</div>
          <h2 className="l-section-title">Everything you need</h2>
          <div className="l-feature-grid">
            <div className="l-feature-card">
              <div className="l-feature-icon" style={{background:'#eef2ff',color:'#4f46e5'}}>🔍</div>
              <h3>Smart Search</h3>
              <p>Find stores instantly by name, address, or category with real-time filtering.</p>
            </div>
            <div className="l-feature-card">
              <div className="l-feature-icon" style={{background:'#fef3c7',color:'#d97706'}}>⭐</div>
              <h3>Star Ratings</h3>
              <p>Rate stores from 1 to 5 stars and update your rating anytime.</p>
            </div>
            <div className="l-feature-card">
              <div className="l-feature-icon" style={{background:'#d1fae5',color:'#059669'}}>📊</div>
              <h3>Owner Dashboard</h3>
              <p>Store owners get a dedicated dashboard to track their average rating.</p>
            </div>
            <div className="l-feature-card">
              <div className="l-feature-icon" style={{background:'#fce7f3',color:'#db2777'}}>🛡️</div>
              <h3>Admin Control</h3>
              <p>Admins can manage users, stores, and platform data with ease.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="l-cta-banner">
        <div className="l-cta-inner">
          <h2>Ready to find your next favourite store?</h2>
          <p>Join thousands of users already rating and reviewing stores near them.</p>
          <Link to="/register" className="l-btn-solid l-btn-lg">Sign up for free</Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="l-footer">
        <div className="l-footer-inner">
          <span className="l-logo">⭐ RateMyStore</span>
          <span>© 2026 RateMyStore. All rights reserved.</span>
        </div>
      </footer>

    </div>
  );
}
