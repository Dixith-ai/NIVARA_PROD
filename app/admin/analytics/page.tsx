'use client';

import { useState, useRef } from 'react';
import AdminNavbar from '@/components/AdminNavbar';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { mockAnalytics } from '@/lib/adminMockData';
import s from '../admin.module.css';

function Reveal({ children }: { children: React.ReactNode }) {
    const ref = useRef<HTMLDivElement>(null);
    const v = useIntersectionObserver(ref as React.RefObject<Element | null>, { threshold: 0.03 });
    return <div ref={ref} className={`reveal${v ? ' active' : ''}`}>{children}</div>;
}

type DateRange = typeof mockAnalytics.dateRanges[number];
type SortKey = 'consultations' | 'acceptRate' | 'avgResponseHrs' | 'satisfaction';

const maxTrend = Math.max(...mockAnalytics.scanTrend);
const maxGrowth = Math.max(...mockAnalytics.userGrowth);

export default function AnalyticsPage() {
    const [dateRange, setDateRange] = useState<DateRange>('Last 30 Days');
    const [sortKey, setSortKey] = useState<SortKey>('consultations');
    const metrics = mockAnalytics.metrics[dateRange];

    const sortedDoctors = [...mockAnalytics.doctorPerformance].sort((a, b) => {
        if (sortKey === 'avgResponseHrs') return a[sortKey] - b[sortKey];
        return (b[sortKey] as number) - (a[sortKey] as number);
    });

    const totalScanSources = Object.values(mockAnalytics.scanSources).reduce((a, v) => a + v, 0);

    return (
        <div className={s.portalPage}>
            <AdminNavbar />
            <div className="container" style={{ paddingBottom: 'var(--space-16)' }}>

                {/* Header */}
                <div className={`slide-up ${s.pageHeader}`}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
                        <div>
                            <p className="section-label">Admin</p>
                            <h1 className={s.pageTitle}>Analytics &amp; Reporting</h1>
                        </div>
                        <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                            {mockAnalytics.dateRanges.map(r => (
                                <button key={r} onClick={() => setDateRange(r)}
                                    className={`btn btn-small ${dateRange === r ? 'btn-primary' : 'btn-outline'}`}>
                                    {r}
                                </button>
                            ))}
                            <button className="btn btn-small btn-outline">Export Report</button>
                        </div>
                    </div>
                </div>

                {/* Key Metrics */}
                <Reveal>
                    <div className={s.statsGrid} style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 'var(--space-8)' }}>
                        {[
                            { icon: '💰', num: `₹${(metrics.revenue / 1000).toFixed(0)}K`, label: 'Revenue', trend: 'Device sales' },
                            { icon: '🔬', num: metrics.scans.toLocaleString(), label: 'Scans', trend: 'This period' },
                            { icon: '👥', num: metrics.users.toLocaleString(), label: 'New Users', trend: 'This period' },
                            { icon: '🩺', num: metrics.consultations.toLocaleString(), label: 'Consultations', trend: 'Completed' },
                            { icon: '⭐', num: metrics.nps, label: 'Platform NPS', trend: 'Net Promoter Score' },
                            { icon: '📡', num: `${metrics.kioskUtil}%`, label: 'Kiosk Utilization', trend: 'Network average' },
                        ].map(item => (
                            <div key={item.label} className={`card ${s.statCard}`}>
                                <div className={s.statIcon}>{item.icon}</div>
                                <div className={s.statNum}>{item.num}</div>
                                <div className={s.statLabel}>{item.label}</div>
                                <div className={`${s.statTrend} ${s.trendNeutral}`}>{item.trend}</div>
                            </div>
                        ))}
                    </div>
                </Reveal>

                {/* Scan Volume Trend */}
                <Reveal>
                    <div className={s.sectionBlock}>
                        <div className={s.twoCol}>
                            <div>
                                <p className="section-label">14-Day Trend</p>
                                <h2 className={s.panelTitle}>Scan Volume</h2>
                                <div className="card" style={{ padding: 'var(--space-6)' }}>
                                    <div className={s.barChart} style={{ height: 140, gap: 6 }}>
                                        {mockAnalytics.scanTrend.map((v, i) => (
                                            <div key={i} className={s.barCol}>
                                                <div className={s.barBar} style={{ height: `${Math.round((v / maxTrend) * 100)}%` }} />
                                                <span className={s.barLbl}>D{i + 1}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginTop: 'var(--space-3)', textAlign: 'center' }}>Daily scans over 14 days · Peak: {Math.max(...mockAnalytics.scanTrend)}</p>
                                </div>
                            </div>

                            {/* User Growth */}
                            <div>
                                <p className="section-label">12-Month Trend</p>
                                <h2 className={s.panelTitle}>User Growth</h2>
                                <div className="card" style={{ padding: 'var(--space-6)' }}>
                                    <div className={s.barChart} style={{ height: 140, gap: 6 }}>
                                        {mockAnalytics.userGrowth.map((v, i) => (
                                            <div key={i} className={s.barCol}>
                                                <div className={s.barBar} style={{ height: `${Math.round((v / maxGrowth) * 100)}%`, background: 'var(--gradient-gold)' }} />
                                                <span className={s.barLbl}>{['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][i]}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginTop: 'var(--space-3)', textAlign: 'center' }}>Cumulative user registrations · Total: {mockAnalytics.userGrowth[11].toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Reveal>

                {/* Condition Distribution + Source Breakdown */}
                <Reveal>
                    <div className={s.sectionBlock}>
                        <div className={s.twoCol}>
                            {/* Conditions */}
                            <div>
                                <p className="section-label">AI Insights</p>
                                <h2 className={s.panelTitle}>Condition Distribution</h2>
                                <div className="card" style={{ padding: 'var(--space-6)' }}>
                                    {mockAnalytics.conditions.map((c, i) => (
                                        <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
                                            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', width: 16 }}>#{i + 1}</span>
                                            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-primary)', flex: 1 }}>{c.name}</span>
                                            <div className={s.barTrack} style={{ width: 100, flex: 'none' }}>
                                                <div className={s.barFill} style={{ width: `${c.pct / 24 * 100}%` }} />
                                            </div>
                                            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', width: 28, textAlign: 'right' }}>{c.pct}%</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Source split */}
                            <div>
                                <p className="section-label">Source Split</p>
                                <h2 className={s.panelTitle}>Scan Source Breakdown</h2>
                                <div className="card" style={{ padding: 'var(--space-6)' }}>
                                    {Object.entries(mockAnalytics.scanSources).map(([src, cnt]) => (
                                        <div key={src} style={{ marginBottom: 'var(--space-5)' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                                                <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)' }}>{src}</span>
                                                <span style={{ fontSize: 'var(--font-size-sm)', fontFamily: 'var(--font-family-display)', color: 'var(--color-accent)' }}>{cnt}%</span>
                                            </div>
                                            <div style={{ height: 16, background: 'var(--color-border)', borderRadius: 4, overflow: 'hidden' }}>
                                                <div style={{ width: `${cnt / totalScanSources * 100}%`, height: '100%', background: 'var(--gradient-gold)', borderRadius: 4 }} />
                                            </div>
                                        </div>
                                    ))}
                                    <div style={{ backgroundColor: 'var(--color-surface-warm)', borderRadius: 'var(--radius-md)', padding: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
                                        <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
                                            Kiosk deployments driving <strong>{mockAnalytics.scanSources.Kiosk}%</strong> of all scans.
                                            Device-linked users account for <strong>{mockAnalytics.scanSources.Device}%</strong>.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Reveal>

                {/* Geographic Performance */}
                <Reveal>
                    <div className={s.sectionBlock}>
                        <p className="section-label">Geographic</p>
                        <h2 className={s.panelTitle}>City-by-City Performance</h2>
                        <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
                            <table className={s.table}>
                                <thead>
                                    <tr><th>City</th><th>Total Scans</th><th>Active Users</th><th>Kiosks</th><th>Top Condition</th></tr>
                                </thead>
                                <tbody>
                                    {mockAnalytics.geoTable.map(g => (
                                        <tr key={g.city}>
                                            <td style={{ fontWeight: 500 }}>{g.city}</td>
                                            <td style={{ fontFamily: 'var(--font-family-display)', color: 'var(--color-accent)', fontSize: 'var(--font-size-xl)' }}>{g.scans.toLocaleString()}</td>
                                            <td style={{ color: 'var(--color-text-secondary)' }}>{g.users.toLocaleString()}</td>
                                            <td style={{ fontFamily: 'var(--font-family-display)', color: 'var(--color-text-primary)', fontSize: 'var(--font-size-xl)' }}>{g.kiosks}</td>
                                            <td style={{ fontSize: 'var(--font-size-xs)' }}>{g.topCondition}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </Reveal>

                {/* Doctor Performance */}
                <Reveal>
                    <div className={s.sectionBlock}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
                            <div>
                                <p className="section-label">Doctors</p>
                                <h2 className={s.panelTitle} style={{ marginBottom: 0 }}>Doctor Performance</h2>
                            </div>
                            <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                                {(['consultations', 'acceptRate', 'avgResponseHrs', 'satisfaction'] as SortKey[]).map(k => (
                                    <button key={k} onClick={() => setSortKey(k)}
                                        className={`btn btn-small ${sortKey === k ? 'btn-primary' : 'btn-outline'}`}
                                        style={{ textTransform: 'none' }}>
                                        {k === 'consultations' ? 'Consultations' : k === 'acceptRate' ? 'Accept Rate' : k === 'avgResponseHrs' ? 'Response Time' : 'Satisfaction'}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
                            <table className={s.table}>
                                <thead>
                                    <tr><th>Doctor</th><th>Consultations</th><th>Acceptance Rate</th><th>Avg Response</th><th>Satisfaction</th></tr>
                                </thead>
                                <tbody>
                                    {sortedDoctors.map(d => (
                                        <tr key={d.name}>
                                            <td style={{ fontWeight: 500 }}>{d.name}</td>
                                            <td style={{ fontFamily: 'var(--font-family-display)', color: 'var(--color-accent)', fontSize: 'var(--font-size-xl)' }}>{d.consultations}</td>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                                    <div style={{ width: 60, height: 4, background: 'var(--color-border)', borderRadius: 4, overflow: 'hidden' }}>
                                                        <div style={{ width: `${d.acceptRate}%`, height: '100%', background: d.acceptRate < 50 ? '#ef4444' : 'var(--gradient-gold)' }} />
                                                    </div>
                                                    <span style={{ fontSize: 'var(--font-size-xs)', color: d.acceptRate < 50 ? '#ef4444' : 'var(--color-text-secondary)' }}>{d.acceptRate}%</span>
                                                </div>
                                            </td>
                                            <td style={{ color: d.avgResponseHrs > 24 ? '#ef4444' : 'var(--color-text-secondary)', fontFamily: 'var(--font-family-display)', fontSize: 'var(--font-size-xl)' }}>{d.avgResponseHrs} hrs</td>
                                            <td style={{ color: d.satisfaction < 4.0 ? '#ef4444' : 'var(--color-success)' }}>⭐ {d.satisfaction}</td>
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
