import { Text, Link, Hr } from '@react-email/components';
import { NivaraEmailLayout } from './components/NivaraEmailLayout';

interface WaitlistConfirmEmailProps {
    firstName: string;
}

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://www.nivara.life';

export default function WaitlistConfirmEmail({ firstName }: WaitlistConfirmEmailProps) {
    return (
        <NivaraEmailLayout>
            {/* Opening */}
            <Text style={{
                fontSize: '28px',
                fontFamily: 'Georgia, serif',
                color: '#D4AF37',
                margin: '0 0 12px',
                lineHeight: '1.2',
            }}>
                {firstName}.
            </Text>

            <Text style={{
                fontSize: '22px',
                fontFamily: 'Georgia, serif',
                color: '#FAF8F4',
                margin: '0 0 24px',
                lineHeight: '1.3',
            }}>
                You are on the list.
            </Text>

            {/* Divider */}
            <Hr style={{
                borderColor: 'rgba(212,175,55,0.3)',
                margin: '24px 0',
            }} />

            {/* Body Paragraph 1 */}
            <Text style={{
                fontSize: '15px',
                color: '#e5e5e5',
                margin: '0 0 20px',
                lineHeight: '1.7',
            }}>
                The NIVARA device is being built to bring clinical grade skin analysis out of the clinic and into your hands. Not a consumer gadget. A proper diagnostic tool, designed around the way dermatologists actually think.
            </Text>

            {/* Body Paragraph 2 */}
            <Text style={{
                fontSize: '15px',
                color: '#e5e5e5',
                margin: '0 0 20px',
                lineHeight: '1.7',
            }}>
                You will be among the first to know when it is ready. That means early access pricing, priority shipping, and a direct line to our team before we open to everyone else.
            </Text>

            {/* Body Paragraph 3 */}
            <Text style={{
                fontSize: '15px',
                color: '#e5e5e5',
                margin: '0 0 24px',
                lineHeight: '1.7',
            }}>
                In the meantime, the AI assisted differential diagnosis system is live right now. Try it. It is what the device is built around.
            </Text>

            {/* Divider */}
            <Hr style={{
                borderColor: 'rgba(212,175,55,0.3)',
                margin: '24px 0',
            }} />

            {/* CTA Button */}
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
                    marginBottom: '24px',
                }}
            >
                Try the Free Demo →
            </Link>

            {/* Closing */}
            <Text style={{
                fontSize: '13px',
                color: '#888888',
                margin: '0 0 8px',
                textAlign: 'center',
            }}>
                The NIVARA Team
            </Text>

            <Text style={{
                fontSize: '11px',
                color: '#555555',
                margin: 0,
                textAlign: 'center',
                lineHeight: '1.6',
            }}>
                You are receiving this because you joined the NIVARA device waitlist. This is a one time email.
            </Text>
        </NivaraEmailLayout>
    );
}
