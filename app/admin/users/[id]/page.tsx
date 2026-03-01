'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import AdminNavbar from '@/components/AdminNavbar';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { mockUserDetail } from '@/lib/adminMockData';
import s from '../../admin.module.css';

function Reveal({ children }: { children: React.ReactNode }) {
    const ref = useRef<HTMLDivElement>(null);
    const v = useIntersectionObserver(ref as React.RefObject<Element | null>, { threshold: 0.03 });
    return <div ref={ref} className={`reveal${v ? ' active' : ''}`}>{children}</div>;
}

export default function UserDetailPage() {
    const u = mockUserDetail;
    const [note, setNote] = useState('');
    const [savedNote, setSavedNote] = useState('');
    const [suspended, setSuspended] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [pwReset, setPwReset] = useState(false);

    return (
        <div className={s.portalPage}>
            <AdminNavbar />
            <div className="container" style={{ paddingBottom: 'var(--space-16)' }}>

                {/* Breadcrumb */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-6) 0 var(--space-2)', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
                    <Link href="/admin/users" style={{ color: 'var(--color-accent)', textDecoration: 'none' }}>Users</Link>
                    <span>/</span>
                    <span>{u.name}</span>
                </div>

                {/* Header */}
                <div className={`slide-up ${s.pageHeader}`}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)', flexWrap: 'wrap' }}>
                        <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--color-accent-light)', border: '2px solid var(--color-accent-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-family-display)', fontSize: 'var(--font-size-2xl)', color: 'var(--color-accent)' }}>
                            {u.name.split(' ').map(w => w[0]).slice(0, 2).join('')}
                        </div>
                        <div>
                            <h1 className={s.pageTitle} style={{ fontSize: 'var(--font-size-3xl)' }}>{u.name}</h1>
                            <p className={s.pageSubtitle}>{u.email} · {u.location} · Registered {u.registered}</p>
                            <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-2)', flexWrap: 'wrap' }}>
                                <span className={`${s.badge} ${suspended ? s.badgeSuspended : s.badgeActive}`}>{suspended ? 'Suspended' : 'Active'}</span>
                                <span className={`${s.badge} ${s.badgePending}`}>{u.accountType}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <Reveal>
                    <div className={s.twoCol}>
                        {/* Left column */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>

                            {/* Profile Info */}
                            <div className="card" style={{ padding: 'var(--space-6)' }}>
                                <p className={s.panelTitle}>Profile Information</p>
                                {[
                                    { label: 'Phone', val: u.phone },
                                    { label: 'Location', val: u.location },
                                    { label: 'Account Type', val: u.accountType },
                                    { label: 'Last Login', val: u.lastLogin },
                                ].map(r => (
                                    <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-2) 0', borderBottom: '1px solid var(--color-border)' }}>
                                        <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>{r.label}</span>
                                        <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)' }}>{r.val}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Device */}
                            <div className="card" style={{ padding: 'var(--space-6)' }}>
                                <p className={s.panelTitle}>Linked Device</p>
                                {[
                                    { label: 'Device ID', val: u.device.id },
                                    { label: 'Linked', val: u.device.linked },
                                    { label: 'Firmware', val: u.device.firmware },
                                ].map(r => (
                                    <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-2) 0', borderBottom: '1px solid var(--color-border)' }}>
                                        <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>{r.label}</span>
                                        <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)', fontFamily: 'var(--font-family-accent)' }}>{r.val}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Activity Log */}
                            <div className="card" style={{ padding: 'var(--space-6)' }}>
                                <p className={s.panelTitle}>Activity Log</p>
                                {u.activityLog.map((a, i) => (
                                    <div key={i} className={s.feedItem}>
                                        <span className={s.feedTime}>{a.time}</span>
                                        <span className={s.feedEvent}>{a.action}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right column */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>

                            {/* Scan History */}
                            <div className="card" style={{ padding: 'var(--space-6)' }}>
                                <p className={s.panelTitle}>Scan History</p>
                                {u.scanHistory.map(sc => (
                                    <div key={sc.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-3) 0', borderBottom: '1px solid var(--color-border)', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
                                        <div>
                                            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)', fontWeight: 500 }}>{sc.condition}</p>
                                            <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>{sc.date} · {sc.source} · {sc.confidence}% confidence</p>
                                        </div>
                                        <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
                                            <span className={`${s.badge} ${sc.severity === 'High' ? s.badgeHigh : sc.severity === 'Low' ? s.badgeLow : s.badgeModerate}`}>{sc.severity}</span>
                                            <span className={`${s.badge} ${sc.reviewed ? s.badgeActive : s.badgePending}`}>{sc.reviewed ? 'Reviewed' : 'Pending'}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Appointment History */}
                            <div className="card" style={{ padding: 'var(--space-6)' }}>
                                <p className={s.panelTitle}>Appointment History</p>
                                {u.appointmentHistory.map((a, i) => (
                                    <div key={i} style={{ padding: 'var(--space-3) 0', borderBottom: '1px solid var(--color-border)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div>
                                                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)', fontWeight: 500 }}>{a.doctor}</p>
                                                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>{a.date} · {a.condition}</p>
                                            </div>
                                            <span className={`${s.badge} ${a.status === 'Completed' ? s.badgeActive : s.badgePending}`}>{a.status}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Admin Actions */}
                            <div className="card" style={{ padding: 'var(--space-6)' }}>
                                <p className={s.panelTitle}>Admin Actions</p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                                    <button className={`btn btn-outline btn-small`} onClick={() => setSuspended(s => !s)}>
                                        {suspended ? 'Reinstate Account' : 'Suspend Account'}
                                    </button>
                                    {pwReset ? (
                                        <div className={s.alertBanner} style={{ fontSize: 'var(--font-size-xs)' }}>Password reset link sent to {u.email}</div>
                                    ) : (
                                        <button className="btn btn-outline btn-small" onClick={() => setPwReset(true)}>Reset Password</button>
                                    )}
                                    {confirmDelete ? (
                                        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                                            <button className="btn btn-small btn-primary" style={{ flex: 1 }} onClick={() => setConfirmDelete(false)}>Cancel</button>
                                            <button className="btn btn-small" style={{ flex: 1, background: '#ef4444', color: 'white', border: 'none', borderRadius: 'var(--radius-full)', cursor: 'pointer', fontSize: 'var(--font-size-xs)', fontFamily: 'var(--font-family-base)' }}>Confirm Delete</button>
                                        </div>
                                    ) : (
                                        <button className="btn btn-small" style={{ background: 'rgba(220,38,38,0.08)', color: '#ef4444', border: '1px solid rgba(220,38,38,0.2)', borderRadius: 'var(--radius-full)', cursor: 'pointer', fontSize: 'var(--font-size-xs)', padding: 'var(--space-2) var(--space-4)', fontFamily: 'var(--font-family-base)' }} onClick={() => setConfirmDelete(true)}>Delete Account</button>
                                    )}
                                </div>
                            </div>

                            {/* Admin Notes */}
                            <div className="card" style={{ padding: 'var(--space-6)' }}>
                                <p className={s.panelTitle}>Admin Notes</p>
                                {savedNote && <div style={{ padding: 'var(--space-3)', background: 'var(--color-surface-warm)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-3)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)' }}>{savedNote}</div>}
                                <textarea className="input" rows={3} placeholder="Add a private admin note…" value={note} onChange={e => setNote(e.target.value)} style={{ resize: 'vertical', marginBottom: 'var(--space-3)' }} />
                                <button className="btn btn-primary btn-small" onClick={() => { if (note.trim()) { setSavedNote(note); setNote(''); } }}>Save Note</button>
                            </div>
                        </div>
                    </div>
                </Reveal>
            </div>
        </div>
    );
}
