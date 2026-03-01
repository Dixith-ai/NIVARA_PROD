'use client';

import { useState, useRef } from 'react';
import AdminNavbar from '@/components/AdminNavbar';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { mockAdminScans, mockPlatformStats } from '@/lib/adminMockData';
import s from '../admin.module.css';

function Reveal({ children }: { children: React.ReactNode }) {
    const ref = useRef<HTMLDivElement>(null);
    const v = useIntersectionObserver(ref as React.RefObject<Element | null>, { threshold: 0.03 });
    return <div ref={ref} className={`reveal${v ? ' active' : ''}`}>{children}</div>;
}

const topConditions = [
    { name: 'Eczema', pct: 24 },
    { name: 'Contact Dermatitis', pct: 18 },
    { name: 'Acne Vulgaris', pct: 16 },
    { name: 'Psoriasis', pct: 12 },
    { name: 'Rosacea', pct: 9 },
];

const confidenceDistribution = [
    { label: '90%+', pct: 28, color: 'var(--color-success)' },
    { label: '80–90%', pct: 35, color: 'var(--color-accent)' },
    { label: '70–80%', pct: 22, color: '#f59e0b' },
    { label: '<70%', pct: 15, color: '#ef4444' },
];

export default function ScansPage() {
    const [search, setSearch] = useState('');
    const [sourceFilter, setSourceFilter] = useState('All');
    const [severityFilter, setSeverityFilter] = useState('All');

    const filtered = mockAdminScans.filter(sc => {
        const matchSearch = sc.patient.toLowerCase().includes(search.toLowerCase()) || sc.condition.toLowerCase().includes(search.toLowerCase());
        const matchSource = sourceFilter === 'All' || sc.source === sourceFilter;
        const matchSev = severityFilter === 'All' || sc.severity === severityFilter;
        return matchSearch && matchSource && matchSev;
    });

    const flaggedScans = mockAdminScans.filter(sc =>
        (sc.severity === 'High' && !sc.reviewed) || sc.confidence < 65 || sc.agreement === 'No'
    );

    function sevCls(sev: string) {
        return sev === 'High' ? s.badgeHigh : sev === 'Low' ? s.badgeLow : s.badgeModerate;
    }
    function agrCls(agr: string) {
        return agr === 'Yes' ? s.badgeActive : agr === 'No' ? s.badgeSuspended : agr === 'Partially' ? s.badgeWarning : s.badgePending;
    }

    return (
        <div className={s.portalPage}>
            <AdminNavbar />
            <div className="container" style={{ paddingBottom: 'var(--space-16)' }}>

                {/* Header */}
                <div className={`slide-up ${s.pageHeader}`}>
                    <p className="section-label">Admin</p>
                    <h1 className={s.pageTitle}>Scan Oversight</h1>
                    <div className={s.quickStats}>
                        <div className={s.quickStat}><span className={s.quickStatNum}>{mockPlatformStats.totalScans.toLocaleString()}</span><span className={s.quickStatLabel}>Total Scans</span></div>
                        <div className={s.quickStat}><span className={s.quickStatNum}>{mockPlatformStats.scansToday}</span><span className={s.quickStatLabel}>Scans Today</span></div>
                        <div className={s.quickStat}><span className={s.quickStatNum}>{mockAdminScans.filter(s => !s.reviewed).length}</span><span className={s.quickStatLabel}>Awaiting Review</span></div>
                        <div className={s.quickStat}><span className={s.quickStatNum}>{mockAdminScans.filter(s => s.severity === 'High' && !s.reviewed).length}</span><span className={s.quickStatLabel}>High Severity Unreviewed</span></div>
                    </div>
                </div>

                {/* Diagnosis System Health */}
                <Reveal>
                    <div className={s.sectionBlock}>
                        <p className="section-label">AI Monitor</p>
                        <h2 className={s.panelTitle}>Diagnosis System Health</h2>
                        <div className={s.threeCol}>
                            {/* Confidence overview */}
                            <div className="card" style={{ padding: 'var(--space-6)' }}>
                                <p style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-3)' }}>Confidence Distribution</p>
                                {confidenceDistribution.map(c => (
                                    <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
                                        <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', width: 44, flexShrink: 0 }}>{c.label}</span>
                                        <div className={s.barTrack}>
                                            <div className={s.barFill} style={{ width: `${c.pct}%`, background: c.color }} />
                                        </div>
                                        <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', width: 32, textAlign: 'right' }}>{c.pct}%</span>
                                    </div>
                                ))}
                                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
                                    <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>Avg confidence: <strong style={{ color: 'var(--color-accent)' }}>82%</strong></p>
                                    <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>Doctor agreement: <strong style={{ color: 'var(--color-success)' }}>78%</strong></p>
                                </div>
                            </div>

                            {/* Top conditions */}
                            <div className="card" style={{ padding: 'var(--space-6)' }}>
                                <p style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-3)' }}>Top 5 Conditions</p>
                                {topConditions.map((c, i) => (
                                    <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
                                        <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', width: 16 }}>#{i + 1}</span>
                                        <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-primary)', flex: 1 }}>{c.name}</span>
                                        <div className={s.barTrack} style={{ flex: 0.5 }}>
                                            <div className={s.barFill} style={{ width: `${c.pct / 24 * 100}%` }} />
                                        </div>
                                        <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', width: 28, textAlign: 'right' }}>{c.pct}%</span>
                                    </div>
                                ))}
                            </div>

                            {/* Doctor disagreement */}
                            <div className="card" style={{ padding: 'var(--space-6)' }}>
                                <p style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-3)' }}>Doctor Disagreements</p>
                                {mockAdminScans.filter(sc => sc.agreement === 'No' || sc.agreement === 'Partially').map(sc => (
                                    <div key={sc.id} style={{ padding: 'var(--space-2) 0', borderBottom: '1px solid var(--color-border)' }}>
                                        <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-primary)', fontWeight: 500 }}>{sc.patient}</p>
                                        <p style={{ fontSize: '0.65rem', color: 'var(--color-text-secondary)' }}>AI: {sc.condition}</p>
                                        <span className={`${s.badge} ${agrCls(sc.agreement)}`} style={{ marginTop: 2 }}>Doctor: {sc.agreement}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </Reveal>

                {/* Flagged Scans */}
                {flaggedScans.length > 0 && (
                    <Reveal>
                        <div className={s.sectionBlock}>
                            <p className="section-label">Flagged</p>
                            <h2 className={s.panelTitle}>Scans Requiring Attention</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                                {flaggedScans.map(sc => (
                                    <div key={sc.id} className="card" style={{ padding: 'var(--space-4) var(--space-5)', borderLeft: `3px solid ${sc.severity === 'High' ? '#ef4444' : sc.confidence < 65 ? '#f59e0b' : '#3b82f6'}` }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
                                            <div>
                                                <p style={{ fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: 2 }}>{sc.patient}</p>
                                                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
                                                    {sc.condition} · {sc.confidence}% confidence · {sc.date}
                                                    {sc.severity === 'High' && !sc.reviewed ? ' · No doctor follow-up' : ''}
                                                    {sc.confidence < 65 ? ' · Low confidence' : ''}
                                                    {sc.agreement === 'No' ? ' · Doctor disagreed with AI' : ''}
                                                </p>
                                            </div>
                                            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                                                <span className={`${s.badge} ${sevCls(sc.severity)}`}>{sc.severity}</span>
                                                <button className="btn btn-small btn-primary">View Report</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Reveal>
                )}

                <Reveal>
                    {/* Filters */}
                    <div className={s.filterBar}>
                        <input className="input" placeholder="Search patient or condition…" value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth: 280, height: 44 }} />
                        <select className={s.filterSelect} value={sourceFilter} onChange={e => setSourceFilter(e.target.value)}>
                            {['All', 'Device', 'Kiosk', 'Demo'].map(o => <option key={o}>{o}</option>)}
                        </select>
                        <select className={s.filterSelect} value={severityFilter} onChange={e => setSeverityFilter(e.target.value)}>
                            {['All', 'High', 'Moderate', 'Low'].map(o => <option key={o}>{o}</option>)}
                        </select>
                    </div>

                    {/* Table */}
                    <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
                        <table className={s.table}>
                            <thead>
                                <tr><th>Scan ID</th><th>Patient</th><th>Date</th><th>Source</th><th>Condition</th><th>Confidence</th><th>Severity</th><th>Reviewed</th><th>Agreement</th><th>Action</th></tr>
                            </thead>
                            <tbody>
                                {filtered.map(sc => (
                                    <tr key={sc.id}>
                                        <td style={{ fontFamily: 'var(--font-family-accent)', color: 'var(--color-accent)', fontSize: 'var(--font-size-xs)' }}>{sc.id}</td>
                                        <td style={{ fontWeight: 500 }}>{sc.patient}</td>
                                        <td style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-xs)' }}>{sc.date}</td>
                                        <td><span className={`${s.badge} ${s.badgeInfo}`}>{sc.source}</span></td>
                                        <td style={{ fontSize: 'var(--font-size-xs)' }}>{sc.condition}</td>
                                        <td>
                                            <span style={{ color: sc.confidence < 65 ? '#ef4444' : sc.confidence < 75 ? '#f59e0b' : 'var(--color-success)', fontWeight: 600 }}>{sc.confidence}%</span>
                                        </td>
                                        <td><span className={`${s.badge} ${sevCls(sc.severity)}`}>{sc.severity}</span></td>
                                        <td><span className={`${s.badge} ${sc.reviewed ? s.badgeActive : s.badgePending}`}>{sc.reviewed ? 'Yes' : 'No'}</span></td>
                                        <td><span className={`${s.badge} ${agrCls(sc.agreement)}`}>{sc.agreement}</span></td>
                                        <td><button className="btn btn-small btn-primary">View Report</button></td>
                                    </tr>
                                ))}
                                {filtered.length === 0 && <tr><td colSpan={10} className={s.emptyState}>No scans match filters.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </Reveal>
            </div>
        </div>
    );
}
