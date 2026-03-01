import type { Metadata } from 'next';
import Link from 'next/link';
import Footer from '@/components/Footer';
import styles from './learn.module.css';

export const metadata: Metadata = {
  title: 'Learn — NIVARA',
  description: 'Learn about skin health — NIVARA knowledge hub',
};

export default function LearnPage() {
  return (
    <div className={styles.learnPage}>
      <section className="page-hero sacred-pattern royal-bar">
        <div className="container">
          <span className="section-label slide-up">Knowledge</span>
          <div className="divider slide-up"><span className="divider-gem"></span></div>
          <h1 className="slide-up" style={{ animationDelay: '0.05s' }}>Knowledge hub</h1>
          <p className="hero-subtitle font-accent slide-up" style={{ animationDelay: '0.15s' }}>
            Evidence-based insights on skin health, technology, and care
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <article className="featured-article reveal">
            <div className="article-content">
              <span className="article-category">Featured</span>
              <h2 className="mb-4">Understanding skin imaging technology</h2>
              <p className="text-large text-secondary mb-6">
                How advanced imaging and AI analysis work together to provide unprecedented insights into skin health.
              </p>
            </div>
            <div className="article-visual">
              <div className="article-placeholder">
                <svg width="64" height="64" viewBox="0 0 80 80" fill="none">
                  <rect x="10" y="10" width="60" height="60" rx="8" stroke="currentColor" strokeWidth="1.5" />
                  <circle cx="40" cy="40" r="12" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="section bg-light">
        <div className="container">
          <div className="content-section reveal">
            <h3 className="section-title mb-8">Skin health fundamentals</h3>
            <div className="article-grid">
              <article className="article-card">
                <span className="article-tag">Guide</span>
                <h4 className="mb-3">Early detection matters</h4>
                <p className="text-secondary mb-4">Why regular skin monitoring is crucial for identifying changes early.</p>
              </article>
              <article className="article-card">
                <span className="article-tag">Research</span>
                <h4 className="mb-3">UV exposure and skin damage</h4>
                <p className="text-secondary mb-4">Understanding the long-term effects of sun exposure on skin health.</p>
              </article>
              <article className="article-card">
                <span className="article-tag">Guide</span>
                <h4 className="mb-3">Skin types and care</h4>
                <p className="text-secondary mb-4">Personalised approaches to skin health based on your unique characteristics.</p>
              </article>
            </div>
          </div>

          <div className="section-divider"></div>

          <div className="content-section reveal">
            <h3 className="section-title mb-8">Technology insights</h3>
            <div className="article-grid">
              <article className="article-card">
                <span className="article-tag">Technology</span>
                <h4 className="mb-3">How AI analyzes skin images</h4>
                <p className="text-secondary mb-4">The science behind pattern recognition and anomaly detection.</p>
              </article>
              <article className="article-card">
                <span className="article-tag">Technology</span>
                <h4 className="mb-3">Clinical-grade imaging explained</h4>
                <p className="text-secondary mb-4">What makes NIVARA&apos;s imaging technology medical-grade.</p>
              </article>
              <article className="article-card">
                <span className="article-tag">Privacy</span>
                <h4 className="mb-3">Data security and privacy</h4>
                <p className="text-secondary mb-4">How we protect your sensitive health information.</p>
              </article>
            </div>
          </div>

          <div className="section-divider"></div>

          <div className="content-section reveal">
            <h3 className="section-title mb-8">Best practices</h3>
            <div className="article-grid">
              <article className="article-card">
                <span className="article-tag">Tutorial</span>
                <h4 className="mb-3">Getting started with NIVARA</h4>
                <p className="text-secondary mb-4">Step-by-step guide to your first scan and dashboard setup.</p>
              </article>
              <article className="article-card">
                <span className="article-tag">Tutorial</span>
                <h4 className="mb-3">Optimal scanning techniques</h4>
                <p className="text-secondary mb-4">Tips for capturing the clearest, most useful images.</p>
              </article>
              <article className="article-card">
                <span className="article-tag">Guide</span>
                <h4 className="mb-3">Interpreting your results</h4>
                <p className="text-secondary mb-4">Understanding AI insights and when to consult a professional.</p>
              </article>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
