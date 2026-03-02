import { NextResponse } from 'next/server';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function POST(req: Request) {
    try {
        const { to, firstName, uid } = await req.json();

        if (!to) {
            return NextResponse.json({ error: 'Missing to address' }, { status: 400 });
        }

        const sendAfter = new Date(Date.now() + 2 * 60 * 1000).toISOString();

        await addDoc(collection(db, 'pending_feedback_emails'), {
            to,
            firstName: firstName || 'there',
            uid: uid || null,
            sendAfter,
            sent: false,
        });

        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error('schedule-feedback error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
