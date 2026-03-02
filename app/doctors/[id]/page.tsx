'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import Footer from '@/components/Footer';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import styles from './page.module.css';
import { useAuth } from '@/context/AuthContext';
import { getDoctorById, createAppointment, getUserProfile } from '@/lib/firestore';
import type { Doctor } from '@/types/doctor';

/* ══════════════════════════════════════════════
   HELPERS
   ══════════════════════════════════════════════ */
function getInitials(name: string) {
    return name.replace('Dr. ', '').split(' ').map((w) => w[0]).slice(0, 2).join('');
}

function StarRating({ rating, size = 12 }: { rating: number; size?: number }) {
    return (
        <div className={styles.stars}>
            {[1, 2, 3, 4, 5].map((s) => (
                <svg key={s} width={size} height={size} viewBox="0 0 24 24"
                    fill={s <= Math.round(rating) ? 'currentColor' : 'none'}
                    stroke="currentColor" strokeWidth="1.5">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
            ))}
        </div>
    );
}

function RevealSection({ children, className }: { children: React.ReactNode; className?: string }) {
    const ref = useRef<HTMLDivElement>(null);
    const visible = useIntersectionObserver(ref as React.RefObject<Element | null>, { threshold: 0.05 });
    return (
        <div ref={ref} className={`reveal${visible ? ' active' : ''}${className ? ` ${className}` : ''}`}>
            {children}
        </div>
    );
}

/* ══════════════════════════════════════════════
   MAIN PAGE
   ══════════════════════════════════════════════ */
