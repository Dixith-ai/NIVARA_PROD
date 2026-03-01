'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import DoctorNavbar from '@/components/DoctorNavbar';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import {
    mockAppointmentRequests, mockUpcomingAppointments, mockPastAppointments,
    AppointmentRequest
} from '@/lib/doctorMockData';
import s from '../portal.module.css';

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

function PatientInitials({ name }: { name: string }) {
    const initials = name.split(' ').map(w => w[0]).slice(0, 2).join('');
    return <div className={s.patientAvatar}>{initials}</div>;
}

const TABS = ['Pending Requests', 'Upcoming', 'Past'] as const;

export default function AppointmentsPage() {
    const [activeTab, setActiveTab] = useState<typeof TABS[number]>('Pending Requests');
    const [searchQuery, setSearchQuery] = useState('');
    const [requests, setRequests] = useState<AppointmentRequest[]>(mockAppointmentRequests);
    const [declined, setDeclined] = useState<number[]>([]);

    const handleAccept = (id: number) => setRequests(r => r.map(req => req.id === id ? { ...req, status: 'accepted' } : req));
    const handleDecline = (id: number) => {
        if (window.confirm('Decline this appointment request?')) {
            setDeclined(d => [...d, id]);
            setRequests(r => r.filter(req => req.id !== id));
        }
    };

    const pending = requests.filter(r => r.status === 'pending' && !declined.includes(r.id));
    const accepted = requests.filter(r => r.status === 'accepted');

    const filterBySearch = (name: string) =>
        name.toLowerCase().includes(searchQuery.toLowerCase());

    return (
        <div className={s.portalPage}>
            <DoctorNavbar />
            <div className="container" style={{ paddingBottom: 'var(--space-16)' }}>

                <div className={`slide-up ${s.pageHeader}`}>
                    <p className="section-label">Doctor Portal</p>
                    <h1 className={s.pageTitle}>Appointments</h1>
                </div>

                <Reveal>
                    {/* Filter bar */}
                    <div className={s.filterBar}>
                        <input
                            className="input"
                            placeholder="Search by patient name…"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            style={{ maxWidth: 280 }}
                        />
                        <select className={s.filterSelect}>
                            <option>All Severities</option>
                            <option>High</option>
                            <option>Moderate</option>
                            <option>Low</option>
                        </select>
                    </div>

                    {/* Tab bar */}
                    <div className={s.tabBar}>
                        {TABS.map(tab => (
                            <button
                                key={tab}
                                className={`${s.tab}${activeTab === tab ? ` ${s.tabActive}` : ''}`}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab}
                                {tab === 'Pending Requests' && pending.length > 0 && (
                                    <span style={{ marginLeft: 6, background: 'rgba(149,109,31,0.3)', borderRadius: '50%', padding: '1px 6px', fontSize: '0.6rem' }}>
                                        {pending.length}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* ── Pending Requests ── */}
                    {activeTab === 'Pending Requests' && (
                        <div>
                            {pending.filter(r => filterBySearch(r.patient.name)).length === 0
                                ? <p className={s.emptyState}>No pending requests.</p>
                                : pending.filter(r => filterBySearch(r.patient.name)).map(req => (
                                    <div key={req.id} className={`card ${s.requestCard}`}>
                                        {/* Header */}
                                        <div className={s.requestHeader}>
                                            <PatientInitials name={req.patient.name} />
                                            <div style={{ flex: 1 }}>
                                                <p className={s.patientName}>{req.patient.name}</p>
                                                <p className={s.patientSub}>{req.patient.age} yrs · {req.patient.location}</p>
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 'var(--space-1)' }}>
                                                <SeverityBadge severity={req.scan.severity} />
                                                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
                                                    Requested {req.requestedDate} · {req.requestedTime}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Scan preview */}
                                        <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
                                            <div className={s.scanStub}>
                                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><path d="M14 14h.01M14 20h.01M20 14h.01M20 20h.01" /></svg>
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)', fontWeight: 500, marginBottom: 4 }}>
                                                    {req.scan.topResult}
                                                </p>
                                                <div className={s.confidenceBar}>
                                                    <div className={s.barTrack}>
                                                        <div className={s.barFill} style={{ width: `${req.scan.confidence}%` }} />
                                                    </div>
                                                    <span className={s.barLabel}>{req.scan.confidence}%</span>
                                                </div>
                                                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginTop: 4 }}>Scan date: {req.scan.date}</p>
                                            </div>
                                        </div>

                                        {/* Patient note */}
                                        {req.note && (
                                            <div style={{ background: 'rgba(250,248,244,0.04)', borderRadius: 'var(--radius-md)', padding: 'var(--space-3)', borderLeft: '2px solid var(--color-accent-border)' }}>
                                                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>
                                                    &ldquo;{req.note}&rdquo;
                                                </p>
                                            </div>
                                        )}

                                        {/* Actions */}
                                        <div className={s.requestActions}>
                                            <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => handleAccept(req.id)}>Accept</button>
                                            <button onClick={() => handleDecline(req.id)}
                                                style={{ flex: 1, background: 'transparent', color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-full)', cursor: 'pointer', fontSize: 'var(--font-size-sm)', padding: 'var(--space-3) var(--space-5)', fontFamily: 'var(--font-family-base)' }}>
                                                Decline
                                            </button>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    )}

                    {/* ── Upcoming ── */}
                    {activeTab === 'Upcoming' && (
                        <div>
                            {[
                                ...mockUpcomingAppointments,
                                ...accepted.map(r => ({
                                    id: r.id,
                                    patient: r.patient,
                                    date: r.requestedDate,
                                    time: r.requestedTime,
                                    scan: { topResult: r.scan.topResult, severity: r.scan.severity },
                                })),
                            ].filter(a => filterBySearch(a.patient.name)).map(appt => (
                                <div key={appt.id} className={`card ${s.requestCard}`}>
                                    <div className={s.requestHeader}>
                                        <PatientInitials name={appt.patient.name} />
                                        <div style={{ flex: 1 }}>
                                            <p className={s.patientName}>{appt.patient.name}</p>
                                            <p className={s.patientSub}>{('age' in appt.patient ? appt.patient.age : '')} · {appt.date} · {appt.time}</p>
                                        </div>
                                        <span className={s.countdown}>Upcoming</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <div>
                                            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)' }}>{appt.scan.topResult}</p>
                                            <SeverityBadge severity={appt.scan.severity} />
                                        </div>
                                        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                                            <Link href={`/doctor/patients/${appt.id}`} className="btn btn-small"
                                                style={{ background: 'transparent', color: 'var(--color-accent)', border: '1px solid var(--color-accent-border)', borderRadius: 'var(--radius-full)', fontSize: 'var(--font-size-xs)', padding: 'var(--space-2) var(--space-4)', textDecoration: 'none' }}>
                                                Patient Dossier
                                            </Link>
                                            <Link href="/doctor/scans" className="btn btn-primary btn-small">View Scan</Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* ── Past ── */}
                    {activeTab === 'Past' && (
                        <div>
                            {mockPastAppointments.filter(a => filterBySearch(a.patient.name)).map(appt => (
                                <div key={appt.id} className={`card ${s.requestCard}`}>
                                    <div className={s.requestHeader}>
                                        <PatientInitials name={appt.patient.name} />
                                        <div style={{ flex: 1 }}>
                                            <p className={s.patientName}>{appt.patient.name}</p>
                                            <p className={s.patientSub}>{appt.patient.age} yrs · Completed {appt.date}</p>
                                        </div>
                                        <SeverityBadge severity={appt.scan.severity} />
                                    </div>
                                    <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                                        Condition: <strong style={{ color: 'var(--color-text-primary)' }}>{appt.scan.topResult}</strong>
                                    </p>
                                    <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                                        <Link href={`/doctor/patients/${appt.id}`} style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-accent)', textDecoration: 'none' }}>
                                            View Patient Dossier →
                                        </Link>
                                        <Link href="/doctor/scans" style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', textDecoration: 'none' }}>
                                            View Scan Report →
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Reveal>
            </div>
        </div>
    );
}

