'use client';
import React from 'react';

import { useState, useRef } from 'react';
import Link from 'next/link';
import AdminNavbar from '@/components/AdminNavbar';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { mockAdminAppointments } from '@/lib/adminMockData';
import s from '../admin.module.css';

function Reveal({ children }: { children: React.ReactNode }) {
    const ref = useRef<HTMLDivElement>(null);
    const v = useIntersectionObserver(ref as React.RefObject<Element | null>, { threshold: 0.03 });
    return <div ref={ref} className={`reveal${v ? ' active' : ''}`}>{children}</div>;
}

type AppointmentStatus = 'All' | 'Pending' | 'Upcoming' | 'Completed' | 'Declined';

export default function AppointmentsPage() {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<AppointmentStatus>('All');
    const [severityFilter, setSeverityFilter] = useState('All');
    const [expanded, setExpanded] = useState<number | null>(null);
    const [adminNotes, setAdminNotes] = useState<Record<number, string>>({});
    const [savedNotes, setSavedNotes] = useState<Record<number, string>>({});

    const filtered = mockAdminAppointments.filter(a => {
        const matchSearch = a.patient.toLowerCase().includes(search.toLowerCase()) || a.doctor.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === 'All' || a.status === statusFilter;
        const matchSev = severityFilter === 'All' || a.severity === severityFilter;
        return matchSearch && matchStatus && matchSev;
    });

    const stats = {
        today: mockAdminAppointments.filter(a => a.daysSince <= 1).length,
        pending: mockAdminAppointments.filter(a => a.status === 'Pending').length,
        accepted: mockAdminAppointments.filter(a => a.status === 'Upcoming').length,
        declined: mockAdminAppointments.filter(a => a.status === 'Declined').length,
    };

    function statusCls(status: string) {
        return status === 'Upcoming' ? s.badgeActive : status === 'Declined' ? s.badgeSuspended : status === 'Completed' ? s.badgeInfo : s.badgePending;
    }
    function sevCls(sev: string) {
        return sev === 'High' ? s.badgeHigh : sev === 'Low' ? s.badgeLow : s.badgeModerate;
    }

    return (
        <div className={s.portalPage}>
            <AdminNavbar />
            <div className="container" style={{ paddingBottom: 'var(--space-16)' }}>

                {/* Header */}
                <div className={`slide-up ${s.pageHeader}`}>
                    <p className="section-label">Admin</p>
                    <h1 className={s.pageTitle}>Appointment Oversight</h1>
                    <div className={s.quickStats}>
                        <div className={s.quickStat}><span className={s.quickStatNum}>{stats.today}</span><span className={s.quickStatLabel}>Total Today</span></div>
                        <div className={s.quickStat}><span className={s.quickStatNum}>{stats.pending}</span><span className={s.quickStatLabel}>Platform Pending</span></div>
                        <div className={s.quickStat}><span className={s.quickStatNum}>{stats.accepted}</span><span className={s.quickStatLabel}>Upcoming This Week</span></div>
                        <div className={s.quickStat}><span className={s.quickStatNum}>{stats.declined}</span><span className={s.quickStatLabel}>Declined This Week</span></div>
                    </div>
                </div>

                <Reveal>
                    {/* Filters */}
                    <div className={s.filterBar}>
                        <input className="input" placeholder="Search patient or doctor…" value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth: 280, height: 44 }} />
                        <select className={s.filterSelect} value={statusFilter} onChange={e => setStatusFilter(e.target.value as AppointmentStatus)}>
                            {['All', 'Pending', 'Upcoming', 'Completed', 'Declined'].map(o => <option key={o}>{o}</option>)}
                        </select>
                        <select className={s.filterSelect} value={severityFilter} onChange={e => setSeverityFilter(e.target.value)}>
                            {['All', 'High', 'Moderate', 'Low'].map(o => <option key={o}>{o}</option>)}
                        </select>
                    </div>

                    {/* Table */}
                    <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
                        <table className={s.table}>
                            <thead>
                                <tr>
                                    <th>Patient</th><th>Doctor</th><th>Date / Time</th>
                                    <th>Condition</th><th>Scan Severity</th><th>Status</th><th>Days Since Request</th><th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(a => (
                                    <React.Fragment key={a.id}>
                                        <tr>
                                            <td style={{ fontWeight: 500 }}>{a.patient}</td>
                                            <td style={{ color: 'var(--color-text-secondary)' }}>{a.doctor}</td>
                                            <td style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-xs)' }}>{a.date} · {a.time}</td>
                                            <td style={{ fontSize: 'var(--font-size-xs)' }}>{a.condition}</td>
                                            <td><span className={`${s.badge} ${sevCls(a.severity)}`}>{a.severity}</span></td>
                                            <td><span className={`${s.badge} ${statusCls(a.status)}`}>{a.status}</span></td>
                                            <td style={{ color: a.daysSince > 7 ? '#ef4444' : 'var(--color-text-secondary)', fontFamily: 'var(--font-family-display)', fontSize: 'var(--font-size-xl)' }}>{a.daysSince}</td>
                                            <td>
                                                <button className="btn btn-small btn-primary" onClick={() => setExpanded(expanded === a.id ? null : a.id)}>
                                                    {expanded === a.id ? 'Close' : 'View Details'}
                                                </button>
                                            </td>
                                        </tr>
                                        {expanded === a.id && (
                                            <tr>
                                                <td colSpan={8} style={{ background: 'var(--color-surface-warm)', padding: 'var(--space-5)' }}>
                                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-5)' }}>
                                                        <div>
                                                            <p style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>Patient</p>
                                                            <p style={{ fontFamily: 'var(--font-family-display)', fontSize: 'var(--font-size-lg)', color: 'var(--color-text-primary)' }}>{a.patient}</p>
                                                            <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>Patient note: <em>{a.note}</em></p>
                                                        </div>
                                                        <div>
                                                            <p style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>Doctor</p>
                                                            <p style={{ fontFamily: 'var(--font-family-display)', fontSize: 'var(--font-size-lg)', color: 'var(--color-text-primary)' }}>{a.doctor}</p>
                                                            <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>Status: {a.status}</p>
                                                        </div>
                                                        <div>
                                                            <p style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>Scan Result</p>
                                                            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)', marginBottom: 4 }}>{a.condition}</p>
                                                            <span className={`${s.badge} ${sevCls(a.severity)}`}>{a.severity}</span>
                                                        </div>
                                                    </div>
                                                    <div style={{ marginTop: 'var(--space-4)' }}>
                                                        <p style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>Admin Note</p>
                                                        {savedNotes[a.id] && <div style={{ padding: 'var(--space-2) var(--space-3)', background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', fontSize: 'var(--font-size-xs)', marginBottom: 'var(--space-2)' }}>{savedNotes[a.id]}</div>}
                                                        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                                                            <input className="input" placeholder="Add admin note…" value={adminNotes[a.id] || ''} onChange={e => setAdminNotes(n => ({ ...n, [a.id]: e.target.value }))} style={{ height: 40, fontSize: 'var(--font-size-xs)' }} />
                                                            <button className="btn btn-primary btn-small" onClick={() => { if (adminNotes[a.id]?.trim()) { setSavedNotes(n => ({ ...n, [a.id]: adminNotes[a.id] })); setAdminNotes(n => ({ ...n, [a.id]: '' })); } }}>Save</button>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))}
                                {filtered.length === 0 && <tr><td colSpan={8} className={s.emptyState}>No appointments match your filters.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </Reveal>
            </div>
        </div>
    );
}
