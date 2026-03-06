'use client';

import { useRef, useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import styles from './doctors.module.css';
import { getDoctors } from '@/lib/firestore';
import type { Doctor } from '@/types/doctor';

/* ══════════════════════════════════════════════
   FILTER DEFAULTS
   ══════════════════════════════════════════════ */
const defaultFilters = {
    specialization: 'All',
    location: 'All',
    availability: 'Any',
    language: 'All',
    rating: 'All',
};

/* ══════════════════════════════════════════════
   HELPERS
   ══════════════════════════════════════════════ */
function getInitials(name: string) {
    return name.replace('Dr. ', '').split(' ').map((w) => w[0]).slice(0, 2).join('');
}

function StarRating({ rating }: { rating: number }) {
    return (
        <div className={styles.stars}>
            {[1, 2, 3, 4, 5].map((s) => (
                <svg key={s} width="11" height="11" viewBox="0 0 24 24"
                    fill={s <= Math.round(rating) ? 'currentColor' : 'none'}
                    stroke="currentColor" strokeWidth="1.5">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
            ))}
        </div>
    );
}

function ConsultTags({ type }: { type: string }) {
    const tags = type === 'Both' ? ['In-Person', 'Video'] : [type];
    return (
        <div className={styles.consultRow}>
            {tags.map((t) => (
                <span key={t} className={styles.consultTag}>{t}</span>
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
export default function DoctorsPage() {
    /* ── Data state ── */
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [doctorsLoading, setDoctorsLoading] = useState(true);

    /* ── SmartMatch from last scan ── */
    const [smartMatchCondition, setSmartMatchCondition] = useState<string | null>(null);
    const [showSmartMatch, setShowSmartMatch] = useState(false);

    /* ── Filter state ── */
    const [filters, setFilters] = useState(defaultFilters);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    /* ── Load doctors from Firestore ── */
    useEffect(() => {
        getDoctors()
            .then((data) => setDoctors(data))
            .catch((err) => console.error('Failed to load doctors:', err))
            .finally(() => setDoctorsLoading(false));
    }, []);

    /* ── Read SmartMatch condition from last scan ── */
    useEffect(() => {
        try {
            const raw = localStorage.getItem('nivara_last_scan');
            if (raw) {
                const scan = JSON.parse(raw);
                if (scan.topCondition) {
                    setSmartMatchCondition(scan.topCondition);
                    setShowSmartMatch(true);
                }
            }
        } catch { /* ignore */ }
    }, []);

    /* ── Filter logic ── */
    const filteredDoctors = useMemo(() => {
        return doctors.filter((doctor) => {
            const q = searchQuery.toLowerCase();
            if (q && !doctor.name.toLowerCase().includes(q) &&
                !doctor.hospital.toLowerCase().includes(q) &&
                !doctor.conditions.some((c) => c.toLowerCase().includes(q))) return false;

            if (filters.specialization !== 'All' && doctor.specialization !== filters.specialization) return false;
            if (filters.location !== 'All' && doctor.location !== filters.location) return false;
            if (filters.availability === 'Available Today' && doctor.availability !== 'Available Today') return false;
            if (filters.language !== 'All' && !doctor.languages.includes(filters.language)) return false;
            if (filters.rating === '4.5+' && doctor.rating < 4.5) return false;
            if (filters.rating === '4.0+' && doctor.rating < 4.0) return false;
            if (filters.rating === '3.5+' && doctor.rating < 3.5) return false;
            return true;
        });
    }, [doctors, filters, searchQuery]);

    const clearFilters = () => {
        setFilters(defaultFilters);
        setSearchQuery('');
        setCurrentPage(1);
    };

    const updateFilter = (key: keyof typeof defaultFilters, value: string) => {
        setFilters((f) => ({ ...f, [key]: value }));
        setCurrentPage(1);
    };

    /* ── Pagination ── */
    const PER_PAGE = 9;
    const totalPages = Math.max(1, Math.ceil(filteredDoctors.length / PER_PAGE));
    const pagedDoctors = filteredDoctors.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);
    const startNum = filteredDoctors.length === 0 ? 0 : (currentPage - 1) * PER_PAGE + 1;
    const endNum = Math.min(currentPage * PER_PAGE, filteredDoctors.length);

    /* ══════════════════════════════════════════════
       RENDER
       ══════════════════════════════════════════════ */
    return (
        <main className={styles.doctorsPage}>

            {/* ════════════ BETA STRIP ════════════ */}
            <div className={styles.betaStrip}>
                NIVARA is in beta. Doctor profiles shown are demonstrations of the platform capabilities.
            </div>

            {/* ════════════ 1. HERO ════════════ */}
            <section className={styles.hero}>
                <div className="container">
                    <div className="slide-up">
                        <span className="section-label">Dermatologists</span>
                        <h1 className={styles.heroHeadline}>Find the right specialist.</h1>
                        <p className={styles.heroSub}>
                            Browse verified dermatologists by specialisation, location, and availability. Book a consultation directly from your scan report or any time from here.
                        </p>

                        {/* Search */}
                        <div className={styles.searchWrap}>
                            <span className={styles.searchIcon}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                                </svg>
                            </span>
                            <input
                                type="search"
                                className={`input ${styles.searchInput}`}
                                placeholder="Search by doctor, condition, or hospital…"
                                value={searchQuery}
                                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* ════════════ MAIN CONTENT ════════════ */}
            <div className="container" style={{ paddingBottom: 'var(--space-12)' }}>

                {/* ════════════ 2. SMART MATCH BANNER ════════════ */}
                {showSmartMatch && smartMatchCondition && (
                    <div className={styles.smartBanner}>
                        <div className={styles.smartBannerIcon}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>
                        </div>
                        <div className={styles.smartBannerText}>
                            <span className={styles.smartBannerTitle}>Smart Match Active</span>
                            <p className={styles.smartBannerDesc}>
                                Based on your recent scan for{' '}
                                <span className={styles.smartBannerCondition}>{smartMatchCondition}</span>,
                                we have highlighted dermatologists who specialise in this area.
                            </p>
                        </div>
                        <button className={styles.dismissBtn} onClick={() => setShowSmartMatch(false)}>
                            Clear ✕
                        </button>
                    </div>
                )}

                {/* ════════════ 3. FILTER BAR ════════════ */}
                <RevealSection className={styles.filterSection}>
                    <div className={styles.filterRow}>
                        <select className={`input ${styles.filterSelect}`} value={filters.specialization}
                            onChange={(e) => updateFilter('specialization', e.target.value)}>
                            <option value="All">All Specializations</option>
                            <option>General Dermatology</option>
                            <option>Cosmetic Dermatology</option>
                            <option>Pediatric Dermatology</option>
                            <option>Trichology</option>
                            <option>Aesthetic Medicine</option>
                        </select>

                        <select className={`input ${styles.filterSelect}`} value={filters.location}
                            onChange={(e) => updateFilter('location', e.target.value)}>
                            <option value="All">All Cities</option>
                            <option>Bengaluru</option>
                            <option>Mumbai</option>
                            <option>Delhi</option>
                            <option>Chennai</option>
                            <option>Hyderabad</option>
                            <option>Pune</option>
                        </select>

                        <select className={`input ${styles.filterSelect}`} value={filters.availability}
                            onChange={(e) => updateFilter('availability', e.target.value)}>
                            <option value="Any">Any Availability</option>
                            <option>Available Today</option>
                            <option>Available This Week</option>
                        </select>

                        <select className={`input ${styles.filterSelect}`} value={filters.language}
                            onChange={(e) => updateFilter('language', e.target.value)}>
                            <option value="All">All Languages</option>
                            <option>English</option>
                            <option>Hindi</option>
                            <option>Kannada</option>
                            <option>Tamil</option>
                            <option>Telugu</option>
                            <option>Malayalam</option>
                        </select>

                        <select className={`input ${styles.filterSelect}`} value={filters.rating}
                            onChange={(e) => updateFilter('rating', e.target.value)}>
                            <option value="All">Any Rating</option>
                            <option value="4.5+">4.5+ Stars</option>
                            <option value="4.0+">4.0+ Stars</option>
                            <option value="3.5+">3.5+ Stars</option>
                        </select>
                    </div>

                    <div className={styles.filterMeta}>
                        <p className={styles.resultsCount}>
                            Showing{' '}
                            <span className={styles.resultsCountBold}>{filteredDoctors.length}</span>
                            {' '}of{' '}
                            <span className={styles.resultsCountBold}>{doctors.length}</span>
                            {' '}doctors
                        </p>
                        <button className={styles.clearFilterBtn} onClick={clearFilters}>
                            Clear Filters
                        </button>
                    </div>
                </RevealSection>

                {/* ════════════ 4. DOCTOR GRID ════════════ */}
                {doctorsLoading ? (
                    /* ── Loading spinner ── */
                    <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-16)' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', border: '2.5px solid var(--color-border)', borderTopColor: 'var(--color-accent)', animation: 'spin 0.8s linear infinite' }} />
                        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    </div>
                ) : filteredDoctors.length === 0 ? (
                    /* ── Empty state ── */
                    <div className={styles.emptyState}>
                        <div className={styles.emptyIcon}>
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                                <line x1="8" y1="11" x2="14" y2="11" />
                            </svg>
                        </div>
                        <h2 className={styles.emptyTitle}>No results match your filters.</h2>
                        <p className={styles.emptyDesc}>Try adjusting or clearing your search filters.</p>
                        <button className="btn btn-primary" onClick={clearFilters}>Clear Filters</button>
                    </div>
                ) : (
                    <>
                        <RevealSection>
                            <div className={styles.doctorsGrid}>
                                {pagedDoctors.map((doctor) => {
                                    const isToday = doctor.availability === 'Available Today';
                                    const isSmartMatch = smartMatchCondition
                                        ? doctor.conditions.some((c) => c.toLowerCase() === smartMatchCondition.toLowerCase())
                                        : false;
                                    return (
                                        <div
                                            key={doctor.id}
                                            className={`card ${styles.doctorCard}${isSmartMatch ? ` ${styles.doctorCardMatched}` : ''}`}
                                            style={{ position: 'relative', padding: 'var(--space-6)' }}
                                        >
                                            {isSmartMatch && (
                                                <span className={styles.recommendedTag}>Recommended for You</span>
                                            )}
                                            <span className={styles.demoBadge}>Demo Profile</span>

                                            {/* Header */}
                                            <div className={styles.cardHeader}>
                                                <div className={styles.avatarWrap}>
                                                    <div className={`${styles.avatar}${isSmartMatch ? ` ${styles.avatarMatched}` : ''}`}>
                                                        {getInitials(doctor.name)}
                                                    </div>
                                                    <div className={styles.verifiedBadge}>
                                                        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                                                            <polyline points="20 6 9 17 4 12" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className={styles.doctorInfo}>
                                                    <p className={styles.doctorName}>{doctor.name}</p>
                                                    <span className={styles.specializationTag}>{doctor.specialization}</span>
                                                </div>
                                            </div>

                                            {/* Meta */}
                                            <div className={styles.cardMeta}>
                                                <div className={styles.metaRow}>
                                                    <svg className={styles.metaIcon} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
                                                    </svg>
                                                    {doctor.hospital}
                                                </div>
                                                <div className={styles.metaRow}>
                                                    <svg className={styles.metaIcon} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                                        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                                                    </svg>
                                                    {doctor.experience} years experience
                                                </div>
                                                <div className={styles.ratingRow}>
                                                    <StarRating rating={doctor.rating} />
                                                    <span className={styles.ratingNum}>{doctor.rating}</span>
                                                    <span className={styles.reviewCount}>({doctor.reviews} reviews)</span>
                                                </div>
                                                <div className={styles.langRow}>
                                                    <svg className={styles.metaIcon} width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                                        <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" />
                                                        <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
                                                    </svg>
                                                    {doctor.languages.map((l) => (
                                                        <span key={l} className={styles.langTag}>{l}</span>
                                                    ))}
                                                </div>
                                                <div className={styles.availabilityRow}>
                                                    <span className={`${styles.availDot} ${isToday ? styles.availDotGreen : styles.availDotMuted}`} />
                                                    <span className={isToday ? styles.availTextGreen : styles.availTextMuted}>
                                                        {doctor.availability}
                                                    </span>
                                                </div>
                                                <ConsultTags type={doctor.consultationType} />
                                            </div>

                                            <div className={styles.cardDivider} />

                                            {/* Actions — use real Firestore doc ID */}
                                            <div className={styles.cardActions}>
                                                <Link href={`/doctors/${doctor.id}`} className={styles.viewProfileBtn}>
                                                    View Profile
                                                </Link>
                                                <Link href={`/doctors/${doctor.id}`} className="btn btn-primary" style={{ flex: 1, justifyContent: 'center', fontSize: 'var(--font-size-xs)', padding: 'var(--space-3) var(--space-4)' }}>
                                                    Book
                                                </Link>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </RevealSection>

                        {/* ════════════ 5. PAGINATION ════════════ */}
                        {totalPages > 1 && (
                            <div className={styles.paginationWrap}>
                                <p className={styles.paginationInfo}>
                                    Showing {startNum}–{endNum} of {filteredDoctors.length} doctors
                                </p>
                                <div className={styles.pageNumbers}>
                                    <button
                                        className={`${styles.pageBtn} ${styles.pageBtnNav}`}
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage((p) => p - 1)}
                                    >
                                        ← Prev
                                    </button>
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                        <button
                                            key={p}
                                            className={`${styles.pageBtn}${p === currentPage ? ` ${styles.pageBtnActive}` : ''}`}
                                            onClick={() => setCurrentPage(p)}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                    <button
                                        className={`${styles.pageBtn} ${styles.pageBtnNav}`}
                                        disabled={currentPage === totalPages}
                                        onClick={() => setCurrentPage((p) => p + 1)}
                                    >
                                        Next →
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* ════════════ 7. BOTTOM CTA ════════════ */}
                <RevealSection>
                    <div className={styles.bottomCta}>
                        <span className="section-label" style={{ marginBottom: 'var(--space-4)', display: 'block' }}>
                            For Doctors
                        </span>
                        <h2 className={styles.ctaHeading}>Are you a dermatologist?</h2>
                        <p className={styles.ctaDesc}>
                            We are building the NIVARA verified doctor network. If you are a qualified dermatologist interested in joining the platform, we would love to hear from you.
                        </p>
                        <a href="#" className="btn btn-outline btn-large">Get in Touch</a>
                    </div>
                </RevealSection>
            </div>

            <Footer />
        </main>
    );
}
