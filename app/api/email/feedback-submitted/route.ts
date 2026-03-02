import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';
import FeedbackSummaryEmail from '@/emails/FeedbackSummaryEmail';
import { createElement } from 'react';

export async function POST(req: Request) {
    try {
        const payload = await req.json();

        await sendEmail({
            to: 'nivara.dermat@gmail.com',
            subject: 'New NIVARA Feedback Received',
            react: createElement(FeedbackSummaryEmail, payload),
        });

        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error('feedback-submitted email error:', err);
        return NextResponse.json({ error: 'Failed to send' }, { status: 500 });
    }
}
