'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import styles from './demo.module.css';
import { useAuth } from '@/context/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { saveScan, getUserProfile, getLatestScan, getSeverity } from '@/lib/firestore';
import type { ScanRecord } from '@/types/scan';

/* ══════════════════════════════════════════════
   TYPES & CONSTANTS
   ══════════════════════════════════════════════ */

interface Prediction {
    condition: string;
    confidence: number;
}

const API_ENDPOINT = 'https://nivara-api.onrender.com/predict';


const processingSteps = [
    'Preprocessing image...',
    'Detecting skin region...',
    'Analysing texture and pigmentation...',
    'Running differential diagnosis...',
    'Generating report...',
];

const guidelines = [
    {
        text: 'Good natural or indoor lighting — no flash',
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
        ),
    },
    {
        text: 'Hold camera 10–15 cm from the skin',
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="12" cy="12" r="4" />
            </svg>
        ),
    },
    {
        text: 'Keep the area in sharp focus',
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
            </svg>
        ),
    },
    {
        text: 'Avoid filters or edited images',
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
        ),
    },
    {
        text: 'Clean, bare skin — remove cream or makeup',
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
            </svg>
        ),
    },
];

/* ══════════════════════════════════════════════
   HELPERS
   ══════════════════════════════════════════════ */

type DemoState = 'idle' | 'processing' | 'finalizing' | 'result' | 'error' | 'used' | 'gate';

function getSevClass(sev: string) {
    if (sev === 'Low') return styles.sevLow;
    if (sev === 'High') return styles.sevHigh;
    return styles.sevModerate;
}
function getDotClass(sev: string) {
    if (sev === 'Low') return styles.dotLow;
    if (sev === 'High') return styles.dotHigh;
    return styles.dotMod;
}

/* ── RevealSection ── */
function RevealSection({ children, className }: { children: React.ReactNode; className?: string }) {
    const ref = useRef<HTMLDivElement>(null);
    const visible = useIntersectionObserver(ref as React.RefObject<Element | null>, { threshold: 0.07 });
    return (
        <div ref={ref} className={`reveal${visible ? ' active' : ''}${className ? ` ${className}` : ''}`}>
            {children}
        </div>
    );
}

/* ══════════════════════════════════════════════
   MAIN PAGE
   ══════════════════════════════════════════════ */
