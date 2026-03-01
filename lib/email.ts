import { Resend } from 'resend';
import { type ReactElement } from 'react';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({
    to,
    subject,
    react,
}: {
    to: string;
    subject: string;
    react: ReactElement;
}) {
    const { error } = await resend.emails.send({
        from: process.env.RESEND_FROM || 'NIVARA <sparsha@nivara.life>',
        to,
        subject,
        react,
    });
    if (error) {
        const msg = typeof error === 'object' ? JSON.stringify(error) : String(error);
        console.error('Resend error:', msg);
        throw new Error(msg);
    }
}
