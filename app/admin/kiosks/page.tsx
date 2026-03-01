'use client';
import React from 'react';

import { useState, useRef } from 'react';
import AdminNavbar from '@/components/AdminNavbar';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { mockKiosks, mockLinkedDevices, mockPlatformStats } from '@/lib/adminMockData';
import s from '../admin.module.css';

function Reveal({ children }: { children: React.ReactNode }) {
    const ref = useRef<HTMLDivElement>(null);
    const v = useIntersectionObserver(ref as React.RefObject<Element | null>, { threshold: 0.03 });
    return <div ref={ref} className={`reveal${v ? ' active' : ''}`}>{children}</div>;
}

const maxScans = Math.max(...mockKiosks.map(k => k.totalScans));

export default function KiosksPage() {
    const [bannerDismissed, setBannerDismissed] = useState(false);
    const [expanded, setExpanded] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [newKiosk, setNewKiosk] = useState({ location: '', city: '', type: 'Hospital', partnership: '', technician: '' });
    const [formSuccess, setFormSuccess] = useState(false);

    const offlineKiosks = mockKiosks.filter(k => k.status === 'Offline');

    function statusCls(st: string) {
        return st === 'Online' ? s.badgeOnline : st === 'Offline' ? s.badgeOffline : s.badgeMaint;
    }
    function dotCls(st: string) {
        return st === 'Online' ? s.dotGreen : st === 'Offline' ? s.dotRed : s.dotAmber;
    }

    return (
        <div className={s.portalPage}>
            <AdminNavbar />
            <div className="container" style={{ paddingBottom: 'var(--space-16)' }}>

                {/* Header */}
                <div className={`slide-up ${s.pageHeader}`}>
                    <p className="section-label">Admin</p>
                    <h1 className={s.pageTitle}>Kiosk &amp; Device Management</h1>
                    <div className={s.quickStats}>
                        <div className={s.quickStat}><span className={s.quickStatNum}>{mockPlatformStats.kiosksOnline}</span><span className={s.quickStatLabel}>Kiosks Online</span></div>
                        <div className={s.quickStat}><span className={s.quickStatNum}>{offlineKiosks.length}</span><span className={s.quickStatLabel}>Offline</span></div>
                        <div className={s.quickStat}><span className={s.quickStatNum}>{mockPlatformStats.devicesLinked}</span><span className={s.quickStatLabel}>Devices Linked</span></div>
                        <div className={s.quickStat}><span className={s.quickStatNum}>{mockKiosks.reduce((a, k) => a + k.scansToday, 0)}</span><span className={s.quickStatLabel}>Scans Today</span></div>
                    </div>
                </div>

                {/* Offline Alert Banner */}
                {!bannerDismissed && offlineKiosks.length > 0 && (
                    <div className={s.alertBanner}>
                        <div>
                            <p style={{ fontWeight: 600, color: '#ef4444', fontSize: 'var(--font-size-sm)', marginBottom: 4 }}>⚠ {offlineKiosks.length} Kiosk{offlineKiosks.length > 1 ? 's' : ''} Offline</p>
                            {offlineKiosks.map(k => (
                                <p key={k.id} style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
                                    {k.id} — {k.location}, {k.city} · Last ping: {k.lastPing} · Technician: {k.technician}
                                </p>
                            ))}
                        </div>
                        <button onClick={() => setBannerDismissed(true)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)', flexShrink: 0 }}>✕</button>
                    </div>
                )}

                <Reveal>
                    {/* Kiosk Table */}
                    <div className={s.sectionBlock}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
                            <h2 className={s.panelTitle}>Kiosk Network</h2>
                            <button className="btn btn-primary btn-small" onClick={() => setShowForm(f => !f)}>
                                {showForm ? 'Hide Form' : '+ Register Kiosk'}
                            </button>
                        </div>

                        {showForm && (
                            <div className="card" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
                                <p className={s.panelTitle} style={{ fontSize: 'var(--font-size-lg)' }}>Register New Kiosk</p>
                                {formSuccess ? (
                                    <div style={{ textAlign: 'center', padding: 'var(--space-6)' }}>
                                        <p style={{ fontFamily: 'var(--font-family-display)', color: 'var(--color-success)', fontSize: 'var(--font-size-2xl)' }}>Kiosk Registered!</p>
                                        <button className="btn btn-outline btn-small" style={{ marginTop: 'var(--space-4)' }} onClick={() => { setFormSuccess(false); setNewKiosk({ location: '', city: '', type: 'Hospital', partnership: '', technician: '' }); }}>Register Another</button>
                                    </div>
                                ) : (
                                    <>
                                        <div className={s.formGrid} style={{ marginBottom: 'var(--space-5)' }}>
                                            {[
                                                { key: 'location', label: 'Location Name', placeholder: 'AIIMS Delhi' },
                                                { key: 'city', label: 'City', placeholder: 'Delhi' },
                                                { key: 'partnership', label: 'Partnership (optional)', placeholder: 'AIIMS MoU' },
                                                { key: 'technician', label: 'Technician Assigned', placeholder: 'Ramesh Kumar' },
                                            ].map(f => (
                                                <div key={f.key} className={s.formGroup}>
                                                    <label className={s.formLabel}>{f.label}</label>
                                                    <input className="input" placeholder={f.placeholder} value={(newKiosk as Record<string, string>)[f.key]} onChange={e => setNewKiosk(d => ({ ...d, [f.key]: e.target.value }))} />
                                                </div>
                                            ))}
                                        </div>
                                        <div className={s.formGroup} style={{ maxWidth: 260, marginBottom: 'var(--space-5)' }}>
                                            <label className={s.formLabel}>Deployment Type</label>
                                            <select className={s.filterSelect} style={{ width: '100%' }} value={newKiosk.type} onChange={e => setNewKiosk(d => ({ ...d, type: e.target.value }))}>
                                                {['Hospital', 'Government', 'Mall', 'CSR', 'Corporate'].map(o => <option key={o}>{o}</option>)}
                                            </select>
                                        </div>
                                        <button className="btn btn-primary" onClick={() => { if (newKiosk.location) setFormSuccess(true); }}>Register Kiosk</button>
                                    </>
                                )}
                            </div>
                        )}

                        <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
                            <table className={s.table}>
                                <thead>
                                    <tr><th>Kiosk ID</th><th>Location</th><th>City</th><th>Type</th><th>Status</th><th>Total Scans</th><th>Today</th><th>Last Ping</th><th>Actions</th></tr>
                                </thead>
                                <tbody>
                                    {mockKiosks.map(k => (
                                        <React.Fragment key={k.id}>
                                            <tr>
                                                <td style={{ fontFamily: 'var(--font-family-accent)', color: 'var(--color-accent)', fontWeight: 500 }}>{k.id}</td>
                                                <td style={{ fontWeight: 500 }}>{k.location}</td>
                                                <td style={{ color: 'var(--color-text-secondary)' }}>{k.city}</td>
                                                <td style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-xs)' }}>{k.type}</td>
                                                <td>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                                        <span className={`${s.statusDot} ${dotCls(k.status)}`} />
                                                        <span className={`${s.badge} ${statusCls(k.status)}`}>{k.status}</span>
                                                    </div>
                                                </td>
                                                <td style={{ fontFamily: 'var(--font-family-display)', color: 'var(--color-accent)', fontSize: 'var(--font-size-xl)' }}>{k.totalScans.toLocaleString()}</td>
                                                <td style={{ fontFamily: 'var(--font-family-display)', color: 'var(--color-text-primary)', fontSize: 'var(--font-size-xl)' }}>{k.scansToday}</td>
                                                <td style={{ color: k.lastPing.includes('hr') ? '#ef4444' : 'var(--color-text-secondary)', fontSize: 'var(--font-size-xs)' }}>{k.lastPing}</td>
                                                <td>
                                                    <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                                                        <button className="btn btn-small btn-primary" onClick={() => setExpanded(expanded === k.id ? null : k.id)}>
                                                            {expanded === k.id ? 'Close' : 'Details'}
                                                        </button>
                                                        <button className="btn btn-small btn-outline">Maintenance</button>
                                                    </div>
                                                </td>
                                            </tr>
                                            {expanded === k.id && (
                                                <tr key={`${k.id}-detail`}>
                                                    <td colSpan={9} style={{ background: 'var(--color-surface-warm)', padding: 'var(--space-5)' }}>
                                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-5)' }}>
                                                            <div>
                                                                <p style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>Location Info</p>
                                                                <p style={{ fontSize: 'var(--font-size-sm)', marginBottom: 2 }}>{k.location}, {k.city}</p>
                                                                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>Type: {k.type}</p>
                                                                {k.partnership && <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-accent)' }}>Partnership: {k.partnership}</p>}
                                                                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>Technician: {k.technician}</p>
                                                            </div>
                                                            <div>
                                                                <p style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>Scan Volume</p>
                                                                <div className={s.barChart} style={{ height: 70 }}>
                                                                    {[k.totalScans, Math.round(k.totalScans * 0.9), Math.round(k.totalScans * 0.7), Math.round(k.totalScans * 1.1), Math.round(k.totalScans * 0.8), k.scansToday * 30].map((v, i) => (
                                                                        <div key={i} className={s.barCol}>
                                                                            <div className={s.barBar} style={{ height: `${Math.round((v / (Math.max(...[k.totalScans * 1.1]))) * 100)}%` }} />
                                                                            <span className={s.barLbl}>M{i + 1}</span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <p style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>Maintenance History</p>
                                                                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>Last service: 2 months ago</p>
                                                                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>Uptime: 99.1% (30 days)</p>
                                                                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>Next scheduled: Apr 2025</p>
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

                {/* Device Management */}
                <Reveal>
                    <div className={s.sectionBlock}>
                        <h2 className={s.panelTitle}>Linked Devices</h2>
                        <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
                            <table className={s.table}>
                                <thead>
                                    <tr><th>Device ID</th><th>Linked User</th><th>Last Sync</th><th>Total Scans</th><th>Status</th><th>Action</th></tr>
                                </thead>
                                <tbody>
                                    {mockLinkedDevices.map(d => (
                                        <tr key={d.id}>
                                            <td style={{ fontFamily: 'var(--font-family-accent)', color: 'var(--color-accent)' }}>{d.id}</td>
                                            <td style={{ fontWeight: 500 }}>{d.user}</td>
                                            <td style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-xs)' }}>{d.lastSync}</td>
                                            <td style={{ fontFamily: 'var(--font-family-display)', color: 'var(--color-accent)', fontSize: 'var(--font-size-xl)' }}>{d.totalScans}</td>
                                            <td><span className={`${s.badge} ${d.status === 'Active' ? s.badgeActive : s.badgePending}`}>{d.status}</span></td>
                                            <td><a href={`/admin/users/${d.userId}`} className="btn btn-small btn-primary">View User</a></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </Reveal>
            </div>
        </div>
    );
}
