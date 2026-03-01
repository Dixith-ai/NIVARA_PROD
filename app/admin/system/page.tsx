'use client';

import { useState, useRef } from 'react';
import AdminNavbar from '@/components/AdminNavbar';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import {
    mockPlatformSettings, mockAuditLog, mockAdminAccounts, mockNotifTemplates,
} from '@/lib/adminMockData';
import s from '../admin.module.css';

function Reveal({ children }: { children: React.ReactNode }) {
    const ref = useRef<HTMLDivElement>(null);
    const v = useIntersectionObserver(ref as React.RefObject<Element | null>, { threshold: 0.03 });
    return <div ref={ref} className={`reveal${v ? ' active' : ''}`}>{children}</div>;
}

type Tab = 'Platform Settings' | 'Notifications' | 'Admin Accounts' | 'Audit Log';
const TABS: Tab[] = ['Platform Settings', 'Notifications', 'Admin Accounts', 'Audit Log'];

export default function SystemPage() {
    const [activeTab, setActiveTab] = useState<Tab>('Platform Settings');
    const [settings, setSettings] = useState(mockPlatformSettings);
    const [saved, setSaved] = useState(false);
    const [editingNotif, setEditingNotif] = useState<number | null>(null);

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    const settingRows = [
        { key: 'demoScanLimit', label: 'Demo Scan Limit (per user)', min: 0, max: 5, step: 1, desc: 'How many demo scans a non-device user can run.' },
        { key: 'maxApptPerWeek', label: 'Max Appointment Requests / Week', min: 1, max: 10, step: 1, desc: 'Maximum appointment requests a patient can submit per week.' },
        { key: 'highSeverityFollowUpDays', label: 'High Severity Follow-Up Alert (days)', min: 3, max: 30, step: 1, desc: 'Days after a high-severity scan before an alert is triggered for missing follow-up.' },
        { key: 'doctorResponseWarningHrs', label: 'Doctor Response Warning (hours)', min: 12, max: 96, step: 6, desc: 'Hours before admin is alerted when a doctor has not responded to a request.' },
        { key: 'kioskOfflineAlertHrs', label: 'Kiosk Offline Alert (hours)', min: 1, max: 24, step: 1, desc: 'Hours a kiosk can be offline before triggering an admin alert.' },
    ];

    return (
        <div className={s.portalPage}>
            <AdminNavbar />
            <div className="container" style={{ paddingBottom: 'var(--space-16)' }}>

                {/* Header */}
                <div className={`slide-up ${s.pageHeader}`}>
                    <p className="section-label">Admin</p>
                    <h1 className={s.pageTitle}>System Settings</h1>
                    <p className={s.pageSubtitle}>Platform configuration, notification templates, admin accounts, and audit trail.</p>
                </div>

                {/* Tab Bar */}
                <div className={s.tabBar}>
                    {TABS.map(tab => (
                        <button key={tab} className={`${s.tab} ${activeTab === tab ? s.tabActive : ''}`} onClick={() => setActiveTab(tab)}>
                            {tab}
                        </button>
                    ))}
                </div>

                {/* ─── Platform Settings ─── */}
                {activeTab === 'Platform Settings' && (
                    <Reveal>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-6)', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
                                <h2 className={s.panelTitle}>Platform Configuration</h2>
                                <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
                                    {saved && <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-success)' }}>✓ Saved successfully</span>}
                                    <button className="btn btn-primary" onClick={handleSave}>Save Changes</button>
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                                {settingRows.map(row => (
                                    <div key={row.key} className="card" style={{ padding: 'var(--space-6)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
                                            <div style={{ flex: 1 }}>
                                                <p style={{ fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 4 }}>{row.label}</p>
                                                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>{row.desc}</p>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexShrink: 0 }}>
                                                <input
                                                    type="range"
                                                    min={row.min} max={row.max} step={row.step}
                                                    value={(settings as Record<string, number>)[row.key]}
                                                    onChange={e => { setSettings(st => ({ ...st, [row.key]: Number(e.target.value) })); setSaved(false); }}
                                                    style={{ cursor: 'pointer', accentColor: 'var(--color-accent)', width: 160 }}
                                                />
                                                <div style={{ background: 'var(--color-accent)', color: 'white', borderRadius: 'var(--radius-md)', padding: 'var(--space-2) var(--space-4)', fontFamily: 'var(--font-family-display)', fontSize: 'var(--font-size-xl)', minWidth: 52, textAlign: 'center' }}>
                                                    {(settings as Record<string, number>)[row.key]}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Danger Zone */}
                            <div className="card" style={{ padding: 'var(--space-6)', marginTop: 'var(--space-8)', border: '1px solid rgba(220,38,38,0.2)' }}>
                                <p style={{ fontFamily: 'var(--font-family-display)', fontSize: 'var(--font-size-lg)', color: '#ef4444', marginBottom: 'var(--space-4)' }}>Danger Zone</p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                                    {[
                                        { label: 'Export Full Platform Data', desc: 'Download a complete JSON export of all non-PHI platform metadata and analytics.' },
                                        { label: 'Flush Demo Scan Quotas', desc: 'Reset all user demo scan counters to 0. Users will regain demo scan access.' },
                                        { label: 'System Maintenance Mode', desc: 'Temporarily pause the patient-facing platform. Kiosks continue to operate on cached mode.' },
                                    ].map(action => (
                                        <div key={action.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-4)', padding: 'var(--space-4) 0', borderBottom: '1px solid var(--color-border)' }}>
                                            <div>
                                                <p style={{ fontWeight: 500, color: 'var(--color-text-primary)', fontSize: 'var(--font-size-sm)', marginBottom: 2 }}>{action.label}</p>
                                                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>{action.desc}</p>
                                            </div>
                                            <button className="btn btn-small" style={{ background: 'rgba(220,38,38,0.08)', color: '#ef4444', border: '1px solid rgba(220,38,38,0.2)', borderRadius: 'var(--radius-full)', cursor: 'pointer', fontSize: 'var(--font-size-xs)', padding: 'var(--space-2) var(--space-4)', fontFamily: 'var(--font-family-base)', flexShrink: 0, whiteSpace: 'nowrap' }}>
                                                {action.label.split(' ').slice(0, 2).join(' ')}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Reveal>
                )}

                {/* ─── Notifications ─── */}
                {activeTab === 'Notifications' && (
                    <Reveal>
                        <div>
                            <h2 className={s.panelTitle}>Notification Templates</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                                {mockNotifTemplates.map(t => (
                                    <div key={t.id} className="card" style={{ padding: 'var(--space-5)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
                                            <div style={{ flex: 1 }}>
                                                <p style={{ fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 4 }}>{t.name}</p>
                                                <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-3)', flexWrap: 'wrap' }}>
                                                    <span className={`${s.badge} ${s.badgeInfo}`}>Trigger: {t.trigger}</span>
                                                    <span className={`${s.badge} ${s.badgePending}`}>To: {t.recipients}</span>
                                                    <span className={`${s.badge} ${s.badgeModerate}`}>{t.channel}</span>
                                                </div>
                                                {editingNotif === t.id ? (
                                                    <textarea className="input" defaultValue={t.content} rows={3} style={{ fontSize: 'var(--font-size-xs)', resize: 'vertical', marginBottom: 'var(--space-3)' }} />
                                                ) : (
                                                    <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', fontFamily: 'var(--font-family-accent)', background: 'var(--color-surface-warm)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', marginBottom: 0 }}>
                                                        {t.content}
                                                    </p>
                                                )}
                                            </div>
                                            <div style={{ display: 'flex', gap: 'var(--space-2)', flexShrink: 0 }}>
                                                {editingNotif === t.id ? (
                                                    <>
                                                        <button className="btn btn-small btn-primary" onClick={() => setEditingNotif(null)}>Save</button>
                                                        <button className="btn btn-small btn-outline" onClick={() => setEditingNotif(null)}>Cancel</button>
                                                    </>
                                                ) : (
                                                    <button className="btn btn-small btn-outline" onClick={() => setEditingNotif(t.id)}>Edit Template</button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Reveal>
                )}

                {/* ─── Admin Accounts ─── */}
                {activeTab === 'Admin Accounts' && (
                    <Reveal>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
                                <h2 className={s.panelTitle}>Admin Accounts</h2>
                                <button className="btn btn-primary btn-small">+ Add Admin</button>
                            </div>
                            <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
                                <table className={s.table}>
                                    <thead>
                                        <tr><th>Name</th><th>Email</th><th>Role</th><th>Last Login</th><th>Status</th><th>Actions</th></tr>
                                    </thead>
                                    <tbody>
                                        {mockAdminAccounts.map(a => (
                                            <tr key={a.id}>
                                                <td style={{ fontWeight: 500 }}>{a.name}</td>
                                                <td style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-xs)' }}>{a.email}</td>
                                                <td>
                                                    <span className={`${s.badge} ${a.role === 'Super Admin' ? s.badgeCritical : a.role === 'Admin' ? s.badgeModerate : s.badgeInfo}`}>{a.role}</span>
                                                </td>
                                                <td style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-xs)' }}>{a.lastLogin}</td>
                                                <td><span className={`${s.badge} ${s.badgeActive}`}>{a.status}</span></td>
                                                <td>
                                                    <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                                                        <button className="btn btn-small btn-outline">Edit Role</button>
                                                        <button className="btn btn-small btn-outline">Reset 2FA</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </Reveal>
                )}

                {/* ─── Audit Log ─── */}
                {activeTab === 'Audit Log' && (
                    <Reveal>
                        <div>
                            <h2 className={s.panelTitle}>Audit Log</h2>
                            <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
                                <table className={s.table}>
                                    <thead>
                                        <tr><th>Time</th><th>Admin</th><th>Action</th><th>Detail</th></tr>
                                    </thead>
                                    <tbody>
                                        {mockAuditLog.map((l, i) => (
                                            <tr key={i}>
                                                <td style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-xs)', whiteSpace: 'nowrap' }}>{l.time}</td>
                                                <td style={{ fontWeight: 500, fontSize: 'var(--font-size-sm)' }}>{l.admin}</td>
                                                <td>
                                                    <span className={`${s.badge} ${l.action.includes('Rejected') || l.action.includes('Suspended') || l.action.includes('suspended') ? s.badgeSuspended : l.action.includes('Created') || l.action.includes('Approved') ? s.badgeActive : s.badgeInfo}`}>
                                                        {l.action}
                                                    </span>
                                                </td>
                                                <td style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>{l.detail}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </Reveal>
                )}
            </div>
        </div>
    );
}
