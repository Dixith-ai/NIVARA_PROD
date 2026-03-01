'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import DoctorNavbar from '@/components/DoctorNavbar';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { mockScansAwaitingReview } from '@/lib/doctorMockData';
import s from '../portal.module.css';

function Reveal({ children }: { children: React.ReactNode }) {
    const ref = useRef<HTMLDivElement>(null);
    const visible = useIntersectionObserver(ref as React.RefObject<Element | null>, { threshold: 0.05 });
    return <div ref={ref} className={`reveal${visible ? ' active' : ''}`}>{children}</div>;
}

function SeverityBadge({ severity }: { severity: string }) {
    const cls = severity === 'High' || severity === 'Urgent'
        ? s.severityHigh : severity === 'Low' ? s.severityLow : s.severityMedium;
    return <span className={`${s.severityBadge} ${cls}`}>{severity}</span>;
}

interface Annotation {
    agreement: 'yes' | 'partially' | 'no' | '';
    assessment: string;
    severityAssessment: string;
    observations: string;
}

type ReviewedScan = {
    id: number;
    patient: { name: string; age: number };
    date: string;
    source: string;
    severity: string;
    diagnosis: {
        primary: { condition: string; confidence: number };
        secondary: { condition: string; confidence: number }[];
    };
    annotation: Annotation;
    reviewedDate: string;
};

const TABS_SCAN = ['Awaiting Review', 'Reviewed'] as const;

