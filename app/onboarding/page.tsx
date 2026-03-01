'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import styles from './onboarding.module.css';

/* ══════════════════════════════════════════════
   TYPES
   ══════════════════════════════════════════════ */
interface FormData {
    phone: string;
    dateOfBirth: string;
    gender: string;
    location: string;
    skinType: string;
    profilePhoto: string;
}

/* ══════════════════════════════════════════════
   HELPERS
   ══════════════════════════════════════════════ */
function getInitials(name: string): string {
    const parts = name.trim().split(' ').filter(Boolean);
    if (parts.length === 0) return '?';
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function isAtLeast13(dob: string): boolean {
    if (!dob) return false;
    const birth = new Date(dob);
    const now = new Date();
    const age = now.getFullYear() - birth.getFullYear()
        - (now < new Date(now.getFullYear(), birth.getMonth(), birth.getDate()) ? 1 : 0);
    return age >= 13;
}

/* Skin type tile data */
const SKIN_TYPES = [
    { value: 'Normal', emoji: '✨', label: 'Normal', desc: 'Balanced, not too oily or dry' },
    { value: 'Oily', emoji: '💦', label: 'Oily', desc: 'Shiny, enlarged pores' },
    { value: 'Dry', emoji: '💧', label: 'Dry', desc: 'Tight, flaky, rough texture' },
    { value: 'Combination', emoji: '🌗', label: 'Combination', desc: 'Oily T-zone, dry cheeks' },
    { value: 'Sensitive', emoji: '🌿', label: 'Sensitive', desc: 'Easily irritated, reacts quickly' },
    { value: 'Not Sure', emoji: '🔍', label: 'Not Sure', desc: "I'm not sure yet" },
];

const GENDER_OPTIONS = ['Male', 'Female', 'Non-binary', 'Prefer not to say'];

/* ══════════════════════════════════════════════
   PROGRESS DOTS
   ══════════════════════════════════════════════ */
function ProgressDots({ step }: { step: number }) {
    return (
        <div className={styles.progressDots}>
            {[1, 2, 3, 4, 5].map((n) => (
                <div
                    key={n}
                    className={`${styles.dot} ${n <= step ? styles.dotFilled : ''}`}
                />
            ))}
        </div>
    );
}

/* ══════════════════════════════════════════════
   BACK ARROW
   ══════════════════════════════════════════════ */
function BackArrow({ onClick }: { onClick: () => void }) {
    return (
        <div style={{ display: 'block' }}>
            <button className={styles.backArrow} onClick={onClick} type="button" aria-label="Go back">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6" />
                </svg>
                Back
            </button>
        </div>
    );
}

/* ══════════════════════════════════════════════
   MAIN PAGE
   ══════════════════════════════════════════════ */
export default function OnboardingPage() {
    const { user, refreshProfile } = useAuth();
    const router = useRouter();
    const photoInputRef = useRef<HTMLInputElement>(null);

    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<FormData>({
        phone: '',
        dateOfBirth: '',
        gender: '',
        location: '',
        skinType: '',
        profilePhoto: '',
    });

    /* Step 2 validation errors */
    const [step2Errors, setStep2Errors] = useState({ phone: '', dob: '', gender: '' });

    /* Submission */
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');

    /* Derive first name */
    const [firstName, setFirstName] = useState('');
    useEffect(() => {
        if (user?.displayName) {
            setFirstName(user.displayName.split(' ')[0]);
        }
    }, [user]);

    const update = (key: keyof FormData, value: string) =>
        setFormData((prev) => ({ ...prev, [key]: value }));

    /* ── handleComplete ── */
    const handleComplete = async () => {
        if (!user) return;
        setSubmitting(true);
        setSubmitError('');
        try {
            await updateDoc(doc(db, 'users', user.uid), {
                phone: formData.phone,
                dateOfBirth: formData.dateOfBirth,
                gender: formData.gender,
                location: formData.location,
                skinType: formData.skinType || null,
                profilePhoto: formData.profilePhoto || null,
                onboardingComplete: true,
                updatedAt: serverTimestamp(),
            });
            // Immediately refresh needsOnboarding in context so guard doesn't redirect back
            await refreshProfile();
            // Fire welcome email — non-blocking, never throws to user
            if (user.email) {
                fetch('/api/email/welcome', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ to: user.email, firstName: firstName || 'there' }),
                }).catch(console.error);
            }
            router.push('/profile');
        } catch (e) {
            console.error(e);
            setSubmitError('Something went wrong. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    /* ── Step 2 "Continue" validation ── */
    const handleStep2Continue = () => {
        const errs = { phone: '', dob: '', gender: '' };
        let valid = true;
        if (!formData.phone.trim()) { errs.phone = 'Phone number is required.'; valid = false; }
        if (!formData.dateOfBirth) { errs.dob = 'Date of birth is required.'; valid = false; }
        else if (!isAtLeast13(formData.dateOfBirth)) { errs.dob = 'You must be at least 13 to use NIVARA.'; valid = false; }
        if (!formData.gender) { errs.gender = 'Please select a gender option.'; valid = false; }
        setStep2Errors(errs);
        if (valid) setStep(3);
    };

    /* ── Step 2 disabled check ── */
    const step2Ready = formData.phone.trim() !== '' && formData.dateOfBirth !== '' && formData.gender !== '';

    /* ── Photo upload ── */
    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            const dataUrl = ev.target?.result as string;
            update('profilePhoto', dataUrl);
        };
        reader.readAsDataURL(file);
    };

    /* ══════════════════════════════════════════
       RENDER
       ══════════════════════════════════════════ */
    return (
        <div className={styles.onboardingPage}>
            <div className={styles.card}>
                <ProgressDots step={step} />

                {/* ─── STEP 1 — WELCOME ─── */}
                {step === 1 && (
                    <div key={1} className={styles.stepContent}>
                        <h1 className={styles.welcomeHeading}>
                            Welcome to NIVARA{firstName ? `, ${firstName}` : ''}.
                        </h1>
                        <p className={styles.subtext}>
                            Let&apos;s complete your profile. It takes less than a minute.
                        </p>
                        <button
                            className={styles.btnGold}
                            onClick={() => setStep(2)}
                            type="button"
                        >
                            Get Started →
                        </button>
                    </div>
                )}

                {/* ─── STEP 2 — PERSONAL DETAILS ─── */}
                {step === 2 && (
                    <div key={2} className={styles.stepContent}>
                        <BackArrow onClick={() => setStep(1)} />
                        <h2 className={styles.heading}>A little about you.</h2>

                        {/* Phone */}
                        <div className={styles.formGroup}>
                            <label className={styles.label} htmlFor="phone">Phone Number</label>
                            <input
                                id="phone"
                                type="tel"
                                className={styles.input}
                                placeholder="+91 XXXXX XXXXX"
                                value={formData.phone}
                                onChange={(e) => update('phone', e.target.value)}
                            />
                            {step2Errors.phone && <p className={styles.inlineError}>{step2Errors.phone}</p>}
                        </div>

                        {/* Date of Birth */}
                        <div className={styles.formGroup}>
                            <label className={styles.label} htmlFor="dob">Date of Birth</label>
                            <input
                                id="dob"
                                type="date"
                                className={styles.input}
                                value={formData.dateOfBirth}
                                onChange={(e) => update('dateOfBirth', e.target.value)}
                                max={new Date().toISOString().split('T')[0]}
                            />
                            {step2Errors.dob && <p className={styles.inlineError}>{step2Errors.dob}</p>}
                        </div>

                        {/* Gender tiles */}
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Gender</label>
                            <div className={styles.tileGrid2}>
                                {GENDER_OPTIONS.map((g) => (
                                    <button
                                        key={g}
                                        type="button"
                                        className={`${styles.tile} ${formData.gender === g ? styles.tileSelected : ''}`}
                                        onClick={() => update('gender', g)}
                                    >
                                        <span className={styles.tileLabel}>{g}</span>
                                    </button>
                                ))}
                            </div>
                            {step2Errors.gender && <p className={styles.inlineError}>{step2Errors.gender}</p>}
                        </div>

                        <button
                            type="button"
                            className={styles.btnGold}
                            disabled={!step2Ready}
                            onClick={handleStep2Continue}
                        >
                            Continue →
                        </button>
                    </div>
                )}

                {/* ─── STEP 3 — LOCATION ─── */}
                {step === 3 && (
                    <div key={3} className={styles.stepContent}>
                        <BackArrow onClick={() => setStep(2)} />
                        <h2 className={styles.heading}>Where are you based?</h2>
                        <p className={styles.subtext}>
                            So we can show you nearby kiosks and dermatologists.
                        </p>

                        <div className={styles.formGroup}>
                            <label className={styles.label} htmlFor="location">City / Location</label>
                            <input
                                id="location"
                                type="text"
                                className={styles.input}
                                placeholder="e.g. Bengaluru, Karnataka"
                                value={formData.location}
                                onChange={(e) => update('location', e.target.value)}
                            />
                        </div>

                        <button
                            type="button"
                            className={styles.btnGold}
                            disabled={!formData.location.trim()}
                            onClick={() => setStep(4)}
                        >
                            Continue →
                        </button>
                    </div>
                )}

                {/* ─── STEP 4 — SKIN TYPE ─── */}
                {step === 4 && (
                    <div key={4} className={styles.stepContent}>
                        <BackArrow onClick={() => setStep(3)} />
                        <h2 className={styles.heading}>What&apos;s your skin type?</h2>
                        <p className={styles.subtext}>
                            Optional — helps us personalise your results.
                        </p>

                        <div className={styles.tileGrid3}>
                            {SKIN_TYPES.map((s) => (
                                <button
                                    key={s.value}
                                    type="button"
                                    className={`${styles.tile} ${formData.skinType === s.value ? styles.tileSelected : ''}`}
                                    onClick={() => update('skinType', s.value)}
                                >
                                    <span className={styles.tileEmoji}>{s.emoji}</span>
                                    <span className={styles.tileLabel}>{s.label}</span>
                                    <span className={styles.tileDesc}>{s.desc}</span>
                                </button>
                            ))}
                        </div>

                        <div className={styles.btnGroupStack}>
                            <button
                                type="button"
                                className={styles.btnGold}
                                onClick={() => setStep(5)}
                            >
                                Continue →
                            </button>
                            <button
                                type="button"
                                className={styles.skipLink}
                                onClick={() => { update('skinType', ''); setStep(5); }}
                            >
                                Skip for now
                            </button>
                        </div>
                    </div>
                )}

                {/* ─── STEP 5 — PROFILE PHOTO ─── */}
                {step === 5 && (
                    <div key={5} className={styles.stepContent}>
                        <BackArrow onClick={() => setStep(4)} />
                        <h2 className={styles.heading}>Add a profile photo.</h2>
                        <p className={styles.subtext}>
                            Optional — you can always add one from your profile.
                        </p>

                        <div className={styles.photoCircleWrap}>
                            <div className={styles.photoCircle}>
                                {formData.profilePhoto ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={formData.profilePhoto} alt="Profile preview" />
                                ) : (
                                    getInitials(firstName || user?.displayName || user?.email || 'N')
                                )}
                            </div>
                        </div>

                        {/* Hidden file input */}
                        <input
                            ref={photoInputRef}
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={handlePhotoChange}
                        />

                        <div className={styles.btnGroupStack}>
                            <button
                                type="button"
                                className={styles.btnOutline}
                                onClick={() => photoInputRef.current?.click()}
                                style={{ marginBottom: 10 }}
                            >
                                Upload Photo
                            </button>
                            <button
                                type="button"
                                className={styles.btnGold}
                                disabled={submitting}
                                onClick={handleComplete}
                            >
                                {submitting ? 'Setting up your profile…' : 'Complete Setup →'}
                            </button>
                            <button
                                type="button"
                                className={styles.skipLink}
                                disabled={submitting}
                                onClick={handleComplete}
                            >
                                Skip for now
                            </button>
                            {submitError && (
                                <p className={styles.submitError}>{submitError}</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
