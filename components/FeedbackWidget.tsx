'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import FeedbackForm from './FeedbackForm';
import styles from './feedback-widget.module.css';

const HIDDEN_PATHS = ['/login', '/signup', '/onboarding'];

export default function FeedbackWidget() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
    const [done, setDone] = useState(false);

    // Hide on auth/admin pages
    const hidden =
        HIDDEN_PATHS.includes(pathname) ||
        pathname.startsWith('/admin');

    if (hidden) return null;

    const handleComplete = () => {
        setDone(true);
        setTimeout(() => {
            setDone(false);
            setOpen(false);
        }, 3000);
    };

    return (
        <>
            {/* Floating pill button */}
            <button
                className={styles.feedbackBtn}
                onClick={() => { setOpen(true); setDone(false); }}
                aria-label="Share feedback"
            >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                </svg>
                Feedback
            </button>

            {/* Modal */}
            {open && (
                <div className={styles.overlay} onClick={e => { if (e.target === e.currentTarget) setOpen(false); }}>
                    <div className={styles.modal} role="dialog" aria-modal="true">
                        <button className={styles.closeBtn} onClick={() => setOpen(false)} aria-label="Close">✕</button>

                        {done ? (
                            <div className={styles.successMsg}>
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
                                    stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10" />
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                                <p className={styles.successTitle}>Thank you — your feedback shapes NIVARA.</p>
                            </div>
                        ) : (
                            <FeedbackForm source="widget" onComplete={handleComplete} />
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
