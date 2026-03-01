import { Text, Link, Hr } from '@react-email/components';
import { NivaraEmailLayout } from './components/NivaraEmailLayout';

interface Props {
    firstName: string;
}

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export function WelcomeEmail({ firstName }: Props) {
    const features = [
        { emoji: '🔬', text: 'Free skin scan — upload an image and get a differential diagnosis in seconds' },
        { emoji: '👨‍⚕️', text: 'Find a dermatologist — browse verified specialists near you' },
        { emoji: '📋', text: 'Track your skin health — every scan is saved to your profile' },
    ];

    return (
        <NivaraEmailLayout>
            <Text style={{ fontSize: '22px', fontFamily: 'Georgia, serif', color: '#FAF8F4', margin: '0 0 10px' }}>
                Welcome to NIVARA, {firstName}.
            </Text>
            <Text style={{ fontSize: '14px', color: '#888888', lineHeight: '1.6', margin: '0 0 28px' }}>
                Your profile is set up and ready. Here&apos;s what you can do:
            </Text>

            {/* Feature list */}
            {features.map((f) => (
                <Text key={f.text} style={{ fontSize: '13px', color: '#e5e5e5', margin: '0 0 12px', lineHeight: '1.5' }}>
                    {f.emoji}&nbsp;&nbsp;{f.text}
                </Text>
            ))}

            <Hr style={{ borderColor: 'rgba(212,175,55,0.15)', margin: '24px 0' }} />

            <Link
                href={`${APP_URL}/demo`}
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
                }}
            >
                Try Your Free Scan →
            </Link>
        </NivaraEmailLayout>
    );
}
