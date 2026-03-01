import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';
import { WelcomeEmail } from '@/emails/WelcomeEmail';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json() as { to: string; firstName: string };
        await sendEmail({
            to: body.to,
            subject: `Welcome to NIVARA, ${body.firstName}.`,
            react: WelcomeEmail({ firstName: body.firstName }),
        });
        return NextResponse.json({ success: true });
    } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error('[welcome email]', msg);
        return NextResponse.json({ error: msg }, { status: 500 });
    }
}
