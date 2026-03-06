import { NextResponse } from 'next/server';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { sendEmail } from '@/lib/email';
import { appendWaitlistRow } from '@/lib/googleSheets';
import { createElement } from 'react';
import WaitlistConfirmEmail from '@/emails/WaitlistConfirmEmail';
import WaitlistNotifyEmail from '@/emails/WaitlistNotifyEmail';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { firstName, email, city, uid } = body;

        if (!firstName || !email || !city) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // 1. Save to Firestore
        const docRef = await addDoc(collection(db, 'waitlist'), {
            firstName,
            email,
            city,
            uid: uid || null,
            joinedAt: serverTimestamp(),
        });

        const joinedAtString = new Date().toLocaleString('en-IN', {
            timeZone: 'Asia/Kolkata',
            dateStyle: 'long',
            timeStyle: 'short',
        });

        // 2. Send confirmation email to user
        try {
            await sendEmail({
                to: email,
                subject: `You are in, ${firstName}.`,
                react: createElement(WaitlistConfirmEmail, { firstName }),
            });
        } catch (emailErr) {
            console.error('Failed to send confirmation email:', emailErr);
        }

        // 3. Send notification email to admin
        try {
            await sendEmail({
                to: 'nivara.dermat@gmail.com',
                subject: 'New Waitlist Signup',
                react: createElement(WaitlistNotifyEmail, {
                    firstName,
                    email,
                    city,
                    joinedAt: joinedAtString,
                }),
            });
        } catch (emailErr) {
            console.error('Failed to send notification email:', emailErr);
        }

        // 4. Append to Google Sheets (non-blocking)
        try {
            await appendWaitlistRow({
                firstName,
                email,
                city,
                uid: uid || null,
                joinedAt: joinedAtString,
            });
        } catch (sheetsErr) {
            console.error('Failed to append to Google Sheets:', sheetsErr);
            // Do not block submission if Sheets fails
        }

        return NextResponse.json({
            success: true,
            id: docRef.id,
        });
    } catch (error) {
        console.error('Waitlist submission error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
