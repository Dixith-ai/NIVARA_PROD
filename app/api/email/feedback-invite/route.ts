import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';
import FeedbackInviteEmail from '@/emails/FeedbackInviteEmail';
import { createElement } from 'react';

export async function POST(req: Request) {
    try {
        const { to, firstName } = await req.json() as { to: string; firstName?: string };
        if (!to) return NextResponse.json({ error: 'Missing to' }, { status: 400 });

        await sendEmail({
            to,
            subject: 'A quick question about your NIVARA experience',
            react: createElement(FeedbackInviteEmail, { firstName: firstName || 'there' }),
        });

        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error('feedback-invite email error:', err);
        return NextResponse.json({ error: 'Failed to send' }, { status: 500 });
    }
}
