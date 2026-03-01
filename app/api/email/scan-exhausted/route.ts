import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';
import { ScanExhaustedEmail } from '@/emails/ScanExhaustedEmail';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json() as { to: string; firstName: string };
        await sendEmail({
            to: body.to,
            subject: "You've used your free NIVARA scan",
            react: ScanExhaustedEmail({ firstName: body.firstName }),
        });
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }
}
