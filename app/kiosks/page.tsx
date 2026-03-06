'use client';

import { useState } from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';
import styles from './kiosks.module.css';

const kiosks = [
  { name: 'Apollo Hospital', address: '154/11, Bannerghatta Road', city: 'Bengaluru, Karnataka 560076', category: 'Medical', distance: '0.5 mi' },
  { name: 'Manipal Hospital', address: '98, HAL Airport Road', city: 'Bengaluru, Karnataka 560017', category: 'Medical', distance: '1.2 mi' },
  { name: 'Forum Mall', address: '21, Hosur Road, Koramangala', city: 'Bengaluru, Karnataka 560095', category: 'Retail', distance: '2.1 mi' },
  { name: 'Government General Hospital', address: 'Park Town', city: 'Chennai, Tamil Nadu 600003', category: 'Medical', distance: '2.8 mi' },
];

const categories = ['All', 'Retail', 'Medical', 'Wellness'];

export default function KiosksPage() {
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered = activeFilter === 'All' ? kiosks : kiosks.filter(k => k.category === activeFilter);

  return (
    <div className={styles.kiosksPage}>
      {/* Beta strip */}
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        borderBottom: '1px solid rgba(201,168,76,0.15)',
        padding: '8px 16px',
        textAlign: 'center',
        fontSize: '12px',
        color: '#C9A84C',
        letterSpacing: '0.01em',
      }}>
        Kiosk locations shown are demonstrations of the platform. Real deployments are in progress.
      </div>
      <section className="page-hero sacred-pattern royal-bar">
        <div className="container">
          <span className="section-label slide-up">Kiosk Network</span>
          <div className="divider slide-up"><span className="divider-gem"></span></div>
          <h1 className="text-center mb-6 slide-up" style={{ animationDelay: '0.05s' }}>Bringing NIVARA closer to you.</h1>
          <p className="text-center font-accent text-secondary mb-12 slide-up" style={{ animationDelay: '0.15s', maxWidth: '480px', margin: '0 auto', fontSize: '1.25rem' }}>
            We are building a network of NIVARA kiosks in hospitals, clinics, and public spaces so clinical grade skin screening is never far away. Deployments beginning soon.
          </p>

          <div className="search-container reveal">
            <input type="text" className="search-input" placeholder="Search by city or area" />
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
              <h3 className="mb-6">Demo Locations</h3>
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)' }}>
                These are demonstration entries. Real kiosk locations will appear here as deployments go live.
              </p>
              {filtered.map((kiosk, i) => (
                <div key={i} className="kiosk-card reveal" style={{ position: 'relative' }}>
                  <span style={{
                    position: 'absolute', top: '10px', right: '12px',
                    fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em',
                    textTransform: 'uppercase', color: '#C9A84C',
                    border: '1px solid rgba(201,168,76,0.5)', background: 'transparent',
                    padding: '2px 8px', borderRadius: '4px', pointerEvents: 'none',
                  }}>Demo Location</span>
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
            <span className="section-label section-label-light" style={{ marginBottom: 'var(--space-6)', display: 'inline-block' }}>Try It Now</span>
            <h2 className="mb-6">Experience NIVARA today.</h2>
            <p className="mb-8" style={{ fontFamily: 'var(--font-family-accent)', fontSize: 'var(--font-size-lg)' }}>
              The demo is free and available now. Upload a photo and receive a full AI assisted differential diagnosis in under a minute.
            </p>
            <Link href="/demo" className="btn btn-accent btn-large">Try the Free Demo</Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
