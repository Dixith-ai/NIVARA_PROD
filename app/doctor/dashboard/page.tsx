'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import DoctorNavbar from '@/components/DoctorNavbar';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import {
    mockDoctor, mockStats, mockAppointmentRequests, mockUpcomingAppointments,
    mockScansAwaitingReview, AppointmentRequest,
} from '@/lib/doctorMockData';
import s from '../portal.module.css';

function getGreeting(): string {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
}

function Reveal({ children }: { children: React.ReactNode }) {
    const ref = useRef<HTMLDivElement>(null);
    const visible = useIntersectionObserver(ref as React.RefObject<Element | null>, { threshold: 0.05 });
    return <div ref={ref} className={`reveal${visible ? ' active' : ''}`}>{children}</div>;
}

function SeverityBadge({ severity }: { severity: string }) {
    const cls = severity === 'High' || severity === 'Urgent'
        ? s.severityHigh : severity === 'Low' ? s.severityLow : s.severityMedium;
    return <span className={`${s.severityBadge} ${cls}`}>{severity}</span>;
}

function PatientInitials({ name, large }: { name: string; large?: boolean }) {
    const initials = name.split(' ').map(w => w[0]).slice(0, 2).join('');
    return (
        <div className={`${s.patientAvatar}${large ? ` ${s.patientAvatarLg}` : ''}`}>
            {initials}
        </div>
    );
}

