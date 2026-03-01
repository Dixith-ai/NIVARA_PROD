'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import AdminNavbar from '@/components/AdminNavbar';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { mockDoctors, mockAdminAppointments, mockAuditLog } from '@/lib/adminMockData';
import s from '../../admin.module.css';

function Reveal({ children }: { children: React.ReactNode }) {
    const ref = useRef<HTMLDivElement>(null);
    const v = useIntersectionObserver(ref as React.RefObject<Element | null>, { threshold: 0.03 });
    return <div ref={ref} className={`reveal${v ? ' active' : ''}`}>{children}</div>;
}

export default function DoctorDetailPage() {
    // Use first doctor as mock — in a real app: params.id → lookup
    const d = mockDoctors[0];
    const [note, setNote] = useState('');
    const [savedNote, setSavedNote] = useState('');
    const [suspended, setSuspended] = useState(false);
    const [pwReset, setPwReset] = useState(false);

    // Filter appointments for this doctor
    const doctorAppts = mockAdminAppointments.filter(a => a.doctor === d.name);

    const performanceMetrics = [
        { label: 'Total Consultations', val: d.consultations },
        { label: 'Acceptance Rate', val: `${d.acceptanceRate}%` },
        { label: 'Avg Response Time', val: '3.2 hrs' },
        { label: 'Patient Satisfaction', val: `${d.rating} / 5.0` },
    ];

    return (
        <div className={s.portalPage}>
            <AdminNavbar />
            <div className="container" style={{ paddingBottom: 'var(--space-16)' }}>

                {/* Breadcrumb */}
                <div style={{ padding: 'var(--space-6) 0 var(--space-2)', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', display: 'flex', gap: 'var(--space-2)' }}>
                    <Link href="/admin/doctors" style={{ color: 'var(--color-accent)', textDecoration: 'none' }}>Doctors</Link>
                    <span>/</span><span>{d.name}</span>
                </div>

                {/* Header */}
                <div className={`slide-up ${s.pageHeader}`}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)', flexWrap: 'wrap' }}>
                        <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--color-accent-light)', border: '2px solid var(--color-accent-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-family-display)', fontSize: 'var(--font-size-3xl)', color: 'var(--color-accent)' }}>
                            {d.name.split(' ').map(w => w[0]).slice(1, 3).join('')}
                        </div>
                        <div>
                            <h1 className={s.pageTitle} style={{ fontSize: 'var(--font-size-3xl)' }}>{d.name}</h1>
                            <p className={s.pageSubtitle}>{d.specialization} · {d.hospital}</p>
                            <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
                                <span className={`${s.badge} ${suspended ? s.badgeSuspended : s.badgeActive}`}>{suspended ? 'Suspended' : 'Active'}</span>
                                <span className={`${s.badge} ${s.badgeInfo}`}>Verified</span>
                            </div>
                        </div>
                    </div>
                </div>

                <Reveal>
                    <div className={s.twoCol}>
                        {/* Left */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>

                            {/* Professional Info */}
                            <div className="card" style={{ padding: 'var(--space-6)' }}>
                                <p className={s.panelTitle}>Professional Info</p>
                                {[
                                    { label: 'Specialization', val: d.specialization },
                                    { label: 'Hospital', val: d.hospital },
                                    { label: 'Location', val: d.location },
                                    { label: 'Verification', val: 'Verified — IADVL Certified' },
                                ].map(r => (
                                    <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-2) 0', borderBottom: '1px solid var(--color-border)' }}>
                                        <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>{r.label}</span>
                                        <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)' }}>{r.val}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Performance */}
                            <div className="card" style={{ padding: 'var(--space-6)' }}>
                                <p className={s.panelTitle}>Performance Metrics</p>
                                {performanceMetrics.map(m => (
                                    <div key={m.label} style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-2) 0', borderBottom: '1px solid var(--color-border)', alignItems: 'center' }}>
                                        <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>{m.label}</span>
                                        <span style={{ fontFamily: 'var(--font-family-display)', fontSize: 'var(--font-size-xl)', color: 'var(--color-accent)' }}>{m.val}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Admin Actions */}
                            <div className="card" style={{ padding: 'var(--space-6)' }}>
                                <p className={s.panelTitle}>Admin Actions</p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                                    <button className="btn btn-outline btn-small" onClick={() => setSuspended(x => !x)}>
                                        {suspended ? 'Reinstate Account' : 'Suspend Account'}
                                    </button>
                                    {pwReset ? (
                                        <div className={s.alertBanner} style={{ fontSize: 'var(--font-size-xs)' }}>Password reset sent to doctor&apos;s email.</div>
                                    ) : (
                                        <button className="btn btn-outline btn-small" onClick={() => setPwReset(true)}>Reset Password</button>
                                    )}
                                    <button className="btn btn-outline btn-small">Edit Credentials</button>
                                </div>
                            </div>

                            {/* Admin Notes */}
                            <div className="card" style={{ padding: 'var(--space-6)' }}>
                                <p className={s.panelTitle}>Admin Notes</p>
                                {savedNote && <div style={{ padding: 'var(--space-3)', background: 'var(--color-surface-warm)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-3)', fontSize: 'var(--font-size-sm)' }}>{savedNote}</div>}
                                <textarea className="input" rows={3} placeholder="Add private admin note…" value={note} onChange={e => setNote(e.target.value)} style={{ resize: 'vertical', marginBottom: 'var(--space-3)' }} />
                                <button className="btn btn-primary btn-small" onClick={() => { if (note.trim()) { setSavedNote(note); setNote(''); } }}>Save Note</button>
                            </div>
                        </div>

                        {/* Right */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>

                            {/* Appointment History */}
                            <div className="card" style={{ padding: 'var(--space-6)' }}>
                                <p className={s.panelTitle}>Appointment History</p>
                                {doctorAppts.length === 0 && <p className={s.emptyState}>No appointments found.</p>}
                                {doctorAppts.map(a => (
                                    <div key={a.id} style={{ padding: 'var(--space-3) 0', borderBottom: '1px solid var(--color-border)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                                            <div>
                                                <p style={{ fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>{a.patient}</p>
                                                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>{a.date} · {a.condition}</p>
                                            </div>
                                            <span className={`${s.badge} ${a.status === 'Declined' ? s.badgeSuspended : a.status === 'Completed' ? s.badgeActive : s.badgePending}`}>{a.status}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Activity Log (reuse audit entries) */}
                            <div className="card" style={{ padding: 'var(--space-6)' }}>
                                <p className={s.panelTitle}>Activity Log</p>
                                {mockAuditLog.slice(0, 4).map((l, i) => (
                                    <div key={i} className={s.feedItem}>
                                        <span className={s.feedTime}>{l.time}</span>
                                        <div>
                                            <p className={s.feedEvent}>{l.action}</p>
                                            <p className={s.feedDetail}>{l.detail}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </Reveal>
            </div>
        </div>
    );
}
