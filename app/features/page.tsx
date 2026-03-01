import type { Metadata } from 'next';
import Link from 'next/link';
import Footer from '@/components/Footer';
import styles from './features.module.css';

export const metadata: Metadata = {
  title: 'Technology — NIVARA',
  description: 'NIVARA Technology — Clinical-grade imaging, AI analysis, intelligent tracking. Indigenously built in India.',
};

export default function FeaturesPage() {
  return (
    <div className={styles.featuresPage}>
      {/* HERO */}
      <section className="page-hero sacred-pattern royal-bar">
        <div className="container">
          <span className="section-label slide-up">Technology</span>
          <div className="divider slide-up reveal"><span className="divider-gem"></span></div>
          <h1 className="slide-up" style={{ animationDelay: '0.05s' }}>Technology built for<br /><em>precision</em></h1>
          <p className="hero-subtitle font-accent slide-up" style={{ animationDelay: '0.15s' }}>
            Clinical-grade hardware meets intelligent software.<br />
            Every detail engineered for accuracy.
          </p>
        </div>
      </section>

      {/* DEVICE SECTION */}
      <section className="section">
        <div className="container">
          <div className="feature-module reveal">
            <div className="feature-visual">
              <div className="device-showcase" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{
                  width: '100%', maxWidth: '320px',
                  border: '1.5px solid var(--color-border-warm)',
                  borderRadius: '16px',
                  background: 'linear-gradient(145deg, #0e0c08 0%, #1a1510 60%, #221d14 100%)',
                  padding: '3rem 2rem',
                  textAlign: 'center',
                  boxShadow: '0 0 40px rgba(212,175,98,0.06)',
                }}>
                  <div style={{ fontFamily: 'var(--font-family-display)', fontSize: '2.2rem', color: 'var(--color-accent)', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>NIVARA</div>
                  <div style={{ fontFamily: 'var(--font-family-accent)', fontSize: '0.8rem', color: 'rgba(250,248,244,0.35)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '2rem' }}>Scanner</div>
                  <div style={{ width: '64px', height: '64px', borderRadius: '50%', border: '1.5px solid var(--color-border-warm)', margin: '0 auto 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                  </div>
                  <div style={{ fontFamily: 'var(--font-family-accent)', fontSize: '0.72rem', color: 'rgba(250,248,244,0.3)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>Clinical-grade · Portable</div>
                </div>
              </div>
            </div>
            <div className="feature-details">
              <span className="feature-label">Hardware</span>
              <h2 className="mb-6">Precision imaging device</h2>
              <p className="text-large text-secondary mb-8">
                Compact, portable, and powerful. The NIVARA device captures clinical-grade images with exceptional clarity and detail.
              </p>
              <div className="spec-list">
                <div className="spec-item"><h4>20MP Sensor</h4><p className="text-secondary">High-resolution imaging captures microscopic detail</p></div>
                <div className="spec-item"><h4>10x Magnification</h4><p className="text-secondary">See what&#39;s invisible to the naked eye</p></div>
                <div className="spec-item"><h4>LED Ring Light</h4><p className="text-secondary">Consistent, shadow-free illumination</p></div>
                <div className="spec-item"><h4>Wireless Sync</h4><p className="text-secondary">Instant transfer to your dashboard</p></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI ANALYSIS SECTION */}
      <section className="section bg-dark">
        <div className="container">
          <div className="feature-module reverse reveal">
            <div className="feature-details">
              <span className="feature-label accent">AI Technology</span>
              <h2 className="mb-6 text-inverse">Advanced AI analysis</h2>
              <p className="text-large text-secondary mb-8">
                Proprietary algorithms trained on millions of images detect patterns, changes, and anomalies with exceptional accuracy.
              </p>
              <div className="spec-list">
                <div className="spec-item"><h4 className="text-inverse">Pattern Recognition</h4><p className="text-secondary">Identifies subtle changes over time</p></div>
                <div className="spec-item"><h4 className="text-inverse">Anomaly Detection</h4><p className="text-secondary">Flags areas requiring attention</p></div>
                <div className="spec-item"><h4 className="text-inverse">Trend Analysis</h4><p className="text-secondary">Tracks improvement or deterioration</p></div>
                <div className="spec-item"><h4 className="text-inverse">Personalized Insights</h4><p className="text-secondary">Recommendations based on your unique profile</p></div>
              </div>
            </div>
            <div className="feature-visual">
              <div className="ai-visualization" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
                <div className="ai-grid" style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(10, 1fr)',
                  gap: '8px',
                  maxWidth: '300px',
                }}>
                  {Array.from({ length: 100 }).map((_, i) => {
                    const row = Math.floor(i / 10);
                    const col = i % 10;
                    const center = Math.sqrt(Math.pow(row - 4.5, 2) + Math.pow(col - 4.5, 2));
                    const active = center < 3.5;
                    const bright = center < 1.5;
                    return (
                      <div key={i} style={{
                        width: '6px', height: '6px', borderRadius: '50%',
                        background: bright
                          ? 'var(--color-accent)'
                          : active
                            ? 'rgba(212,175,98,0.45)'
                            : 'rgba(212,175,98,0.08)',
                        boxShadow: bright ? '0 0 4px rgba(212,175,98,0.6)' : 'none',
                        transition: 'all 0.3s ease',
                      }} />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRACKING SECTION */}
      <section className="section">
        <div className="container">
          <div className="feature-module reveal">
            <div className="feature-visual">
              <div className="timeline-preview">
                <div className="timeline-line"></div>
                <div className="timeline-point" style={{ top: '20%' }}></div>
                <div className="timeline-point" style={{ top: '40%' }}></div>
                <div className="timeline-point active" style={{ top: '60%' }}></div>
                <div className="timeline-point" style={{ top: '80%' }}></div>
              </div>
            </div>
            <div className="feature-details">
              <span className="feature-label">Platform</span>
              <h2 className="mb-6">Intelligent tracking dashboard</h2>
              <p className="text-large text-secondary mb-8">
                Visualize your skin&#39;s evolution with comprehensive timeline tracking and detailed analytics.
              </p>
              <div className="spec-list">
                <div className="spec-item"><h4>Timeline Visualization</h4><p className="text-secondary">See your entire history at a glance</p></div>
                <div className="spec-item"><h4>Comparison Tools</h4><p className="text-secondary">Side-by-side analysis of any two scans</p></div>
                <div className="spec-item"><h4>Progress Metrics</h4><p className="text-secondary">Quantifiable measurements over time</p></div>
                <div className="spec-item"><h4>Export &amp; Share</h4><p className="text-secondary">Generate reports for professionals</p></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROFESSIONAL ACCESS */}
      <section className="section bg-light">
        <div className="container">
          <div className="feature-module reverse reveal">
            <div className="feature-details">
              <span className="feature-label">Collaboration</span>
              <h2 className="mb-6">Professional access</h2>
              <p className="text-large text-secondary mb-8">
                Connect with dermatologists and healthcare professionals for expert consultation and guidance.
              </p>
              <div className="spec-list">
                <div className="spec-item"><h4>Secure Sharing</h4><p className="text-secondary">End-to-end encrypted data transfer</p></div>
                <div className="spec-item"><h4>Consultation Booking</h4><p className="text-secondary">Schedule virtual or in-person appointments</p></div>
                <div className="spec-item"><h4>Professional Network</h4><p className="text-secondary">Access verified dermatologists</p></div>
                <div className="spec-item"><h4>Treatment Tracking</h4><p className="text-secondary">Monitor prescribed treatment effectiveness</p></div>
              </div>
            </div>
            <div className="feature-visual">
              <div className="professional-card" style={{ padding: 0 }}>
                <div className="card" style={{ padding: 'var(--space-5)', maxWidth: '300px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                    <div style={{
                      width: '48px', height: '48px', borderRadius: '50%',
                      background: 'linear-gradient(135deg, var(--color-accent) 0%, #b8860b 100%)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'var(--font-family-display)', fontSize: '1.1rem',
                      color: '#1a1510', fontWeight: 700, flexShrink: 0,
                    }}>RS</div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', fontSize: 'var(--font-size-sm)', marginBottom: '2px' }}>Dr. Rohini Suresh</div>
                      <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>Dermatologist · AIIMS Delhi</div>
                    </div>
                    <span style={{
                      marginLeft: 'auto', flexShrink: 0,
                      fontSize: '0.65rem', fontWeight: 600,
                      padding: '3px 8px', borderRadius: '100px',
                      background: 'rgba(34,197,94,0.1)', color: '#22c55e',
                      letterSpacing: '0.04em',
                    }}>✓ Verified</span>
                  </div>
                  <div style={{ height: '1px', background: 'var(--color-border)', marginBottom: 'var(--space-4)' }} />
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                    15 years experience · Specialises in eczema, psoriasis, and pigmentation disorders.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SPECS */}
      <section className="section">
        <div className="container">
          <h2 className="text-center mb-16 reveal">Technical specifications</h2>
          <div className="specs-grid reveal">
            <div className="spec-category">
              <h4 className="mb-6">Device</h4>
              <table className="spec-table">
                <tbody>
                  <tr><td>Dimensions</td><td>120 × 45 × 30 mm</td></tr>
                  <tr><td>Weight</td><td>180g</td></tr>
                  <tr><td>Battery</td><td>2000mAh Li-ion</td></tr>
                  <tr><td>Battery Life</td><td>500+ scans</td></tr>
                  <tr><td>Charging</td><td>USB-C, 2 hours</td></tr>
                  <tr><td>Connectivity</td><td>Bluetooth 5.2, Wi-Fi</td></tr>
                </tbody>
              </table>
            </div>
            <div className="spec-category">
              <h4 className="mb-6">Imaging</h4>
              <table className="spec-table">
                <tbody>
                  <tr><td>Sensor</td><td>20MP CMOS</td></tr>
                  <tr><td>Resolution</td><td>5472 × 3648 pixels</td></tr>
                  <tr><td>Magnification</td><td>10x optical</td></tr>
                  <tr><td>Focus</td><td>Auto-focus</td></tr>
                  <tr><td>Illumination</td><td>LED ring light, 6500K</td></tr>
                  <tr><td>Image Format</td><td>RAW, JPEG</td></tr>
                </tbody>
              </table>
            </div>
            <div className="spec-category">
              <h4 className="mb-6">Software</h4>
              <table className="spec-table">
                <tbody>
                  <tr><td>Platforms</td><td>iOS, Android, Web</td></tr>
                  <tr><td>AI Engine</td><td>Proprietary neural network</td></tr>
                  <tr><td>Storage</td><td>Unlimited cloud storage</td></tr>
                  <tr><td>Encryption</td><td>AES-256</td></tr>
                  <tr><td>Compliance</td><td>HIPAA, GDPR</td></tr>
                  <tr><td>Updates</td><td>Over-the-air (OTA)</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section cta-section">
        <div className="container">
          <div className="cta-content reveal">
            <span className="section-label section-label-light" style={{ marginBottom: 'var(--space-6)', display: 'inline-block' }}>Get Started</span>
            <h2 className="mb-6">Experience the technology</h2>
            <p className="mb-8" style={{ fontFamily: 'var(--font-family-accent)', fontSize: 'var(--font-size-lg)' }}>
              Order your NIVARA device and take control of your skin health.
            </p>
            <Link href="/buy" className="btn btn-accent btn-large">Buy Device — $299</Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
