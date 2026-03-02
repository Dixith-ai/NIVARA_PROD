'use client';

import { useState } from 'react';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { getUserProfile } from '@/lib/firestore';
import styles from './FeedbackForm.module.css';

export interface FeedbackFormProps {
    source: 'widget' | 'page';
    onComplete: () => void;
}

interface Answers {
    q1: string; q2: string;
    q3: string; q4: string; q5: string;
    q6: string; q7: string; q7Detail: string;
    q8: string; q9: string; q10: string; q10Detail: string;
    q11: string; q12Score: string; q12Detail: string;
}

const BLANK: Answers = {
    q1: '', q2: '',
    q3: '', q4: '', q5: '',
    q6: '', q7: '', q7Detail: '',
    q8: '', q9: '', q10: '', q10Detail: '',
    q11: '', q12Score: '', q12Detail: '',
};

const STEP_TITLES = [
    'First impressions',
    'Getting started',
    'The scan',
    'The result',
    'Trust & next steps',
];

const TOTAL = 5;

export default function FeedbackForm({ source, onComplete }: FeedbackFormProps) {
    const { user } = useAuth();
    const [step, setStep] = useState(1);
    const [answers, setAnswers] = useState<Answers>(BLANK);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const set = (key: keyof Answers, val: string) =>
        setAnswers(a => ({ ...a, [key]: val }));

    const handleSubmit = async () => {
        setSubmitting(true);
        setError('');
        try {
            let profile = null;
            if (user?.uid) {
                profile = await getUserProfile(user.uid);
            }

            const payload = {
                q1: answers.q1 || null,
                q2: answers.q2 || null,
                q3: answers.q3 || null,
                q4: answers.q4 || null,
                q5: answers.q5 || null,
                q6: answers.q6 || null,
                q7: answers.q7 || null,
                q7_detail: answers.q7Detail || null,
                q8: answers.q8 || null,
                q9: answers.q9 || null,
                q10: answers.q10 || null,
                q10_detail: answers.q10Detail || null,
                q11: answers.q11 || null,
                q12_score: answers.q12Score ? Number(answers.q12Score) : null,
                q12_detail: answers.q12Detail || null,
                uid: user?.uid ?? null,
                userName: user?.displayName || profile?.fullName || null,
                userEmail: user?.email || null,
                source,
                completedAt: Timestamp.now(),
            };

            await addDoc(collection(db, 'feedback'), payload);

            // Fire admin notification — non-blocking
            fetch('/api/email/feedback-submitted', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...payload, completedAt: new Date().toISOString() }),
            }).catch(console.error);

            onComplete();
        } catch {
            setError('Something went wrong. Please try again.');
            setSubmitting(false);
        }
    };

    const progress = Math.round((step / TOTAL) * 100);

    const Opt = ({ field, val }: { field: keyof Answers; val: string }) => (
        <button
            type="button"
            className={`${styles.optBtn}${answers[field] === val ? ` ${styles.selected}` : ''}`}
            onClick={() => set(field, val)}
        >
            {val}
        </button>
    );

    return (
        <div className={styles.form}>

            {/* Progress bar */}
            <div className={styles.progressWrap}>
                <div className={styles.progressTrack}>
                    {/* width must be inline — it is dynamic */}
                    <div className={styles.progressFill} style={{ width: `${progress}%` }} />
                </div>
                <span className={styles.stepLabel}>Step {step} of {TOTAL} — {STEP_TITLES[step - 1]}</span>
            </div>

            {/* Back button */}
            {step > 1 && (
                <button type="button" className={styles.backBtn} onClick={() => setStep(s => s - 1)}>
                    ← Back
                </button>
            )}

            {/* ── STEP 1 — First impressions ── */}
            {step === 1 && (
                <>
                    <h3 className={styles.stepTitle}>First impressions</h3>

                    <div className={styles.question}>
                        <label className={styles.label}>
                            In one sentence — what did you think NIVARA does?
                        </label>
                        <textarea
                            className={styles.textarea}
                            rows={2}
                            placeholder="e.g. an app that analyses your skin..."
                            value={answers.q1}
                            onChange={e => set('q1', e.target.value)}
                        />
                    </div>

                    <div className={styles.question}>
                        <label className={styles.label}>
                            Did you almost leave when you saw you needed an account? What stopped you?
                        </label>
                        <textarea
                            className={styles.textarea}
                            rows={3}
                            value={answers.q2}
                            onChange={e => set('q2', e.target.value)}
                        />
                    </div>

                    <button type="button" className={styles.nextBtn} onClick={() => setStep(2)}>
                        Continue →
                    </button>
                </>
            )}

            {/* ── STEP 2 — Getting started ── */}
            {step === 2 && (
                <>
                    <h3 className={styles.stepTitle}>Getting started</h3>

                    <div className={styles.question}>
                        <label className={styles.label}>How easy was creating your account? Any friction?</label>
                        <textarea
                            className={styles.textarea}
                            rows={2}
                            value={answers.q3}
                            onChange={e => set('q3', e.target.value)}
                        />
                    </div>

                    <div className={styles.question}>
                        <label className={styles.label}>
                            Was there a question during onboarding you didn&apos;t want to answer? Which one?
                        </label>
                        <textarea
                            className={styles.textarea}
                            rows={2}
                            value={answers.q4}
                            onChange={e => set('q4', e.target.value)}
                        />
                    </div>

                    <div className={styles.question}>
                        <label className={styles.label}>5 steps before your scan — too long, or fine?</label>
                        <div className={styles.btnGroup}>
                            {['Too long', 'Fine', "Didn't notice"].map(o => (
                                <Opt key={o} field="q5" val={o} />
                            ))}
                        </div>
                    </div>

                    <button type="button" className={styles.nextBtn} onClick={() => setStep(3)}>
                        Continue →
                    </button>
                </>
            )}

            {/* ── STEP 3 — The scan ── */}
            {step === 3 && (
                <>
                    <h3 className={styles.stepTitle}>The scan</h3>

                    <div className={styles.question}>
                        <label className={styles.label}>Did you know what photo to take? What would have helped?</label>
                        <textarea
                            className={styles.textarea}
                            rows={3}
                            value={answers.q6}
                            onChange={e => set('q6', e.target.value)}
                        />
                    </div>

                    <div className={styles.question}>
                        <label className={styles.label}>
                            While your photo was being analysed — how did you feel?
                        </label>
                        <div className={styles.btnGroup}>
                            {['Confident', 'Nervous', 'Bored', 'Other'].map(o => (
                                <Opt key={o} field="q7" val={o} />
                            ))}
                        </div>
                        {answers.q7 === 'Other' && (
                            <input
                                type="text"
                                className={`${styles.textInput} ${styles.textareaSpaced}`}
                                placeholder="Tell us more"
                                value={answers.q7Detail}
                                onChange={e => set('q7Detail', e.target.value)}
                            />
                        )}
                    </div>

                    <button type="button" className={styles.nextBtn} onClick={() => setStep(4)}>
                        Continue →
                    </button>
                </>
            )}

            {/* ── STEP 4 — The result ── */}
            {step === 4 && (
                <>
                    <h3 className={styles.stepTitle}>The result</h3>

                    <div className={styles.question}>
                        <label className={styles.label}>What was the first emotion when you saw your result?</label>
                        <textarea
                            className={styles.textarea}
                            rows={2}
                            placeholder="e.g. surprised, relieved, confused, scared..."
                            value={answers.q8}
                            onChange={e => set('q8', e.target.value)}
                        />
                    </div>

                    <div className={styles.question}>
                        <label className={styles.label}>
                            The result showed a confidence percentage. What did that mean to you?
                        </label>
                        <textarea
                            className={styles.textarea}
                            rows={2}
                            value={answers.q9}
                            onChange={e => set('q9', e.target.value)}
                        />
                    </div>

                    <div className={styles.question}>
                        <label className={styles.label}>After reading your report — did you understand your skin better?</label>
                        <div className={styles.btnGroup}>
                            {['Yes, clearly', 'Somewhat', 'Not really'].map(o => (
                                <Opt key={o} field="q10" val={o} />
                            ))}
                        </div>
                        {(answers.q10 === 'Somewhat' || answers.q10 === 'Not really') && (
                            <textarea
                                className={`${styles.textarea} ${styles.textareaSpaced}`}
                                rows={2}
                                placeholder="What was unclear?"
                                value={answers.q10Detail}
                                onChange={e => set('q10Detail', e.target.value)}
                            />
                        )}
                    </div>

                    <button type="button" className={styles.nextBtn} onClick={() => setStep(5)}>
                        Continue →
                    </button>
                </>
            )}

            {/* ── STEP 5 — Trust & next steps ── */}
            {step === 5 && (
                <>
                    <h3 className={styles.stepTitle}>Trust &amp; next steps</h3>

                    <div className={styles.question}>
                        <label className={styles.label}>What was the first thing you did after closing the results?</label>
                        <textarea
                            className={styles.textarea}
                            rows={2}
                            placeholder="e.g. googled the condition, called a doctor, told a friend..."
                            value={answers.q11}
                            onChange={e => set('q11', e.target.value)}
                        />
                    </div>

                    <div className={styles.question}>
                        <label className={styles.label}>
                            1 to 10 — how much do you trust this vs a real dermatologist? What would change that score?
                        </label>
                        <input
                            type="number"
                            className={styles.textInput}
                            min={1}
                            max={10}
                            placeholder="Score (1–10)"
                            value={answers.q12Score}
                            onChange={e => set('q12Score', e.target.value)}
                        />
                        <textarea
                            className={`${styles.textarea} ${styles.textareaSpaced}`}
                            rows={2}
                            placeholder="What would change that score?"
                            value={answers.q12Detail}
                            onChange={e => set('q12Detail', e.target.value)}
                        />
                    </div>

                    {error && <p className={styles.errorMsg}>{error}</p>}

                    <button
                        type="button"
                        className={styles.submitBtn}
                        onClick={handleSubmit}
                        disabled={submitting}
                    >
                        {submitting ? 'Submitting…' : 'Submit Feedback'}
                    </button>
                </>
            )}
        </div>
    );
}
