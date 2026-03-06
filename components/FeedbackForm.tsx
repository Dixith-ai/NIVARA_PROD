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
    // Step 1 — Account & Onboarding
    q1_signup: string;
    q1_detail: string;
    q2_onboarding: string;
    q2_detail: string;
    q3_length: string;
    // Step 2 — The Scan
    q4_photo: string;
    q4_detail: string;
    q5_feeling: string;
    q5_detail: string;
    q6_reaction: string;
    q6_detail: string;
    q7_confidence: string;
    q7_detail: string;
    q8_understood: string;
    q8_detail: string;
    // Step 3 — Doctor Booking
    q9_doctors: string;
    q9_detail: string;
    q10_booking: string;
    q10_detail: string;
    q11_credibility: string;
    q11_detail: string;
    q12_would_book: string;
    q12_detail: string;
    // Step 4 — Kiosk & General
    q13_kiosk: string;
    q13_detail: string;
    q14_description: string;
    q14_detail: string;
    q15_return: string;
    q15_detail: string;
    // Step 5 — Trust & Closing
    q16_trust_score: string;
    q16_detail: string;
    q17_fix: string;
    q17_detail: string;
    q18_recommend: string;
    q18_detail: string;
}

const BLANK: Answers = {
    q1_signup: '', q1_detail: '',
    q2_onboarding: '', q2_detail: '',
    q3_length: '',
    q4_photo: '', q4_detail: '',
    q5_feeling: '', q5_detail: '',
    q6_reaction: '', q6_detail: '',
    q7_confidence: '', q7_detail: '',
    q8_understood: '', q8_detail: '',
    q9_doctors: '', q9_detail: '',
    q10_booking: '', q10_detail: '',
    q11_credibility: '', q11_detail: '',
    q12_would_book: '', q12_detail: '',
    q13_kiosk: '', q13_detail: '',
    q14_description: '', q14_detail: '',
    q15_return: '', q15_detail: '',
    q16_trust_score: '5', q16_detail: '',
    q17_fix: '', q17_detail: '',
    q18_recommend: '', q18_detail: '',
};

const STEP_TITLES = [
    'Account & Onboarding',
    'The Scan',
    'Doctor Booking',
    'Kiosk & General',
    'Trust & Closing',
];

const TOTAL = 5;

/** Per-step validation: each entry has an option field and an optional detail/textarea field.
 *  A question counts as answered if EITHER the option is selected OR the textbox has text.
 *  Q3 has no detail field — option selection is required. */
interface QuestionCheck {
    option: keyof Answers;
    detail?: keyof Answers;
}
const CHECKS_BY_STEP: Record<number, QuestionCheck[]> = {
    1: [
        { option: 'q1_signup', detail: 'q1_detail' },
        { option: 'q2_onboarding', detail: 'q2_detail' },
        { option: 'q3_length' },                          // no textbox
    ],
    2: [
        { option: 'q4_photo', detail: 'q4_detail' },
        { option: 'q5_feeling', detail: 'q5_detail' },
        { option: 'q6_reaction', detail: 'q6_detail' },
        { option: 'q7_confidence', detail: 'q7_detail' },
        { option: 'q8_understood', detail: 'q8_detail' },
    ],
    3: [
        { option: 'q9_doctors', detail: 'q9_detail' },
        { option: 'q10_booking', detail: 'q10_detail' },
        { option: 'q11_credibility', detail: 'q11_detail' },
        { option: 'q12_would_book', detail: 'q12_detail' },
    ],
    4: [
        { option: 'q13_kiosk', detail: 'q13_detail' },
        { option: 'q14_description', detail: 'q14_detail' },
        { option: 'q15_return', detail: 'q15_detail' },
    ],
    // Step 5 handled separately (q16 uses q16Touched; q17/q18 use OR logic inline)
};

