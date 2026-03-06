import {
    Html,
    Head,
    Preview,
    Body,
    Text,
} from '@react-email/components';
import { NivaraEmailLayout } from './components/NivaraEmailLayout';

interface WaitlistNotifyEmailProps {
    firstName: string;
    email: string;
    city: string;
    joinedAt: string;
}

export default function WaitlistNotifyEmail({
    firstName,
    email,
    city,
    joinedAt,
}: WaitlistNotifyEmailProps) {
    return (
        <Html>
            <Head />
            <Preview>New waitlist signup</Preview>
            <Body style={{ margin: 0, padding: 0, backgroundColor: '#0a0a0a' }}>
                <NivaraEmailLayout>
                    <Text style={{
                        fontFamily: "'DM Serif Display', Georgia, serif",
                        fontSize: '24px',
                        color: '#D4AF37',
                        margin: '0 0 24px',
                        lineHeight: '1.3',
                    }}>
                        Someone joined the waitlist.
                    </Text>

                    <table cellPadding="0" cellSpacing="0" border={0} style={{
                        width: '100%',
                        marginBottom: '16px',
                        borderCollapse: 'collapse',
                    }}>
                        <tbody>
                            <tr>
                                <td style={{
                                    padding: '12px 0',
                                    fontSize: '13px',
                                    fontWeight: 600,
                                    color: '#888',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.06em',
                                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                                }}>
                                    Name
                                </td>
                                <td style={{
                                    padding: '12px 0',
                                    fontSize: '15px',
                                    color: '#D4AF37',
                                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                                }}>
                                    {firstName}
                                </td>
                            </tr>
                            <tr>
                                <td style={{
                                    padding: '12px 0',
                                    fontSize: '13px',
                                    fontWeight: 600,
                                    color: '#888',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.06em',
                                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                                }}>
                                    Email
                                </td>
                                <td style={{
                                    padding: '12px 0',
                                    fontSize: '15px',
                                    color: '#D4AF37',
                                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                                }}>
                                    {email}
                                </td>
                            </tr>
                            <tr>
                                <td style={{
                                    padding: '12px 0',
                                    fontSize: '13px',
                                    fontWeight: 600,
                                    color: '#888',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.06em',
                                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                                }}>
                                    City
                                </td>
                                <td style={{
                                    padding: '12px 0',
                                    fontSize: '15px',
                                    color: '#D4AF37',
                                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                                }}>
                                    {city}
                                </td>
                            </tr>
                            <tr>
                                <td style={{
                                    padding: '12px 0',
                                    fontSize: '13px',
                                    fontWeight: 600,
                                    color: '#888',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.06em',
                                }}>
                                    Joined
                                </td>
                                <td style={{
                                    padding: '12px 0',
                                    fontSize: '15px',
                                    color: '#D4AF37',
                                }}>
                                    {joinedAt}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </NivaraEmailLayout>
            </Body>
        </Html>
    );
}
