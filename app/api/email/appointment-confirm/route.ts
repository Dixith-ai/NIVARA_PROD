import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';
import { AppointmentConfirmEmail } from '@/emails/AppointmentConfirmEmail';

interface Body {
    to: string;
    firstName: string;
    doctorName: string;
    specialization: string;
    hospital: string;
    requestedDate: string;
    requestedTime: string;
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json() as Body;
        await sendEmail({
            to: body.to,
            subject: `Appointment request sent — ${body.doctorName}`,
            react: AppointmentConfirmEmail({
                firstName: body.firstName,
                doctorName: body.doctorName,
                specialization: body.specialization,
                hospital: body.hospital,
                requestedDate: body.requestedDate,
                requestedTime: body.requestedTime,
            }),
        });
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }
}
