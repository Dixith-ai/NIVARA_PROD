import type { Metadata } from 'next';
import Link from 'next/link';
import Footer from '@/components/Footer';
import styles from './features.module.css';

export const metadata: Metadata = {
  title: 'How It Works — NIVARA',
  description: 'NIVARA combines structured imaging with AI assisted differential diagnosis. Clinical thinking, accessible to everyone.',
};

export default function FeaturesPage() {
  return (
    <div className={styles.featuresPage}>
      {/* HERO */}
      <section className="page-hero sacred-pattern royal-bar">
        <div className="container">
          <span className="section-label slide-up">How It Works</span>
          <div className="divider slide-up reveal"><span className="divider-gem"></span></div>
          <h1 className="slide-up" style={{ animationDelay: '0.05s' }}>Clinical thinking.<br /><em>Accessible to everyone.</em></h1>
          <p className="hero-subtitle font-accent slide-up" style={{ animationDelay: '0.15s' }}>
            NIVARA combines structured imaging with AI assisted differential diagnosis. The same framework a dermatologist uses, available without a clinic visit.
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
              <span className="feature-label">The Device</span>
              <h2 className="mb-6">A purpose built skin imaging device.</h2>
              <p className="text-large text-secondary mb-8">
                The NIVARA device is designed for one thing. Capturing standardised, high quality skin images that produce consistent, clinically useful results. Currently in development.
              </p>
              <div className="spec-list">
                <div className="spec-item"><h4>Standardised Imaging</h4><p className="text-secondary">Captures consistent images regardless of lighting conditions or user technique.</p></div>
                <div className="spec-item"><h4>Controlled Illumination</h4><p className="text-secondary">Built in lighting eliminates shadows and flash artefacts that distort skin tone and texture.</p></div>
                <div className="spec-item"><h4>Portable</h4><p className="text-secondary">Compact enough to carry. Designed for home use, clinic integration, and kiosk deployment.</p></div>
                <div className="spec-item"><h4>Wireless Sync</h4><p className="text-secondary">Connects directly to your NIVARA account. Results available instantly on any device.</p></div>
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
              <span className="feature-label accent">The Analysis</span>
              <h2 className="mb-6 text-inverse">Not one answer. A ranked differential.</h2>
              <p className="text-large text-secondary mb-8">
                Most consumer skin tools return a single condition name. NIVARA evaluates multiple possible conditions, assigns confidence scores to each, and presents them in order of likelihood. The way clinical differential diagnosis actually works.
              </p>
              <div className="spec-list">
                <div className="spec-item"><h4 className="text-inverse">Differential Framework</h4><p className="text-secondary">Evaluates conditions in parallel, not in sequence. Every result includes alternative possibilities.</p></div>
                <div className="spec-item"><h4 className="text-inverse">Confidence Scoring</h4><p className="text-secondary">Each condition is assigned a confidence percentage based on visual pattern analysis.</p></div>
                <div className="spec-item"><h4 className="text-inverse">Condition Descriptions</h4><p className="text-secondary">Every result includes a plain language explanation of what the condition is and what to watch for.</p></div>
                <div className="spec-item"><h4 className="text-inverse">Not a Diagnosis</h4><p className="text-secondary">NIVARA is a screening tool. Results are a starting point for professional consultation, not a replacement.</p></div>
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
              <span className="feature-label">The Platform</span>
              <h2 className="mb-6">Your skin history, in one place.</h2>
              <p className="text-large text-secondary mb-8">
                Every scan you take is stored against your profile. Track changes over time, compare results, and share your history directly with a dermatologist.
              </p>
              <div className="spec-list">
                <div className="spec-item"><h4>Scan History</h4><p className="text-secondary">Every scan stored chronologically with full results and condition breakdowns.</p></div>
                <div className="spec-item"><h4>Progress Tracking</h4><p className="text-secondary">See how a condition has changed between scans. Improving, stable, or worth a closer look.</p></div>
                <div className="spec-item"><h4>Shareable Reports</h4><p className="text-secondary">Generate a clean PDF report from any scan to share with your doctor or keep for your records.</p></div>
                <div className="spec-item"><h4>Appointment Integration</h4><p className="text-secondary">Book a dermatologist consultation directly from your scan report, without leaving the platform.</p></div>
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
              <span className="feature-label">The Doctors</span>
              <h2 className="mb-6">When the scan says consult someone.</h2>
              <p className="text-large text-secondary mb-8">
                NIVARA connects you with verified dermatologists for proper evaluation when your results warrant it. Browse by specialisation, location, and availability and book directly through the platform.
              </p>
              <div className="spec-list">
                <div className="spec-item"><h4>Verified Network</h4><p className="text-secondary">Every dermatologist on NIVARA is verified and licensed to practice.</p></div>
                <div className="spec-item"><h4>Direct Booking</h4><p className="text-secondary">Schedule consultations directly from your scan report or browse the full directory.</p></div>
                <div className="spec-item"><h4>Specialisation Filters</h4><p className="text-secondary">Find doctors who specialise in the condition your scan identified.</p></div>
                <div className="spec-item"><h4>Consultation History</h4><p className="text-secondary">All appointments and doctor interactions stored in your account.</p></div>
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
          <div className="reveal" style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
            <span className="section-label">Device Specifications</span>
            <h2 className="mb-6" style={{ marginTop: 'var(--space-4)' }}>Full specifications coming soon.</h2>
            <p className="text-large text-secondary mb-8">
              The NIVARA device is currently in development. Detailed technical specifications will be published ahead of launch.
            </p>
            <Link href="/demo" className="btn btn-primary btn-large">Try the Free Demo</Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section cta-section">
        <div className="container">
          <div className="cta-content reveal">
            <span className="section-label section-label-light" style={{ marginBottom: 'var(--space-6)', display: 'inline-block' }}>Try It Now</span>
            <h2 className="mb-6">The demo is live. No device needed.</h2>
            <p className="mb-8" style={{ fontFamily: 'var(--font-family-accent)', fontSize: 'var(--font-size-lg)' }}>
              Experience the differential diagnosis system directly in your browser. Free, instant, no equipment required.
            </p>
            <Link href="/demo" className="btn btn-accent btn-large">Try the Free Demo</Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
