'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FeedbackForm from '@/components/FeedbackForm';
import styles from './page.module.css';

export default function FeedbackPage() {
    const router = useRouter();
    const [done, setDone] = useState(false);

    return (
        <main className={styles.feedbackPage}>
            <div className={styles.card}>
                {done ? (
                    <div className={`${styles.successWrap} slide-up`}>
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none"
                            stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                            style={{ marginBottom: '8px' }}>
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <h1 className={styles.successTitle}>Thank you for helping build NIVARA.</h1>
                        <p className={styles.successSub}>
                            Your feedback directly shapes what we build next.
                        </p>
                        <button className={styles.homeBtn} onClick={() => router.push('/')}>
                            Back to home
                        </button>
                    </div>
                ) : (
                    <FeedbackForm source="page" onComplete={() => setDone(true)} />
                )}
            </div>
        </main>
    );
}
