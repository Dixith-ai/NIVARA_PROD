'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import styles from './profile.module.css';
import { useAuth } from '@/context/AuthContext';
import { doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getUserScans, getPatientAppointments } from '@/lib/firestore';
import type { ScanRecord } from '@/types/scan';
import type { Appointment } from '@/types/appointment';
import { useRouter } from 'next/navigation';

/* ══════════════════════════════════════════════
   TYPES
   ══════════════════════════════════════════════ */
interface UserProfile {
    uid: string;
    email: string;
    fullName: string;
    role: string;
    createdAt: Timestamp | null;
    skinType: string | null;
    profilePhoto: string | null;
    deviceLinked: boolean;
    deviceId: string | null;
    demoScanUsed: boolean;
    phone?: string | null;
    dateOfBirth?: string | null;
    location?: string | null;
    notifications?: {
        appointmentReminders: boolean;
        scanAlerts: boolean;
        productAnnouncements: boolean;
        doctorResponses: boolean;
    } | null;
}

/* StoredScan kept only for demo-scan section localStorage read */
interface StoredScan {
    scanId: string;
    date: string;
    source: string;
    topCondition: string;
    topConfidence: number;
    severity: 'Low' | 'Moderate' | 'High';
}

/* ══════════════════════════════════════════════
   HELPERS
   ══════════════════════════════════════════════ */