export default function FeedbackForm({ source, onComplete }: FeedbackFormProps) {
    const { user } = useAuth();
    const [step, setStep] = useState(1);
    const [answers, setAnswers] = useState<Answers>(BLANK);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    /** Flips true when user clicks Continue/Submit with missing answers */
    const [attempted, setAttempted] = useState(false);
    /** True only after user has actively dragged/changed the Q16 slider */
    const [q16Touched, setQ16Touched] = useState(false);

    const set = (key: keyof Answers, val: string) =>
        setAnswers(a => ({ ...a, [key]: val }));

    /** Returns true if all questions on the given step are answered.
     *  A question with an option+detail pair is answered if EITHER has content.
     *  Q3 (option only) and Q16 (slider/touched) are handled specially. */
    const stepIsValid = (s: number): boolean => {
        if (s === 5) {
            return q16Touched &&
                (answers.q17_fix.trim() !== '' || answers.q17_detail.trim() !== '') &&
                (answers.q18_recommend.trim() !== '' || answers.q18_detail.trim() !== '');
        }
        return CHECKS_BY_STEP[s].every(({ option, detail }) =>
            answers[option].trim() !== '' ||
            (detail ? answers[detail].trim() !== '' : false)
        );
    };

    const handleContinue = (next: number) => {
        if (!stepIsValid(step)) {
            setAttempted(true);
            return;
        }
        setAttempted(false);
        setStep(next);
    };

    const handleSubmit = async () => {
        if (!stepIsValid(5)) {
            setAttempted(true);
            return;
        }
        setSubmitting(true);
        setError('');
        try {
            let profile = null;
            if (user?.uid) {
                profile = await getUserProfile(user.uid);
            }

            const payload = {
                q1_signup: answers.q1_signup || null,
                q1_detail: answers.q1_detail || null,
                q2_onboarding: answers.q2_onboarding || null,
                q2_detail: answers.q2_detail || null,
                q3_length: answers.q3_length || null,
                q4_photo: answers.q4_photo || null,
                q4_detail: answers.q4_detail || null,
                q5_feeling: answers.q5_feeling || null,
                q5_detail: answers.q5_detail || null,
                q6_reaction: answers.q6_reaction || null,
                q6_detail: answers.q6_detail || null,
                q7_confidence: answers.q7_confidence || null,
                q7_detail: answers.q7_detail || null,
                q8_understood: answers.q8_understood || null,
                q8_detail: answers.q8_detail || null,
                q9_doctors: answers.q9_doctors || null,
                q9_detail: answers.q9_detail || null,
                q10_booking: answers.q10_booking || null,
                q10_detail: answers.q10_detail || null,
                q11_credibility: answers.q11_credibility || null,
                q11_detail: answers.q11_detail || null,
                q12_would_book: answers.q12_would_book || null,
                q12_detail: answers.q12_detail || null,
                q13_kiosk: answers.q13_kiosk || null,
                q13_detail: answers.q13_detail || null,
                q14_description: answers.q14_description || null,
                q14_detail: answers.q14_detail || null,
                q15_return: answers.q15_return || null,
                q15_detail: answers.q15_detail || null,
                q16_trust_score: answers.q16_trust_score ? Number(answers.q16_trust_score) : null,
                q16_detail: answers.q16_detail || null,
                q17_fix: answers.q17_fix || null,
                q17_detail: answers.q17_detail || null,
                q18_recommend: answers.q18_recommend || null,
                q18_detail: answers.q18_detail || null,
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

    /** Shows validation hint for a question with an option and optional detail field.
     *  Hint shows only after an attempted advance AND the question is unanswered
     *  (i.e. BOTH the option is empty AND the textbox is empty). */
    const showHint = (option: keyof Answers, detail?: keyof Answers): boolean => {
        if (!attempted) return false;
        const isAnswered = answers[option].trim() !== '' ||
            (detail ? answers[detail].trim() !== '' : false);
        return !isAnswered;
    };

    /** Single-select option button */
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
                <button type="button" className={styles.backBtn} onClick={() => { setAttempted(false); setStep(s => s - 1); }}>
                    ← Back
                </button>
            )}

            {/* ── STEP 1 — Account & Onboarding ── */}
            {step === 1 && (
                <>
                    <h3 className={styles.stepTitle}>Account &amp; Onboarding</h3>

                    {/* Q1 */}
                    <div className={styles.question}>
                        <label className={styles.label}>
                            How smooth was signing up and creating your account?
                        </label>
                        <div className={styles.btnGroup}>
                            {['Very smooth', 'Had some friction', 'Confusing', 'Gave up and came back'].map(o => (
                                <Opt key={o} field="q1_signup" val={o} />
                            ))}
                        </div>
                        {showHint('q1_signup', 'q1_detail') && <span className={styles.validationHint}>Please select an option to continue</span>}
                        <textarea
                            className={styles.textarea}
                            rows={2}
                            placeholder="Tell us more..."
                            value={answers.q1_detail}
                            onChange={e => set('q1_detail', e.target.value)}
                        />
                    </div>

                    {/* Q2 */}
                    <div className={styles.question}>
                        <label className={styles.label}>
                            Was there any step in onboarding that felt unnecessary or invasive?
                        </label>
                        <div className={styles.btnGroup}>
                            {['Phone number', 'Date of birth', 'Skin type', 'Profile photo', 'None of them'].map(o => (
                                <Opt key={o} field="q2_onboarding" val={o} />
                            ))}
                        </div>
                        {showHint('q2_onboarding', 'q2_detail') && <span className={styles.validationHint}>Please select an option to continue</span>}
                        <textarea
                            className={styles.textarea}
                            rows={2}
                            placeholder="Anything else?"
                            value={answers.q2_detail}
                            onChange={e => set('q2_detail', e.target.value)}
                        />
                    </div>

                    {/* Q3 */}
                    <div className={styles.question}>
                        <label className={styles.label}>
                            5 steps before reaching the scan — what did you think?
                        </label>
                        <div className={styles.btnGroup}>
                            {['Too long', 'Fine', "Didn't notice", 'Should be shorter'].map(o => (
                                <Opt key={o} field="q3_length" val={o} />
                            ))}
                        </div>
                        {showHint('q3_length') && <span className={styles.validationHint}>Please select an option to continue</span>}
                    </div>

                    <button type="button" className={styles.nextBtn} onClick={() => handleContinue(2)}>
                        Continue →
                    </button>
                </>
            )}

            {/* ── STEP 2 — The Scan ── */}
            {step === 2 && (
                <>
                    <h3 className={styles.stepTitle}>The Scan</h3>

                    {/* Q4 */}
                    <div className={styles.question}>
                        <label className={styles.label}>
                            Did you know what photo to upload for the scan?
                        </label>
                        <div className={styles.btnGroup}>
                            {['Yes, immediately', 'Took me a second', 'Not really', 'I guessed'].map(o => (
                                <Opt key={o} field="q4_photo" val={o} />
                            ))}
                        </div>
                        {showHint('q4_photo', 'q4_detail') && <span className={styles.validationHint}>Please select an option to continue</span>}
                        <textarea
                            className={styles.textarea}
                            rows={2}
                            placeholder="What would have helped?"
                            value={answers.q4_detail}
                            onChange={e => set('q4_detail', e.target.value)}
                        />
                    </div>

                    {/* Q5 */}
                    <div className={styles.question}>
                        <label className={styles.label}>
                            While your photo was being analysed, how did you feel?
                        </label>
                        <div className={styles.btnGroup}>
                            {['Confident', 'Curious', 'Nervous', 'Bored', 'Impressed'].map(o => (
                                <Opt key={o} field="q5_feeling" val={o} />
                            ))}
                        </div>
                        {showHint('q5_feeling', 'q5_detail') && <span className={styles.validationHint}>Please select an option to continue</span>}
                        <textarea
                            className={styles.textarea}
                            rows={2}
                            placeholder="Anything else?"
                            value={answers.q5_detail}
                            onChange={e => set('q5_detail', e.target.value)}
                        />
                    </div>

                    {/* Q6 */}
                    <div className={styles.question}>
                        <label className={styles.label}>
                            When you saw your result, what was your first reaction?
                        </label>
                        <div className={styles.btnGroup}>
                            {['Impressed', 'Surprised', 'Confused', 'Skeptical', 'Relieved', 'Scared'].map(o => (
                                <Opt key={o} field="q6_reaction" val={o} />
                            ))}
                        </div>
                        {showHint('q6_reaction', 'q6_detail') && <span className={styles.validationHint}>Please select an option to continue</span>}
                        <textarea
                            className={styles.textarea}
                            rows={2}
                            placeholder="Tell us more..."
                            value={answers.q6_detail}
                            onChange={e => set('q6_detail', e.target.value)}
                        />
                    </div>

                    {/* Q7 */}
                    <div className={styles.question}>
                        <label className={styles.label}>
                            The result showed a confidence percentage — what did you think it meant?
                        </label>
                        <div className={styles.btnGroup}>
                            {['How accurate the AI is', 'How serious my condition is', 'I had no idea', 'I ignored it'].map(o => (
                                <Opt key={o} field="q7_confidence" val={o} />
                            ))}
                        </div>
                        {showHint('q7_confidence', 'q7_detail') && <span className={styles.validationHint}>Please select an option to continue</span>}
                        <textarea
                            className={styles.textarea}
                            rows={2}
                            placeholder="In your own words..."
                            value={answers.q7_detail}
                            onChange={e => set('q7_detail', e.target.value)}
                        />
                    </div>

                    {/* Q8 */}
                    <div className={styles.question}>
                        <label className={styles.label}>
                            After reading your full report, did you understand your skin better?
                        </label>
                        <div className={styles.btnGroup}>
                            {['Yes, clearly', 'Somewhat', 'Not really', 'It confused me more'].map(o => (
                                <Opt key={o} field="q8_understood" val={o} />
                            ))}
                        </div>
                        {showHint('q8_understood', 'q8_detail') && <span className={styles.validationHint}>Please select an option to continue</span>}
                        <textarea
                            className={styles.textarea}
                            rows={2}
                            placeholder="What was unclear?"
                            value={answers.q8_detail}
                            onChange={e => set('q8_detail', e.target.value)}
                        />
                    </div>

                    <button type="button" className={styles.nextBtn} onClick={() => handleContinue(3)}>
                        Continue →
                    </button>
                </>
            )}

            {/* ── STEP 3 — Doctor Booking ── */}
            {step === 3 && (
                <>
                    <h3 className={styles.stepTitle}>Doctor Booking</h3>

                    {/* Q9 */}
                    <div className={styles.question}>
                        <label className={styles.label}>
                            Did you explore the Find a Doctor feature?
                        </label>
                        <div className={styles.btnGroup}>
                            {['Yes, fully', 'Briefly', 'No', "Didn't notice it"].map(o => (
                                <Opt key={o} field="q9_doctors" val={o} />
                            ))}
                        </div>
                        {showHint('q9_doctors', 'q9_detail') && <span className={styles.validationHint}>Please select an option to continue</span>}
                        <textarea
                            className={styles.textarea}
                            rows={2}
                            placeholder="What stopped you?"
                            value={answers.q9_detail}
                            onChange={e => set('q9_detail', e.target.value)}
                        />
                    </div>

                    {/* Q10 */}
                    <div className={styles.question}>
                        <label className={styles.label}>
                            If you tried booking — how was the process?
                        </label>
                        <div className={styles.btnGroup}>
                            {['Very easy', 'Took some figuring out', 'Confusing', "Didn't try"].map(o => (
                                <Opt key={o} field="q10_booking" val={o} />
                            ))}
                        </div>
                        {showHint('q10_booking', 'q10_detail') && <span className={styles.validationHint}>Please select an option to continue</span>}
                        <textarea
                            className={styles.textarea}
                            rows={2}
                            placeholder="Tell us more..."
                            value={answers.q10_detail}
                            onChange={e => set('q10_detail', e.target.value)}
                        />
                    </div>

                    {/* Q11 */}
                    <div className={styles.question}>
                        <label className={styles.label}>
                            Did the doctor profiles feel credible?
                        </label>
                        <div className={styles.btnGroup}>
                            {['Yes, very', 'Somewhat', 'Not really', 'Felt like fake data'].map(o => (
                                <Opt key={o} field="q11_credibility" val={o} />
                            ))}
                        </div>
                        {showHint('q11_credibility', 'q11_detail') && <span className={styles.validationHint}>Please select an option to continue</span>}
                        <textarea
                            className={styles.textarea}
                            rows={2}
                            placeholder="What felt off?"
                            value={answers.q11_detail}
                            onChange={e => set('q11_detail', e.target.value)}
                        />
                    </div>

                    {/* Q12 */}
                    <div className={styles.question}>
                        <label className={styles.label}>
                            Would you book a real dermatologist through NIVARA?
                        </label>
                        <div className={styles.btnGroup}>
                            {['Definitely', 'Maybe', 'No', 'Already did'].map(o => (
                                <Opt key={o} field="q12_would_book" val={o} />
                            ))}
                        </div>
                        {showHint('q12_would_book', 'q12_detail') && <span className={styles.validationHint}>Please select an option to continue</span>}
                        <textarea
                            className={styles.textarea}
                            rows={2}
                            placeholder="What would change your mind?"
                            value={answers.q12_detail}
                            onChange={e => set('q12_detail', e.target.value)}
                        />
                    </div>

                    <button type="button" className={styles.nextBtn} onClick={() => handleContinue(4)}>
                        Continue →
                    </button>
                </>
            )}

            {/* ── STEP 4 — Kiosk & General ── */}
            {step === 4 && (
                <>
                    <h3 className={styles.stepTitle}>Kiosk &amp; General</h3>

                    {/* Q13 */}
                    <div className={styles.question}>
                        <label className={styles.label}>
                            Did you notice the Kiosk Locator? What did you think it was for?
                        </label>
                        <div className={styles.btnGroup}>
                            {["Yes, I understood it", "Saw it but wasn't sure", "Didn't notice it", "Not relevant to me"].map(o => (
                                <Opt key={o} field="q13_kiosk" val={o} />
                            ))}
                        </div>
                        {showHint('q13_kiosk', 'q13_detail') && <span className={styles.validationHint}>Please select an option to continue</span>}
                        <textarea
                            className={styles.textarea}
                            rows={2}
                            placeholder="Your thoughts..."
                            value={answers.q13_detail}
                            onChange={e => set('q13_detail', e.target.value)}
                        />
                    </div>

                    {/* Q14 */}
                    <div className={styles.question}>
                        <label className={styles.label}>
                            Overall, how would you describe NIVARA to a friend?
                        </label>
                        <div className={styles.btnGroup}>
                            {['A skin analysis app', 'An AI dermatologist', 'A health platform', 'Something else'].map(o => (
                                <Opt key={o} field="q14_description" val={o} />
                            ))}
                        </div>
                        {showHint('q14_description', 'q14_detail') && <span className={styles.validationHint}>Please select an option to continue</span>}
                        <textarea
                            className={styles.textarea}
                            rows={2}
                            placeholder="In your own words..."
                            value={answers.q14_detail}
                            onChange={e => set('q14_detail', e.target.value)}
                        />
                    </div>

                    {/* Q15 */}
                    <div className={styles.question}>
                        <label className={styles.label}>
                            How likely are you to use NIVARA again for a real skin concern?
                        </label>
                        <div className={styles.btnGroup}>
                            {['Definitely', 'Probably', 'Unlikely', 'Only if it improves'].map(o => (
                                <Opt key={o} field="q15_return" val={o} />
                            ))}
                        </div>
                        {showHint('q15_return', 'q15_detail') && <span className={styles.validationHint}>Please select an option to continue</span>}
                        <textarea
                            className={styles.textarea}
                            rows={2}
                            placeholder="What would make you come back?"
                            value={answers.q15_detail}
                            onChange={e => set('q15_detail', e.target.value)}
                        />
                    </div>

                    <button type="button" className={styles.nextBtn} onClick={() => handleContinue(5)}>
                        Continue →
                    </button>
                </>
            )}

            {/* ── STEP 5 — Trust & Closing ── */}
            {step === 5 && (
                <>
                    <h3 className={styles.stepTitle}>Trust &amp; Closing</h3>

                    {/* Q16 */}
                    <div className={styles.question}>
                        <label className={styles.label}>
                            1 to 10 — how much do you trust NIVARA vs a real dermatologist?
                        </label>

                        {/* Live score readout */}
                        <div className={styles.sliderValue}>
                            {q16Touched ? answers.q16_trust_score : '—'}
                        </div>

                        {/* Slider */}
                        <input
                            type="range"
                            className={styles.slider}
                            min={1}
                            max={10}
                            step={1}
                            value={answers.q16_trust_score}
                            onChange={e => {
                                set('q16_trust_score', e.target.value);
                                setQ16Touched(true);
                            }}
                        />

                        {/* Track labels */}
                        <div className={styles.sliderLabels}>
                            <span>1 — Don&apos;t trust it</span>
                            <span>10 — Fully trust it</span>
                        </div>

                        {attempted && !q16Touched && (
                            <span className={styles.validationHint}>Please move the slider to continue</span>
                        )}
                        <textarea
                            className={styles.textarea}
                            rows={2}
                            placeholder="What would change that score?"
                            value={answers.q16_detail}
                            onChange={e => set('q16_detail', e.target.value)}
                        />
                    </div>

                    {/* Q17 */}
                    <div className={styles.question}>
                        <label className={styles.label}>
                            What&apos;s the one thing you&apos;d fix about NIVARA right now?
                        </label>
                        <div className={styles.btnGroup}>
                            {['The scan result', 'The onboarding', 'The website design', 'The doctor feature', 'The speed'].map(o => (
                                <Opt key={o} field="q17_fix" val={o} />
                            ))}
                        </div>
                        {showHint('q17_fix', 'q17_detail') && <span className={styles.validationHint}>Please select an option to continue</span>}
                        <textarea
                            className={styles.textarea}
                            rows={2}
                            placeholder="Be specific..."
                            value={answers.q17_detail}
                            onChange={e => set('q17_detail', e.target.value)}
                        />
                    </div>

                    {/* Q18 */}
                    <div className={styles.question}>
                        <label className={styles.label}>
                            Would you recommend NIVARA to someone with a skin concern?
                        </label>
                        <div className={styles.btnGroup}>
                            {['Yes, already have', 'Yes, I would', 'Maybe', 'No'].map(o => (
                                <Opt key={o} field="q18_recommend" val={o} />
                            ))}
                        </div>
                        {showHint('q18_recommend', 'q18_detail') && <span className={styles.validationHint}>Please select an option to continue</span>}
                        <textarea
                            className={styles.textarea}
                            rows={2}
                            placeholder="Why / why not?"
                            value={answers.q18_detail}
                            onChange={e => set('q18_detail', e.target.value)}
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
