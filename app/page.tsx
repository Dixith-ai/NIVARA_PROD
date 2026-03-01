'use client';

import { useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';
import styles from './page.module.css';

function useReveal() {
  const revealRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
            const label = entry.target.querySelector('.section-label');
            if (label) {
              setTimeout(() => label.classList.add('shimmer-ready'), 200);
            }
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const setRevealRef = useCallback((index: number) => (el: HTMLDivElement | null) => {
    revealRefs.current[index] = el;
  }, []);

  return setRevealRef;
}

export default function HomePage() {
  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const setRevealRef = useReveal();
  let revealIndex = 0;

  useEffect(() => {
    const title = heroTitleRef.current;
    if (!title) return;

    title.style.opacity = '1';
    title.style.animation = 'none';

    const children = Array.from(title.childNodes);
    title.innerHTML = '';

    let wordIndex = 0;

    const createWordSpan = (word: string, index: number) => {
      const outer = document.createElement('span');
      outer.className = 'hero-word';
      const inner = document.createElement('span');
      inner.className = 'hero-word-inner';
      inner.textContent = word;
      inner.style.animationDelay = `${0.08 + index * 0.07}s`;
      outer.appendChild(inner);
      return outer;
    };

    children.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const words = (node.textContent || '').split(/(\s+)/).filter((s) => s.length);
        words.forEach((segment) => {
          if (!/^\s+$/.test(segment)) {
            title.appendChild(createWordSpan(segment, wordIndex++));
          }
        });
      } else if (node.nodeName === 'BR') {
        title.appendChild(document.createElement('br'));
      } else if (node.nodeName === 'EM') {
        const words = (node.textContent || '').split(/(\s+)/).filter((s) => s.length);
        words.forEach((segment) => {
          if (/^\s+$/.test(segment)) return;
          const em = document.createElement('em');
          const span = createWordSpan(segment, wordIndex++);
          em.appendChild(span);
          title.appendChild(em);
        });
      } else {
        title.appendChild((node as Element).cloneNode(true));
      }
    });
  }, []);

  useEffect(() => {
    const targets = document.querySelectorAll('.step-number');
    if (targets.length === 0) return;

    targets.forEach((el) => {
      const text = (el as HTMLElement).textContent?.trim() || '';
      el.setAttribute('data-target', text);
      el.setAttribute('data-count', '');
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const target = el.getAttribute('data-target') || '0';
            const numericValue = parseInt(target, 10);
            const isZeroPadded = target.startsWith('0');
            const duration = 600;
            const startTime = performance.now();

            el.classList.add('counted');

            const step = (currentTime: number) => {
              const elapsed = currentTime - startTime;
              const progress = Math.min(elapsed / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 3);
              const current = Math.floor(eased * numericValue);
              el.textContent = isZeroPadded
                ? String(current).padStart(target.length, '0')
                : String(current);

              if (progress < 1) {
                requestAnimationFrame(step);
              } else {
                el.textContent = target;
              }
            };

            requestAnimationFrame(step);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.3 }
    );

    targets.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const groups = document.querySelectorAll('.grid');
    groups.forEach((group) => {
      const reveals = group.querySelectorAll('.reveal');
      reveals.forEach((el, i) => {
        (el as HTMLElement).style.transitionDelay = `${i * 0.07}s`;
      });
    });
  }, []);

  return (
    <div className={styles.homePage}>
      {/* HERO */}
      <section className="hero sacred-pattern royal-bar">
        <div className="container">
          <div className="hero-content">
            <p className="hero-origin slide-up">
              <span className="heritage-badge"><span className="dot"></span> Indigenously Crafted in India <span className="dot"></span></span>
            </p>
            <h1 ref={heroTitleRef} className="hero-title slide-up" style={{ animationDelay: '0.05s' }}>
              Your skin deserves<br /><em>protection.</em>
            </h1>
            <p className="hero-subtitle slide-up" style={{ animationDelay: '0.15s' }}>
              NIVARA combines precision imaging with intelligent analysis to guard your skin health — rooted in the Sanskrit tradition of <em>nivāra</em>, meaning shelter.
            </p>
            <div className="hero-cta slide-up" style={{ animationDelay: '0.25s' }}>
              <Link href="/buy" className="btn btn-accent btn-large">Buy Device — $299</Link>
              <Link href="/#features" className="btn btn-outline btn-large">Explore Technology</Link>
            </div>
          </div>

          <div className="hero-visual">
            <div className="device-placeholder">
              <div className="device-inner">
                <span className="device-logo">N</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="section">
        <div className="container">
          <div className="section-header reveal" ref={setRevealRef(revealIndex++)}>
            <span className="section-label">Capabilities</span>
            <div className="divider reveal" ref={setRevealRef(revealIndex++)}><span className="divider-gem"></span></div>
            <h2 className="text-center mb-4">Six ways NIVARA<br />understands your skin</h2>
            <p className="text-center text-secondary font-accent" style={{ fontSize: '1.2rem', maxWidth: '460px', margin: '0 auto' }}>Precision engineering meets intelligent design.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" style={{ marginTop: 'var(--space-12)' }}>
            <div className="card reveal" ref={setRevealRef(revealIndex++)}>
              <div className="feature-icon">
                <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
                  <rect x="8" y="8" width="32" height="32" rx="4" stroke="currentColor" strokeWidth="1.5" />
                  <circle cx="24" cy="24" r="6" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </div>
              <h4 className="mb-3">Precision Imaging</h4>
              <p className="text-secondary">Clinical-grade optics capture microscopic detail with exceptional clarity and depth.</p>
            </div>

            <div className="card reveal" ref={setRevealRef(revealIndex++)}>
              <div className="feature-icon">
                <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
                  <path d="M24 8L32 16L24 24L16 16L24 8Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
                  <path d="M24 24L32 32L24 40L16 32L24 24Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
                </svg>
              </div>
              <h4 className="mb-3">AI Analysis</h4>
              <p className="text-secondary">Algorithms trained on millions of images detect patterns invisible to the human eye.</p>
            </div>

            <div className="card reveal" ref={setRevealRef(revealIndex++)}>
              <div className="feature-icon">
                <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
                  <rect x="8" y="12" width="32" height="24" rx="2" stroke="currentColor" strokeWidth="1.5" />
                  <line x1="8" y1="20" x2="40" y2="20" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </div>
              <h4 className="mb-3">Intelligent Tracking</h4>
              <p className="text-secondary">Timeline visualization shows your skin&#39;s evolution over weeks, months, and years.</p>
            </div>

            <div className="card reveal" ref={setRevealRef(revealIndex++)}>
              <div className="feature-icon">
                <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
                  <circle cx="24" cy="24" r="16" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M24 8V24L32 32" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </div>
              <h4 className="mb-3">Real-time Insights</h4>
              <p className="text-secondary">Personalized recommendations based on your unique skin profile and history.</p>
            </div>

            <div className="card reveal" ref={setRevealRef(revealIndex++)}>
              <div className="feature-icon">
                <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
                  <path d="M24 8C15.163 8 8 15.163 8 24C8 32.837 15.163 40 24 40" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M24 8C32.837 8 40 15.163 40 24C40 32.837 32.837 40 24 40" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
                </svg>
              </div>
              <h4 className="mb-3">Secure &amp; Private</h4>
              <p className="text-secondary">End-to-end encryption keeps your health data completely private and protected.</p>
            </div>

            <div className="card reveal" ref={setRevealRef(revealIndex++)}>
              <div className="feature-icon">
                <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
                  <circle cx="18" cy="18" r="6" stroke="currentColor" strokeWidth="1.5" />
                  <circle cx="30" cy="30" r="6" stroke="currentColor" strokeWidth="1.5" />
                  <line x1="22" y1="22" x2="26" y2="26" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </div>
              <h4 className="mb-3">Professional Access</h4>
              <p className="text-secondary">Share insights directly with dermatologists for expert consultation.</p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section how-it-works">
        <div className="container">
          <div className="section-header reveal" ref={setRevealRef(revealIndex++)}>
            <span className="section-label">Process</span>
            <div className="divider reveal" ref={setRevealRef(revealIndex++)}><span className="divider-gem"></span></div>
            <h2 className="text-center mb-4">From capture to insight</h2>
            <p className="text-center text-secondary font-accent" style={{ fontSize: '1.2rem', maxWidth: '420px', margin: '0 auto' }}>Four steps. No complexity.</p>
          </div>

          <div className="steps-container" style={{ marginTop: 'var(--space-12)' }}>
            <div className="step reveal" ref={setRevealRef(revealIndex++)}>
              <div className="step-number">01</div>
              <h4 className="mb-3">Capture</h4>
              <p className="text-secondary text-small">Point the device. High-resolution images in seconds.</p>
            </div>
            <div className="step-connector reveal" ref={setRevealRef(revealIndex++)}></div>
            <div className="step reveal" ref={setRevealRef(revealIndex++)}>
              <div className="step-number">02</div>
              <h4 className="mb-3">Analyze</h4>
              <p className="text-secondary text-small">AI identifies key markers and changes instantly.</p>
            </div>
            <div className="step-connector reveal" ref={setRevealRef(revealIndex++)}></div>
            <div className="step reveal" ref={setRevealRef(revealIndex++)}>
              <div className="step-number">03</div>
              <h4 className="mb-3">Track</h4>
              <p className="text-secondary text-small">Watch your skin&#39;s story unfold on a visual timeline.</p>
            </div>
            <div className="step-connector reveal" ref={setRevealRef(revealIndex++)}></div>
            <div className="step reveal" ref={setRevealRef(revealIndex++)}>
              <div className="step-number">04</div>
              <h4 className="mb-3">Act</h4>
              <p className="text-secondary text-small">Get insights. Connect with professionals if needed.</p>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section testimonials-section">
        <div className="container">
          <div className="section-header reveal" ref={setRevealRef(revealIndex++)}>
            <span className="section-label section-label-light">Stories</span>
            <div className="divider reveal" ref={setRevealRef(revealIndex++)}><span className="divider-gem"></span></div>
            <h2 className="text-center mb-4" style={{ color: 'var(--color-text-inverse)' }}>Trusted by thousands</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" style={{ marginTop: 'var(--space-12)' }}>
            <div className="card card-dark reveal" ref={setRevealRef(revealIndex++)}>
              <p className="testimonial-quote">&ldquo;I&rsquo;d been ignoring a patch on my arm for months. NIVARA flagged it as something worth checking — my dermatologist confirmed it needed treatment. Caught early because of this.&rdquo;</p>
              <div className="testimonial-author">
                <div className="testimonial-initial">P</div>
                <div>
                  <strong>Priya Venkataraman</strong>
                  <span>Software Engineer, Bengaluru</span>
                </div>
              </div>
            </div>

            <div className="card card-dark reveal" ref={setRevealRef(revealIndex++)}>
              <p className="testimonial-quote">&ldquo;The kiosk at my college hospital was so easy to use. Got results in minutes and booked a consultation right after. No long queues, no waiting weeks for an appointment.&rdquo;</p>
              <div className="testimonial-author">
                <div className="testimonial-initial">A</div>
                <div>
                  <strong>Arjun Nair</strong>
                  <span>College Student, Kochi</span>
                </div>
              </div>
            </div>

            <div className="card card-dark reveal" ref={setRevealRef(revealIndex++)}>
              <p className="testimonial-quote">&ldquo;I&rsquo;ve been recommending NIVARA to patients who can&rsquo;t access specialists easily. The differential output is well-structured and genuinely useful for primary care screening.&rdquo;</p>
              <div className="testimonial-author">
                <div className="testimonial-initial">M</div>
                <div>
                  <strong>Dr. Meenakshi Subramaniam</strong>
                  <span>General Practitioner, Chennai</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section cta-section">
        <div className="container">
          <div className="cta-content reveal" ref={setRevealRef(revealIndex++)}>
            <span className="section-label section-label-light" style={{ marginBottom: 'var(--space-6)', display: 'inline-block' }}>Begin Your Journey</span>
            <h2 className="mb-6">Your skin&#39;s guardian,<br />perfected.</h2>
            <p className="mb-8">Join thousands who trust NIVARA to monitor, understand, and protect their skin.</p>
            <div className="flex gap-4 justify-center" style={{ flexWrap: 'wrap' }}>
              <Link href="/buy" className="btn btn-accent btn-large">Buy Device — $299</Link>
              <Link href="/features" className="btn btn-outline btn-large" style={{ borderColor: 'rgba(250,248,244,0.12)', color: 'var(--color-text-inverse)' }}>Explore Technology</Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
