'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import DoctorNavbar from '@/components/DoctorNavbar';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { mockPatientDossier } from '@/lib/doctorMockData';
import s from '../../portal.module.css';

function Reveal({ children }: { children: React.ReactNode }) {
    const ref = useRef<HTMLDivElement>(null);
    const visible = useIntersectionObserver(ref as React.RefObject<Element | null>, { threshold: 0.05 });
    return <div ref={ref} className={`reveal${visible ? ' active' : ''}`}>{children}</div>;
}

function SeverityBadge({ severity }: { severity: string }) {
    const cls = severity === 'High' ? s.severityHigh : severity === 'Low' ? s.severityLow : s.severityMedium;
    return <span className={`${s.severityBadge} ${cls}`}>{severity}</span>;
}

export default function PatientDossierPage() {
    const patient = mockPatientDossier; // always Arjun Mehta regardless of [id]
    const [note, setNote] = useState('Patient presents with recurring contact dermatitis on forearms. Likely work-related exposure to detergents. Prescribing topical steroid cream + antigen avoidance. Follow-up in 4 weeks.');
    const [noteSaved, setNoteSaved] = useState(false);

    const handleSaveNote = () => {
        setNoteSaved(true);
        setTimeout(() => setNoteSaved(false), 2000);
    };

    const initials = patient.name.split(' ').map(w => w[0]).slice(0, 2).join('');

    return (
        <div className={s.portalPage}>
            <DoctorNavbar />
            <div className="container" style={{ paddingBottom: 'var(--space-16)' }}>

                {/* Back link */}
                <div style={{ paddingTop: 'var(--space-6)', paddingBottom: 'var(--space-2)' }}>
                    <Link href="/doctor/patients" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', textDecoration: 'none' }}>
                        ← My Patients
                    </Link>
                </div>

                {/* ─── Patient Header ─── */}
                <div className={`slide-up ${s.pageHeader}`}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)', flexWrap: 'wrap' }}>
                        <div className={`${s.patientAvatar} ${s.patientAvatarLg}`}>{initials}</div>
                        <div>
                            <p className="section-label">Patient Dossier</p>
                            <h1 className={s.pageTitle} style={{ marginBottom: 'var(--space-1)' }}>{patient.name}</h1>
                            <p className={s.pageSubtitle}>
                                {patient.age} yrs · {patient.location} · {patient.skinType} · Member since {patient.memberSince}
                            </p>
                        </div>
                        {/* Quick stats */}
                        <div style={{ marginLeft: 'auto', display: 'flex', gap: 'var(--space-5)' }}>
                            {[
                                { label: 'Total Scans', val: patient.totalScans },
                                { label: 'Appointments', val: patient.appointmentsWithDoctor },
                                { label: 'Last Seen', val: patient.lastSeen },
                            ].map(item => (
                                <div key={item.label} style={{ textAlign: 'center' }}>
                                    <p style={{ fontFamily: 'var(--font-family-display)', fontSize: 'var(--font-size-2xl)', color: 'var(--color-accent)' }}>{item.val}</p>
                                    <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{item.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ─── Two-column layout ─── */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-8)', alignItems: 'start' }}>

                    {/* LEFT: Scan History */}
                    <Reveal>
                        <div className={s.sectionBlock}>
                            <p className="section-label">History</p>
                            <h2 className={s.panelTitle}>Scan History</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                                {patient.scanHistory.map(scan => (
                                    <div key={scan.id} className="card" style={{ padding: 'var(--space-5)', display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start' }}>
                                        <div className={s.scanStub} style={{ width: 64, height: 64 }}>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><path d="M14 14h.01M14 20h.01M20 14h.01M20 20h.01" /></svg>
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                                                <p style={{ fontFamily: 'var(--font-family-display)', color: 'var(--color-text-primary)' }}>{scan.topResult}</p>
                                                <SeverityBadge severity={scan.severity} />
                                            </div>
                                            <div className={s.confidenceBar}>
                                                <div className={s.barTrack}>
                                                    <div className={s.barFill} style={{ width: `${scan.confidence}%` }} />
                                                </div>
                                                <span className={s.barLabel}>{scan.confidence}%</span>
                                            </div>
                                            <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginTop: 'var(--space-2)' }}>
                                                {scan.source} · {scan.date}
                                            </p>
                                            <Link href="/doctor/scans" style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-accent)', textDecoration: 'none' }}>
                                                Review Scan →
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Reveal>

                    {/* RIGHT: Appointment History + Notes */}
                    <div>
                        <Reveal>
                            <div className={s.sectionBlock}>
                                <p className="section-label">Appointments</p>
                                <h2 className={s.panelTitle}>Appointment History</h2>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                                    {patient.appointmentHistory.map((appt, i) => (
                                        <div key={i} className="card" style={{ padding: 'var(--space-4) var(--space-5)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div>
                                                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)', marginBottom: 4 }}>{appt.date}</p>
                                                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>{appt.scan}</p>
                                            </div>
                                            <span className={`${s.severityBadge} ${appt.status === 'upcoming' ? s.severityMedium : s.severityLow}`}>
                                                {appt.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Reveal>

                        <Reveal>
                            <div>
                                <p className="section-label">Private Notes</p>
                                <h2 className={s.panelTitle}>Doctor's Notes</h2>
                                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-3)' }}>
                                    These notes are private and only visible to you.
                                </p>
                                <textarea
                                    className="input"
                                    rows={6}
                                    value={note}
                                    onChange={e => setNote(e.target.value)}
                                    style={{ resize: 'vertical', marginBottom: 'var(--space-4)' }}
                                    placeholder="Add notes about this patient…"
                                />
                                <button
                                    className="btn btn-primary"
                                    onClick={handleSaveNote}
                                    style={{ minWidth: 140 }}
                                >
                                    {noteSaved ? '✓ Saved!' : 'Save Notes'}
                                </button>
                            </div>
                        </Reveal>
                    </div>
                </div>
            </div>
        </div>
    );
}
