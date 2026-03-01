'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import AdminNavbar from '@/components/AdminNavbar';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import {
    mockAdminUser, mockPlatformStats, mockAlerts, mockActivityFeed,
    mockGeoData, mockKiosks, mockRecentUsers, mockRecentDoctorActions, mockRecentScans,
} from '@/lib/adminMockData';
import s from '../admin.module.css';

function Reveal({ children }: { children: React.ReactNode }) {
    const ref = useRef<HTMLDivElement>(null);
    const visible = useIntersectionObserver(ref as React.RefObject<Element | null>, { threshold: 0.03 });
    return <div ref={ref} className={`reveal${visible ? ' active' : ''}`}>{children}</div>;
}

function getGreeting() {
    const h = new Date().getHours();
    return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
}

function AlertBadge({ severity }: { severity: string }) {
    const cls = severity === 'Critical' ? s.badgeCritical : severity === 'Warning' ? s.badgeWarning : s.badgeInfo;
    return <span className={`${s.badge} ${cls}`}>{severity}</span>;
}

function SeverityBadge({ sev }: { sev: string }) {
    const cls = sev === 'High' ? s.badgeHigh : sev === 'Low' ? s.badgeLow : s.badgeModerate;
    return <span className={`${s.badge} ${cls}`}>{sev}</span>;
}

const maxGeo = Math.max(...mockGeoData.map(g => g.scans));
const kiosksOnline = mockKiosks.filter(k => k.status === 'Online').length;
const kiosksOffline = mockKiosks.filter(k => k.status === 'Offline').length;
const scansToday = mockKiosks.reduce((a, k) => a + k.scansToday, 0);

