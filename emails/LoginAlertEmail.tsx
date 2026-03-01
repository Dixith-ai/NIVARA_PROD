import { Text, Link, Hr } from '@react-email/components';
import { NivaraEmailLayout } from './components/NivaraEmailLayout';

interface Props {
    firstName: string;
    device: string;
    platform: string;
    time: string;
}

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export function LoginAlertEmail({ firstName, device, platform, time }: Props) {
    return (
        <NivaraEmailLayout>
            <Text style={{ fontSize: '22px', fontFamily: 'Georgia, serif', color: '#FAF8F4', margin: '0 0 10px' }}>
                New sign-in to your account, {firstName}.
            </Text>
            <Text style={{ fontSize: '14px', color: '#888888', lineHeight: '1.6', margin: '0 0 24px' }}>
                We noticed a sign-in to your NIVARA account from a new device.
            </Text>

            {/* Details card */}
            <div style={{ backgroundColor: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', padding: '20px 22px', marginBottom: '24px' }}>
                <Text style={{ fontSize: '11px', color: '#888888', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 12px' }}>
                    Sign-in Details
                </Text>
                <Text style={{ fontSize: '13px', color: '#e5e5e5', margin: '0 0 6px' }}>
                    🖥️ &nbsp;Device: <span style={{ color: '#FAF8F4', fontWeight: '500' }}>{device}</span>
                </Text>
                <Text style={{ fontSize: '13px', color: '#e5e5e5', margin: '0 0 6px' }}>
                    💻 &nbsp;Platform: <span style={{ color: '#FAF8F4', fontWeight: '500' }}>{platform}</span>
                </Text>
                <Text style={{ fontSize: '13px', color: '#e5e5e5', margin: 0 }}>
                    🕐 &nbsp;Time: <span style={{ color: '#FAF8F4', fontWeight: '500' }}>{time}</span>
                </Text>
            </div>

            <Text style={{ fontSize: '13px', color: '#888888', margin: '0 0 24px', lineHeight: '1.6' }}>
                If this was you, no action needed. If you don&apos;t recognise this login, change your password immediately.
            </Text>

            <Link
                href={`${APP_URL}/login`}
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
                    marginBottom: '24px',
                }}
            >
                Secure Your Account →
            </Link>

            <Hr style={{ borderColor: 'rgba(212,175,55,0.15)', margin: '0 0 14px' }} />
            <Text style={{ fontSize: '12px', color: '#555555', margin: 0, lineHeight: '1.6' }}>
                This alert was sent because a sign-in was detected from a device not previously associated with your NIVARA account.
            </Text>
        </NivaraEmailLayout>
    );
}