export default function DashboardPage() {
    const [today, setToday] = useState('');
    useEffect(() => {
        setToday(new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
    }, []);

    // Pending requests with local state for accept/decline
    const [requests, setRequests] = useState<AppointmentRequest[]>(mockAppointmentRequests);

    const handleAccept = (id: number) => setRequests(r => r.map(req => req.id === id ? { ...req, status: 'accepted' } : req));
    const handleDecline = (id: number) => setRequests(r => r.filter(req => req.id !== id));

    const pendingOnly = requests.filter(r => r.status === 'pending').slice(0, 3);
    const urgentScans = mockScansAwaitingReview.filter(s => s.severity === 'High');

    const statItems = [
        { icon: '👥', num: mockStats.totalPatients, label: 'Total Patients', trend: '+4 this month' },
        { icon: '📋', num: requests.filter(r => r.status === 'pending').length, label: 'Pending Requests', trend: 'Needs action' },
        { icon: '📅', num: mockStats.todayAppointments, label: "Today's Appointments", trend: 'Starting 10:00 AM' },
        { icon: '🔬', num: mockStats.scansAwaitingReview, label: 'Scans Awaiting Review', trend: '1 high severity' },
    ];

    return (
        <div className={s.portalPage}>
            <DoctorNavbar />

            <div className="container" style={{ paddingBottom: 'var(--space-16)' }}>

                {/* ─── Welcome Header ─── */}
                <div className={`slide-up ${s.pageHeader}`}>
                    <p className="section-label">Dashboard</p>
                    <h1 className={s.pageTitle}>{getGreeting()}, Dr. {mockDoctor.firstName}.</h1>
                    <p className={s.pageSubtitle}>
                        {today} &nbsp;·&nbsp; You have{' '}
                        <strong style={{ color: 'var(--color-accent)' }}>{requests.filter(r => r.status === 'pending').length} pending requests</strong>{' '}
                        and <strong style={{ color: 'var(--color-accent)' }}>{mockStats.todayAppointments} appointments</strong> today.
                    </p>
                </div>

                {/* ─── Stats ─── */}
                <Reveal>
                    <div className={s.statsGrid}>
                        {statItems.map(item => (
                            <div key={item.label} className={`card ${s.statCard}`}>
                                <div className={s.statIcon}>{item.icon}</div>
                                <div className={s.statNum}>{item.num}</div>
                                <div className={s.statLabel}>{item.label}</div>
                                <div className={s.statTrend}>{item.trend}</div>
                            </div>
                        ))}
                    </div>
                </Reveal>

                {/* ─── Urgent Attention ─── */}
                {urgentScans.length > 0 && (
                    <Reveal>
                        <div className={s.sectionBlock}>
                            <p className="section-label">Urgent</p>
                            <h2 className={s.panelTitle}>Requires Immediate Review</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                                {urgentScans.map(scan => (
                                    <div key={scan.id} className={`card ${s.requestCard}`} style={{ borderLeft: '3px solid #ef4444' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                                <PatientInitials name={scan.patient.name} />
                                                <div>
                                                    <p style={{ fontFamily: 'var(--font-family-display)', color: 'var(--color-text-primary)', marginBottom: 2 }}>{scan.patient.name}</p>
                                                    <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
                                                        {scan.diagnosis.primary.condition} · {scan.date}
                                                    </p>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                                <SeverityBadge severity={scan.severity} />
                                                <Link href="/doctor/scans" className="btn btn-primary btn-small">Review Scan</Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Reveal>
                )}

                {/* ─── Two-column: Schedule + Requests ─── */}
                <Reveal>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)', marginBottom: 'var(--space-10)', alignItems: 'start' }}>

                        {/* Today's Schedule */}
                        <div>
                            <p className="section-label">Today</p>
                            <h2 className={s.panelTitle}>Today's Schedule</h2>
                            <div className={`card ${s.statCard}`} style={{ padding: 0 }}>
                                <div className={s.timeline}>
                                    {mockUpcomingAppointments.map(appt => (
                                        <div key={appt.id} className={s.timelineItem} style={{ padding: 'var(--space-4) var(--space-5)' }}>
                                            <span className={s.timelineTime}>{appt.time}</span>
                                            <div className={s.timelineContent}>
                                                <p style={{ fontFamily: 'var(--font-family-display)', color: 'var(--color-text-primary)', marginBottom: 2 }}>{appt.patient.name}</p>
                                                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>
                                                    {appt.scan.topResult}
                                                </p>
                                                <Link href={`/doctor/patients/${appt.id}`} style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-accent)', textDecoration: 'none' }}>
                                                    View Patient →
                                                </Link>
                                            </div>
                                            <SeverityBadge severity={appt.scan.severity} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Pending Requests */}
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
                                <div>
                                    <p className="section-label">Action Required</p>
                                    <h2 className={s.panelTitle}>Pending Requests</h2>
                                </div>
                                <Link href="/doctor/appointments" style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-accent)', textDecoration: 'none' }}>View All →</Link>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                                {pendingOnly.length === 0 && <p className={s.emptyState}>No pending requests.</p>}
                                {pendingOnly.map(req => (
                                    <div key={req.id} className={`card ${s.requestCard}`} style={{ padding: 'var(--space-4)' }}>
                                        <div className={s.requestHeader}>
                                            <PatientInitials name={req.patient.name} />
                                            <div style={{ flex: 1 }}>
                                                <p className={s.patientName}>{req.patient.name}</p>
                                                <p className={s.patientSub}>{req.patient.age} · {req.patient.location}</p>
                                            </div>
                                            <SeverityBadge severity={req.scan.severity} />
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                            <div className={s.scanStub}>
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><path d="M14 14h.01M14 20h.01M20 14h.01M20 20h.01" /></svg>
                                            </div>
                                            <div>
                                                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)', fontWeight: 500 }}>{req.scan.topResult}</p>
                                                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>{req.scan.confidence}% confidence · {req.requestedDate}</p>
                                            </div>
                                        </div>
                                        <div className={s.requestActions}>
                                            <button className="btn btn-primary btn-small" style={{ flex: 1 }} onClick={() => handleAccept(req.id)}>Accept</button>
                                            <button className="btn btn-small" onClick={() => handleDecline(req.id)}
                                                style={{ flex: 1, background: 'transparent', color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-full)', cursor: 'pointer', fontSize: 'var(--font-size-xs)', padding: 'var(--space-2) var(--space-4)' }}>
                                                Decline
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </Reveal>

                {/* ─── Recently Shared Scans ─── */}
                <Reveal>
                    <div className={s.sectionBlock}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
                            <div>
                                <p className="section-label">Scans</p>
                                <h2 className={s.panelTitle}>Recently Shared</h2>
                            </div>
                            <Link href="/doctor/scans" style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-accent)', textDecoration: 'none' }}>View All →</Link>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 'var(--space-5)' }}>
                            {mockScansAwaitingReview.map(scan => (
                                <div key={scan.id} className={`card ${s.requestCard}`} style={{ padding: 'var(--space-5)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                        <div className={s.scanStub} style={{ width: 52, height: 52 }}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><path d="M14 14h.01M14 20h.01M20 14h.01M20 20h.01" /></svg>
                                        </div>
                                        <div>
                                            <p style={{ fontFamily: 'var(--font-family-display)', color: 'var(--color-text-primary)', marginBottom: 2 }}>{scan.patient.name}</p>
                                            <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>{scan.date}</p>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)' }}>{scan.diagnosis.primary.condition}</span>
                                        <SeverityBadge severity={scan.severity} />
                                    </div>
                                    <Link href="/doctor/scans" className="btn btn-small"
                                        style={{ background: 'transparent', color: 'var(--color-accent)', border: '1px solid var(--color-accent-border)', borderRadius: 'var(--radius-full)', fontSize: 'var(--font-size-xs)', padding: 'var(--space-2) var(--space-4)', textAlign: 'center', textDecoration: 'none' }}>
                                        Review
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </Reveal>

                {/* ─── Performance Snapshot ─── */}
                <Reveal>
                    <div>
                        <p className="section-label">Insights</p>
                        <h2 className={s.panelTitle}>Performance Snapshot</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--space-5)' }}>
                            {[
                                { label: 'Consultations this month', value: mockDoctor.performance.consultationsThisMonth },
                                { label: 'Avg. response time', value: mockDoctor.performance.avgResponseTime },
                                { label: 'Patient satisfaction', value: `${mockDoctor.performance.satisfactionRating} / 5.0` },
                                { label: 'Top condition seen', value: mockDoctor.performance.topConditions[0] },
                            ].map(item => (
                                <div key={item.label} className={`card ${s.statCard}`}>
                                    <div style={{ fontSize: 'var(--font-size-2xl)', fontFamily: 'var(--font-family-display)', color: 'var(--color-accent)' }}>{item.value}</div>
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

