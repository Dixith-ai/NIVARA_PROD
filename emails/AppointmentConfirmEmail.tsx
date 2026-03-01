import { Text, Link, Hr } from '@react-email/components';
import { NivaraEmailLayout } from './components/NivaraEmailLayout';

interface Props {
    firstName: string;
    doctorName: string;
    specialization: string;
    hospital: string;
    requestedDate: string;
    requestedTime: string;
}

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export function AppointmentConfirmEmail({ firstName, doctorName, specialization, hospital, requestedDate, requestedTime }: Props) {
    return (
        <NivaraEmailLayout>
            <Text style={{ fontSize: '22px', fontFamily: 'Georgia, serif', color: '#FAF8F4', margin: '0 0 10px' }}>
                Appointment request sent, {firstName}.
            </Text>
            <Text style={{ fontSize: '14px', color: '#888888', lineHeight: '1.6', margin: '0 0 24px' }}>
                Your request has been sent to {doctorName}. They&apos;ll confirm within 24 hours.
            </Text>

            {/* Doctor + appointment details card */}
            <div style={{ backgroundColor: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '8px', padding: '20px 22px', marginBottom: '20px' }}>
                <Text style={{ fontSize: '15px', fontWeight: '700', color: '#FAF8F4', margin: '0 0 2px' }}>
                    {doctorName}
                </Text>
                <Text style={{ fontSize: '13px', color: '#888888', margin: '0 0 14px' }}>
                    {specialization} · {hospital}
                </Text>
                <Hr style={{ borderColor: 'rgba(212,175,55,0.12)', margin: '0 0 14px' }} />
                <Text style={{ fontSize: '13px', color: '#e5e5e5', margin: '0 0 4px' }}>
                    📅 &nbsp;{requestedDate}
                </Text>
                <Text style={{ fontSize: '13px', color: '#e5e5e5', margin: '0 0 14px' }}>
                    🕐 &nbsp;{requestedTime}
                </Text>
                <span style={{ display: 'inline-block', backgroundColor: '#f59e0b22', color: '#f59e0b', border: '1px solid #f59e0b55', borderRadius: '20px', padding: '3px 12px', fontSize: '11px', fontWeight: '600', letterSpacing: '0.05em' }}>
                    Pending Confirmation
                </span>
            </div>

            <Text style={{ fontSize: '13px', color: '#888888', margin: '0 0 24px', lineHeight: '1.6' }}>
                You&apos;ll receive another email once the doctor confirms your appointment.
            </Text>

            <Link
                href={`${APP_URL}/profile`}
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
                Track Your Appointment →
            </Link>
        </NivaraEmailLayout>
    );
}
