import {
    Html,
    Head,
    Preview,
    Body,
    Text,
    Hr,
} from '@react-email/components';
import { NivaraEmailLayout } from './components/NivaraEmailLayout';

interface FeedbackPayload {
    // Step 1 — Account & Onboarding
    q1_signup?: string | null;
    q1_detail?: string | null;
    q2_onboarding?: string | null;
    q2_detail?: string | null;
    q3_length?: string | null;
    // Step 2 — The Scan
    q4_photo?: string | null;
    q4_detail?: string | null;
    q5_feeling?: string | null;
    q5_detail?: string | null;
    q6_reaction?: string | null;
    q6_detail?: string | null;
    q7_confidence?: string | null;
    q7_detail?: string | null;
    q8_understood?: string | null;
    q8_detail?: string | null;
    // Step 3 — Doctor Booking
    q9_doctors?: string | null;
    q9_detail?: string | null;
    q10_booking?: string | null;
    q10_detail?: string | null;
    q11_credibility?: string | null;
    q11_detail?: string | null;
    q12_would_book?: string | null;
    q12_detail?: string | null;
    // Step 4 — Kiosk & General
    q13_kiosk?: string | null;
    q13_detail?: string | null;
    q14_description?: string | null;
    q14_detail?: string | null;
    q15_return?: string | null;
    q15_detail?: string | null;
    // Step 5 — Trust & Closing
    q16_trust_score?: number | null;
    q16_detail?: string | null;
    q17_fix?: string | null;
    q17_detail?: string | null;
    q18_recommend?: string | null;
    q18_detail?: string | null;
    // Meta
    uid?: string | null;
    userName?: string | null;
    userEmail?: string | null;
    source?: 'widget' | 'page';
    completedAt?: string;
}

