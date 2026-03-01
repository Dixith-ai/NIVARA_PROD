'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import AdminNavbar from '@/components/AdminNavbar';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { mockDoctors, mockPlatformStats } from '@/lib/adminMockData';
import s from '../admin.module.css';

function Reveal({ children }: { children: React.ReactNode }) {
    const ref = useRef<HTMLDivElement>(null);
    const v = useIntersectionObserver(ref as React.RefObject<Element | null>, { threshold: 0.03 });
    return <div ref={ref} className={`reveal${v ? ' active' : ''}`}>{children}</div>;
}

function genPassword() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#';
    return Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

export default function DoctorsPage() {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', specialization: '', hospital: '', location: '', phone: '' });
    const [tempPassword] = useState(genPassword());
    const [formSuccess, setFormSuccess] = useState(false);

    const filtered = mockDoctors.filter(d => {
        const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) || d.specialization.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === 'All' || d.status === statusFilter;
        return matchSearch && matchStatus;
    });

    const handleCreate = () => {
        if (formData.name && formData.email) setFormSuccess(true);
    };

    return (
        <div className={s.portalPage}>
            <AdminNavbar />
            <div className="container" style={{ paddingBottom: 'var(--space-16)' }}>

                {/* Header */}
                <div className={`slide-up ${s.pageHeader}`}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
                        <div>
                            <p className="section-label">Admin</p>
                            <h1 className={s.pageTitle}>Doctor Management</h1>
                            <div className={s.quickStats}>
                                <div className={s.quickStat}><span className={s.quickStatNum}>{mockPlatformStats.totalDoctors}</span><span className={s.quickStatLabel}>Total Doctors</span></div>
                                <div className={s.quickStat}><span className={s.quickStatNum}>{mockPlatformStats.activeDoctors}</span><span className={s.quickStatLabel}>Active</span></div>
                                <div className={s.quickStat}><span className={s.quickStatNum}>{mockPlatformStats.pendingDoctorVerifications}</span><span className={s.quickStatLabel}>Pending Verification</span></div>
                                <div className={s.quickStat}><span className={s.quickStatNum}>{mockPlatformStats.suspendedDoctors}</span><span className={s.quickStatLabel}>Suspended</span></div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                            <button className="btn btn-primary btn-small" onClick={() => { setShowForm(f => !f); setFormSuccess(false); }}>
                                {showForm ? 'Hide Form' : '+ Create Doctor Account'}
                            </button>
                            <Link href="/admin/doctors/verify" className="btn btn-outline btn-small">Verification Pipeline</Link>
                        </div>
                    </div>
                </div>

                {/* Create Doctor Form */}
                {showForm && (
                    <Reveal>
                        <div className="card" style={{ padding: 'var(--space-8)', marginBottom: 'var(--space-8)' }}>
                            <p className={s.panelTitle}>Create Doctor Account</p>
                            {formSuccess ? (
                                <div style={{ background: 'var(--color-surface-warm)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', textAlign: 'center' }}>
                                    <p style={{ fontFamily: 'var(--font-family-display)', fontSize: 'var(--font-size-2xl)', color: 'var(--color-success)', marginBottom: 'var(--space-4)' }}>Account Created!</p>
                                    <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>Share these credentials securely with the doctor:</p>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', alignItems: 'center' }}>
                                        <p style={{ fontFamily: 'var(--font-family-accent)', fontSize: 'var(--font-size-lg)', color: 'var(--color-text-primary)' }}>Email: <strong>{formData.email}</strong></p>
                                        <p style={{ fontFamily: 'var(--font-family-accent)', fontSize: 'var(--font-size-lg)', color: 'var(--color-accent)' }}>Temp Password: <strong>{tempPassword}</strong></p>
                                    </div>
                                    <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginTop: 'var(--space-3)' }}>This password will not be shown again. Credentials email sent to {formData.email}.</p>
                                    <button className="btn btn-outline btn-small" style={{ marginTop: 'var(--space-4)' }} onClick={() => { setFormSuccess(false); setFormData({ name: '', email: '', specialization: '', hospital: '', location: '', phone: '' }); }}>Create Another</button>
                                </div>
                            ) : (
                                <>
                                    <div className={s.formGrid} style={{ marginBottom: 'var(--space-5)' }}>
                                        {[
                                            { key: 'name', label: 'Full Name', placeholder: 'Dr. Jane Doe' },
                                            { key: 'email', label: 'Email (Login)', placeholder: 'jane@hospital.com' },
                                            { key: 'specialization', label: 'Specialization', placeholder: 'General Dermatology' },
                                            { key: 'hospital', label: 'Hospital Affiliation', placeholder: 'City Hospital, Mumbai' },
                                            { key: 'location', label: 'Location', placeholder: 'Mumbai' },
                                            { key: 'phone', label: 'Phone', placeholder: '+91 98765 43210' },
                                        ].map(f => (
                                            <div key={f.key} className={s.formGroup}>
                                                <label className={s.formLabel}>{f.label}</label>
                                                <input className="input" placeholder={f.placeholder} value={(formData as Record<string, string>)[f.key]} onChange={e => setFormData(d => ({ ...d, [f.key]: e.target.value }))} />
                                            </div>
                                        ))}
                                    </div>
                                    <div style={{ padding: 'var(--space-4)', background: 'var(--color-surface-warm)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-5)', fontSize: 'var(--font-size-sm)' }}>
                                        Temporary password: <strong style={{ fontFamily: 'var(--font-family-accent)', color: 'var(--color-accent)' }}>{tempPassword}</strong>
                                        <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', display: 'block', marginTop: 4 }}>Auto-generated. Will be shown once on account creation.</span>
                                    </div>
                                    <button className="btn btn-primary" onClick={handleCreate}>Create Account &amp; Send Credentials</button>
                                </>
                            )}
                        </div>
                    </Reveal>
                )}

                <Reveal>
                    {/* Filters */}
                    <div className={s.filterBar}>
                        <input className="input" placeholder="Search by name or specialization…" value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth: 300, height: 44 }} />
                        <select className={s.filterSelect} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                            {['All', 'Active', 'Suspended'].map(o => <option key={o}>{o}</option>)}
                        </select>
                    </div>

                    {/* Table */}
                    <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
                        <table className={s.table}>
                            <thead>
                                <tr><th>Doctor</th><th>Specialization</th><th>Hospital</th><th>Location</th><th>Consultations</th><th>Rating</th><th>Acceptance Rate</th><th>Status</th><th>Actions</th></tr>
                            </thead>
                            <tbody>
                                {filtered.map(d => (
                                    <tr key={d.id}>
                                        <td style={{ fontWeight: 500 }}>{d.name}</td>
                                        <td style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-xs)' }}>{d.specialization}</td>
                                        <td style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-xs)' }}>{d.hospital}</td>
                                        <td style={{ color: 'var(--color-text-secondary)' }}>{d.location}</td>
                                        <td style={{ fontFamily: 'var(--font-family-display)', color: 'var(--color-accent)', fontSize: 'var(--font-size-xl)' }}>{d.consultations}</td>
                                        <td style={{ color: d.rating < 4.0 ? '#ef4444' : 'var(--color-success)' }}>⭐ {d.rating}</td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                                <div style={{ flex: 1, height: 4, background: 'var(--color-border)', borderRadius: 4, overflow: 'hidden', minWidth: 60 }}>
                                                    <div style={{ width: `${d.acceptanceRate}%`, height: '100%', background: d.acceptanceRate < 50 ? '#ef4444' : 'var(--gradient-gold)' }} />
                                                </div>
                                                <span style={{ fontSize: 'var(--font-size-xs)', color: d.acceptanceRate < 50 ? '#ef4444' : 'var(--color-text-secondary)' }}>{d.acceptanceRate}%</span>
                                            </div>
                                        </td>
                                        <td><span className={`${s.badge} ${d.status === 'Active' ? s.badgeActive : s.badgeSuspended}`}>{d.status}</span></td>
                                        <td>
                                            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                                                <Link href={`/admin/doctors/${d.id}`} className="btn btn-small btn-primary">View</Link>
                                                <button className="btn btn-small btn-outline">Suspend</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filtered.length === 0 && <tr><td colSpan={9} className={s.emptyState}>No doctors match your filters.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </Reveal>
            </div>
        </div>
    );
}
