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
    q1?: string; q2?: string; q3?: string; q4?: string; q5?: string;
    q6?: string; q7?: string; q7_detail?: string;
    q8?: string; q9?: string; q10?: string; q10_detail?: string;
    q11?: string; q12_score?: number | null; q12_detail?: string;
    uid?: string | null;
    userName?: string | null;
    userEmail?: string | null;
    source?: 'widget' | 'page';
    completedAt?: string;
}

const row = (label: string, value?: string | number | null) => {
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

                    {row('Q1 — What did you think NIVARA does?', payload.q1)}
                    {row('Q2 — Almost left when saw account needed?', payload.q2)}
                    {row('Q3 — How easy was signup?', payload.q3)}
                    {row('Q4 — Onboarding question they avoided?', payload.q4)}
                    {row('Q5 — Onboarding length?', payload.q5)}
                    {row('Q6 — Photo guidance?', payload.q6)}
                    {row('Q7 — Feeling during analysis?', payload.q7)}
                    {payload.q7_detail ? row('Q7 detail', payload.q7_detail) : null}
                    {row('Q8 — First emotion seeing result?', payload.q8)}
                    {row('Q9 — Confidence % meaning?', payload.q9)}
                    {row('Q10 — Understood skin better?', payload.q10)}
                    {payload.q10_detail ? row('Q10 detail', payload.q10_detail) : null}
                    {row('Q11 — First action after results?', payload.q11)}
                    {payload.q12_score != null ? row('Q12 — Trust score (1–10)', payload.q12_score) : null}
                    {row('Q12 — What would change the score?', payload.q12_detail)}
                </NivaraEmailLayout>
            </Body>
        </Html>
    );
}
