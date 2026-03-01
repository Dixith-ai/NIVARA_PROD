import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';
import { LoginAlertEmail } from '@/emails/LoginAlertEmail';

interface Body {
    to: string;
    firstName: string;
    device: string;
    platform: string;
    time: string;
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json() as Body;
        await sendEmail({
            to: body.to,
            subject: 'New sign-in to your NIVARA account',
            react: LoginAlertEmail({
                firstName: body.firstName,
                device: body.device,
                platform: body.platform,
                time: body.time,
            }),
        });
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }
}
