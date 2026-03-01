'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import styles from './results.module.css';
import { useAuth } from '@/context/AuthContext';
import { getLatestScan } from '@/lib/firestore';
import type { ScanRecord } from '@/types/scan';

/* ScanRecord imported from @/types/scan — same shape as StoredScan previously defined here */

/* ══════════════════════════════════════════════
   CONDITION DESCRIPTIONS
   ══════════════════════════════════════════════ */
const CONDITION_DESCRIPTIONS: Record<string, string> = {
    'Eczema': 'Eczema is a chronic inflammatory skin condition characterised by dry, itchy, and inflamed patches of skin. It is often associated with a personal or family history of allergies or asthma and typically flares with triggers like stress, heat, or irritants.',
    'Melanoma': 'Melanoma is a serious form of skin cancer that develops from the pigment-producing cells (melanocytes). It can appear as a new, unusual growth or a change in an existing mole. Early detection is critical — please consult a dermatologist promptly.',
    'Atopic Dermatitis': 'Atopic Dermatitis is a chronic inflammatory skin condition causing dry, intensely itchy, and red skin. It is the most common form of eczema and often begins in childhood, commonly affecting the folds of the elbows, knees, and the face.',
    'Basal Cell Carcinoma': 'Basal Cell Carcinoma (BCC) is the most common form of skin cancer. It typically appears as a pearly or waxy bump, or a flat, flesh-coloured lesion. BCC rarely spreads but can cause significant local damage if left untreated. Please consult a dermatologist promptly.',
    'Melanocytic Nevi': 'Melanocytic Nevi are common benign moles formed by clusters of pigmented cells. Most are harmless, but changes in size, shape, colour or border should be evaluated by a dermatologist to rule out malignant transformation.',
    'Benign Keratosis-like Lesions': 'Benign Keratosis-like Lesions include seborrhoeic keratoses and solar lentigines — non-cancerous growths that appear as rough, scaly patches with a "stuck-on" appearance. They are generally harmless and require no treatment unless irritated or cosmetically concerning.',
    'Psoriasis / Lichen Planus': 'Psoriasis and Lichen Planus are chronic inflammatory skin conditions. Psoriasis causes rapid cell buildup resulting in red, scaly plaques, while Lichen Planus presents as flat-topped, purplish papules. Both conditions can be managed effectively with appropriate treatment.',
    'Seborrheic Keratoses': 'Seborrhoeic Keratoses are common, non-cancerous skin growths that appear as brown, black, or pale waxy, scaly plaques. They are a normal part of ageing and typically require no treatment unless they become irritated or are cosmetically bothersome.',
    'Tinea / Ringworm / Candidiasis': 'Tinea and Candidiasis are fungal skin infections. Tinea (Ringworm) often presents as a ring-shaped, scaly rash, while Candidiasis typically causes red, itchy rashes in warm, moist skin folds. Both respond well to antifungal treatment.',
    'Warts / Molluscum / Viral Infections': 'Warts and Molluscum Contagiosum are common viral skin infections. Warts appear as rough, raised bumps caused by HPV, while Molluscum presents as small, pearly, dome-shaped papules. Both are generally benign and often resolve on their own, though treatment can speed resolution.',
};

const DEFAULT_DESCRIPTION = 'A skin condition identified by AI-assisted visual pattern analysis. Please consult a dermatologist for a full clinical evaluation and appropriate management.';

/* ══════════════════════════════════════════════
   STATIC MOCK — keeping remedies unchanged
   ══════════════════════════════════════════════ */
const remedies = [
    { title: 'Keep the area clean', description: 'Gently wash with mild, fragrance-free soap and lukewarm water. Pat dry — do not rub.' },
    { title: 'Moisturize regularly', description: 'Apply a gentle, fragrance-free moisturizer to maintain the skin barrier and reduce dryness.' },
    { title: 'Avoid scratching', description: 'Scratching worsens inflammation and increases the risk of infection. Keep nails short and clean.' },
    { title: 'Use sun protection', description: 'Apply broad-spectrum SPF 30+ sunscreen daily, especially on affected areas.' },
    { title: 'Wear breathable clothing', description: 'Choose loose, soft, natural fabrics like cotton to reduce friction and irritation.' },
    { title: 'Avoid known irritants', description: 'Steer clear of harsh soaps, synthetic fragrances, and any substances that previously caused reactions.' },
    { title: 'Stay hydrated', description: 'Drink adequate water and maintain a balanced diet to support overall skin health.' },
];

/* ══════════════════════════════════════════════
   HELPERS
   ══════════════════════════════════════════════ */
function getSeverityPillClass(severity: string): string {
    if (severity === 'Low') return styles.severityPillLow;
    if (severity === 'High') return styles.severityPillHigh;
    return styles.severityPillModerate;
}