export default function DoctorProfilePage() {
    const params = useParams();
    const doctorId = typeof params.id === 'string' ? params.id : '';
    const router = useRouter();
    const { user } = useAuth();

    /* ── Data state ── */
    const [doctor, setDoctor] = useState<Doctor | null>(null);
    const [pageLoading, setPageLoading] = useState(true);
    const [patientName, setPatientName] = useState('');

    /* ── SmartMatch from last scan ── */
    const [smartMatchCondition, setSmartMatchCondition] = useState<string | null>(null);

    /* ── Booking state ── */
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [patientNote, setPatientNote] = useState('');
    const [bookingState, setBookingState] = useState<'idle' | 'loading' | 'success'>('idle');

    /* ── Load doctor + patient profile ── */
    useEffect(() => {
        if (!doctorId) return;
        async function load() {
            try {
                const [doc, profile] = await Promise.all([
                    getDoctorById(doctorId),
                    user ? getUserProfile(user.uid) : Promise.resolve(null),
                ]);
                if (!doc) { router.push('/doctors'); return; }
                setDoctor(doc);
                // Set default selected date to first available date
                const dates = Object.keys(doc.availableSlots);
                if (dates.length > 0) setSelectedDate(dates[0]);
                // Patient name for booking
                const fullName = (profile?.fullName as string) || user?.displayName || '';
                setPatientName(fullName);
            } catch (err) {
                console.error('Failed to load doctor:', err);
                router.push('/doctors');
            } finally {
                setPageLoading(false);
            }
        }
        load();
    }, [doctorId, user, router]);

    /* ── SmartMatch from localStorage ── */
    useEffect(() => {
        try {
            const raw = localStorage.getItem('nivara_last_scan');
            if (raw) {
                const scan = JSON.parse(raw);
                setSmartMatchCondition(scan.topCondition || null);
            }
        } catch { /* ignore */ }
    }, []);

    /* ── Booking handler — real Firestore write ── */
    const handleBook = async () => {
        if (!selectedSlot || !user || !doctor || bookingState === 'loading') return;
        setBookingState('loading');

        // Read scan context from localStorage
        let scanId: string | null = null;
        let topCondition: string | null = null;
        let severity: string | null = null;
        try {
            const raw = localStorage.getItem('nivara_last_scan');
            if (raw) {
                const scan = JSON.parse(raw);
                scanId = scan.scanId || null;
                topCondition = scan.topCondition || null;
                severity = scan.severity || null;
            }
        } catch { /* ignore */ }

        try {
            await createAppointment({
                patientId: user.uid,
                patientName: patientName || user.displayName || 'Patient',
                patientEmail: user.email || '',
                doctorId: doctor.id,
                doctorName: doctor.name,
                doctorSpecialization: doctor.specialization,
                doctorHospital: doctor.hospital,
                requestedDate: selectedDate,
                requestedTime: selectedSlot,
                note: patientNote,
                status: 'pending',
                createdAt: new Date().toISOString(),
                scanId,
                topCondition,
                severity,
            });
            setBookingState('success');
            // Fire appointment confirmation email — non-blocking
            if (user.email) {
                fetch('/api/email/appointment-confirm', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        to: user.email,
                        firstName: patientName.split(' ')[0] || 'there',
                        doctorName: doctor.name,
                        specialization: doctor.specialization,
                        hospital: doctor.hospital,
                        requestedDate: selectedDate,
                        requestedTime: selectedSlot,
                    }),
                }).catch(console.error);
            }
        } catch (err) {
            console.error('Failed to create appointment:', err);
            setBookingState('idle');
        }
    };

    /* ── Loading state ── */
    if (pageLoading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--color-bg)' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', border: '2.5px solid var(--color-border)', borderTopColor: 'var(--color-accent)', animation: 'spin 0.8s linear infinite' }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    if (!doctor) return null;

    /* ── Derived values ── */
    const isToday = doctor.availability === 'Available Today';
    const consultTags = doctor.consultationType === 'Both' ? ['In-Person', 'Video'] : [doctor.consultationType];
    const dates = Object.keys(doctor.availableSlots);
    const currentSlots = doctor.availableSlots[selectedDate] ?? [];
    const isSmartMatch = smartMatchCondition
        ? doctor.conditions.some(c => c.toLowerCase() === smartMatchCondition.toLowerCase())
        : false;

    return (
        <main className={styles.profilePage}>

            {/* ════════════ BETA STRIP ════════════ */}
            <div style={{
                background: 'rgba(255,255,255,0.03)',
                borderBottom: '1px solid rgba(201,168,76,0.15)',
                padding: '8px 16px',
                textAlign: 'center',
                fontSize: '12px',
                color: '#C9A84C',
                letterSpacing: '0.01em',
            }}>
                NIVARA is currently in beta. Doctor profiles shown are demonstrations of the platform&apos;s capabilities.
            </div>

            {/* ════════════ 1. HERO ════════════ */}
            <section className={styles.hero} style={{ borderBottom: '1px solid var(--color-border)' }}>
                <div className="container">
                    <div className={`slide-up ${styles.heroInner}`}>

                        {/* Avatar */}
                        <div className={styles.avatarCol}>
                            <div className={styles.heroAvatar}>{getInitials(doctor.name)}</div>
                            <div className={styles.verifiedBadge}>
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                                NIVARA Verified
                            </div>
                        </div>

                        {/* Info */}
                        <div className={styles.heroInfo} style={{ position: 'relative' }}>
                            <span style={{
                                position: 'absolute', top: 0, right: 0,
                                fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em',
                                textTransform: 'uppercase', color: '#C9A84C',
                                border: '1px solid rgba(201,168,76,0.5)', background: 'transparent',
                                padding: '2px 8px', borderRadius: '4px', pointerEvents: 'none',
                            }}>Demo Profile</span>
                            {isSmartMatch && smartMatchCondition && (
                                <div className={styles.smartMatchTag}>
                                    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                    </svg>
                                    Recommended for your {smartMatchCondition} scan
                                </div>
                            )}

                            <h1 className={styles.heroName}>{doctor.name}</h1>
                            <span className={styles.specializationTag}>{doctor.specialization}</span>

                            <div className={styles.heroMeta}>
                                <div className={styles.metaRow}>
                                    <svg className={styles.metaIcon} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
                                    </svg>
                                    {doctor.hospital}
                                </div>
                                <div className={styles.metaRow}>
                                    <svg className={styles.metaIcon} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                                    </svg>
                                    {doctor.experience} years of experience
                                </div>
                                <div className={styles.ratingRow}>
                                    <StarRating rating={doctor.rating} size={14} />
                                    <span className={styles.ratingNum}>{doctor.rating}</span>
                                    <span className={styles.reviewCount}>({doctor.reviews} reviews)</span>
                                </div>
                                <div className={styles.langRow}>
                                    <svg className={styles.metaIcon} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" />
                                        <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
                                    </svg>
                                    {doctor.languages.map((l) => <span key={l} className={styles.langTag}>{l}</span>)}
                                </div>
                                <div className={styles.availRow}>
                                    <span className={`${styles.availDot} ${isToday ? styles.availDotGreen : styles.availDotMuted}`} />
                                    <span className={isToday ? styles.availTextGreen : styles.availTextMuted}>{doctor.availability}</span>
                                </div>
                                <div className={styles.consultRow}>
                                    {consultTags.map((t) => <span key={t} className={styles.consultTag}>{t}</span>)}
                                </div>
                            </div>

                            <div className={styles.heroActions}>
                                <a
                                    href="#booking"
                                    className="btn btn-primary btn-large"
                                    onClick={(e) => { e.preventDefault(); document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' }); }}
                                >
                                    Book Appointment
                                </a>
                                <Link href="/doctors" className="btn btn-outline btn-large" style={{ color: 'var(--color-text-primary)', borderColor: 'var(--color-border-warm)' }}>
                                    ← Back to Doctors
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="container">

                {/* ════════════ 2. ABOUT ════════════ */}
                <RevealSection className={styles.section}>
                    <span className="section-label">About</span>
                    <h2 className={styles.sectionTitle}>Professional Overview</h2>
                    <p className={styles.bioParagraph}>{doctor.bio}</p>
                    {doctor.focus && <p className={styles.bioParagraph}>{doctor.focus}</p>}
                </RevealSection>

                {/* ════════════ 3. CONDITIONS ════════════ */}
                <RevealSection className={styles.section}>
                    <span className="section-label">Specializations</span>
                    <h2 className={styles.sectionTitle}>Conditions Treated</h2>
                    <div className={styles.conditionGrid}>
                        {doctor.conditions.map((c) => (
                            <span
                                key={c}
                                className={`${styles.conditionTag}${smartMatchCondition && c.toLowerCase() === smartMatchCondition.toLowerCase() ? ` ${styles.conditionTagHighlighted}` : ''}`}
                            >
                                {smartMatchCondition && c.toLowerCase() === smartMatchCondition.toLowerCase() && '✦ '}
                                {c}
                            </span>
                        ))}
                    </div>
                </RevealSection>

                {/* ════════════ 4. CREDENTIALS ════════════ */}
                <RevealSection className={styles.section}>
                    <span className="section-label">Credentials</span>
                    <h2 className={styles.sectionTitle}>Education &amp; Affiliations</h2>
                    <div className={styles.credGrid}>
                        <div className={styles.credGroup}>
                            <span className={styles.credGroupTitle}>Education</span>
                            {doctor.credentials.education.map((e) => (
                                <div key={e.degree} className={styles.educationCard}>
                                    <p className={styles.eduDegree}>{e.degree}</p>
                                    <p className={styles.eduDetail}>{e.institution} · {e.year}</p>
                                </div>
                            ))}
                        </div>
                        <div className={styles.credGroup}>
                            <span className={styles.credGroupTitle}>Hospital Affiliations</span>
                            <ul className={styles.credList}>
                                {doctor.credentials.affiliations.map((a) => (
                                    <li key={a} className={styles.credListItem}>
                                        <span className={styles.credBullet} />{a}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className={styles.credGroup}>
                            <span className={styles.credGroupTitle}>Certifications &amp; Memberships</span>
                            <ul className={styles.credList}>
                                {doctor.credentials.certifications.map((c) => (
                                    <li key={c} className={styles.credListItem}>
                                        <span className={styles.credBullet} />{c}
                                    </li>
                                ))}
                            </ul>
                            <div>
                                <p className={styles.credGroupTitle} style={{ marginBottom: 'var(--space-1)' }}>Registration</p>
                                <div className={styles.regNumber}>{doctor.credentials.registrationNumber}</div>
                            </div>
                        </div>
                    </div>
                </RevealSection>

                {/* ════════════ 5. REVIEWS ════════════ */}
                <RevealSection className={styles.section}>
                    <span className="section-label">Patient Reviews</span>
                    <h2 className={styles.sectionTitle}>What Patients Say</h2>

                    <div className={styles.reviewsHeader}>
                        <div className={styles.overallRating}>
                            <span className={styles.overallNum}>{doctor.rating}</span>
                            <StarRating rating={doctor.rating} size={16} />
                            <span className={styles.overallTotal}>{doctor.reviews} reviews</span>
                        </div>
                        <div className={styles.ratingBars}>
                            {[5, 4, 3, 2, 1].map((star) => (
                                <div key={star} className={styles.ratingBar}>
                                    <span className={styles.barLabel}>{star} ★</span>
                                    <div className={styles.barTrack}>
                                        <div className={styles.barFill} style={{ width: `${doctor.ratingBreakdown[String(star)] ?? 0}%` }} />
                                    </div>
                                    <span className={styles.barPct}>{doctor.ratingBreakdown[String(star)] ?? 0}%</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={styles.reviewsGrid}>
                        {doctor.patientReviews.map((r) => (
                            <div key={r.name} className={`card ${styles.reviewCard}`}>
                                <div className={styles.reviewMeta}>
                                    <div className={styles.reviewerInfo}>
                                        <span className={styles.reviewerName}>{r.name}</span>
                                        <span className={styles.reviewDate}>{r.date}</span>
                                    </div>
                                    <span className={styles.verifiedPatient}>
                                        <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                        Verified
                                    </span>
                                </div>
                                <StarRating rating={r.rating} size={12} />
                                <p className={styles.reviewText}>&ldquo;{r.text}&rdquo;</p>
                            </div>
                        ))}
                    </div>

                    <button className="btn btn-outline" style={{ color: 'var(--color-text-primary)', borderColor: 'var(--color-border-warm)' }}>
                        Load More Reviews
                    </button>
                </RevealSection>

            </div>

            {/* ════════════ 6. BOOKING ════════════ */}
            <section id="booking" className={styles.bookingSection}>
                <div className="container">
                    <RevealSection>
                        <span className="section-label">Book an Appointment</span>
                        <h2 className={styles.sectionTitle} style={{ marginTop: 'var(--space-3)' }}>Schedule a Consultation</h2>

                        {bookingState === 'success' ? (
                            /* ── Success state ── */
                            <div className={`card ${styles.successCard}`} style={{ maxWidth: 560 }}>
                                <div className={styles.successIcon}>
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                </div>
                                <h3 className={styles.successTitle}>Appointment Request Sent</h3>
                                <p className={styles.successDesc}>
                                    {doctor.name} will confirm your request within 24 hours. You can track the status in your Profile.
                                </p>
                                <Link href="/profile" className="btn btn-primary btn-large">Go to Profile</Link>
                            </div>
                        ) : (
                            /* ── Booking form ── */
                            <div className={`card ${styles.bookingCard}`}>
                                <p className={styles.bookingSubtitle}>
                                    Select a date and time to send an appointment request to {doctor.name}. They will confirm within 24 hours.
                                </p>

                                {/* Date pills */}
                                <span className={styles.noteLabel}>Select Date</span>
                                <div className={styles.datePills}>
                                    {dates.map((d) => {
                                        const parts = d.split(' ');
                                        const day = parts[0];
                                        const mon = parts.slice(1).join(' ');
                                        return (
                                            <button
                                                key={d}
                                                className={`${styles.datePill}${selectedDate === d ? ` ${styles.datePillActive}` : ''}`}
                                                onClick={() => { setSelectedDate(d); setSelectedSlot(null); }}
                                            >
                                                <span className={styles.pillDay}>{mon}</span>
                                                <span className={styles.pillDate}>{day}</span>
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Time slots */}
                                <span className={styles.noteLabel}>Select Time</span>
                                {currentSlots.length === 0 ? (
                                    <p className={styles.noSlots}>No slots available for this date.</p>
                                ) : (
                                    <div className={styles.slotGrid}>
                                        {currentSlots.map((slot) => (
                                            <button
                                                key={slot}
                                                className={`${styles.slotBtn}${selectedSlot === slot ? ` ${styles.slotBtnActive}` : ''}`}
                                                onClick={() => setSelectedSlot(slot)}
                                            >
                                                {slot}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* Note */}
                                <label className={styles.noteLabel} htmlFor="patientNote" style={{ marginTop: 'var(--space-4)' }}>
                                    Note to Doctor <span style={{ fontWeight: 'normal', color: 'var(--color-text-secondary)' }}>(optional)</span>
                                </label>
                                <textarea
                                    id="patientNote"
                                    className={`input ${styles.noteInput}`}
                                    placeholder="Briefly describe your concern or the condition you'd like to discuss…"
                                    value={patientNote}
                                    onChange={(e) => setPatientNote(e.target.value)}
                                />

                                <button
                                    className="btn btn-primary btn-large"
                                    disabled={!selectedSlot || bookingState === 'loading'}
                                    onClick={handleBook}
                                    style={{
                                        opacity: selectedSlot && bookingState !== 'loading' ? 1 : 0.5,
                                        cursor: selectedSlot && bookingState !== 'loading' ? 'pointer' : 'not-allowed',
                                    }}
                                >
                                    {bookingState === 'loading' ? 'Sending…' : 'Send Appointment Request'}
                                </button>

                                <p className={styles.bookingNote}>
                                    ℹ️ The mode and location of consultation will be decided mutually between you and the doctor after confirmation.
                                </p>
                            </div>
                        )}
                    </RevealSection>
                </div>
            </section>

            {/* ════════════ 7. RELATED DOCTORS ════════════ */}
            <section className={styles.relatedSection}>
                <div className="container">
                    <RevealSection>
                        <div className={styles.relatedHeader}>
                            <div>
                                <span className="section-label">Similar Dermatologists</span>
                                <h2 className={styles.sectionTitle} style={{ marginBottom: 0 }}>You Might Also Consider</h2>
                            </div>
                            <Link href="/doctors" className="btn btn-outline btn-small" style={{ color: 'var(--color-text-primary)', borderColor: 'var(--color-border-warm)' }}>
                                View All Doctors
                            </Link>
                        </div>
                        {/* Related doctors link back to the full listing */}
                        <div style={{ marginTop: 'var(--space-6)', textAlign: 'center' }}>
                            <Link href="/doctors" className="btn btn-outline btn-large" style={{ color: 'var(--color-text-primary)', borderColor: 'var(--color-border-warm)' }}>
                                Browse All Dermatologists →
                            </Link>
                        </div>
                    </RevealSection>
                </div>
            </section>

            <Footer />
        </main>
    );
}