export default function CommandCenterPage() {
    const [greeting, setGreeting] = useState('');
    const [platformStatus] = useState<'All Systems Operational' | 'Degraded'>('All Systems Operational');
    const [alertsVisible, setAlertsVisible] = useState(true);

    useEffect(() => { setGreeting(getGreeting()); }, []);

    const statRows = [
        [
            { icon: '👥', num: mockPlatformStats.totalUsers.toLocaleString(), label: 'Registered Users', trend: '+127 this week', dir: 'up' },
            { icon: '🩺', num: mockPlatformStats.totalDoctors, label: 'Active Doctors', trend: '+1 this week', dir: 'up' },
            { icon: '🔬', num: mockPlatformStats.totalScans.toLocaleString(), label: 'Total Scans', trend: '+143 today', dir: 'up' },
            { icon: '📅', num: mockPlatformStats.scansToday, label: 'Scans Today', trend: '+12 vs yesterday', dir: 'up' },
        ],
        [
            { icon: '📋', num: mockPlatformStats.totalAppointments.toLocaleString(), label: 'Total Appointments', trend: '+38 today', dir: 'up' },
            { icon: '📡', num: `${kiosksOnline} / ${mockPlatformStats.kiosksTotal}`, label: 'Kiosks Online', trend: kiosksOffline > 0 ? `${kiosksOffline} offline` : 'All healthy', dir: kiosksOffline > 0 ? 'down' : 'up' },
            { icon: '📱', num: mockPlatformStats.devicesLinked, label: 'Devices Linked', trend: '+12 this week', dir: 'up' },
            { icon: '⏳', num: mockPlatformStats.pendingDoctorVerifications, label: 'Pending Verifications', trend: 'Awaiting review', dir: 'neutral' },
        ],
    ];

    return (
        <div className={s.portalPage}>
            <AdminNavbar />
            <div className="container" style={{ paddingBottom: 'var(--space-16)' }}>

                {/* ─── Header ─── */}
                <div className={`slide-up ${s.pageHeader}`}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
                        <div>
                            <p className="section-label">Admin Portal</p>
                            <h1 className={s.pageTitle}>{greeting}, {mockAdminUser.firstName}.</h1>
                            <p className={s.pageSubtitle}>Last login: {mockAdminUser.lastLogin} &nbsp;·&nbsp;
                                <span style={{ color: platformStatus === 'All Systems Operational' ? 'var(--color-success)' : '#f59e0b', fontWeight: 600 }}>
                                    ● {platformStatus}
                                </span>
                            </p>
                        </div>
                        <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
                            <Link href="/admin/doctors" className="btn btn-small btn-primary">Create Doctor Account</Link>
                            <Link href="/admin/kiosks" className="btn btn-small btn-outline">Add Kiosk</Link>
                            <button className="btn btn-small" style={{ background: 'rgba(220,38,38,0.08)', color: '#ef4444', border: '1px solid rgba(220,38,38,0.2)', borderRadius: 'var(--radius-full)', cursor: 'pointer', fontSize: 'var(--font-size-xs)', padding: 'var(--space-2) var(--space-4)', fontFamily: 'var(--font-family-base)' }}
                                onClick={() => setAlertsVisible(true)}>
                                View Flagged Alerts ({mockAlerts.length})
                            </button>
                        </div>
                    </div>
                </div>

                {/* ─── Flagged Alerts ─── */}
                {alertsVisible && (
                    <Reveal>
                        <div className={s.sectionBlock}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
                                <div>
                                    <p className="section-label">Alerts</p>
                                    <h2 className={s.panelTitle}>Flagged Alerts</h2>
                                </div>
                                <button onClick={() => setAlertsVisible(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', fontFamily: 'var(--font-family-base)' }}>Dismiss All</button>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                                {mockAlerts.map(alert => (
                                    <div key={alert.id} className="card" style={{ padding: 'var(--space-4) var(--space-5)', borderLeft: `3px solid ${alert.severity === 'Critical' ? '#ef4444' : alert.severity === 'Warning' ? '#f59e0b' : '#3b82f6'}` }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flex: 1 }}>
                                                <AlertBadge severity={alert.severity} />
                                                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)', flex: 1 }}>{alert.message}</p>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexShrink: 0 }}>
                                                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', whiteSpace: 'nowrap' }}>{alert.time}</span>
                                                <Link href={alert.link} className="btn btn-primary btn-small">{alert.action}</Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Reveal>
                )}

                {/* ─── Stats ─── */}
                {statRows.map((row, ri) => (
                    <Reveal key={ri}>
                        <div className={s.statsGrid} style={{ marginBottom: ri === 0 ? 'var(--space-5)' : 'var(--space-8)' }}>
                            {row.map(item => (
                                <div key={item.label} className={`card ${s.statCard}`}>
                                    <div className={s.statIcon}>{item.icon}</div>
                                    <div className={s.statNum}>{item.num}</div>
                                    <div className={s.statLabel}>{item.label}</div>
                                    <div className={`${s.statTrend} ${item.dir === 'up' ? s.trendUp : item.dir === 'down' ? s.trendDown : s.trendNeutral}`}>
                                        {item.dir === 'up' ? '↑' : item.dir === 'down' ? '↓' : '·'} {item.trend}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Reveal>
                ))}

                {/* ─── Activity Feed + Platform Health ─── */}
                <Reveal>
                    <div className={s.twoCol} style={{ marginBottom: 'var(--space-10)' }}>
                        {/* Live Activity Feed */}
                        <div>
                            <p className="section-label">Live</p>
                            <h2 className={s.panelTitle}>Activity Feed</h2>
                            <div className="card" style={{ padding: 'var(--space-4) var(--space-5)', maxHeight: 420, overflowY: 'auto' }}>
                                {mockActivityFeed.map((item, i) => (
                                    <div key={i} className={s.feedItem}>
                                        <span className={s.feedTime}>{item.time}</span>
                                        <div>
                                            <p className={s.feedEvent}>{item.event}</p>
                                            <p className={s.feedDetail}>{item.detail}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Platform Health */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
                            <p className="section-label">Health</p>
                            <h2 className={s.panelTitle} style={{ marginBottom: 0 }}>Platform Health</h2>

                            {/* Kiosk health */}
                            <div className="card" style={{ padding: 'var(--space-5)' }}>
                                <p style={{ fontFamily: 'var(--font-family-display)', fontSize: 'var(--font-size-lg)', color: 'var(--color-text-primary)', marginBottom: 'var(--space-3)' }}>Kiosk Network</p>
                                {[
                                    { label: 'Online', val: `${kiosksOnline} / ${mockPlatformStats.kiosksTotal}`, dot: 'green' },
                                    { label: 'Offline', val: kiosksOffline, dot: kiosksOffline > 0 ? 'red' : 'green' },
                                    { label: 'Scans Today', val: scansToday, dot: 'green' },
                                ].map(r => (
                                    <div key={r.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-2) 0', borderBottom: '1px solid var(--color-border)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                            <span className={`${s.statusDot} ${r.dot === 'green' ? s.dotGreen : s.dotRed}`} />
                                            <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>{r.label}</span>
                                        </div>
                                        <span style={{ fontFamily: 'var(--font-family-display)', fontSize: 'var(--font-size-xl)', color: 'var(--color-accent)' }}>{r.val}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Diagnosis health */}
                            <div className="card" style={{ padding: 'var(--space-5)' }}>
                                <p style={{ fontFamily: 'var(--font-family-display)', fontSize: 'var(--font-size-lg)', color: 'var(--color-text-primary)', marginBottom: 'var(--space-3)' }}>Diagnosis System</p>
                                {[
                                    { label: 'Avg Confidence Today', val: '82%' },
                                    { label: 'Scans Processed Today', val: mockPlatformStats.scansToday },
                                    { label: 'Doctor Agreement Rate', val: '78%' },
                                ].map(r => (
                                    <div key={r.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-2) 0', borderBottom: '1px solid var(--color-border)' }}>
                                        <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>{r.label}</span>
                                        <span style={{ fontFamily: 'var(--font-family-display)', fontSize: 'var(--font-size-xl)', color: 'var(--color-accent)' }}>{r.val}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Appointment health */}
                            <div className="card" style={{ padding: 'var(--space-5)' }}>
                                <p style={{ fontFamily: 'var(--font-family-display)', fontSize: 'var(--font-size-lg)', color: 'var(--color-text-primary)', marginBottom: 'var(--space-3)' }}>Appointment Flow</p>
                                {[
                                    { label: 'Avg Doctor Response', val: '6.4 hrs' },
                                    { label: 'Acceptance Rate (week)', val: '81%' },
                                    { label: 'Completed Today', val: mockPlatformStats.appointmentsToday },
                                ].map(r => (
                                    <div key={r.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-2) 0', borderBottom: '1px solid var(--color-border)' }}>
                                        <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>{r.label}</span>
                                        <span style={{ fontFamily: 'var(--font-family-display)', fontSize: 'var(--font-size-xl)', color: 'var(--color-accent)' }}>{r.val}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </Reveal>

                {/* ─── Geographic Spread ─── */}
                <Reveal>
                    <div className={s.sectionBlock}>
                        <div className={s.twoCol}>
                            <div>
                                <p className="section-label">Reach</p>
                                <h2 className={s.panelTitle}>Geographic Spread</h2>
                                <div className="card" style={{ padding: 'var(--space-5)' }}>
                                    {mockGeoData.map((g, i) => (
                                        <div key={g.city} className={s.geoBar}>
                                            <span style={{ width: 100, fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)', flexShrink: 0 }}>#{i + 1} {g.city}</span>
                                            <div className={s.geoBarTrack}>
                                                <div className={s.geoBarFill} style={{ width: `${Math.round((g.scans / maxGeo) * 100)}%` }} />
                                            </div>
                                            <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-accent)', fontFamily: 'var(--font-family-display)', width: 48, textAlign: 'right' }}>{g.scans.toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Recent Activity Summary */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
                                <p className="section-label">Recent</p>
                                <h2 className={s.panelTitle} style={{ marginBottom: 0 }}>Activity Summary</h2>

                                <div className="card" style={{ padding: 'var(--space-4) var(--space-5)' }}>
                                    <p style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-3)' }}>New Users This Week</p>
                                    {mockRecentUsers.map(u => (
                                        <div key={u.name} style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-2) 0', borderBottom: '1px solid var(--color-border)' }}>
                                            <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)' }}>{u.name}</span>
                                            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>{u.date}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="card" style={{ padding: 'var(--space-4) var(--space-5)' }}>
                                    <p style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-3)' }}>Recent Doctor Actions</p>
                                    {mockRecentDoctorActions.map((d, i) => (
                                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-2) 0', borderBottom: '1px solid var(--color-border)', alignItems: 'center' }}>
                                            <div>
                                                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-primary)' }}>{d.doctor}</p>
                                                <p style={{ fontSize: '0.65rem', color: d.action === 'Declined' ? '#ef4444' : 'var(--color-success)' }}>{d.action} · {d.patient}</p>
                                            </div>
                                            <span style={{ fontSize: '0.65rem', color: 'var(--color-text-secondary)' }}>{d.time}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="card" style={{ padding: 'var(--space-4) var(--space-5)' }}>
                                    <p style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-3)' }}>Recent Scans</p>
                                    {mockRecentScans.map((sc, i) => (
                                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-2) 0', borderBottom: '1px solid var(--color-border)', alignItems: 'center' }}>
                                            <div>
                                                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-primary)' }}>{sc.patient}</p>
                                                <p style={{ fontSize: '0.65rem', color: 'var(--color-text-secondary)' }}>{sc.condition}</p>
                                            </div>
                                            <SeverityBadge sev={sc.severity} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </Reveal>

            </div>
        </div>
    );
}