function getSeverityDotClass(severity: string): string {
    if (severity === 'Low') return styles.severityDotLow;
    if (severity === 'High') return styles.severityDotHigh;
    return styles.severityDotMod;
}

function formatDate(isoString: string): { date: string; time: string } {
    try {
        const d = new Date(isoString);
        return {
            date: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
            time: d.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true }),
        };
    } catch {
        return { date: '—', time: '—' };
    }
}

/* Remedy icons — simple SVG per category */
const remedyIcons = [
    <svg key="clean" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" /><path d="M8 12h8M12 8v8" /></svg>,
    <svg key="moist" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" /></svg>,
    <svg key="scratch" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>,
    <svg key="sun" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>,
    <svg key="cloth" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.57a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.57a2 2 0 00-1.34-2.23z" /></svg>,
    <svg key="irrit" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>,
    <svg key="hydrate" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" /><line x1="12" y1="12" x2="12" y2="17" /></svg>,
];

/* ══════════════════════════════════════════════
   REVEAL WRAPPER
   ══════════════════════════════════════════════ */
function RevealSection({ children, className }: { children: React.ReactNode; className?: string }) {
    const ref = useRef<HTMLDivElement>(null);
    const visible = useIntersectionObserver(ref as React.RefObject<Element | null>, { threshold: 0.07 });
    return (
        <div ref={ref} className={`reveal${visible ? ' active' : ''}${className ? ` ${className}` : ''}`}>
            {children}
        </div>
    );
}

/* ══════════════════════════════════════════════
   CONFIDENCE BAR — animates on mount
   ══════════════════════════════════════════════ */
function ConfidenceBar({ value, isPrimary = false }: { value: number; isPrimary?: boolean }) {
    return (
        <div className={styles.confidenceRow}>
            <span className={styles.confidenceLabel}>Confidence</span>
            <div className={styles.confidenceTrack}>
                <div
                    className={`${styles.confidenceFill}${isPrimary ? '' : ` ${styles.confidenceFillMuted}`}`}
                    style={{ width: `${value}%` }}
                />
            </div>
            <span className={`${styles.confidencePercent}${isPrimary ? '' : ` ${styles.confidencePercentMuted}`}`}>
                {value}%
            </span>
        </div>
    );
}

/* ══════════════════════════════════════════════
   MAIN PAGE
   ══════════════════════════════════════════════ */
