'use client';

import { useState } from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';
import styles from './kiosks.module.css';

const kiosks = [
  { name: 'Wellness Center Downtown', address: '123 Main Street, Suite 100', city: 'San Francisco, CA 94102', category: 'Wellness', distance: '0.5 mi' },
  { name: 'TechMed Clinic', address: '456 Market Street', city: 'San Francisco, CA 94103', category: 'Medical', distance: '1.2 mi' },
  { name: 'Premium Health Store', address: '789 Valencia Street', city: 'San Francisco, CA 94110', category: 'Retail', distance: '2.1 mi' },
  { name: 'Dermatology Associates', address: '321 California Street, Floor 5', city: 'San Francisco, CA 94104', category: 'Medical', distance: '2.8 mi' },
];

const categories = ['All', 'Retail', 'Medical', 'Wellness'];

export default function KiosksPage() {
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered = activeFilter === 'All' ? kiosks : kiosks.filter(k => k.category === activeFilter);

  return (
    <div className={styles.kiosksPage}>
      <section className="page-hero sacred-pattern royal-bar">
        <div className="container">
          <span className="section-label slide-up">Locations</span>
          <div className="divider slide-up"><span className="divider-gem"></span></div>
          <h1 className="text-center mb-6 slide-up" style={{ animationDelay: '0.05s' }}>Find a kiosk near you</h1>
          <p className="text-center font-accent text-secondary mb-12 slide-up" style={{ animationDelay: '0.15s', maxWidth: '480px', margin: '0 auto', fontSize: '1.25rem' }}>
            Try NIVARA at one of our partner locations before you buy
          </p>

          <div className="search-container reveal">
            <input type="text" className="search-input" placeholder="Enter your city or postal code" />
            <button className="search-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                <path d="M20 20L16 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <div className="filters reveal">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`filter-chip${activeFilter === cat ? ' active' : ''}`}
                onClick={() => setActiveFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="kiosk-layout">
            <div className="map-container reveal">
              <div className="map-placeholder">
                <svg width="48" height="48" viewBox="0 0 64 64" fill="none">
                  <path d="M32 8C21.5 8 13 16.5 13 27C13 40.5 32 56 32 56C32 56 51 40.5 51 27C51 16.5 42.5 8 32 8Z" stroke="currentColor" strokeWidth="1.5" />
                  <circle cx="32" cy="27" r="5" stroke="currentColor" strokeWidth="1.5" />
                </svg>
                <p className="text-secondary mt-4" style={{ fontSize: 'var(--font-size-sm)' }}>Map view</p>
              </div>
            </div>

            <div className="results-container">
              <h3 className="mb-6">Nearby locations</h3>
              {filtered.map((kiosk, i) => (
                <div key={i} className="kiosk-card reveal">
                  <div className="kiosk-info">
                    <h4>{kiosk.name}</h4>
                    <p className="text-secondary text-small mb-2">{kiosk.address}</p>
                    <p className="text-secondary text-small mb-4">{kiosk.city}</p>
                    <div className="kiosk-meta">
                      <span className="badge">{kiosk.category}</span>
                      <span className="distance">{kiosk.distance}</span>
                    </div>
                  </div>
                  <div className="kiosk-actions">
                    <button className="btn btn-outline btn-small">Directions</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section cta-section">
        <div className="container">
          <div className="cta-content reveal">
            <span className="section-label section-label-light" style={{ marginBottom: 'var(--space-6)', display: 'inline-block' }}>Own One</span>
            <h2 className="mb-6">Ready to get your own?</h2>
            <p className="mb-8" style={{ fontFamily: 'var(--font-family-accent)', fontSize: 'var(--font-size-lg)' }}>
              Purchase a NIVARA device and start tracking your skin health from home.
            </p>
            <Link href="/buy" className="btn btn-accent btn-large">Buy Device — $299</Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
