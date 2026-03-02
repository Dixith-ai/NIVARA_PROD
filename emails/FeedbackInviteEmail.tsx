import {
    Html,
    Head,
    Preview,
    Body,
    Button,
    Text,
} from '@react-email/components';
import { NivaraEmailLayout } from './components/NivaraEmailLayout';

interface FeedbackInviteEmailProps {
    firstName?: string;
}

export default function FeedbackInviteEmail({
    firstName = 'there',
}: FeedbackInviteEmailProps) {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.nivara.life';

    return (
        <Html>
            <Head />
            <Preview>A quick question about your NIVARA experience</Preview>
            <Body style={{ margin: 0, padding: 0, backgroundColor: '#0a0a0a' }}>
                <NivaraEmailLayout>
                    <Text style={{
                        fontFamily: "'DM Serif Display', Georgia, serif",
                        fontSize: '24px',
                        color: '#D4AF37',
                        margin: '0 0 16px',
                        lineHeight: '1.3',
                    }}>
                        What did you think, {firstName}?
                    </Text>

                    <Text style={{
                        fontSize: '15px',
                        color: '#aaaaaa',
                        lineHeight: '1.7',
                        margin: '0 0 8px',
                    }}>
                        You scanned with NIVARA a couple of minutes ago. Your thoughts
                        help us build something genuinely useful — takes under 2 minutes.
                    </Text>

                    <Text style={{
                        fontSize: '13px',
                        color: '#777',
                        lineHeight: '1.6',
                        margin: '0 0 28px',
                    }}>
                        Your honest experience — good or bad — is exactly what helps us improve.
                    </Text>

                    <Button
                        href={`${appUrl}/feedback`}
                        style={{
                            display: 'inline-block',
                            backgroundColor: '#D4AF37',
                            color: '#0a0a0a',
                            padding: '13px 32px',
                            borderRadius: '6px',
                            fontFamily: 'Inter, Arial, sans-serif',
                            fontSize: '14px',
                            fontWeight: '600',
                            textDecoration: 'none',
                            margin: '0 0 28px',
                        }}
                    >
                        Share Your Feedback →
                    </Button>

                    <Text style={{
                        fontSize: '11px',
                        color: '#555',
                        lineHeight: '1.6',
                        margin: '24px 0 0',
                        borderTop: '1px solid rgba(255,255,255,0.06)',
                        paddingTop: '16px',
                    }}>
                        This is a one-time email. You&apos;re receiving it because you used
                        NIVARA&apos;s skin analysis feature.
                    </Text>
                </NivaraEmailLayout>
            </Body>
        </Html>
    );
}