export default function DemoPage() {
    const { user, loading: authLoading } = useAuth();

    const [demoState, setDemoState] = useState<DemoState>('idle');
    const [prevScan, setPrevScan] = useState<ScanRecord | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [selectedFileName, setSelectedFileName] = useState<string>('');
    const [isDragging, setIsDragging] = useState(false);
    const [processingStep, setProcessingStep] = useState(0);
    const [progress, setProgress] = useState(0);

    const uploadInputRef = useRef<HTMLInputElement>(null);
    const cameraInputRef = useRef<HTMLInputElement>(null);
    const selectedFileRef = useRef<File | null>(null);

    /* ── API state ── */
    const [apiPredictions, setApiPredictions] = useState<Prediction[] | null>(null);
    const [apiError, setApiError] = useState<string | null>(null);
    // Ref so the animation interval can read latest value without stale closure
    const apiDoneRef = useRef(false);
    const exhaustedEmailSentRef = useRef(false);

    /* ── Determine real gate/idle/used state on auth load ── */
    useEffect(() => {
        if (authLoading) return;
        if (!user) {
            setDemoState('gate');
            return;
        }
        // User is logged in — check if they already used the demo
        (async () => {
            try {
                const profile = await getUserProfile(user.uid);
                const demoUsed = !!(profile as { demoScanUsed?: boolean } | null)?.demoScanUsed;
                if (demoUsed) {
                    // Load previous scan for display in used-state card
                    try {
                        const raw = localStorage.getItem('nivara_last_scan');
                        if (raw) {
                            setPrevScan(JSON.parse(raw) as ScanRecord);
                        } else {
                            const latest = await getLatestScan(user.uid);
                            setPrevScan(latest);
                        }
                    } catch { /* ignore */ }
                    setDemoState('used');
                    // Fire scan-exhausted email once per session
                    if (user.email && !exhaustedEmailSentRef.current) {
                        exhaustedEmailSentRef.current = true;
                        const fn = (profile as { fullName?: string } | null)?.fullName?.split(' ')[0] || 'there';
                        fetch('/api/email/scan-exhausted', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ to: user.email, firstName: fn }),
                        }).catch(console.error);
                    }
                } else {
                    setDemoState('idle');
                }
            } catch {
                setDemoState('idle');
            }
        })();
    }, [user, authLoading]);

    /* ── Processing animation sequence ── */
    useEffect(() => {
        if (demoState !== 'processing') return;

        const delays = [500, 1500, 2500, 3500, 4500];
        const timers = delays.map((delay, i) =>
            setTimeout(() => setProcessingStep(i), delay)
        );

        const interval = setInterval(() => {
            setProgress((p) => {
                if (p >= 100) {
                    clearInterval(interval);
                    // If the API has already returned, go straight to result/error.
                    // Otherwise hold at 'finalizing' — the API fetch will advance state.
                    setTimeout(() => {
                        if (apiDoneRef.current) {
                            setDemoState(apiError ? 'error' : 'result');
                        } else {
                            setDemoState('finalizing');
                        }
                    }, 500);
                    return 100;
                }
                return p + 2;
            });
        }, 100);

        return () => {
            timers.forEach(clearTimeout);
            clearInterval(interval);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [demoState]);

    /* ── Image selection handler — also keeps raw File for API ── */
    const handleImageFile = useCallback((file: File) => {
        const url = URL.createObjectURL(file);
        setSelectedImage(url);
        setSelectedFileName(file.name);
        selectedFileRef.current = file;
    }, []);

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleImageFile(file);
    };

    const clearImage = () => {
        setSelectedImage(null);
        setSelectedFileName('');
        selectedFileRef.current = null;
        if (uploadInputRef.current) uploadInputRef.current.value = '';
        if (cameraInputRef.current) cameraInputRef.current.value = '';
    };

    const startAnalysis = () => {
        // Reset API state
        setApiPredictions(null);
        setApiError(null);
        apiDoneRef.current = false;

        setProcessingStep(0);
        setProgress(0);
        setDemoState('processing');

        // Fire API request in parallel with animation
        const file = selectedFileRef.current;
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file);

        fetch(API_ENDPOINT, { method: 'POST', body: formData })
            .then(async res => {
                if (!res.ok) throw new Error(`Server error: ${res.status}`);
                const data = await res.json();
                const preds: Prediction[] = data.predictions ?? [];
                setApiPredictions(preds);
                apiDoneRef.current = true;
                // Persist to localStorage for the results page
                if (preds.length > 0) {
                    try {
                        const scanRecord: ScanRecord = {
                            scanId: 'NVR-' + Date.now(),
                            date: new Date().toISOString(),
                            source: 'Demo',
                            predictions: preds,
                            severity: getSeverity(preds[0].condition),
                            topCondition: preds[0].condition,
                            topConfidence: preds[0].confidence,
                            createdAt: new Date().toISOString(),
                        };
                        localStorage.setItem('nivara_last_scan', JSON.stringify(scanRecord));
                        if (user) {
                            await saveScan(user.uid, scanRecord);
                            await updateDoc(doc(db, 'users', user.uid), {
                                demoScanUsed: true,
                            });
                            // Fire scan-report email — non-blocking
                            if (user.email) {
                                const fn = (await getUserProfile(user.uid) as { fullName?: string } | null)?.fullName?.split(' ')[0] || 'there';
                                fetch('/api/email/scan-report', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                        to: user.email,
                                        firstName: fn,
                                        topCondition: scanRecord.topCondition,
                                        confidence: scanRecord.topConfidence,
                                        severity: scanRecord.severity,
                                        scanId: scanRecord.scanId,
                                        otherConditions: scanRecord.predictions.slice(1, 4),
                                    }),
                                }).catch(console.error);
                            }
                        }
                    } catch { /* localStorage unavailable */ }
                }
                // If the animation already finished and we're in 'finalizing', advance now
                setDemoState(prev => prev === 'finalizing' ? 'result' : prev);
            })
            .catch((err: Error) => {
                setApiError(err.message || 'Unexpected error');
                apiDoneRef.current = true;
                setDemoState(prev => prev === 'finalizing' ? 'error' : prev);
            });
    };

    /* ── Drag and drop ── */
    const onDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
    const onDragLeave = () => setIsDragging(false);
    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file?.type.startsWith('image/')) handleImageFile(file);
    };

    /* ══════════════════════════════════════════════
       RENDER
       ══════════════════════════════════════════════ */
    return (
        <main className={styles.demoPage}>

            {/* ════════════════════════════════════
          GATE STATE — not logged in
          ════════════════════════════════════ */}
            {demoState === 'gate' && (
                <div className="container">
                    <div className={styles.gateWrap}>
                        <div className={styles.gateIcon}>
                            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                            </svg>
                        </div>
                        <span className="section-label">Demo Access</span>
                        <h1 className={styles.gateHeading}>Create a Free Account to Try the Demo</h1>
                        <p className={styles.gateDesc}>
                            Get one free AI-powered skin scan. Upload a photo of your concern and receive a differential diagnosis — no device required. No credit card, no commitment.
                        </p>
                        <div className={styles.gateBtns}>
                            <Link href="/signup" className="btn btn-primary btn-large">Sign Up Free</Link>
                            <Link href="/login" className="btn btn-outline btn-large">Log In</Link>
                        </div>
                    </div>
                </div>
            )}

            {/* ════════════════════════════════════
          USED STATE — demo already consumed
          ════════════════════════════════════ */}
            {demoState === 'used' && (
                <div className="container">
                    <div className={styles.usedWrap}>
                        <span className="section-label">Free Scan Used</span>
                        <h1 className={styles.usedHeading}>You've Already Used Your Free Demo Scan</h1>

                        {/* Previous scan summary */}
                        <div className="card" style={{ width: '100%', textAlign: 'left' }}>
                            <div className={styles.prevScanCard}>
                                <h3 style={{ fontFamily: 'var(--font-family-display)', fontSize: 'var(--font-size-xl)', marginBottom: 'var(--space-2)' }}>
                                    Previous Scan
                                </h3>
                                {prevScan ? (
                                    <div className={styles.prevScanRow}>
                                        <div>
                                            <p className={styles.prevScanLabel}>Date</p>
                                            <p className={styles.prevScanValue}>
                                                {new Date(prevScan.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                                            </p>
                                        </div>
                                        <div>
                                            <p className={styles.prevScanLabel}>Top Result</p>
                                            <p className={styles.prevScanValue}>{prevScan.topCondition}</p>
                                        </div>
                                        <div>
                                            <p className={styles.prevScanLabel}>Confidence</p>
                                            <p className={styles.prevScanValue}>{prevScan.topConfidence.toFixed(1)}%</p>
                                        </div>
                                        <div>
                                            <p className={styles.prevScanLabel}>Severity</p>
                                            <span className={`${styles.severityBadge} ${getSevClass(prevScan.severity)}`}>
                                                <span className={`${styles.severityDot} ${getDotClass(prevScan.severity)}`} />
                                                {prevScan.severity}
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-4)' }}>
                                        Scan details unavailable. Your results are saved in your account.
                                    </p>
                                )}
                                <Link href="/results" className="btn btn-primary" style={{ alignSelf: 'flex-start', marginTop: 'var(--space-2)' }}>
                                    View Your Report
                                </Link>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className={styles.wantMoreDivider}>
                            <div className={styles.wantMoreLine} />
                            <span className={styles.wantMoreText}>Want More Scans?</span>
                            <div className={styles.wantMoreLine} />
                        </div>

                        {/* Option cards */}
                        <div className={styles.usedOptionsGrid}>
                            <Link href="/profile" className={`card ${styles.optionCard}`} style={{ textDecoration: 'none' }}>
                                <div className={styles.optionIcon}>
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="3" width="18" height="18" rx="3" /><path d="M9 9h6M9 12h6M9 15h4" />
                                    </svg>
                                </div>
                                <span className={styles.optionTitle}>Link Your Device</span>
                                <p className={styles.optionDesc}>
                                    If you own a NIVARA device, link it to your account for unlimited scans from home.
                                </p>
                            </Link>

                            <Link href="/kiosks" className={`card ${styles.optionCard}`} style={{ textDecoration: 'none' }}>
                                <div className={styles.optionIcon}>
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                                    </svg>
                                </div>
                                <span className={styles.optionTitle}>Find a Kiosk Near You</span>
                                <p className={styles.optionDesc}>
                                    Visit a NIVARA kiosk for a full clinical-grade scan at your nearest partner location.
                                </p>
                            </Link>
                        </div>

                        <p className={styles.buyNote}>
                            Don&apos;t have a device yet?{' '}
                            <Link href="/buy" style={{ color: 'var(--color-accent)', textDecoration: 'none', fontWeight: 500 }}>
                                Buy the NIVARA Device →
                            </Link>
                        </p>
                    </div>
                </div>
            )}

            {/* ════════════════════════════════════
          IDLE STATE — hero + guidelines + upload
          ════════════════════════════════════ */}
            {demoState === 'idle' && (
                <>
                    {/* Hero */}
                    <section className={styles.hero}>
                        <div className="container">
                            <div className="slide-up">
                                <span className={styles.freeScanBadge}>Free Demo Scan · One Per Account</span>
                                <h1 className={styles.heroHeadline}>See What Your Skin Is Telling You</h1>
                                <p className={styles.heroSub}>
                                    Upload a photo of your skin concern and receive an AI-assisted differential diagnosis — no device required, no appointment needed.
                                </p>
                                <p className={styles.disclaimerLine}>This is a screening tool, not a medical diagnosis.</p>
                            </div>
                        </div>
                    </section>

                    {/* Guidelines */}
                    <RevealSection>
                        <div className="container">
                            <div className={styles.guidelinesRow} style={{ marginBottom: 'var(--space-10)' }}>
                                {guidelines.map((g, i) => (
                                    <div key={i} className={`card ${styles.guideCard}`}>
                                        <div className={styles.guideIcon}>{g.icon}</div>
                                        <p className={styles.guideText}>{g.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </RevealSection>

                    {/* Upload Zone */}
                    <RevealSection>
                        <div className="container">
                            <div className={styles.uploadSection}>
                                <div
                                    className={`${styles.dropZone}${isDragging ? ` ${styles.dropZoneDragging}` : ''}`}
                                    onDragOver={onDragOver}
                                    onDragLeave={onDragLeave}
                                    onDrop={onDrop}
                                >
                                    {selectedImage ? (
                                        /* ── Image preview ── */
                                        <div className={styles.imagePreview}>
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={selectedImage} alt="Selected skin photo" className={styles.previewImg} />
                                            <div className={styles.previewMeta}>
                                                <span className={styles.previewFileName}>{selectedFileName}</span>
                                                <button className={styles.clearBtn} onClick={clearImage}>Clear</button>
                                            </div>
                                        </div>
                                    ) : (
                                        /* ── Empty drop zone ── */
                                        <>
                                            <div className={styles.dropZoneIcon}>
                                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                                    <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" />
                                                    <polyline points="21 15 16 10 5 21" />
                                                </svg>
                                            </div>
                                            <p className={styles.dropZonePrompt}>
                                                Drag and drop your image here, or use the options below
                                            </p>
                                            <div className={styles.uploadBtns}>
                                                <button className="btn btn-outline" onClick={() => uploadInputRef.current?.click()}>
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                                                    </svg>
                                                    Upload a Photo
                                                </button>
                                                <button className="btn btn-outline" onClick={() => cameraInputRef.current?.click()}>
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" /><circle cx="12" cy="13" r="4" />
                                                    </svg>
                                                    Take a Photo
                                                </button>
                                            </div>
                                        </>
                                    )}

                                    {/* Hidden file inputs */}
                                    <input
                                        ref={uploadInputRef}
                                        type="file"
                                        accept="image/*"
                                        className={styles.fileInput}
                                        onChange={onFileChange}
                                    />
                                    <input
                                        ref={cameraInputRef}
                                        type="file"
                                        accept="image/*"
                                        capture="environment"
                                        className={styles.fileInput}
                                        onChange={onFileChange}
                                    />
                                </div>

                                {/* Analyse button */}
                                <button
                                    className="btn btn-primary btn-large"
                                    disabled={!selectedImage}
                                    onClick={startAnalysis}
                                    style={{ opacity: selectedImage ? 1 : 0.4, cursor: selectedImage ? 'pointer' : 'not-allowed' }}
                                >
                                    Analyse My Skin
                                </button>
                            </div>
                        </div>
                    </RevealSection>
                </>
            )}

            {/* ════════════════════════════════════
          PROCESSING STATE
          ════════════════════════════════════ */}
            {demoState === 'processing' && (
                <div className="container">
                    <div className={styles.processingWrap}>
                        {/* Scanned image with animated line */}
                        <div className={styles.processingImageWrap}>
                            {selectedImage && (
                                /* eslint-disable-next-line @next/next/no-img-element */
                                <img src={selectedImage} alt="Analysing" className={styles.processingImg} />
                            )}
                            <div className={styles.scanLine} />
                        </div>

                        {/* Analysis panel */}
                        <div className={`card ${styles.analysisPanel}`}>
                            <h2 className={styles.analysisPanelTitle}>Analysing Your Scan</h2>

                            <div className={styles.stepsList}>
                                {processingSteps.map((step, i) => {
                                    const isDone = i < processingStep;
                                    const isActive = i === processingStep;
                                    return (
                                        <div
                                            key={step}
                                            className={`${styles.stepItem}${isActive ? ` ${styles.stepItemActive}` : ''}`}
                                        >
                                            <span
                                                className={`${styles.stepDot}${isActive ? ` ${styles.stepDotActive}` : ''}${isDone ? ` ${styles.stepDotDone}` : ''}`}
                                            />
                                            {step}
                                        </div>
                                    );
                                })}
                            </div>

                            <div className={styles.progressWrap}>
                                <div className={styles.progressLabel}>
                                    <span>Processing</span>
                                    <span>{progress}%</span>
                                </div>
                                <div className={styles.progressTrack}>
                                    <div className={styles.progressFill} style={{ width: `${progress}%` }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* ════════════════════════════════════
          FINALIZING STATE — animation done, API still pending
          ════════════════════════════════════ */}
            {demoState === 'finalizing' && (
                <div className="container">
                    <div className={styles.processingWrap}>
                        <div className={styles.processingImageWrap}>
                            {selectedImage && (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={selectedImage} alt="Analysing" className={styles.processingImg} />
                            )}
                            <div className={styles.scanLine} />
                        </div>
                        <div className={`card ${styles.analysisPanel}`}>
                            <h2 className={styles.analysisPanelTitle}>Finalising Analysis…</h2>
                            <div className={styles.stepsList}>
                                {processingSteps.map((step) => (
                                    <div key={step} className={`${styles.stepItem}`}>
                                        <span className={`${styles.stepDot} ${styles.stepDotDone}`} />
                                        {step}
                                    </div>
                                ))}
                            </div>
                            <div className={styles.progressWrap}>
                                <div className={styles.progressLabel}>
                                    <span>Finalising</span>
                                    <span>100%</span>
                                </div>
                                <div className={styles.progressTrack}>
                                    <div className={styles.progressFill} style={{ width: '100%' }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {demoState === 'error' && (
                <div className="container">
                    <div className={styles.resultWrap} style={{ textAlign: 'center', gap: 'var(--space-6)' }}>
                        <div className={styles.checkmarkCircle} style={{ background: 'rgba(239,68,68,0.08)', border: '1.5px solid rgba(239,68,68,0.2)' }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </div>
                        <h2 style={{ fontFamily: 'var(--font-family-display)', fontSize: 'var(--font-size-2xl)', color: 'var(--color-text-primary)' }}>Analysis Failed</h2>
                        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                            {apiError ?? 'Something went wrong. Please try again.'}
                        </p>
                        <button
                            className="btn btn-primary btn-large"
                            onClick={() => { clearImage(); setDemoState('idle'); }}
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            )}

            {demoState === 'result' && (() => {
                const primary = apiPredictions?.[0];
                const secondary = apiPredictions?.slice(1) ?? [];
                const severity = primary ? getSeverity(primary.condition) : 'Low';
                const topConf = primary ? parseFloat(primary.confidence.toFixed(1)) : 0;
                const topName = primary?.condition ?? 'Unknown';
                return (
                    <div className="container">
                        <div className={styles.resultWrap}>
                            {/* Header */}
                            <div className={styles.resultHeader}>
                                <div className={styles.checkmarkCircle}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                </div>
                                <div className={styles.resultHeaderText}>
                                    <span className={styles.resultTitle}>Analysis Complete</span>
                                    <span className={styles.resultSubtitle}>Scan #NVR-2025-00424</span>
                                </div>
                            </div>

                            {/* Severity */}
                            <div>
                                <span className={`${styles.severityBadge} ${getSevClass(severity)}`}>
                                    <span className={`${styles.severityDot} ${getDotClass(severity)}`} />
                                    {severity} Severity
                                </span>
                            </div>

                            {/* Primary diagnosis */}
                            <div className="card">
                                <span style={{ fontSize: 'var(--font-size-xs)', textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--color-accent)', fontWeight: 500 }}>
                                    Primary Finding
                                </span>
                                <h2 className={styles.primaryCondition} style={{ marginTop: 'var(--space-3)' }}>
                                    {topName}
                                </h2>
                                <div className={styles.conditionMeta}>
                                    <span className={styles.confidenceTag}>{topConf}% confidence</span>
                                </div>
                            </div>

                            {/* Secondary conditions */}
                            {secondary.length > 0 && (
                                <div className="card">
                                    <h3 style={{ fontFamily: 'var(--font-family-display)', fontSize: 'var(--font-size-lg)', marginBottom: 'var(--space-4)' }}>
                                        Other Possibilities
                                    </h3>
                                    <div className={styles.secondaryConditions}>
                                        {secondary.map((p) => (
                                            <div key={p.condition} className={styles.secondaryItem}>
                                                <span className={styles.secondaryName}>{p.condition}</span>
                                                <span className={styles.secondaryConf}>{parseFloat(p.confidence.toFixed(1))}%</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Summary */}
                            <p className={styles.resultSummary}>
                                Your scan most strongly suggests <strong>{topName}</strong> ({topConf}% confidence).
                                View your full report for a complete breakdown, basic remedies, and next steps.
                            </p>

                            {/* CTAs */}
                            <div className={styles.resultCtAs}>
                                <Link href="/results" className="btn btn-primary btn-large">
                                    View Full Report
                                </Link>
                                <Link href="/doctors" className="btn btn-outline btn-large">
                                    Book a Dermatologist
                                </Link>
                            </div>

                            {/* Free scan note */}
                            <p className={styles.freeNote}>
                                This was your free demo scan. For unlimited scans,{' '}
                                <Link href="/profile" style={{ color: 'var(--color-accent)', textDecoration: 'none', fontWeight: 500 }}>
                                    link your NIVARA device
                                </Link>{' '}
                                or{' '}
                                <Link href="/kiosks" style={{ color: 'var(--color-accent)', textDecoration: 'none', fontWeight: 500 }}>
                                    visit a kiosk
                                </Link>
                                .
                            </p>
                        </div>
                    </div>
                );
            })()}


            <Footer />
        </main>
    );
}