function getInitials(name: string) {
    return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

function getSeverityClass(severity: string, s: typeof styles): string {
    if (severity === 'Low') return s.severityLow;
    if (severity === 'High') return s.severityHigh;
    return s.severityModerate;
}

function getSourceTagClass(source: string, s: typeof styles): string {
    if (source === 'Device') return s.sourceTagDevice;
    if (source === 'Kiosk') return s.sourceTagKiosk;
    return s.sourceTagDemo;
}

function getDoctorInitials(name: string) {
    const parts = name.replace('Dr. ', '').split(' ');
    return parts.map((p) => p[0]).join('').slice(0, 2).toUpperCase();
}

function formatMemberSince(ts: Timestamp | null): string {
    if (!ts) return '—';
    try {
        const d = ts.toDate();
        return d.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
    } catch {
        return '—';
    }
}

function deriveAge(dob: string | null | undefined): string {
    if (!dob) return '—';
    try {
        const birth = new Date(dob);
        const now = new Date();
        const age = now.getFullYear() - birth.getFullYear() -
            (now < new Date(now.getFullYear(), birth.getMonth(), birth.getDate()) ? 1 : 0);
        return `${age}`;
    } catch {
        return '—';
    }
}

/* ══════════════════════════════════════════════
   REVEAL WRAPPER
   ══════════════════════════════════════════════ */
function RevealSection({ children, className }: { children: React.ReactNode; className?: string }) {
    const ref = useRef<HTMLDivElement>(null);
    const visible = useIntersectionObserver(ref as React.RefObject<Element | null>, { threshold: 0.08 });
    return (
        <div ref={ref} className={`reveal${visible ? ' active' : ''}${className ? ` ${className}` : ''}`}>
            {children}
        </div>
    );
}

/* ══════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ══════════════════════════════════════════════ */
export default function ProfilePage() {
    const { user } = useAuth();
    const router = useRouter();

    /* ── Firestore profile state ── */
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [profileLoading, setProfileLoading] = useState(true);

    /* ── Scan history from Firestore ── */
    const [scanHistory, setScanHistory] = useState<ScanRecord[]>([]);
    const [scansLoading, setScansLoading] = useState(true);

    /* ── Appointments from Firestore ── */
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [apptsLoading, setApptsLoading] = useState(true);

    /* ── Device panel state ── */
    const [deviceLinked, setDeviceLinked] = useState(false);
    const [serialInput, setSerialInput] = useState('');
    const [deviceSaving, setDeviceSaving] = useState(false);

    /* ── Demo scan from localStorage ── */
    const [lastScan, setLastScan] = useState<StoredScan | null>(null);

    /* ── Appointments tab ── */
    const [apptTab, setApptTab] = useState<'pending' | 'upcoming' | 'past'>('pending');

    /* ── Personal info form state ── */
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dob: '',
        location: '',
        skinType: 'Normal',
    });
    const [formSaving, setFormSaving] = useState(false);
    const [formSuccess, setFormSuccess] = useState(false);

    /* ── Profile photo upload ── */
    const photoInputRef = useRef<HTMLInputElement>(null);
    const [photoUploading, setPhotoUploading] = useState(false);

    /* ── Device serial validation error ── */
    const [deviceSerialError, setDeviceSerialError] = useState('');

    /* ── Notification toggles ── */
    const [notifs, setNotifs] = useState({
        appointmentReminders: true,
        scanAlerts: true,
        productAnnouncements: false,
        doctorResponses: true,
    });

    /* ── Hero ref ── */
    const heroRef = useRef<HTMLDivElement>(null);

    /* ── Load Firestore profile on mount ── */
    useEffect(() => {
        if (!user) return;

        async function loadProfile() {
            try {
                const snap = await getDoc(doc(db, 'users', user!.uid));
                if (snap.exists()) {
                    const data = snap.data() as UserProfile;
                    setProfile(data);
                    setDeviceLinked(data.deviceLinked ?? false);

                    // Populate form
                    const nameParts = (data.fullName ?? '').split(' ');
                    setForm({
                        firstName: nameParts[0] ?? '',
                        lastName: nameParts.slice(1).join(' ') ?? '',
                        email: data.email ?? '',
                        phone: data.phone ?? '',
                        dob: data.dateOfBirth ?? '',
                        location: data.location ?? '',
                        skinType: data.skinType ?? 'Normal',
                    });

                    // Notification defaults
                    setNotifs({
                        appointmentReminders: data.notifications?.appointmentReminders ?? true,
                        scanAlerts: data.notifications?.scanAlerts ?? true,
                        productAnnouncements: data.notifications?.productAnnouncements ?? false,
                        doctorResponses: data.notifications?.doctorResponses ?? true,
                    });
                }
            } catch (err) {
                console.error('Failed to load profile:', err);
            } finally {
                setProfileLoading(false);
            }
        }

        async function loadScans() {
            try {
                const scans = await getUserScans(user!.uid);
                setScanHistory(scans);
            } catch (err) {
                console.error('Failed to load scan history:', err);
            } finally {
                setScansLoading(false);
            }
        }

        async function loadAppointments() {
            try {
                const appts = await getPatientAppointments(user!.uid);
                setAppointments(appts);
            } catch (err) {
                console.error('Failed to load appointments:', err);
            } finally {
                setApptsLoading(false);
            }
        }

        loadProfile();
        loadScans();
        loadAppointments();

        // Load last scan from localStorage (for demo scan section only)
        try {
            const raw = localStorage.getItem('nivara_last_scan');
            if (raw) setLastScan(JSON.parse(raw) as StoredScan);
        } catch { /* ignore */ }
    }, [user]);

    const handleFormChange = (key: keyof typeof form) => (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

    /* ── Save personal info ── */
    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setFormSaving(true);
        setFormSuccess(false);
        try {
            await updateDoc(doc(db, 'users', user.uid), {
                fullName: `${form.firstName} ${form.lastName}`.trim(),
                phone: form.phone || null,
                dateOfBirth: form.dob || null,
                location: form.location || null,
                skinType: form.skinType || null,
            });
            setFormSuccess(true);
            // Refresh local profile state
            setProfile(prev => prev ? {
                ...prev,
                fullName: `${form.firstName} ${form.lastName}`.trim(),
                phone: form.phone || null,
                dateOfBirth: form.dob || null,
                location: form.location || null,
                skinType: form.skinType || null,
            } : prev);
            setTimeout(() => setFormSuccess(false), 3000);
        } catch (err) {
            console.error('Failed to save profile:', err);
        } finally {
            setFormSaving(false);
        }
    };

    /* ── Notification toggle + immediate Firestore write ── */
    const toggleNotif = async (key: keyof typeof notifs) => {
        if (!user) return;
        const updated = { ...notifs, [key]: !notifs[key] };
        setNotifs(updated);
        try {
            await updateDoc(doc(db, 'users', user.uid), {
                notifications: updated,
            });
        } catch (err) {
            console.error('Failed to save notification preference:', err);
            // Revert on failure
            setNotifs(notifs);
        }
    };

    /* ── Link device with serial validation ── */
    const handleLinkDevice = async () => {
        if (!user || !serialInput.trim()) return;
        const SERIAL_REGEX = /^NVR-\d{4}-\d{5}$/;
        if (!SERIAL_REGEX.test(serialInput.trim())) {
            setDeviceSerialError('Invalid serial format. Expected: NVR-YYYY-NNNNN');
            return;
        }
        setDeviceSerialError('');
        setDeviceSaving(true);
        try {
            await updateDoc(doc(db, 'users', user.uid), {
                deviceLinked: true,
                deviceId: serialInput.trim(),
            });
            setDeviceLinked(true);
            setProfile(prev => prev ? { ...prev, deviceLinked: true, deviceId: serialInput.trim() } : prev);
        } catch (err) {
            console.error('Failed to link device:', err);
        } finally {
            setDeviceSaving(false);
        }
    };

    /* ── Profile photo upload handler (Fix 11) ── */
    const handlePhotoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;
        setPhotoUploading(true);
        try {
            const reader = new FileReader();
            reader.onload = async (ev) => {
                const dataUrl = ev.target?.result as string;
                await updateDoc(doc(db, 'users', user.uid), { profilePhoto: dataUrl });
                setProfile(prev => prev ? { ...prev, profilePhoto: dataUrl } : prev);
                setPhotoUploading(false);
            };
            reader.onerror = () => setPhotoUploading(false);
            reader.readAsDataURL(file);
        } catch (err) {
            console.error('Failed to upload photo:', err);
            setPhotoUploading(false);
        }
    };

    /* ── Loading state ── */
    if (profileLoading) {
        return (
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                minHeight: '100vh', background: 'var(--color-bg)',
            }}>
                <div style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    border: '2.5px solid var(--color-border)',
                    borderTopColor: 'var(--color-accent)',
                    animation: 'spin 0.8s linear infinite',
                }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    /* ── Derived display values ── */
    const displayName = profile?.fullName || user?.displayName || 'User';
    const displayLocation = profile?.location || '—';
    const displaySkinType = profile?.skinType || '—';
    const displayAge = deriveAge(profile?.dateOfBirth);
    const memberSince = formatMemberSince(profile?.createdAt ?? null);
    const accountStatus = profile?.deviceLinked ? 'Device Linked' : 'Free Plan';
    const isDeviceLinked = deviceLinked;

    return (
        <main className={styles.profilePage}>
            {/* ══════════════ SECTION 1 — HERO ══════════════ */}
            <section className={styles.profileHero} ref={heroRef}>
                <div className="container">
                    <div className={`${styles.profileHeroInner} slide-up`}>
                        {/* Avatar */}
                        <div className={styles.avatarRing}>
                            <div className={styles.avatarInner}>
                                {profile?.profilePhoto ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={profile.profilePhoto} alt={displayName} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                                ) : (
                                    <span className={styles.avatarInitials}>{getInitials(displayName)}</span>
                                )}
                            </div>
                        </div>

                        {/* Identity */}
                        <div className={styles.heroInfo}>
                            <h1 className={styles.heroName}>{displayName}</h1>
                            <div className={styles.heroMeta}>
                                {displayAge !== '—' && (
                                    <>
                                        <span>{displayAge} years</span>
                                        <span className={styles.heroDivider}>·</span>
                                    </>
                                )}
                                <span>{displayLocation}</span>
                                <span className={styles.heroDivider}>·</span>
                                <span>Member since {memberSince}</span>
                            </div>
                            <div className={styles.heroBadges}>
                                {displaySkinType !== '—' && (
                                    <span className={styles.skinBadge}>{displaySkinType} Skin</span>
                                )}
                                <span className={profile?.deviceLinked ? styles.statusBadgeLinked : styles.statusBadgeFree}>
                                    {accountStatus}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════ CONTENT GRID ══════════════ */}
            <div className={styles.contentGrid}>
                <div className="container">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>

                        {/* ══════════════ SECTION 2 — DEVICE PANEL ══════════════ */}
                        <RevealSection>
                            <div className={styles.sectionBlock}>
                                <div className={styles.sectionBlockHeader}>
                                    <h2 className={styles.sectionTitle}>Device</h2>
                                    {isDeviceLinked && (
                                        <button
                                            className="btn btn-outline btn-small"
                                            onClick={async () => {
                                                if (!user) return;
                                                try {
                                                    await updateDoc(doc(db, 'users', user.uid), { deviceLinked: false, deviceId: null });
                                                    setDeviceLinked(false);
                                                    setProfile(prev => prev ? { ...prev, deviceLinked: false, deviceId: null } : prev);
                                                } catch (err) { console.error(err); }
                                            }}
                                        >
                                            Unlink Device
                                        </button>
                                    )}
                                </div>

                                <div className="card">
                                    {isDeviceLinked ? (
                                        /* ─ Linked state ─ */
                                        <div className={styles.deviceCard}>
                                            <div className={styles.deviceInfo}>
                                                <div className={styles.deviceName}>NIVARA Device</div>
                                                <div className={styles.deviceMeta}>
                                                    <div className={styles.deviceMetaItem}>
                                                        <span className={styles.deviceMetaLabel}>Device ID</span>
                                                        <span className={styles.deviceMetaValue}>{profile?.deviceId || '—'}</span>
                                                    </div>
                                                    <div className={styles.deviceMetaItem}>
                                                        <span className={styles.deviceMetaLabel}>Status</span>
                                                        <span className={`${styles.statusDot} ${styles.statusDotActive}`}>Active</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        /* ─ Unlinked state ─ */
                                        <div className={styles.unlinkedCard}>
                                            <span className="section-label">Link Your Device</span>
                                            <p className={styles.unlinkedDesc}>
                                                Linking your NIVARA device unlocks continuous skin monitoring, personalized trends, and clinical-grade scan history stored securely in your account.
                                            </p>
                                            <div className={styles.deviceInputRow}>
                                                <input
                                                    type="text"
                                                    className={`input${deviceSerialError ? ' input-error' : ''}`}
                                                    placeholder="Enter device serial number (e.g. NVR-2024-00423)"
                                                    value={serialInput}
                                                    onChange={(e) => { setSerialInput(e.target.value); setDeviceSerialError(''); }}
                                                />
                                                {deviceSerialError && (
                                                    <div className="error-message" style={{ marginTop: 'var(--space-2)' }}>{deviceSerialError}</div>
                                                )}
                                                <button
                                                    className="btn btn-primary"
                                                    disabled={deviceSaving}
                                                    onClick={handleLinkDevice}
                                                >
                                                    {deviceSaving ? 'Linking…' : 'Link Device'}
                                                </button>
                                            </div>
                                            <div className={styles.deviceSecondaryCtAs}>
                                                <Link href="/kiosks" className="btn btn-outline btn-small">
                                                    Find a Kiosk Near You
                                                </Link>
                                                <Link href="/buy" className="btn btn-outline btn-small">
                                                    Buy a Device
                                                </Link>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </RevealSection>

                        {/* ══════════════ SECTION 3 — DEMO SCAN STATUS ══════════════ */}
                        <RevealSection>
                            <div className={styles.sectionBlock}>
                                <div className={styles.sectionBlockHeader}>
                                    <h2 className={styles.sectionTitle}>Demo Scan</h2>
                                </div>

                                {profile?.demoScanUsed && lastScan ? (
                                    /* ─ Used state ─ */
                                    <div className="card">
                                        <div className={styles.demoScanCard}>
                                            <div className={styles.demoScanHeader}>
                                                <div className={styles.demoScanResult}>
                                                    <span className={styles.demoScanResultLabel}>Scan Date</span>
                                                    <span className={styles.demoScanResultValue}>
                                                        {new Date(lastScan.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                    </span>
                                                </div>
                                                <div className={styles.demoScanResult}>
                                                    <span className={styles.demoScanResultLabel}>Top Diagnosis</span>
                                                    <span className={styles.demoScanResultValue}>{lastScan.topCondition}</span>
                                                </div>
                                                <div className={styles.demoScanResult}>
                                                    <span className={styles.demoScanResultLabel}>Severity</span>
                                                    <span className={`${styles.severityBadge} ${getSeverityClass(lastScan.severity, styles)}`}>
                                                        {lastScan.severity}
                                                    </span>
                                                </div>
                                            </div>
                                            <div style={{ paddingTop: 'var(--space-2)' }}>
                                                <Link href="/results" className="btn btn-primary btn-small">
                                                    View Full Report
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ) : profile?.demoScanUsed && !lastScan ? (
                                    /* ─ Used but localStorage cleared ─ */
                                    <div className="card">
                                        <div className={styles.demoScanCard}>
                                            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-4)' }}>
                                                You&apos;ve completed a demo scan. Your results are saved in your scan history.
                                            </p>
                                            <Link href="/results" className="btn btn-primary btn-small">
                                                View Your Results
                                            </Link>
                                        </div>
                                    </div>
                                ) : (
                                    /* ─ Unused state ─ */
                                    <div className={styles.unusedScanCtaCard}>
                                        <span className="section-label section-label-light">Free Trial</span>
                                        <h3 className={styles.unusedScanTitle}>Try your free skin scan.</h3>
                                        <p className={styles.unusedScanDesc}>
                                            Get an AI assisted differential diagnosis of your skin concern. No device required. Takes less than 2 minutes.
                                        </p>
                                        <Link href="/demo" className="btn btn-accent btn-large">
                                            Start Demo Scan
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </RevealSection>

                        {/* ══════════════ SECTION 4 — SCAN HISTORY ══════════════ */}
                        <RevealSection>
                            <div className={styles.sectionBlock}>
                                <h2 className={styles.sectionTitle}>Scan History</h2>
                                <div className={styles.scanTimeline}>
                                    {scansLoading ? (
                                        <div className="card" style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
                                            <div style={{ width: '22px', height: '22px', borderRadius: '50%', border: '2px solid var(--color-border)', borderTopColor: 'var(--color-accent)', animation: 'spin 0.8s linear infinite', margin: '0 auto' }} />
                                            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                                        </div>
                                    ) : scanHistory.length === 0 ? (
                                        <div className="card" style={{ textAlign: 'center', padding: 'var(--space-10) var(--space-6)' }}>
                                            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-5)' }}>
                                                Your scan history will appear here after your first scan.
                                            </p>
                                            <Link href="/demo" className="btn btn-primary btn-small">
                                                Try the Demo
                                            </Link>
                                        </div>
                                    ) : (
                                        scanHistory.map((scan, idx) => (
                                            <div key={scan.scanId} className={`card ${styles.scanCard}`} style={{ animationDelay: `${idx * 0.06}s` }}>
                                                <div className={styles.scanCardLeft}>
                                                    <div className={styles.scanDateBlock}>
                                                        <span className={`${styles.sourceTagDemo} ${getSourceTagClass(scan.source, styles)}`}>
                                                            {scan.source}
                                                        </span>
                                                        <span className={styles.scanDate}>
                                                            {new Date(scan.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                        </span>
                                                    </div>
                                                    <div className={styles.scanResultBlock}>
                                                        <span className={styles.scanResultName}>{scan.topCondition}</span>
                                                        <span className={`${styles.severityBadge} ${getSeverityClass(scan.severity, styles)}`}>
                                                            {scan.severity}
                                                        </span>
                                                        <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
                                                            {scan.topConfidence.toFixed(1)}%
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className={styles.scanCardRight}>
                                                    <button
                                                        className="btn btn-outline btn-small"
                                                        onClick={() => {
                                                            try { localStorage.setItem('nivara_last_scan', JSON.stringify(scan)); } catch { /* ignore */ }
                                                            router.push('/results');
                                                        }}
                                                    >
                                                        View Full Report
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </RevealSection>

                        {/* ══════════════ SECTION 5 — APPOINTMENTS ══════════════ */}
                        <RevealSection>
                            <div className={styles.sectionBlock}>
                                <h2 className={styles.sectionTitle}>Appointments</h2>
                                <div className="card" style={{ overflow: 'hidden' }}>
                                    {/* Tab bar */}
                                    <div className={styles.tabBar}>
                                        {(['pending', 'upcoming', 'past'] as const).map((tab) => (
                                            <button
                                                key={tab}
                                                className={`${styles.tab}${apptTab === tab ? ` ${styles.tabActive}` : ''}`}
                                                onClick={() => setApptTab(tab)}
                                            >
                                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Tab content */}
                                    <div className={styles.appointmentsList}>
                                        {apptsLoading ? (
                                            <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-8)' }}>
                                                <div style={{ width: '22px', height: '22px', borderRadius: '50%', border: '2px solid var(--color-border)', borderTopColor: 'var(--color-accent)', animation: 'spin 0.8s linear infinite' }} />
                                                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                                            </div>
                                        ) : (() => {
                                            const buckets: Record<string, Appointment[]> = {
                                                pending: appointments.filter(a => a.status === 'pending'),
                                                upcoming: appointments.filter(a => a.status === 'accepted'),
                                                past: appointments.filter(a => a.status === 'completed' || a.status === 'declined'),
                                            };
                                            const list = buckets[apptTab];
                                            const emptyMessages: Record<string, string> = {
                                                pending: 'No pending appointment requests.',
                                                upcoming: 'No upcoming appointments.',
                                                past: 'No past consultations.',
                                            };
                                            if (list.length === 0) {
                                                return (
                                                    <div style={{ textAlign: 'center', padding: 'var(--space-8) var(--space-6)' }}>
                                                        <p className={styles.emptyState}>{emptyMessages[apptTab]}</p>
                                                        <Link href="/doctors" className="btn btn-outline btn-small" style={{ marginTop: 'var(--space-4)', display: 'inline-block' }}>
                                                            Find a Doctor
                                                        </Link>
                                                    </div>
                                                );
                                            }
                                            return (
                                                <>
                                                    {list.map((appt) => {
                                                        const statusColors: Record<string, [string, string]> = {
                                                            pending: ['rgba(251,191,36,0.12)', '#f59e0b'],
                                                            accepted: ['rgba(34,197,94,0.12)', '#22c55e'],
                                                            declined: ['rgba(239,68,68,0.12)', '#ef4444'],
                                                            completed: ['rgba(148,163,184,0.1)', '#94a3b8'],
                                                        };
                                                        const [bg, color] = statusColors[appt.status] ?? statusColors.pending;
                                                        const statusLabel = appt.status === 'accepted' ? 'Confirmed' : appt.status.charAt(0).toUpperCase() + appt.status.slice(1);
                                                        return (
                                                            <div key={appt.id} style={{ padding: 'var(--space-4) var(--space-5)', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--space-4)' }}>
                                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                                    <p style={{ fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--space-1)', fontSize: 'var(--font-size-sm)' }}>{appt.doctorName}</p>
                                                                    <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-1)' }}>{appt.doctorSpecialization} · {appt.doctorHospital}</p>
                                                                    <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginBottom: appt.topCondition ? 'var(--space-1)' : 0 }}>{appt.requestedDate} at {appt.requestedTime}</p>
                                                                    {appt.topCondition && (
                                                                        <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-accent)', marginTop: 'var(--space-1)' }}>Scan: {appt.topCondition}</p>
                                                                    )}
                                                                </div>
                                                                <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, padding: '3px 10px', borderRadius: '100px', background: bg, color, whiteSpace: 'nowrap', flexShrink: 0 }}>
                                                                    {statusLabel}
                                                                </span>
                                                            </div>
                                                        );
                                                    })}
                                                </>
                                            );
                                        })()}
                                    </div>
                                </div>
                            </div>
                        </RevealSection>

                        {/* ══════════════ SECTION 6 — PERSONAL INFO ══════════════ */}
                        <RevealSection>
                            <div className={styles.sectionBlock}>
                                <h2 className={styles.sectionTitle}>Personal Information</h2>
                                <div className="card">
                                    <form onSubmit={handleFormSubmit}>
                                        <div className={styles.formGrid}>
                                            {/* Photo upload — Fix 11 */}
                                            <div className={`${styles.formGroupFull} ${styles.formGroup}`}>
                                                <label className="label">Profile Photo</label>
                                                <div className={styles.photoUploadRow}>
                                                    <div className={styles.photoUploadAvatar}>{getInitials(displayName)}</div>
                                                    <div className={styles.photoUploadText}>
                                                        <span className={styles.photoUploadLabel}>Upload a new photo</span>
                                                        <span className={styles.photoUploadHint}>JPG or PNG, max 5 MB. Recommended: 400×400 px</span>
                                                    </div>
                                                    {/* Hidden input */}
                                                    <input
                                                        ref={photoInputRef}
                                                        type="file"
                                                        accept="image/*"
                                                        style={{ display: 'none' }}
                                                        onChange={handlePhotoFileChange}
                                                    />
                                                    <button
                                                        type="button"
                                                        className="btn btn-outline btn-small"
                                                        style={{ marginLeft: 'auto' }}
                                                        disabled={photoUploading}
                                                        onClick={() => photoInputRef.current?.click()}
                                                    >
                                                        {photoUploading ? 'Uploading…' : 'Choose File'}
                                                    </button>
                                                </div>
                                            </div>

                                            {/* First name */}
                                            <div className={styles.formGroup}>
                                                <label className="label" htmlFor="firstName">First Name</label>
                                                <input
                                                    id="firstName"
                                                    type="text"
                                                    className="input"
                                                    value={form.firstName}
                                                    onChange={handleFormChange('firstName')}
                                                />
                                            </div>

                                            {/* Last name */}
                                            <div className={styles.formGroup}>
                                                <label className="label" htmlFor="lastName">Last Name</label>
                                                <input
                                                    id="lastName"
                                                    type="text"
                                                    className="input"
                                                    value={form.lastName}
                                                    onChange={handleFormChange('lastName')}
                                                />
                                            </div>

                                            {/* Email — read-only */}
                                            <div className={styles.formGroup}>
                                                <label className="label" htmlFor="email">Email Address</label>
                                                <input
                                                    id="email"
                                                    type="email"
                                                    className="input"
                                                    value={form.email}
                                                    readOnly
                                                    style={{ opacity: 0.6, cursor: 'not-allowed' }}
                                                />
                                            </div>

                                            {/* Phone */}
                                            <div className={styles.formGroup}>
                                                <label className="label" htmlFor="phone">Phone Number</label>
                                                <input
                                                    id="phone"
                                                    type="tel"
                                                    className="input"
                                                    value={form.phone}
                                                    onChange={handleFormChange('phone')}
                                                    placeholder="+91 98765 43210"
                                                />
                                            </div>

                                            {/* DOB */}
                                            <div className={styles.formGroup}>
                                                <label className="label" htmlFor="dob">Date of Birth</label>
                                                <input
                                                    id="dob"
                                                    type="date"
                                                    className="input"
                                                    value={form.dob}
                                                    onChange={handleFormChange('dob')}
                                                />
                                            </div>

                                            {/* Location */}
                                            <div className={styles.formGroup}>
                                                <label className="label" htmlFor="location">Location / City</label>
                                                <input
                                                    id="location"
                                                    type="text"
                                                    className="input"
                                                    value={form.location}
                                                    onChange={handleFormChange('location')}
                                                    placeholder="e.g. Bengaluru, Karnataka"
                                                />
                                            </div>

                                            {/* Skin type */}
                                            <div className={`${styles.formGroupFull} ${styles.formGroup}`}>
                                                <label className="label" htmlFor="skinType">Skin Type</label>
                                                <select
                                                    id="skinType"
                                                    className={styles.select}
                                                    value={form.skinType}
                                                    onChange={handleFormChange('skinType')}
                                                >
                                                    <option value="Normal">Normal</option>
                                                    <option value="Oily">Oily</option>
                                                    <option value="Dry">Dry</option>
                                                    <option value="Combination">Combination</option>
                                                    <option value="Sensitive">Sensitive</option>
                                                </select>
                                            </div>

                                            {/* Save */}
                                            <div className={`${styles.formGroupFull} ${styles.formActions}`}>
                                                {formSuccess && (
                                                    <span style={{ color: 'var(--color-accent)', fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>
                                                        ✓ Changes saved
                                                    </span>
                                                )}
                                                <button type="submit" className="btn btn-primary" disabled={formSaving}>
                                                    {formSaving ? 'Saving…' : 'Save Changes'}
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </RevealSection>

                        {/* ══════════════ SECTION 7 — NOTIFICATION PREFERENCES ══════════════ */}
                        <RevealSection>
                            <div className={styles.sectionBlock} style={{ marginBottom: 'var(--space-8)' }}>
                                <h2 className={styles.sectionTitle}>Notification Preferences</h2>
                                <div className="card">
                                    <div className={styles.notifList}>
                                        {/* Appointment Reminders */}
                                        <div className={styles.notifItem}>
                                            <div className={styles.notifText}>
                                                <span className={styles.notifTitle}>Appointment Reminders</span>
                                                <p className={styles.notifDesc}>
                                                    Receive reminders 24 hours and 1 hour before your scheduled appointments.
                                                </p>
                                            </div>
                                            <label className={styles.toggle} aria-label="Appointment reminders toggle">
                                                <input
                                                    type="checkbox"
                                                    checked={notifs.appointmentReminders}
                                                    onChange={() => toggleNotif('appointmentReminders')}
                                                />
                                                <span className={styles.toggleSlider} />
                                            </label>
                                        </div>

                                        {/* Scan Alerts */}
                                        <div className={styles.notifItem}>
                                            <div className={styles.notifText}>
                                                <span className={styles.notifTitle}>Scan Ready Alerts</span>
                                                <p className={styles.notifDesc}>
                                                    Get notified when your scan analysis is complete and results are ready to view.
                                                </p>
                                            </div>
                                            <label className={styles.toggle} aria-label="Scan alerts toggle">
                                                <input
                                                    type="checkbox"
                                                    checked={notifs.scanAlerts}
                                                    onChange={() => toggleNotif('scanAlerts')}
                                                />
                                                <span className={styles.toggleSlider} />
                                            </label>
                                        </div>

                                        {/* Product Announcements */}
                                        <div className={styles.notifItem}>
                                            <div className={styles.notifText}>
                                                <span className={styles.notifTitle}>NIVARA Product Announcements</span>
                                                <p className={styles.notifDesc}>
                                                    Stay updated on new features, device launches, and platform improvements.
                                                </p>
                                            </div>
                                            <label className={styles.toggle} aria-label="Product announcements toggle">
                                                <input
                                                    type="checkbox"
                                                    checked={notifs.productAnnouncements}
                                                    onChange={() => toggleNotif('productAnnouncements')}
                                                />
                                                <span className={styles.toggleSlider} />
                                            </label>
                                        </div>

                                        {/* Doctor Responses */}
                                        <div className={styles.notifItem}>
                                            <div className={styles.notifText}>
                                                <span className={styles.notifTitle}>Doctor Response Notifications</span>
                                                <p className={styles.notifDesc}>
                                                    Be notified when a doctor accepts your appointment request or sends a message.
                                                </p>
                                            </div>
                                            <label className={styles.toggle} aria-label="Doctor responses toggle">
                                                <input
                                                    type="checkbox"
                                                    checked={notifs.doctorResponses}
                                                    onChange={() => toggleNotif('doctorResponses')}
                                                />
                                                <span className={styles.toggleSlider} />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </RevealSection>

                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