export default function ResultsPage() {
    const { user, loading: authLoading } = useAuth();
    const [scan, setScan] = useState<ScanRecord | null | 'loading'>('loading');

    useEffect(() => {
        async function loadScan() {
            // 1. Try localStorage first
            try {
                const raw = localStorage.getItem('nivara_last_scan');
                if (raw) {
                    setScan(JSON.parse(raw) as ScanRecord);
                    return;
                }
            } catch { /* ignore */ }

            // 2. Firestore fallback — only when auth is settled
            if (!authLoading && user) {
                try {
                    const latest = await getLatestScan(user.uid);
                    setScan(latest); // null if empty
                    return;
                } catch { /* ignore */ }
            }

            // 3. No data
            setScan(null);
        }

        if (!authLoading) loadScan();
    }, [user, authLoading]);

    /* ── Loading (avoids SSR mismatch) ── */
    if (scan === 'loading') return null;

    /* ── No data fallback ── */
    if (scan === null) {
        return (
            <main className={styles.resultsPage}>
                <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
                    <div className="card" style={{ textAlign: 'center', maxWidth: 480, padding: 'var(--space-12)' }}>
                        <svg style={{ margin: '0 auto var(--space-5)', display: 'block', color: 'var(--color-text-secondary)' }} width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
                        </svg>
                        <h2 style={{ fontFamily: 'var(--font-family-display)', fontSize: 'var(--font-size-2xl)', marginBottom: 'var(--space-3)' }}>No Scan Data Found</h2>
                        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-6)' }}>
                            Please complete a demo scan first to view your results here.
                        </p>
                        <Link href="/demo" className="btn btn-primary btn-large">Try the Demo</Link>
                    </div>
                </div>
                <Footer />
            </main>
        );
    }

    /* ── Derived values ── */
    const { scanId, date: isoDate, source, severity, predictions, topCondition, topConfidence } = scan;
    const { date, time } = formatDate(isoDate);
    const primary = predictions[0];
    const secondary = predictions.slice(1);
    const primaryDesc = CONDITION_DESCRIPTIONS[primary?.condition] ?? DEFAULT_DESCRIPTION;
    const isHigh = severity === 'High';

    const summary = `Your scan most strongly suggests ${topCondition} (${topConfidence.toFixed(1)}% confidence). The other conditions listed are considered less likely based on the visual patterns detected. We recommend consulting a dermatologist to confirm this finding.`;

    return (
        <main className={styles.resultsPage}>

            {/* ══════════ SECTION 1 — REPORT HEADER ══════════ */}
            <section className={styles.reportHeader}>
                <div className="container">
                    <div className={`${styles.reportHeaderInner} slide-up`}>
                        <span className="section-label">Scan Report</span>

                        {/* Scan ID */}
                        <h1 className={styles.reportScanId}>Scan #{scanId}</h1>

                        {/* Meta row */}
                        <div className={styles.reportMeta}>
                            <span className={styles.metaChip}>{date}</span>
                            <span className={styles.metaDivider} />
                            <span className={styles.metaChip}>{time}</span>
                        </div>

                        {/* Source + severity row */}
                        <div className={styles.reportFooterRow}>
                            <span className={styles.sourceTag}>{source}</span>
                            <span className={`${styles.severityPill} ${getSeverityPillClass(severity)}`}>
                                <span className={`${styles.severityDot} ${getSeverityDotClass(severity)}`} />
                                {severity} Severity
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════ CONTENT SECTIONS ══════════ */}
            <div className={styles.contentWrap}>
                <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-12)' }}>

                    {/* ══════════ SECTION 2 — SCAN IMAGE PANEL ══════════ */}
                    <RevealSection>
                        <h2 className={styles.sectionTitle}>Scan Image</h2>
                        <div className={styles.scanPanel}>
                            {/* Informational note — image is not stored */}
                            <div className={`card ${styles.primaryDiagCard}`} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-4)', padding: 'var(--space-6)' }}>
                                <svg style={{ flexShrink: 0, marginTop: '2px', color: 'var(--color-accent)' }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                                </svg>
                                <div>
                                    <p style={{ fontWeight: 600, color: 'var(--color-text-primary)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-2)' }}>Image processed securely</p>
                                    <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', lineHeight: 1.6 }}>
                                        Your scan image is analysed on-device and is not stored on our servers. Your differential diagnosis is shown in full below.
                                    </p>
                                </div>
                            </div>

                            {/* Metadata */}
                            <div className="card" style={{ padding: 'var(--space-6)' }}>
                                <h3 style={{ fontFamily: 'var(--font-family-display)', fontSize: 'var(--font-size-xl)', marginBottom: 'var(--space-4)', color: 'var(--color-text-primary)' }}>
                                    Scan Details
                                </h3>
                                <div className={styles.scanMeta}>
                                    {[
                                        { label: 'Source', value: source },
                                        { label: 'Scan ID', value: `#${scanId}` },
                                        { label: 'Date', value: date },
                                        { label: 'Time', value: time },
                                        { label: 'Primary Finding', value: topCondition },
                                        { label: 'Severity', value: severity },
                                    ].map(({ label, value }) => (
                                        <div key={label} className={styles.scanMetaItem}>
                                            <span className={styles.scanMetaLabel}>{label}</span>
                                            <span className={styles.scanMetaValue}>{value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </RevealSection>

                    {/* ══════════ SECTION 3 — DIFFERENTIAL DIAGNOSIS ══════════ */}
                    <RevealSection>
                        <h2 className={styles.sectionTitle}>Differential Diagnosis</h2>
                        <div className={styles.diagnosisSection}>

                            {/* Primary */}
                            <div className={`card ${styles.primaryDiagCard}`}>
                                <span className={styles.primaryLabel}>Primary Finding</span>
                                <h2 className={styles.conditionName}>{primary?.condition ?? '—'}</h2>
                                <ConfidenceBar value={parseFloat(topConfidence.toFixed(1))} isPrimary />
                                <p className={styles.diagDescription}>{primaryDesc}</p>
                            </div>

                            {/* Secondary */}
                            {secondary.length > 0 && (
                                <div className="card">
                                    <h3 style={{ fontFamily: 'var(--font-family-display)', fontSize: 'var(--font-size-xl)', marginBottom: 'var(--space-6)', color: 'var(--color-text-primary)' }}>
                                        Other Possibilities
                                    </h3>
                                    <div className={styles.secondaryList}>
                                        {secondary.map((sec, idx) => (
                                            <div key={sec.condition}>
                                                <div className={styles.secondaryCard}>
                                                    <span className={styles.secondaryName}>{sec.condition}</span>
                                                    <ConfidenceBar value={parseFloat(sec.confidence.toFixed(1))} />
                                                    <p className={styles.secondaryDesc}>
                                                        {CONDITION_DESCRIPTIONS[sec.condition] ?? DEFAULT_DESCRIPTION}
                                                    </p>
                                                    <p className={styles.lessLikelyNote}>
                                                        <svg className={styles.lessLikelyIcon} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                                                        </svg>
                                                        Lower probability based on visual pattern analysis.
                                                    </p>
                                                </div>
                                                {idx < secondary.length - 1 && (
                                                    <div style={{ height: '1px', background: 'var(--color-border)', margin: 'var(--space-5) 0' }} />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Summary */}
                            <div className={styles.summaryBlock}>
                                <p className={styles.summaryLabel}>What This Means For You</p>
                                <p className={styles.summaryText}>{summary}</p>
                            </div>
                        </div>
                    </RevealSection>

                    {/* ══════════ SECTION 4 — BASIC REMEDIES ══════════ */}
                    <RevealSection>
                        <div className="section-header" style={{ textAlign: 'left', marginBottom: 'var(--space-6)' }}>
                            <span className="section-label">General Guidance</span>
                            <h2 className={styles.sectionTitle} style={{ marginTop: 'var(--space-4)', marginBottom: 0 }}>Basic Skincare Remedies</h2>
                        </div>
                        <div className="card">
                            <div className={styles.remedyGrid}>
                                {remedies.map((remedy, idx) => (
                                    <div key={remedy.title} className={styles.remedyCard}>
                                        <div className={styles.remedyIconWrap}>
                                            {remedyIcons[idx] ?? remedyIcons[0]}
                                        </div>
                                        <div className={styles.remedyText}>
                                            <span className={styles.remedyTitle}>{remedy.title}</span>
                                            <p className={styles.remedyDesc}>{remedy.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </RevealSection>

                    {/* ══════════ SECTION 5 — DISCLAIMER ══════════ */}
                    <RevealSection>
                        <div className={styles.disclaimer}>
                            <div className={styles.disclaimerIcon}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                                </svg>
                            </div>
                            <div className={styles.disclaimerText}>
                                <span className={styles.disclaimerHeading}>Medical Disclaimer</span>
                                <p className={styles.disclaimerBody}>
                                    This report is generated by an AI-assisted screening system and is not a substitute for professional medical diagnosis. The results are intended as a screening aid only. Always consult a qualified dermatologist for proper evaluation and treatment.
                                </p>
                            </div>
                        </div>
                    </RevealSection>

                </div>
            </div>

            {/* ══════════ SECTION 6 — DOCTOR CTA ══════════ */}
            <RevealSection className={styles.doctorCta}>
                <div className="container">
                    <div className={`${styles.ctaCard}${isHigh ? ` ${styles.ctaCardUrgent}` : ''}`}>
                        <div className={styles.ctaInner}>
                            {isHigh ? (
                                <span className="section-label section-label-light" style={{ borderColor: 'rgba(220,38,38,0.2)', background: 'rgba(220,38,38,0.08)', color: 'rgba(220,80,80,0.9)' }}>
                                    High Severity Detected
                                </span>
                            ) : (
                                <span className="section-label section-label-light">Professional Consultation</span>
                            )}

                            <h2 className={styles.ctaHeading}>
                                {isHigh
                                    ? 'We Recommend Consulting a Doctor Soon'
                                    : 'Want a Professional Opinion?'}
                            </h2>
                            <p className={styles.ctaCopy}>
                                {isHigh
                                    ? 'Your scan results suggest a condition that may benefit from prompt professional attention. Please consult a dermatologist at your earliest convenience.'
                                    : 'Connect with a certified dermatologist who can review your scan and provide a proper diagnosis and treatment plan.'}
                            </p>
                            <div className={styles.ctaButtons}>
                                <Link href="/doctors" className="btn btn-accent btn-large">
                                    Find a Dermatologist
                                </Link>
                                <Link href="/doctors" className="btn btn-outline" style={{ color: 'rgba(250,248,244,0.75)', borderColor: 'rgba(250,248,244,0.2)' }}>
                                    Book an Appointment
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </RevealSection>

            {/* ══════════ SECTION 7 — RELATED ACTIONS FOOTER ══════════ */}
            <RevealSection className={styles.relatedActions}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
                        <h6 style={{ color: 'var(--color-accent)', letterSpacing: '0.18em', fontSize: '0.68rem', textTransform: 'uppercase' }}>
                            Related Actions
                        </h6>
                    </div>
                    <div className={styles.relatedActionsInner}>
                        <Link href="/profile" className="btn btn-outline">
                            ← Back to Profile
                        </Link>
                        <Link href="/demo" className="btn btn-primary">
                            Try Another Scan
                        </Link>
                        <Link href="/kiosks" className="btn btn-outline">
                            Find a Kiosk
                        </Link>
                    </div>
                </div>
            </RevealSection>

            <Footer />
        </main>
    );
}
