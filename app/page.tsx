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
        const words = (node.textContent || '').split(/\s+/).filter((s) => s.length);
        words.forEach((word, idx) => {
          const em = document.createElement('em');
          const span = createWordSpan(word, wordIndex++);
          em.appendChild(span);
          title.appendChild(em);
          // Add space after each word except the last
          if (idx < words.length - 1) {
            title.appendChild(document.createTextNode(' '));
          }
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
              <span className="heritage-badge"><span className="dot"></span> Free Demo Available <span className="dot"></span></span>
            </p>
            <h1 ref={heroTitleRef} className="hero-title slide-up" style={{ animationDelay: '0.05s' }}>
              Skin analysis that used to<br /> <em>require a clinic visit.</em>
            </h1>
            <p className="hero-subtitle slide-up" style={{ animationDelay: '0.15s' }}>
              NIVARA brings clinical grade skin screening to anyone. No appointment. No waiting room. No specialist required. Upload a photo and receive a structured differential diagnosis in under a minute.
            </p>
            <div className="hero-cta slide-up" style={{ animationDelay: '0.25s' }}>
              <Link href="/demo" className="btn btn-accent btn-large">Try the Free Demo</Link>
              <Link href="/features" className="btn btn-outline btn-large">How It Works</Link>
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
            <span className="section-label">What NIVARA Does</span>
            <div className="divider reveal" ref={setRevealRef(revealIndex++)}><span className="divider-gem"></span></div>
            <h2 className="text-center mb-4">Built for early detection.<br />Not guesswork.</h2>
            <p className="text-center text-secondary font-accent" style={{ fontSize: '1.2rem', maxWidth: '460px', margin: '0 auto' }}>Most tools give you one answer. NIVARA evaluates multiple possible conditions and ranks them. The way a clinician thinks.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" style={{ marginTop: 'var(--space-12)' }}>
            <div className="card reveal" ref={setRevealRef(revealIndex++)}>
              <div className="feature-icon">
                <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
                  <rect x="8" y="8" width="32" height="32" rx="4" stroke="currentColor" strokeWidth="1.5" />
                  <circle cx="24" cy="24" r="6" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </div>
              <h4 className="mb-3">Differential Diagnosis</h4>
              <p className="text-secondary">Not a single guess. A ranked analysis of what your skin could be showing, with confidence scores for each.</p>
            </div>

            <div className="card reveal" ref={setRevealRef(revealIndex++)}>
              <div className="feature-icon">
                <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
                  <path d="M24 8L32 16L24 24L16 16L24 8Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
                  <path d="M24 24L32 32L24 40L16 32L24 24Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
                </svg>
              </div>
              <h4 className="mb-3">AI Assisted Analysis</h4>
              <p className="text-secondary">Trained on clinical imaging data to detect patterns, pigmentation changes, and anomalies across skin conditions.</p>
            </div>

            <div className="card reveal" ref={setRevealRef(revealIndex++)}>
              <div className="feature-icon">
                <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
                  <rect x="8" y="12" width="32" height="24" rx="2" stroke="currentColor" strokeWidth="1.5" />
                  <line x1="8" y1="20" x2="40" y2="20" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </div>
              <h4 className="mb-3">Scan History</h4>
              <p className="text-secondary">Every scan is stored against your profile. Track changes, monitor progress, and share your history with a doctor.</p>
            </div>

            <div className="card reveal" ref={setRevealRef(revealIndex++)}>
              <div className="feature-icon">
                <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
                  <circle cx="24" cy="24" r="16" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M24 8V24L32 32" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </div>
              <h4 className="mb-3">Personalised Insights</h4>
              <p className="text-secondary">Results are contextualised to your skin type, history, and reported concerns. Not generic advice.</p>
            </div>

            <div className="card reveal" ref={setRevealRef(revealIndex++)}>
              <div className="feature-icon">
                <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
                  <path d="M24 8C15.163 8 8 15.163 8 24C8 32.837 15.163 40 24 40" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M24 8C32.837 8 40 15.163 40 24C40 32.837 32.837 40 24 40" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
                </svg>
              </div>
              <h4 className="mb-3">Private by Design</h4>
              <p className="text-secondary">Your scan data is yours. Encrypted, secure, and never sold or shared without your explicit consent.</p>
            </div>

            <div className="card reveal" ref={setRevealRef(revealIndex++)}>
              <div className="feature-icon">
                <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
                  <circle cx="18" cy="18" r="6" stroke="currentColor" strokeWidth="1.5" />
                  <circle cx="30" cy="30" r="6" stroke="currentColor" strokeWidth="1.5" />
                  <line x1="22" y1="22" x2="26" y2="26" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </div>
              <h4 className="mb-3">Dermatologist Access</h4>
              <p className="text-secondary">Found something worth investigating? Connect with a verified dermatologist directly through NIVARA.</p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section how-it-works">
        <div className="container">
          <div className="section-header reveal" ref={setRevealRef(revealIndex++)}>
            <span className="section-label">How It Works</span>
            <div className="divider reveal" ref={setRevealRef(revealIndex++)}><span className="divider-gem"></span></div>
            <h2 className="text-center mb-4">From photo to diagnosis<br />in under a minute.</h2>
            <p className="text-center text-secondary font-accent" style={{ fontSize: '1.2rem', maxWidth: '420px', margin: '0 auto' }}>No device needed for the demo. Just a photo.</p>
          </div>

          <div className="steps-container" style={{ marginTop: 'var(--space-12)' }}>
            <div className="step reveal" ref={setRevealRef(revealIndex++)}>
              <div className="step-number">01</div>
              <h4 className="mb-3">Upload</h4>
              <p className="text-secondary text-small">Take a clear photo of the area you are concerned about and upload it directly from your phone or computer.</p>
            </div>
            <div className="step-connector reveal" ref={setRevealRef(revealIndex++)}></div>
            <div className="step reveal" ref={setRevealRef(revealIndex++)}>
              <div className="step-number">02</div>
              <h4 className="mb-3">Analyse</h4>
              <p className="text-secondary text-small">Our AI evaluates the image against a clinical differential framework and identifies the most likely conditions.</p>
            </div>
            <div className="step-connector reveal" ref={setRevealRef(revealIndex++)}></div>
            <div className="step reveal" ref={setRevealRef(revealIndex++)}>
              <div className="step-number">03</div>
              <h4 className="mb-3">Review</h4>
              <p className="text-secondary text-small">Receive a full ranked report with confidence scores, condition descriptions, and what to watch for.</p>
            </div>
            <div className="step-connector reveal" ref={setRevealRef(revealIndex++)}></div>
            <div className="step reveal" ref={setRevealRef(revealIndex++)}>
              <div className="step-number">04</div>
              <h4 className="mb-3">Consult</h4>
              <p className="text-secondary text-small">If the result warrants it, book a consultation with a verified dermatologist directly from your report.</p>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section testimonials-section">
        <div className="container">
          <div className="section-header reveal" ref={setRevealRef(revealIndex++)}>
            <span className="section-label section-label-light">Early Users</span>
            <div className="divider reveal" ref={setRevealRef(revealIndex++)}><span className="divider-gem"></span></div>
            <h2 className="text-center mb-4" style={{ color: 'var(--color-text-inverse)' }}>What people are saying.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" style={{ marginTop: 'var(--space-12)' }}>
            <div className="card card-dark reveal" ref={setRevealRef(revealIndex++)}>
              <p className="testimonial-quote">&ldquo;I had been putting off checking a patch on my arm for months. The scan flagged it clearly and I finally booked a doctor. Turned out to be something that needed early attention.&rdquo;</p>
              <div className="testimonial-author">
                <div className="testimonial-initial">E</div>
                <div>
                  <strong>NIVARA User</strong>
                  <span>Bengaluru</span>
                </div>
              </div>
            </div>

            <div className="card card-dark reveal" ref={setRevealRef(revealIndex++)}>
              <p className="testimonial-quote">&ldquo;Simple to use and the results actually made sense. It did not just say see a doctor. It told me what it might be and why.&rdquo;</p>
              <div className="testimonial-author">
                <div className="testimonial-initial">E</div>
                <div>
                  <strong>NIVARA User</strong>
                  <span>Kochi</span>
                </div>
              </div>
            </div>

            <div className="card card-dark reveal" ref={setRevealRef(revealIndex++)}>
              <p className="testimonial-quote">&ldquo;The differential output is structured in a way that is genuinely useful for primary care. I have started recommending it to patients who cannot access a specialist easily.&rdquo;</p>
              <div className="testimonial-author">
                <div className="testimonial-initial">G</div>
                <div>
                  <strong>General Practitioner</strong>
                  <span>Chennai</span>
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
            <span className="section-label section-label-light" style={{ marginBottom: 'var(--space-6)', display: 'inline-block' }}>Get Started</span>
            <h2 className="mb-6">Try it now.<br />No device needed.</h2>
            <p className="mb-8">The demo is free. Upload a photo of your concern and receive a full AI assisted differential diagnosis. No appointment. No equipment. No cost.</p>
            <div className="flex gap-4 justify-center" style={{ flexWrap: 'wrap' }}>
              <Link href="/demo" className="btn btn-accent btn-large">Try the Free Demo</Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
