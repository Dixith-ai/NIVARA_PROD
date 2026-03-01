'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import AdminNavbar from '@/components/AdminNavbar';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { mockDoctorApplications, Stage } from '@/lib/adminMockData';
import s from '../../admin.module.css';

function Reveal({ children }: { children: React.ReactNode }) {
    const ref = useRef<HTMLDivElement>(null);
    const v = useIntersectionObserver(ref as React.RefObject<Element | null>, { threshold: 0.03 });
    return <div ref={ref} className={`reveal${v ? ' active' : ''}`}>{children}</div>;
}

const STAGES: Stage[] = ['Application Received', 'Under Review', 'Approved', 'Rejected'];

type App = {
    id: number; name: string; specialization: string; hospital: string;
    applied: string; stage: Stage; documents: string[]; rejectionReason: string;
};

export default function DoctorVerifyPage() {
    const [apps, setApps] = useState<App[]>(mockDoctorApplications);
    const [rejectNotes, setRejectNotes] = useState<Record<number, string>>({});
    const [rejectInput, setRejectInput] = useState<Record<number, string>>({});

    const move = (id: number, to: Stage) => {
        setApps(a => a.map(x => x.id === id ? { ...x, stage: to, rejectionReason: to === 'Rejected' ? (rejectNotes[id] || '') : x.rejectionReason } : x));
    };

    const stageCount = (st: Stage) => apps.filter(a => a.stage === st).length;

    const stageActions = (app: App): React.ReactNode => {
        switch (app.stage) {
            case 'Application Received':
                return (
                    <button className="btn btn-small btn-outline" onClick={() => move(app.id, 'Under Review')}>Move to Review</button>
                );
            case 'Under Review':
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                        <button className="btn btn-small btn-primary" onClick={() => move(app.id, 'Approved')}>Approve</button>
                        <input className="input" placeholder="Rejection reason…" value={rejectInput[app.id] || ''} onChange={e => setRejectInput(n => ({ ...n, [app.id]: e.target.value }))} style={{ height: 36, fontSize: 'var(--font-size-xs)' }} />
                        <button className="btn btn-small" style={{ background: 'rgba(220,38,38,0.08)', color: '#ef4444', border: '1px solid rgba(220,38,38,0.2)', borderRadius: 'var(--radius-full)', cursor: 'pointer', fontSize: 'var(--font-size-xs)', padding: 'var(--space-2) var(--space-3)', fontFamily: 'var(--font-family-base)' }}
                            onClick={() => { setRejectNotes(n => ({ ...n, [app.id]: rejectInput[app.id] || '' })); move(app.id, 'Rejected'); }}>
                            Reject
                        </button>
                    </div>
                );
            case 'Approved':
                return <Link href="/admin/doctors?createAccount=true" className="btn btn-small btn-primary">Create Account →</Link>;
            case 'Rejected':
                return (
                    <div>
                        <p style={{ fontSize: 'var(--font-size-xs)', color: '#ef4444', marginBottom: 'var(--space-2)' }}>Reason: {app.rejectionReason || 'Not specified'}</p>
                        <button className="btn btn-small btn-outline" onClick={() => move(app.id, 'Application Received')}>Move Back</button>
                    </div>
                );
        }
    };

    return (
        <div className={s.portalPage}>
            <AdminNavbar />
            <div className="container" style={{ paddingBottom: 'var(--space-16)' }}>

                <div className={`slide-up ${s.pageHeader}`}>
                    <p className="section-label">Admin · Doctors</p>
                    <h1 className={s.pageTitle}>Doctor Verification Pipeline</h1>
                    <div className={s.quickStats}>
                        {STAGES.map(st => (
                            <div key={st} className={s.quickStat}>
                                <span className={s.quickStatNum}>{stageCount(st)}</span>
                                <span className={s.quickStatLabel}>{st}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <Reveal>
                    <div className={s.kanban}>
                        {STAGES.map(stage => (
                            <div key={stage} className={s.kanbanCol}>
                                <div className={s.kanbanColHeader}>
                                    <span className={s.kanbanColTitle}>{stage}</span>
                                    <span style={{ fontFamily: 'var(--font-family-display)', fontSize: 'var(--font-size-xl)', color: 'var(--color-accent)' }}>{stageCount(stage)}</span>
                                </div>
                                {apps.filter(a => a.stage === stage).map(app => (
                                    <div key={app.id} className={s.kanbanCard}>
                                        <div>
                                            <p style={{ fontFamily: 'var(--font-family-display)', fontSize: 'var(--font-size-lg)', color: 'var(--color-text-primary)', marginBottom: 2 }}>{app.name}</p>
                                            <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginBottom: 2 }}>{app.specialization}</p>
                                            <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>{app.hospital}</p>
                                        </div>
                                        <p style={{ fontSize: '0.65rem', color: 'var(--color-text-secondary)' }}>Applied: {app.applied}</p>
                                        <div>
                                            <p style={{ fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>Documents</p>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                                {app.documents.map(doc => (
                                                    <span key={doc} style={{ fontSize: '0.65rem', display: 'flex', alignItems: 'center', gap: 4, color: 'var(--color-success)' }}>✓ {doc}</span>
                                                ))}
                                            </div>
                                        </div>
                                        <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-3)' }}>
                                            {stageActions(app)}
                                        </div>
                                    </div>
                                ))}
                                {stageCount(stage) === 0 && <p className={s.emptyState} style={{ padding: 'var(--space-6) 0', fontSize: '0.75rem' }}>No applications</p>}
                            </div>
                        ))}
                    </div>
                </Reveal>
            </div>
        </div>
    );
}
