import { Text, Link, Hr } from '@react-email/components';
import { NivaraEmailLayout } from './components/NivaraEmailLayout';

interface Props {
    firstName: string;
}

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export function ScanExhaustedEmail({ firstName }: Props) {
    return (
        <NivaraEmailLayout>
            <Text style={{ fontSize: '22px', fontFamily: 'Georgia, serif', color: '#FAF8F4', margin: '0 0 10px' }}>
                You&apos;ve used your free scan, {firstName}.
            </Text>
            <Text style={{ fontSize: '14px', color: '#888888', lineHeight: '1.6', margin: '0 0 28px' }}>
                To continue scanning, get access to a NIVARA device or visit a kiosk near you.
            </Text>

            {/* Option 1 */}
            <div style={{ backgroundColor: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '8px', padding: '20px 22px', marginBottom: '14px' }}>
                <Text style={{ fontSize: '14px', fontWeight: '600', color: '#FAF8F4', margin: '0 0 4px' }}>
                    NIVARA Device
                </Text>
                <Text style={{ fontSize: '13px', color: '#888888', margin: '0 0 14px', lineHeight: '1.5' }}>
                    Own a personal scanner. Clinical-grade results at home.
                </Text>
                <Link
                    href={`${APP_URL}/buy`}
                    style={{
                        display: 'inline-block',
                        backgroundColor: '#D4AF37',
                        color: '#0a0a0a',
                        fontWeight: '600',
                        fontSize: '13px',
                        padding: '10px 22px',
                        borderRadius: '6px',
                        textDecoration: 'none',
                    }}
                >
                    Buy Device →
                </Link>
            </div>

            {/* Option 2 */}
            <div style={{ backgroundColor: 'rgba(212,175,55,0.03)', border: '1px solid rgba(212,175,55,0.15)', borderRadius: '8px', padding: '20px 22px', marginBottom: '24px' }}>
                <Text style={{ fontSize: '14px', fontWeight: '600', color: '#FAF8F4', margin: '0 0 4px' }}>
                    Find a Kiosk
                </Text>
                <Text style={{ fontSize: '13px', color: '#888888', margin: '0 0 14px', lineHeight: '1.5' }}>
                    Visit a NIVARA kiosk near you. Free to use.
                </Text>
                <Link
                    href={`${APP_URL}/kiosks`}
                    style={{
                        display: 'inline-block',
                        backgroundColor: 'transparent',
                        color: '#D4AF37',
                        fontWeight: '600',
                        fontSize: '13px',
                        padding: '10px 22px',
                        borderRadius: '6px',
                        border: '1px solid rgba(212,175,55,0.4)',
                        textDecoration: 'none',
                    }}
                >
                    Find Kiosks →
                </Link>
            </div>

            <Hr style={{ borderColor: 'rgba(212,175,55,0.15)', margin: '0 0 16px' }} />
            <Text style={{ fontSize: '12px', color: '#555555', margin: 0 }}>
                Your previous scan report is still available in your profile.
            </Text>
        </NivaraEmailLayout>
    );
}
