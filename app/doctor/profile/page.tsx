'use client';

import { useState, useRef } from 'react';
import DoctorNavbar from '@/components/DoctorNavbar';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { mockDoctor, mockAvailability, AvailabilityDay } from '@/lib/doctorMockData';
import s from '../portal.module.css';

function Reveal({ children }: { children: React.ReactNode }) {
    const ref = useRef<HTMLDivElement>(null);
    const visible = useIntersectionObserver(ref as React.RefObject<Element | null>, { threshold: 0.05 });
    return <div ref={ref} className={`reveal${visible ? ' active' : ''}`}>{children}</div>;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const SLOT_OPTIONS = ['8:00 AM', '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '1:00 PM', '2:00 PM', '2:30 PM', '3:00 PM', '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM'];

export default function DoctorProfilePage() {
    // Personal info form
    const [info, setInfo] = useState({
        name: mockDoctor.name,
        email: mockDoctor.email,
        phone: mockDoctor.phone,
        hospital: mockDoctor.hospital,
        location: mockDoctor.location,
        bio: mockDoctor.bio,
    });
    const [infoSaved, setInfoSaved] = useState(false);

    // Conditions/tags
    const [conditions, setConditions] = useState<string[]>(mockDoctor.conditions);
    const [newCondition, setNewCondition] = useState('');

    const addCondition = () => {
        if (newCondition.trim() && !conditions.includes(newCondition.trim())) {
            setConditions(c => [...c, newCondition.trim()]);
            setNewCondition('');
        }
    };

    const removeCondition = (c: string) => setConditions(cs => cs.filter(x => x !== c));

    // Availability
    const [avail, setAvail] = useState<Record<string, AvailabilityDay>>(
        JSON.parse(JSON.stringify(mockAvailability))
    );
    const [availSaved, setAvailSaved] = useState(false);

    const toggleDay = (day: string) =>
        setAvail(a => ({ ...a, [day]: { ...a[day], active: !a[day].active } }));

    const removeSlot = (day: string, slot: string) =>
        setAvail(a => ({ ...a, [day]: { ...a[day], slots: a[day].slots.filter(s => s !== slot) } }));

    const addSlot = (day: string, slot: string) => {
        if (!avail[day].slots.includes(slot)) {
            setAvail(a => ({ ...a, [day]: { ...a[day], slots: [...a[day].slots, slot].sort() } }));
        }
    };

    const saveInfo = () => { setInfoSaved(true); setTimeout(() => setInfoSaved(false), 2000); };
    const saveAvail = () => { setAvailSaved(true); setTimeout(() => setAvailSaved(false), 2000); };

    // Bar chart data
    const trend = mockDoctor.performance.monthlyTrend;
    const maxVal = Math.max(...trend);
    const initials = mockDoctor.name.split(' ').map(w => w[0]).slice(0, 2).join('');

    return (
        <div className={s.portalPage}>
            <DoctorNavbar />
            <div className="container" style={{ paddingBottom: 'var(--space-16)' }}>

                {/* ─── Profile Header ─── */}
                <div className={`slide-up ${s.pageHeader}`}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)', flexWrap: 'wrap' }}>
                        <div style={{ position: 'relative' }}>
                            <div className={`${s.patientAvatar} ${s.patientAvatarLg}`} style={{ width: 88, height: 88, fontSize: 'var(--font-size-3xl)', border: '3px solid var(--color-accent)', boxShadow: 'var(--shadow-gold)' }}>
                                {initials}
                            </div>
                            <button style={{ position: 'absolute', bottom: 0, right: 0, width: 24, height: 24, borderRadius: '50%', background: 'var(--gradient-gold)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-gold)' }}>
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                                </svg>
                            </button>
                        </div>
                        <div>
                            <p className="section-label">Doctor Portal</p>
                            <h1 className={s.pageTitle} style={{ marginBottom: 'var(--space-1)' }}>{mockDoctor.name}</h1>
                            <p className={s.pageSubtitle}>{mockDoctor.specialization} · {mockDoctor.hospital}</p>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 'var(--space-2)', background: 'rgba(149,109,31,0.15)', border: '1px solid var(--color-accent-border)', borderRadius: 'var(--radius-full)', padding: '2px var(--space-3)', fontSize: 'var(--font-size-xs)', color: 'var(--color-accent)', fontWeight: 600, letterSpacing: '0.08em' }}>
                                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                NIVARA Verified
                            </div>
                        </div>
                    </div>
                </div>

                {/* ─── Personal Information ─── */}
                <Reveal>
                    <div className={s.sectionBlock}>
                        <p className="section-label">Profile</p>
                        <h2 className={s.panelTitle}>Personal Information</h2>
                        <div className="card" style={{ padding: 'var(--space-6)' }}>
                            <div className={s.formGrid}>
                                {[
                                    { label: 'Full Name', key: 'name' },
                                    { label: 'Email', key: 'email' },
                                    { label: 'Phone', key: 'phone' },
                                    { label: 'Hospital / Clinic', key: 'hospital' },
                                    { label: 'Location / City', key: 'location' },
                                ].map(({ label, key }) => (
                                    <div key={key} className={s.formGroup}>
                                        <label className={s.formLabel}>{label}</label>
                                        <input
                                            className="input"
                                            value={info[key as keyof typeof info]}
                                            onChange={e => setInfo(i => ({ ...i, [key]: e.target.value }))}
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className={s.formGroup} style={{ marginTop: 'var(--space-4)' }}>
                                <label className={s.formLabel}>Professional Bio</label>
                                <textarea
                                    className="input"
                                    rows={4}
                                    style={{ resize: 'vertical', marginTop: 'var(--space-2)' }}
                                    value={info.bio}
                                    onChange={e => setInfo(i => ({ ...i, bio: e.target.value }))}
                                />
                            </div>
                            <button className="btn btn-primary" style={{ marginTop: 'var(--space-5)' }} onClick={saveInfo}>
                                {infoSaved ? '✓ Saved!' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </Reveal>

                {/* ─── Conditions / Specializations ─── */}
                <Reveal>
                    <div className={s.sectionBlock}>
                        <p className="section-label">Specializations</p>
                        <h2 className={s.panelTitle}>Conditions Treated</h2>
                        <div className="card" style={{ padding: 'var(--space-6)' }}>
                            <div className={s.tagGrid}>
                                {conditions.map(c => (
                                    <span key={c} className={s.condTag}>
                                        {c}
                                        <button className={s.condTagRemove} onClick={() => removeCondition(c)} title="Remove">×</button>
                                    </span>
                                ))}
                            </div>
                            <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-4)', alignItems: 'center' }}>
                                <input
                                    className="input"
                                    placeholder="Add a condition…"
                                    value={newCondition}
                                    onChange={e => setNewCondition(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && addCondition()}
                                    style={{ maxWidth: 240 }}
                                />
                                <button className="btn btn-primary btn-small" onClick={addCondition}>Add</button>
                            </div>
                        </div>
                    </div>
                </Reveal>

                {/* ─── Availability Management ─── */}
                <Reveal>
                    <div className={s.sectionBlock}>
                        <p className="section-label">Availability</p>
                        <h2 className={s.panelTitle}>Weekly Schedule</h2>
                        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-5)' }}>
                            Toggle days and manage time slots. This feeds directly into the patient-facing booking page.
                        </p>
                        <div className={s.availGrid}>
                            {DAYS.map(day => {
                                const dayData = avail[day];
                                return (
                                    <div key={day} className={s.availDay} style={{ opacity: dayData.active ? 1 : 0.5 }}>
                                        <div className={s.availDayHeader}>
                                            <span className={s.availDayName}>{day}</span>
                                            <button className={`${s.toggle} ${dayData.active ? s.toggleOn : s.toggleOff}`} onClick={() => toggleDay(day)}>
                                                <span className={`${s.toggleKnob} ${dayData.active ? s.toggleKnobOn : s.toggleKnobOff}`} />
                                            </button>
                                        </div>
                                        {dayData.active && (
                                            <div className={s.slotList}>
                                                {dayData.slots.map(slot => (
                                                    <span key={slot} className={s.slotPill}>
                                                        {slot}
                                                        <button className={s.slotRemove} onClick={() => removeSlot(day, slot)}>×</button>
                                                    </span>
                                                ))}
                                                <select
                                                    defaultValue=""
                                                    onChange={e => { if (e.target.value) { addSlot(day, e.target.value); e.target.value = ''; } }}
                                                    style={{ fontSize: 'var(--font-size-xs)', background: 'transparent', border: '1px dashed var(--color-accent-border)', borderRadius: 'var(--radius-full)', padding: '3px var(--space-3)', color: 'var(--color-accent)', cursor: 'pointer', outline: 'none' }}
                                                >
                                                    <option value="" disabled>+ Add slot</option>
                                                    {SLOT_OPTIONS.filter(o => !dayData.slots.includes(o)).map(o => <option key={o} value={o}>{o}</option>)}
                                                </select>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                        <button className="btn btn-primary" style={{ marginTop: 'var(--space-6)' }} onClick={saveAvail}>
                            {availSaved ? '✓ Availability Saved!' : 'Save Availability'}
                        </button>
                    </div>
                </Reveal>

                {/* ─── Credentials ─── */}
                <Reveal>
                    <div className={s.sectionBlock}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
                            <div>
                                <p className="section-label">Credentials</p>
                                <h2 className={s.panelTitle}>Education & Affiliations</h2>
                            </div>
                            <button className="btn btn-small"
                                style={{ background: 'transparent', color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-full)', cursor: 'pointer', fontSize: 'var(--font-size-xs)', padding: 'var(--space-2) var(--space-4)', fontFamily: 'var(--font-family-base)' }}>
                                Request Update
                            </button>
                        </div>
                        <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)', fontStyle: 'italic' }}>
                            Credentials are verified by NIVARA admin and cannot be self-edited to ensure authenticity.
                        </p>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-5)' }}>
                            <div>
                                <p className={s.formLabel} style={{ marginBottom: 'var(--space-3)' }}>Education</p>
                                {mockDoctor.credentials.education.map(e => (
                                    <div key={e.degree} className="card" style={{ padding: 'var(--space-4) var(--space-5)', marginBottom: 'var(--space-3)' }}>
                                        <p style={{ fontFamily: 'var(--font-family-display)', color: 'var(--color-text-primary)', marginBottom: 4 }}>{e.degree}</p>
                                        <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>{e.institution} · {e.year}</p>
                                    </div>
                                ))}
                            </div>
                            <div>
                                <p className={s.formLabel} style={{ marginBottom: 'var(--space-3)' }}>Certifications</p>
                                {mockDoctor.credentials.certifications.map(c => (
                                    <div key={c} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
                                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-accent)', flexShrink: 0, marginTop: 6 }} />
                                        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>{c}</p>
                                    </div>
                                ))}
                                <p style={{ fontFamily: 'monospace', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: 'var(--space-2) var(--space-3)', marginTop: 'var(--space-4)', letterSpacing: '0.08em' }}>
                                    {mockDoctor.credentials.registrationNumber}
                                </p>
                            </div>
                        </div>
                    </div>
                </Reveal>

                {/* ─── Performance Insights ─── */}
                <Reveal>
                    <div>
                        <p className="section-label">Insights</p>
                        <h2 className={s.panelTitle}>Performance Insights</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--space-5)', marginBottom: 'var(--space-8)' }}>
                            {[
                                { label: 'Consultations completed', val: mockDoctor.performance.consultationsThisMonth },
                                { label: 'Avg. response time', val: mockDoctor.performance.avgResponseTime },
                                { label: 'Patient satisfaction', val: `${mockDoctor.performance.satisfactionRating} / 5` },
                            ].map(item => (
                                <div key={item.label} className={`card ${s.statCard}`}>
                                    <div style={{ fontSize: 'var(--font-size-2xl)', fontFamily: 'var(--font-family-display)', color: 'var(--color-accent)' }}>{item.val}</div>
                                    <div className={s.statLabel}>{item.label}</div>
                                </div>
                            ))}
                        </div>

                        {/* Top conditions */}
                        <div className="card" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
                            <p className={s.formLabel} style={{ marginBottom: 'var(--space-4)' }}>Top Conditions Seen</p>
                            {mockDoctor.performance.topConditions.map((c, i) => (
                                <div key={c} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-3)' }}>
                                    <span style={{ fontFamily: 'var(--font-family-display)', fontSize: 'var(--font-size-xl)', color: 'var(--color-accent)', minWidth: 24 }}>#{i + 1}</span>
                                    <span style={{ flex: 1, fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)' }}>{c}</span>
                                </div>
                            ))}
                        </div>

                        {/* CSS bar chart */}
                        <div className="card" style={{ padding: 'var(--space-6)' }}>
                            <p className={s.formLabel} style={{ marginBottom: 'var(--space-5)' }}>Monthly Consultation Trend (This Year)</p>
                            <div className={s.barChart}>
                                {trend.map((val, i) => (
                                    <div key={i} className={s.barChartCol}>
                                        <div className={s.barChartBar} style={{ height: `${(val / maxVal) * 100}%` }} />
                                        <span className={s.barChartLabel}>{MONTH_LABELS[i]}</span>
                                    </div>
                                ))}
                            </div>
                            <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginTop: 'var(--space-3)', textAlign: 'right' }}>
                                Peak: {maxVal} consultations
                            </p>
                        </div>
                    </div>
                </Reveal>

            </div>
        </div>
    );
}
