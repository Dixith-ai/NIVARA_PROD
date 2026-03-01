import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';
import { VerificationEmail } from '@/emails/VerificationEmail';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json() as { to: string; firstName: string; verificationUrl: string };
        await sendEmail({
            to: body.to,
            subject: 'Verify your NIVARA account',
            react: VerificationEmail({ firstName: body.firstName, verificationUrl: body.verificationUrl }),
        });
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }
}
