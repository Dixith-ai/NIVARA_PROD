'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import DoctorNavbar from '@/components/DoctorNavbar';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { mockPatients } from '@/lib/doctorMockData';
import s from '../portal.module.css';

function Reveal({ children }: { children: React.ReactNode }) {
    const ref = useRef<HTMLDivElement>(null);
    const visible = useIntersectionObserver(ref as React.RefObject<Element | null>, { threshold: 0.05 });
    return <div ref={ref} className={`reveal${visible ? ' active' : ''}`}>{children}</div>;
}

function SeverityBadge({ severity }: { severity: string }) {
    const cls = severity === 'High' ? s.severityHigh : severity === 'Low' ? s.severityLow : s.severityMedium;
    return <span className={`${s.severityBadge} ${cls}`}>{severity}</span>;
}

export default function PatientsPage() {
    const [search, setSearch] = useState('');
    const [filterSeverity, setFilterSeverity] = useState('All');
    const [filterCondition, setFilterCondition] = useState('All');

    const conditions = ['All', ...Array.from(new Set(mockPatients.map(p => p.condition)))];

    const filtered = mockPatients.filter(p => {
        const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.condition.toLowerCase().includes(search.toLowerCase());
        const matchSeverity = filterSeverity === 'All' || p.severity === filterSeverity;
        const matchCondition = filterCondition === 'All' || p.condition === filterCondition;
        return matchSearch && matchSeverity && matchCondition;
    });

    return (
        <div className={s.portalPage}>
            <DoctorNavbar />
            <div className="container" style={{ paddingBottom: 'var(--space-16)' }}>

                <div className={`slide-up ${s.pageHeader}`}>
                    <p className="section-label">Doctor Portal</p>
                    <h1 className={s.pageTitle}>My Patients</h1>
                    <p className={s.pageSubtitle}>{mockPatients.length} patients total</p>
                </div>

                <Reveal>
                    {/* Filter bar */}
                    <div className={s.filterBar}>
                        <input
                            className="input"
                            placeholder="Search by name or condition…"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            style={{ maxWidth: 300 }}
                        />
                        <select className={s.filterSelect} value={filterSeverity} onChange={e => setFilterSeverity(e.target.value)}>
                            <option>All</option><option>High</option><option>Moderate</option><option>Low</option>
                        </select>
                        <select className={s.filterSelect} value={filterCondition} onChange={e => setFilterCondition(e.target.value)}>
                            {conditions.map(c => <option key={c}>{c}</option>)}
                        </select>
                    </div>

                    {/* Patient grid */}
                    <div className={s.patientGrid}>
                        {filtered.length === 0 && <p className={s.emptyState}>No patients match your filters.</p>}
                        {filtered.map(p => {
                            const initials = p.name.split(' ').map(w => w[0]).slice(0, 2).join('');
                            return (
                                <div key={p.id} className={`card`} style={{ padding: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                                    {/* Header */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                        <div className={s.patientAvatar}>{initials}</div>
                                        <div>
                                            <p className={s.patientName} style={{ marginBottom: 2 }}>{p.name}</p>
                                            <p className={s.patientSub}>{p.age} yrs · {p.location}</p>
                                        </div>
                                    </div>

                                    {/* Condition */}
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)' }}>{p.condition}</span>
                                        <SeverityBadge severity={p.severity} />
                                    </div>

                                    {/* Stats row */}
                                    <div style={{ display: 'flex', gap: 'var(--space-5)', paddingTop: 'var(--space-2)', borderTop: '1px solid var(--color-border)' }}>
                                        {[
                                            { label: 'Scans', val: p.scans },
                                            { label: 'Appointments', val: p.appointments },
                                        ].map(item => (
                                            <div key={item.label}>
                                                <p style={{ fontFamily: 'var(--font-family-display)', fontSize: 'var(--font-size-xl)', color: 'var(--color-accent)' }}>{item.val}</p>
                                                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{item.label}</p>
                                            </div>
                                        ))}
                                        <div>
                                            <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>Last Seen</p>
                                            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)' }}>{p.lastSeen}</p>
                                        </div>
                                    </div>

                                    <Link href={`/doctor/patients/${p.id}`} className="btn btn-primary btn-small" style={{ textAlign: 'center' }}>
                                        View Dossier
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                </Reveal>
            </div>
        </div>
    );
}

