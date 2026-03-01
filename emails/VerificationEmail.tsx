import { Text, Link, Hr } from '@react-email/components';
import { NivaraEmailLayout } from './components/NivaraEmailLayout';

interface Props {
    firstName: string;
    verificationUrl: string;
}

export function VerificationEmail({ firstName, verificationUrl }: Props) {
    return (
        <NivaraEmailLayout>
            <Text style={{ fontSize: '22px', fontFamily: 'Georgia, serif', color: '#FAF8F4', margin: '0 0 12px' }}>
                Verify your email, {firstName}.
            </Text>
            <Text style={{ fontSize: '14px', color: '#888888', lineHeight: '1.6', margin: '0 0 28px' }}>
                Click below to verify your NIVARA account and get started.
            </Text>

            {/* CTA */}
            <Link
                href={verificationUrl}
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
                    marginBottom: '28px',
                }}
            >
                Verify Email Address
            </Link>

            <Hr style={{ borderColor: 'rgba(212,175,55,0.15)', margin: '24px 0' }} />

            <Text style={{ fontSize: '12px', color: '#555555', margin: 0, lineHeight: '1.6' }}>
                This link expires in 24 hours. If you didn&apos;t create a NIVARA account, you can safely ignore this email.
            </Text>
        </NivaraEmailLayout>
    );
}