/** Renders a labelled question row. Detail always shown (as "—" if empty). */
const QRow = ({
    label,
    selected,
    detail,
}: {
    label: string;
    selected?: string | number | null;
    detail?: string | null;
}) => (
    <>
        <Text style={{ fontSize: '11px', color: '#888', margin: '14px 0 2px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {label}
        </Text>
        <Text style={{ fontSize: '14px', color: '#D4AF37', margin: '0 0 2px', fontWeight: 600 }}>
            Selected: {selected ?? '—'}
        </Text>
        <Text style={{ fontSize: '13px', color: '#aaa', margin: '0', lineHeight: '1.6' }}>
            Detail: {detail && detail.trim() ? detail.trim() : '—'}
        </Text>
    </>
);

/** Renders a meta header row (no detail). */
const MetaRow = ({ label, value }: { label: string; value?: string | number | null }) => {
    if (!value) return null;
    return (
        <>
            <Text style={{ fontSize: '11px', color: '#888', margin: '12px 0 2px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {label}
            </Text>
            <Text style={{ fontSize: '14px', color: '#ddd', margin: '0', lineHeight: '1.6' }}>
                {String(value)}
            </Text>
        </>
    );
};

const SectionHeader = ({ title }: { title: string }) => (
    <>
        <Hr style={{ borderColor: 'rgba(255,255,255,0.08)', margin: '20px 0 8px' }} />
        <Text style={{ fontSize: '13px', color: '#C9A84C', fontWeight: 700, margin: '0 0 4px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            {title}
        </Text>
    </>
);

export default function FeedbackSummaryEmail(payload: FeedbackPayload) {
    return (
        <Html>
            <Head />
            <Preview>New NIVARA Feedback Received</Preview>
            <Body style={{ margin: 0, padding: 0, backgroundColor: '#0a0a0a' }}>
                <NivaraEmailLayout>
                    <Text style={{
                        fontFamily: "'DM Serif Display', Georgia, serif",
                        fontSize: '22px',
                        color: '#D4AF37',
                        margin: '0 0 4px',
                    }}>
                        New feedback submitted
                    </Text>

                    <Text style={{ fontSize: '12px', color: '#666', margin: '0 0 20px' }}>
                        Source: {payload.source || 'unknown'} · {payload.completedAt ? new Date(payload.completedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) : ''}
                        <br />
                        {payload.userName || payload.userEmail ? (
                            <>Submitted by: {payload.userName || 'Anonymous'} ({payload.userEmail || 'no email'})</>
                        ) : (
                            <>UID: {payload.uid || 'anonymous'}</>
                        )}
                    </Text>

                    <Hr style={{ borderColor: 'rgba(255,255,255,0.08)', margin: '0 0 16px' }} />

                    {/* ── STEP 1 — Account & Onboarding ── */}
                    <SectionHeader title="Step 1 — Account & Onboarding" />

                    <QRow
                        label="Q1 — How smooth was signing up and creating your account?"
                        selected={payload.q1_signup}
                        detail={payload.q1_detail}
                    />
                    <QRow
                        label="Q2 — Was there any step in onboarding that felt unnecessary or invasive?"
                        selected={payload.q2_onboarding}
                        detail={payload.q2_detail}
                    />
                    <MetaRow label="Q3 — 5 steps before reaching the scan — what did you think?" value={payload.q3_length} />

                    {/* ── STEP 2 — The Scan ── */}
                    <SectionHeader title="Step 2 — The Scan" />

                    <QRow
                        label="Q4 — Did you know what photo to upload for the scan?"
                        selected={payload.q4_photo}
                        detail={payload.q4_detail}
                    />
                    <QRow
                        label="Q5 — While your photo was being analysed, how did you feel?"
                        selected={payload.q5_feeling}
                        detail={payload.q5_detail}
                    />
                    <QRow
                        label="Q6 — When you saw your result, what was your first reaction?"
                        selected={payload.q6_reaction}
                        detail={payload.q6_detail}
                    />
                    <QRow
                        label="Q7 — The result showed a confidence percentage — what did you think it meant?"
                        selected={payload.q7_confidence}
                        detail={payload.q7_detail}
                    />
                    <QRow
                        label="Q8 — After reading your full report, did you understand your skin better?"
                        selected={payload.q8_understood}
                        detail={payload.q8_detail}
                    />

                    {/* ── STEP 3 — Doctor Booking ── */}
                    <SectionHeader title="Step 3 — Doctor Booking" />

                    <QRow
                        label="Q9 — Did you explore the Find a Doctor feature?"
                        selected={payload.q9_doctors}
                        detail={payload.q9_detail}
                    />
                    <QRow
                        label="Q10 — If you tried booking — how was the process?"
                        selected={payload.q10_booking}
                        detail={payload.q10_detail}
                    />
                    <QRow
                        label="Q11 — Did the doctor profiles feel credible?"
                        selected={payload.q11_credibility}
                        detail={payload.q11_detail}
                    />
                    <QRow
                        label="Q12 — Would you book a real dermatologist through NIVARA?"
                        selected={payload.q12_would_book}
                        detail={payload.q12_detail}
                    />

                    {/* ── STEP 4 — Kiosk & General ── */}
                    <SectionHeader title="Step 4 — Kiosk & General" />

                    <QRow
                        label="Q13 — Did you notice the Kiosk Locator? What did you think it was for?"
                        selected={payload.q13_kiosk}
                        detail={payload.q13_detail}
                    />
                    <QRow
                        label="Q14 — Overall, how would you describe NIVARA to a friend?"
                        selected={payload.q14_description}
                        detail={payload.q14_detail}
                    />
                    <QRow
                        label="Q15 — How likely are you to use NIVARA again for a real skin concern?"
                        selected={payload.q15_return}
                        detail={payload.q15_detail}
                    />

                    {/* ── STEP 5 — Trust & Closing ── */}
                    <SectionHeader title="Step 5 — Trust & Closing" />

                    <QRow
                        label="Q16 — 1 to 10: how much do you trust NIVARA vs a real dermatologist?"
                        selected={payload.q16_trust_score !== null ? payload.q16_trust_score : null}
                        detail={payload.q16_detail}
                    />
                    <QRow
                        label="Q17 — What's the one thing you'd fix about NIVARA right now?"
                        selected={payload.q17_fix}
                        detail={payload.q17_detail}
                    />
                    <QRow
                        label="Q18 — Would you recommend NIVARA to someone with a skin concern?"
                        selected={payload.q18_recommend}
                        detail={payload.q18_detail}
                    />

                </NivaraEmailLayout>
            </Body>
        </Html>
    );
}