export default function ScansPage() {
    const [activeTab, setActiveTab] = useState<typeof TABS_SCAN[number]>('Awaiting Review');
    const [annotations, setAnnotations] = useState<Record<number, Annotation>>(
        Object.fromEntries(mockScansAwaitingReview.map(s => [s.id, { agreement: '', assessment: '', severityAssessment: s.severity, observations: '' }]))
    );
    const [reviewed, setReviewed] = useState<ReviewedScan[]>([]);
    const [awaiting, setAwaiting] = useState(mockScansAwaitingReview);

    const updateAnnotation = (id: number, field: keyof Annotation, value: string) => {
        setAnnotations(a => ({ ...a, [id]: { ...a[id], [field]: value } }));
    };

    const markReviewed = (scan: typeof mockScansAwaitingReview[0]) => {
        const ann = annotations[scan.id];
        if (!ann.agreement || !ann.assessment) {
            alert('Please fill in the agreement and your assessment before marking as reviewed.');
            return;
        }
        setReviewed(r => [...r, { ...scan, annotation: ann, reviewedDate: 'Today' }]);
        setAwaiting(a => a.filter(s => s.id !== scan.id));
    };

    return (
        <div className={s.portalPage}>
            <DoctorNavbar />
            <div className="container" style={{ paddingBottom: 'var(--space-16)' }}>

                <div className={`slide-up ${s.pageHeader}`}>
                    <p className="section-label">Doctor Portal</p>
                    <h1 className={s.pageTitle}>Scan Reviews</h1>
                    <p className={s.pageSubtitle}>{awaiting.length} awaiting review · {reviewed.length} completed</p>
                </div>

                <Reveal>
                    <div className={s.tabBar}>
                        {TABS_SCAN.map(tab => (
                            <button key={tab} className={`${s.tab}${activeTab === tab ? ` ${s.tabActive}` : ''}`} onClick={() => setActiveTab(tab)}>
                                {tab}
                                {tab === 'Awaiting Review' && awaiting.length > 0 && (
                                    <span style={{ marginLeft: 6, background: 'rgba(149,109,31,0.3)', borderRadius: '50%', padding: '1px 6px', fontSize: '0.6rem' }}>
                                        {awaiting.length}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* ── Awaiting Review ── */}
                    {activeTab === 'Awaiting Review' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
                            {awaiting.length === 0 && <p className={s.emptyState}>All scans have been reviewed. Great work.</p>}
                            {awaiting.map(scan => {
                                const ann = annotations[scan.id];
                                return (
                                    <div key={scan.id} className="card" style={{ padding: 'var(--space-6)' }}>
                                        {/* Patient header */}
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-5)', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
                                            <div>
                                                <p style={{ fontFamily: 'var(--font-family-display)', fontSize: 'var(--font-size-xl)', color: 'var(--color-text-primary)' }}>
                                                    {scan.patient.name}, <span style={{ fontFamily: 'var(--font-family-base)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>{scan.patient.age} yrs</span>
                                                </p>
                                                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>Scan date: {scan.date} · Source: {scan.source}</p>
                                            </div>
                                            <SeverityBadge severity={scan.severity} />
                                        </div>

                                        {/* Scan + Annotation layout */}
                                        <div className={s.scanReviewLayout}>
                                            {/* Left: scan visual + diagnosis */}
                                            <div>
                                                <div className={s.scanImageBox}>
                                                    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="rgba(149,109,31,0.4)" strokeWidth="1">
                                                        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><path d="M14 14h.01M14 20h.01M20 14h.01M20 20h.01" />
                                                    </svg>
                                                </div>
                                                <div className={s.diagnosisPanel} style={{ marginTop: 'var(--space-4)' }}>
                                                    {/* Primary */}
                                                    <div className={s.primaryDiagnosis}>
                                                        <p className={s.primaryCondName}>{scan.diagnosis.primary.condition}</p>
                                                        <div className={s.confidenceBar}>
                                                            <div className={s.barTrack}>
                                                                <div className={s.barFill} style={{ width: `${scan.diagnosis.primary.confidence}%` }} />
                                                            </div>
                                                            <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-accent)', fontWeight: 600 }}>
                                                                {scan.diagnosis.primary.confidence}%
                                                            </span>
                                                        </div>
                                                        <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-accent)', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Primary Diagnosis</p>
                                                    </div>
                                                    {/* Secondary */}
                                                    <div className={s.secondaryDiagnosis}>
                                                        {scan.diagnosis.secondary.map(sec => (
                                                            <div key={sec.condition} className={s.secondaryItem}>
                                                                <span>{sec.condition}</span>
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flex: 1, maxWidth: 180 }}>
                                                                    <div className={s.barTrack}>
                                                                        <div style={{ height: '100%', borderRadius: 'var(--radius-full)', background: 'rgba(149,109,31,0.4)', width: `${sec.confidence}%` }} />
                                                                    </div>
                                                                    <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', width: 28 }}>{sec.confidence}%</span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right: annotation form */}
                                            <div className={`card ${s.annotationForm}`}>
                                                <p style={{ fontFamily: 'var(--font-family-display)', fontSize: 'var(--font-size-lg)', color: 'var(--color-text-primary)', marginBottom: 'var(--space-1)' }}>
                                                    Your Annotation
                                                </p>

                                                {/* Agreement */}
                                                <div>
                                                    <p className={s.formLabel} style={{ marginBottom: 'var(--space-2)' }}>Do you agree with the primary diagnosis?</p>
                                                    <div className={s.radioGroup}>
                                                        {(['yes', 'partially', 'no'] as const).map(opt => (
                                                            <label key={opt} className={s.radioLabel}>
                                                                <input type="radio" name={`agree-${scan.id}`} value={opt}
                                                                    checked={ann.agreement === opt} onChange={() => updateAnnotation(scan.id, 'agreement', opt)} />
                                                                {opt.charAt(0).toUpperCase() + opt.slice(1)}
                                                            </label>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Assessment */}
                                                <div>
                                                    <label className={s.formLabel}>Your Assessment</label>
                                                    <textarea className="input" rows={3} style={{ resize: 'vertical', marginTop: 'var(--space-2)' }}
                                                        placeholder="Enter your clinical assessment or diagnosis…"
                                                        value={ann.assessment} onChange={e => updateAnnotation(scan.id, 'assessment', e.target.value)} />
                                                </div>

                                                {/* Severity */}
                                                <div>
                                                    <label className={s.formLabel}>Severity Assessment</label>
                                                    <select className={`input ${s.filterSelect}`} style={{ marginTop: 'var(--space-2)', width: '100%' }}
                                                        value={ann.severityAssessment} onChange={e => updateAnnotation(scan.id, 'severityAssessment', e.target.value)}>
                                                        {['Low', 'Moderate', 'High', 'Urgent'].map(opt => <option key={opt}>{opt}</option>)}
                                                    </select>
                                                </div>

                                                {/* Observations */}
                                                <div>
                                                    <label className={s.formLabel}>Additional Observations</label>
                                                    <textarea className="input" rows={2} style={{ resize: 'vertical', marginTop: 'var(--space-2)' }}
                                                        placeholder="Any additional notes or observations…"
                                                        value={ann.observations} onChange={e => updateAnnotation(scan.id, 'observations', e.target.value)} />
                                                </div>

                                                <button className="btn btn-primary" onClick={() => markReviewed(scan)}>
                                                    Mark as Reviewed
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* ── Reviewed ── */}
                    {activeTab === 'Reviewed' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
                            {reviewed.length === 0 && <p className={s.emptyState}>No reviewed scans yet.</p>}
                            {reviewed.map(scan => (
                                <div key={scan.id} className="card" style={{ padding: 'var(--space-6)' }}>
                                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
                                        <div>
                                            <p style={{ fontFamily: 'var(--font-family-display)', fontSize: 'var(--font-size-lg)', color: 'var(--color-text-primary)', marginBottom: 4 }}>{scan.patient.name}</p>
                                            <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>Scan: {scan.date} · Reviewed: {scan.reviewedDate}</p>
                                        </div>
                                        <SeverityBadge severity={scan.annotation.severityAssessment} />
                                    </div>
                                    <div style={{ marginTop: 'var(--space-4)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-5)' }}>
                                        <div>
                                            <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>AI Diagnosis</p>
                                            <p style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>{scan.diagnosis.primary.condition}</p>
                                            <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>{scan.diagnosis.primary.confidence}% confidence</p>
                                        </div>
                                        <div>
                                            <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Your Assessment</p>
                                            <p style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>{scan.annotation.assessment || 'No assessment noted.'}</p>
                                            <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-accent)' }}>
                                                Agreement: {scan.annotation.agreement || '—'}
                                            </p>
                                        </div>
                                    </div>
                                    {scan.annotation.observations && (
                                        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginTop: 'var(--space-3)', fontStyle: 'italic' }}>
                                            Observations: {scan.annotation.observations}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </Reveal>
            </div>
        </div>
    );
}

