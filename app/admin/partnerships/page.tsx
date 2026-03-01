'use client';
import React from 'react';

import { useState, useRef } from 'react';
import AdminNavbar from '@/components/AdminNavbar';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { mockPartnerships } from '@/lib/adminMockData';
import s from '../admin.module.css';

function Reveal({ children }: { children: React.ReactNode }) {
    const ref = useRef<HTMLDivElement>(null);
    const v = useIntersectionObserver(ref as React.RefObject<Element | null>, { threshold: 0.03 });
    return <div ref={ref} className={`reveal${v ? ' active' : ''}`}>{children}</div>;
}

const csrImpact = {
    csrScans: 3821,
    freeFunded: 2940,
    communities: 18,
    topCondition: 'Eczema',
};

export default function PartnershipsPage() {
    const [expanded, setExpanded] = useState<number | null>(null);
    const [adminNotes, setAdminNotes] = useState<Record<number, string>>({});
    const [showForm, setShowForm] = useState(false);
    const [newP, setNewP] = useState({ name: '', type: 'Hospital', city: '', contact: '', email: '', kioskCount: '', notes: '', start: '', end: '' });
    const [formSuccess, setFormSuccess] = useState(false);

    function statusCls(status: string) {
        return status === 'Active' ? s.badgeActive : status === 'Renewal Due' ? s.badgeRenewal : s.badgeSuspended;
    }
    function typeCls(type: string) {
        return type === 'CSR' ? s.badgeInfo : type === 'Government' ? s.badgePending : s.badgeModerate;
    }

    return (
        <div className={s.portalPage}>
            <AdminNavbar />
            <div className="container" style={{ paddingBottom: 'var(--space-16)' }}>

                {/* Header */}
                <div className={`slide-up ${s.pageHeader}`}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
                        <div>
                            <p className="section-label">Admin</p>
                            <h1 className={s.pageTitle}>CSR &amp; Partnerships</h1>
                            <div className={s.quickStats}>
                                <div className={s.quickStat}><span className={s.quickStatNum}>{mockPartnerships.length}</span><span className={s.quickStatLabel}>Active Partnerships</span></div>
                                <div className={s.quickStat}><span className={s.quickStatNum}>{mockPartnerships.reduce((a, p) => a + p.kiosks, 0)}</span><span className={s.quickStatLabel}>Kiosks Under Partnerships</span></div>
                                <div className={s.quickStat}><span className={s.quickStatNum}>{csrImpact.csrScans.toLocaleString()}</span><span className={s.quickStatLabel}>CSR Scans</span></div>
                                <div className={s.quickStat}><span className={s.quickStatNum}>{csrImpact.communities}</span><span className={s.quickStatLabel}>Communities Reached</span></div>
                            </div>
                        </div>
                        <button className="btn btn-primary btn-small" onClick={() => { setShowForm(f => !f); setFormSuccess(false); }}>
                            {showForm ? 'Hide Form' : '+ Add Partnership'}
                        </button>
                    </div>
                </div>

                {/* Add Partnership Form */}
                {showForm && (
                    <Reveal>
                        <div className="card" style={{ padding: 'var(--space-8)', marginBottom: 'var(--space-8)' }}>
                            <p className={s.panelTitle}>Register New Partnership</p>
                            {formSuccess ? (
                                <div style={{ textAlign: 'center', padding: 'var(--space-6)' }}>
                                    <p style={{ fontFamily: 'var(--font-family-display)', color: 'var(--color-success)', fontSize: 'var(--font-size-2xl)' }}>Partnership Registered!</p>
                                    <button className="btn btn-outline btn-small" style={{ marginTop: 'var(--space-4)' }} onClick={() => { setFormSuccess(false); setNewP({ name: '', type: 'Hospital', city: '', contact: '', email: '', kioskCount: '', notes: '', start: '', end: '' }); }}>Add Another</button>
                                </div>
                            ) : (
                                <>
                                    <div className={s.formGrid} style={{ marginBottom: 'var(--space-5)' }}>
                                        {[
                                            { key: 'name', label: 'Organization Name', placeholder: 'AIIMS Delhi' },
                                            { key: 'city', label: 'City', placeholder: 'Delhi' },
                                            { key: 'contact', label: 'Key Contact', placeholder: 'Dr. R. Sharma' },
                                            { key: 'email', label: 'Contact Email', placeholder: 'contact@org.com' },
                                            { key: 'kioskCount', label: 'Kiosks to Assign', placeholder: '1' },
                                            { key: 'start', label: 'Contract Start', placeholder: 'Jan 2025' },
                                            { key: 'end', label: 'Contract End', placeholder: 'Jan 2026' },
                                        ].map(f => (
                                            <div key={f.key} className={s.formGroup}>
                                                <label className={s.formLabel}>{f.label}</label>
                                                <input className="input" placeholder={f.placeholder} value={(newP as Record<string, string>)[f.key]} onChange={e => setNewP(d => ({ ...d, [f.key]: e.target.value }))} />
                                            </div>
                                        ))}
                                        <div className={s.formGroup}>
                                            <label className={s.formLabel}>Organization Type</label>
                                            <select className={s.filterSelect} style={{ width: '100%' }} value={newP.type} onChange={e => setNewP(d => ({ ...d, type: e.target.value }))}>
                                                {['Hospital', 'Government', 'CSR', 'Corporate'].map(o => <option key={o}>{o}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <div className={s.formGroup} style={{ marginBottom: 'var(--space-5)' }}>
                                        <label className={s.formLabel}>Notes</label>
                                        <textarea className="input" rows={3} placeholder="Partnership notes…" value={newP.notes} onChange={e => setNewP(d => ({ ...d, notes: e.target.value }))} style={{ resize: 'vertical' }} />
                                    </div>
                                    <button className="btn btn-primary" onClick={() => { if (newP.name) setFormSuccess(true); }}>Register Partnership</button>
                                </>
                            )}
                        </div>
                    </Reveal>
                )}

                {/* Partnerships Table */}
                <Reveal>
                    <div className={s.sectionBlock}>
                        <h2 className={s.panelTitle}>Active Partnerships</h2>
                        <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
                            <table className={s.table}>
                                <thead>
                                    <tr><th>Organization</th><th>Type</th><th>City</th><th>Kiosks</th><th>Total Scans</th><th>Contract</th><th>Status</th><th>Actions</th></tr>
                                </thead>
                                <tbody>
                                    {mockPartnerships.map(p => (
                                        <React.Fragment key={p.id}>
                                            <tr>
                                                <td style={{ fontWeight: 500 }}>{p.name}</td>
                                                <td><span className={`${s.badge} ${typeCls(p.type)}`}>{p.type}</span></td>
                                                <td style={{ color: 'var(--color-text-secondary)' }}>{p.city}</td>
                                                <td style={{ fontFamily: 'var(--font-family-display)', color: 'var(--color-accent)', fontSize: 'var(--font-size-xl)' }}>{p.kiosks}</td>
                                                <td style={{ fontFamily: 'var(--font-family-display)', color: 'var(--color-text-primary)', fontSize: 'var(--font-size-xl)' }}>{p.totalScans.toLocaleString()}</td>
                                                <td style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>{p.start} → {p.end}</td>
                                                <td><span className={`${s.badge} ${statusCls(p.status)}`}>{p.status}</span></td>
                                                <td>
                                                    <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                                                        <button className="btn btn-small btn-primary" onClick={() => setExpanded(expanded === p.id ? null : p.id)}>
                                                            {expanded === p.id ? 'Close' : 'View'}
                                                        </button>
                                                        {p.status === 'Renewal Due' && <button className="btn btn-small btn-outline">Renew</button>}
                                                    </div>
                                                </td>
                                            </tr>
                                            {expanded === p.id && (
                                                <tr key={`${p.id}-detail`}>
                                                    <td colSpan={8} style={{ background: 'var(--color-surface-warm)', padding: 'var(--space-5)' }}>
                                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-5)' }}>
                                                            <div>
                                                                <p style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>Contact</p>
                                                                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)' }}>{p.contact}</p>
                                                                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-accent)' }}>{p.contactEmail}</p>
                                                            </div>
                                                            <div>
                                                                <p style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>Impact</p>
                                                                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)' }}>{p.totalScans.toLocaleString()} scans completed</p>
                                                                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>{p.kiosks} kiosk{p.kiosks > 1 ? 's' : ''} deployed · {p.city}</p>
                                                            </div>
                                                            <div>
                                                                <p style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>Admin Notes</p>
                                                                <textarea className="input" rows={3} placeholder="Add note…" value={adminNotes[p.id] || ''} onChange={e => setAdminNotes(n => ({ ...n, [p.id]: e.target.value }))} style={{ resize: 'none', fontSize: 'var(--font-size-xs)' }} />
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </Reveal>

                {/* CSR Impact */}
                <Reveal>
                    <div className={s.sectionBlock}>
                        <p className="section-label">Impact</p>
                        <h2 className={s.panelTitle}>CSR Impact Metrics</h2>
                        <div className={s.statsGrid}>
                            {[
                                { icon: '🔬', num: csrImpact.csrScans.toLocaleString(), label: 'Underserved Community Scans' },
                                { icon: '🆓', num: csrImpact.freeFunded.toLocaleString(), label: 'Free CSR-Funded Scans' },
                                { icon: '🏘️', num: csrImpact.communities, label: 'Communities Reached' },
                                { icon: '🏆', num: csrImpact.topCondition, label: 'Top Condition (CSR)' },
                            ].map(item => (
                                <div key={item.label} className={`card ${s.statCard}`}>
                                    <div className={s.statIcon}>{item.icon}</div>
                                    <div className={s.statNum} style={{ fontSize: typeof item.num === 'string' && item.num.length > 5 ? 'var(--font-size-2xl)' : 'var(--font-size-4xl)' }}>{item.num}</div>
                                    <div className={s.statLabel}>{item.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </Reveal>
            </div>
        </div>
    );
}
