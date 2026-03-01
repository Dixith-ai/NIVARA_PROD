import {
    Html,
    Head,
    Body,
    Container,
    Section,
    Text,
    Hr,
} from '@react-email/components';
import { type ReactNode } from 'react';

interface NivaraEmailLayoutProps {
    children: ReactNode;
}

export function NivaraEmailLayout({ children }: NivaraEmailLayoutProps) {
    return (
        <Html lang="en">
            <Head />
            <Body style={{ backgroundColor: '#0a0a0a', margin: 0, padding: '40px 16px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                <Container style={{ maxWidth: '560px', margin: '0 auto' }}>
                    {/* Logo */}
                    <Section style={{ textAlign: 'center', marginBottom: '32px' }}>
                        <Text style={{
                            fontFamily: 'Georgia, "Times New Roman", serif',
                            fontSize: '28px',
                            fontWeight: '400',
                            color: '#D4AF37',
                            letterSpacing: '0.14em',
                            margin: 0,
                        }}>
                            NIVARA
                        </Text>
                    </Section>

                    {/* Card */}
                    <Section style={{
                        backgroundColor: '#111111',
                        border: '1px solid rgba(212, 175, 55, 0.3)',
                        borderRadius: '12px',
                        padding: '40px 36px',
                    }}>
                        {children}
                    </Section>

                    {/* Footer */}
                    <Section style={{ textAlign: 'center', marginTop: '28px' }}>
                        <Hr style={{ borderColor: 'rgba(212,175,55,0.12)', marginBottom: '16px' }} />
                        <Text style={{ fontSize: '11px', color: '#555555', margin: 0, letterSpacing: '0.02em' }}>
                            निवार — protection, shelter. Indigenously crafted in India.
                        </Text>
                        <Text style={{ fontSize: '10px', color: '#444444', marginTop: '6px' }}>
                            © 2026 NIVARA. You received this email because of activity on your NIVARA account.
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
}
