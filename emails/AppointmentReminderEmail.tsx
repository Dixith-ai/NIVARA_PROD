import { Text, Link, Hr } from '@react-email/components';
import { NivaraEmailLayout } from './components/NivaraEmailLayout';

interface Props {
    firstName: string;
    doctorName: string;
    specialization: string;
    hospital: string;
    appointmentDate: string;
    appointmentTime: string;
}

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export function AppointmentReminderEmail({ firstName, doctorName, specialization, hospital, appointmentDate, appointmentTime }: Props) {
    return (
        <NivaraEmailLayout>
            <Text style={{ fontSize: '22px', fontFamily: 'Georgia, serif', color: '#FAF8F4', margin: '0 0 10px' }}>
                Your appointment is tomorrow, {firstName}.
            </Text>
            <Text style={{ fontSize: '14px', color: '#888888', lineHeight: '1.6', margin: '0 0 24px' }}>
                Just a reminder — you have a confirmed appointment tomorrow.
            </Text>

            {/* Appointment details card */}
            <div style={{ backgroundColor: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.25)', borderRadius: '8px', padding: '20px 22px', marginBottom: '24px' }}>
                <Text style={{ fontSize: '15px', fontWeight: '700', color: '#FAF8F4', margin: '0 0 2px' }}>
                    {doctorName}
                </Text>
                <Text style={{ fontSize: '13px', color: '#888888', margin: '0 0 16px' }}>
                    {specialization} · {hospital}
                </Text>
                <Text style={{ fontSize: '14px', color: '#D4AF37', fontWeight: '600', margin: '0 0 4px' }}>
                    📅 &nbsp;{appointmentDate}
                </Text>
                <Text style={{ fontSize: '14px', color: '#D4AF37', fontWeight: '600', margin: 0 }}>
                    🕐 &nbsp;{appointmentTime}
                </Text>
            </div>

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
                    marginBottom: '24px',
                }}
            >
                View Appointment →
            </Link>

            <Hr style={{ borderColor: 'rgba(212,175,55,0.15)', margin: '0 0 14px' }} />
            <Text style={{ fontSize: '12px', color: '#555555', margin: 0, lineHeight: '1.6' }}>
                If you need to cancel or reschedule, please contact the clinic directly.
            </Text>
        </NivaraEmailLayout>
    );
}
