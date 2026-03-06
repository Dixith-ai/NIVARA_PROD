'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { getUserProfile } from '@/lib/firestore';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import styles from './buy.module.css';

function RevealSection({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useIntersectionObserver(ref as React.RefObject<Element | null>, { threshold: 0.08 });
  return (
    <div ref={ref} className={`reveal${visible ? ' active' : ''}${className ? ` ${className}` : ''}`}>
      {children}
    </div>
  );
}

function BuyPageContent() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [alreadyOnWaitlist, setAlreadyOnWaitlist] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (!user) return;

    async function loadUserData() {
      try {
        // Get user profile
        const profile = await getUserProfile(user!.uid);
        if (profile) {
          const fullName = profile.fullName || '';
          const nameParts = fullName.split(' ');
          setFirstName(nameParts[0] || 'there');
          setEmail(profile.email || user!.email || '');
          setCity((profile.location as string) || '');
        } else {
          setFirstName('there');
          setEmail(user!.email || '');
        }

        // Check if already on waitlist
        const q = query(
          collection(db, 'waitlist'),
          where('email', '==', user!.email)
        );
        const snap = await getDocs(q);
        if (!snap.empty) {
          setAlreadyOnWaitlist(true);
          setShowSuccess(true);
        }
      } catch (error) {
        console.error('Failed to load user data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadUserData();
  }, [user]);

  const handleReserve = async () => {
    if (!user) return;
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          email,
          city: city || 'Not provided',
          uid: user.uid,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to submit');
      }

      setShowSuccess(true);
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner} />
      </div>
    );
  }

  return (
    <div className={styles.buyPage}>
      {/* SECTION 1 — HERO */}
      <section className={styles.heroSection}>
        <div className="container">
          <div className={styles.heroContent}>
            <span className="section-label">Early Access</span>
            <h1 className={styles.heroHeading}>
              We are building something<br />for you, <span className={styles.heroAccent}>{firstName}</span>.
            </h1>
            <div className={styles.heroDivider} />
            <p className={styles.heroSubheading}>
              The NIVARA device brings clinical grade skin imaging to your home. Standardised. Precise. Built around you.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 2 — THE DEVICE FEATURES */}
      <section className={styles.featuresSection}>
        <div className="container">
          <RevealSection>
            <div className={styles.featuresSectionHeader}>
              <span className="section-label section-label-light">The Device</span>
              <h2 className={styles.featuresSectionHeading}>
                Everything you need.<br />Nothing you do not.
              </h2>
            </div>
          </RevealSection>

          <div className={styles.featuresGrid}>
            {[
              {
                num: 'I',
                title: 'Clinical Grade Imaging',
                desc: 'Captures standardised, high quality skin images with controlled illumination and consistent results.',
              },
              {
                num: 'II',
                title: 'AI Assisted Diagnosis',
                desc: 'Every scan runs through a differential framework that evaluates multiple conditions, not just one.',
              },
              {
                num: 'III',
                title: 'Scan History',
                desc: 'Your scans are stored chronologically so you can track changes and share your history with a doctor.',
              },
              {
                num: 'IV',
                title: 'Dermatologist Access',
                desc: 'Book a verified dermatologist consultation directly from your scan report without leaving the platform.',
              },
              {
                num: 'V',
                title: 'Private by Design',
                desc: 'Your data is encrypted and never shared without your explicit consent.',
              },
              {
                num: 'VI',
                title: 'Built for India',
                desc: 'Designed for home use, clinic integration, and eventual kiosk deployment across the country.',
              },
            ].map((feature, idx) => (
              <RevealSection key={idx}>
                <div className={styles.featureItem} style={{ animationDelay: `${idx * 0.1}s` }}>
                  <div className={styles.featureNum}>{feature.num}</div>
                  <div className={styles.featureNumLine} />
                  <h3 className={styles.featureTitle}>{feature.title}</h3>
                  <p className={styles.featureDesc}>{feature.desc}</p>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3 — THE MOMENT / SUCCESS */}
      <section className={styles.ctaSection}>
        <div className="container">
          <div className={styles.ctaContent}>
            {showSuccess ? (
              /* SUCCESS STATE */
              <>
                <svg className={styles.successIcon} width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <h2 className={styles.ctaHeading}>
                  You are on the list, {firstName}.
                </h2>
                <div className={styles.ctaDivider} />
                <p className={styles.ctaBody}>
                  We will be in touch when the device is ready. Check your email for a confirmation from us.
                </p>
                <Link href="/demo" className="btn btn-primary btn-large">
                  Try the Free Demo
                </Link>
              </>
            ) : (
              /* JOIN STATE */
              <>
                <p className={styles.ctaLabel}>Early access. Limited availability.</p>
                <h2 className={styles.ctaHeading}>
                  {firstName}, you are<br />one step away.
                </h2>
                <div className={styles.ctaDivider} />
                <p className={styles.ctaBody}>
                  Join the waitlist and we will reach out personally when the device is ready. Early access pricing. Priority shipping. No obligations.
                </p>
                <button
                  className="btn btn-primary btn-large"
                  onClick={handleReserve}
                  disabled={isSubmitting}
                  style={{ minWidth: '240px' }}
                >
                  {isSubmitting ? 'Reserving...' : 'Reserve My Spot'}
                </button>
                {submitError && (
                  <p className={styles.ctaError}>{submitError}</p>
                )}
                <div className={styles.ctaMicro}>
                  <p>Joining as {firstName} via {email}</p>
                  <p>No payment required. No spam. Cancel any time.</p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default function BuyPage() {
  return (
    <ProtectedRoute>
      <BuyPageContent />
    </ProtectedRoute>
  );
}
