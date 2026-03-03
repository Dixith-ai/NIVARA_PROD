import { Text, Link, Hr } from '@react-email/components';
import { NivaraEmailLayout } from './components/NivaraEmailLayout';

interface Props {
    firstName: string;
    topCondition: string;
    confidence: number;
    severity: 'High' | 'Moderate' | 'Low';
    scanId: string;
    otherConditions: { condition: string; confidence: number }[];
}

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

const SEV_COLORS: Record<string, string> = {
    High: '#ef4444',
    Moderate: '#f59e0b',
    Low: '#22c55e',
};

const SEV_NOTES: Record<string, string> = {
    High: 'We strongly recommend consulting a dermatologist soon.',
    Moderate: 'Consider booking a consultation for a professional opinion.',
    Low: 'Your scan looks routine. Monitor and rescan if anything changes.',
};

export function ScanReportEmail({ firstName, topCondition, confidence, severity, scanId, otherConditions }: Props) {
    const sevColor = SEV_COLORS[severity] ?? '#888888';
    const top3 = otherConditions.slice(0, 3);

    return (
        <NivaraEmailLayout>
            <Text style={{ fontSize: '22px', fontFamily: 'Georgia, serif', color: '#FAF8F4', margin: '0 0 6px' }}>
                Your scan report is ready, {firstName}.
            </Text>
            <Text style={{ fontSize: '11px', color: '#555555', letterSpacing: '0.08em', margin: '0 0 24px' }}>
                Scan #{scanId}
            </Text>

            {/* Primary finding card */}
            <div style={{ backgroundColor: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '8px', padding: '20px 22px', marginBottom: '20px' }}>
                <Text style={{ fontSize: '11px', color: '#888888', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 6px' }}>
                    Primary Finding
                </Text>
                <Text style={{ fontSize: '20px', fontFamily: 'Georgia, serif', color: '#FAF8F4', margin: '0 0 8px' }}>
                    {topCondition}
                </Text>
                <Text style={{ fontSize: '15px', color: '#D4AF37', fontWeight: '600', margin: '0 0 10px' }}>
                    {confidence.toFixed(1)}% confidence
                </Text>
                <span style={{ display: 'inline-block', backgroundColor: sevColor + '22', color: sevColor, border: `1px solid ${sevColor}55`, borderRadius: '20px', padding: '3px 12px', fontSize: '11px', fontWeight: '600', letterSpacing: '0.05em' }}>
                    {severity} Severity
                </span>
            </div>

            {/* Other possibilities */}
            {top3.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                    <Text style={{ fontSize: '11px', color: '#888888', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 10px' }}>
                        Other Possibilities
                    </Text>
                    {top3.map((c) => (
                        <Text key={c.condition} style={{ fontSize: '13px', color: '#e5e5e5', margin: '0 0 6px' }}>
                            {c.condition} — <span style={{ color: '#888888' }}>{c.confidence.toFixed(1)}%</span>
                        </Text>
                    ))}
                </div>
            )}

            <Text style={{ fontSize: '13px', color: '#888888', margin: '0 0 24px', lineHeight: '1.6' }}>
                {SEV_NOTES[severity]}
            </Text>

            <Hr style={{ borderColor: 'rgba(212,175,55,0.15)', margin: '20px 0' }} />

            <Text style={{ fontSize: '11px', color: '#555555', fontStyle: 'italic', margin: '0 0 16px', lineHeight: '1.6' }}>
                📎 Your full scan report has been attached as a PDF to this email.
            </Text>

            <Link
                href={`${APP_URL}/results`}
                style={{
                    display: 'inline-block',
                    backgroundColor: '#D4AF37',
                    color: '#0a0a0a',
                    fontWeight: '600',
                    fontSize: '14px',
                    padding: '14px 28px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    letterSpacing: '0.02em',
                    marginBottom: '16px',
                }}
            >
                View Full Report →
            </Link>
            <br />
            <Link href={`${APP_URL}/doctors`} style={{ fontSize: '13px', color: '#D4AF37', textDecoration: 'underline' }}>
                Find a Dermatologist →
            </Link>

            <Hr style={{ borderColor: 'rgba(212,175,55,0.15)', margin: '24px 0' }} />
            <Text style={{ fontSize: '11px', color: '#555555', margin: 0, lineHeight: '1.6' }}>
                This is an AI-assisted screening tool, not a medical diagnosis. Consult a dermatologist for professional evaluation.
            </Text>
        </NivaraEmailLayout>
    );
}
