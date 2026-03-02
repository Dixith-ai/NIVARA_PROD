import { NextResponse } from 'next/server';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function GET(req: Request) {
    // 1. Verify cron secret
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    try {
        const nowIso = new Date().toISOString();

        // 2. Fetch pending emails (filter sendAfter manually to avoid composite index requirement)
        const emailsRef = collection(db, 'pending_feedback_emails');
        const qEmails = query(emailsRef, where('sent', '==', false));
        const snapshot = await getDocs(qEmails);

        let sentCount = 0;
        let skippedCount = 0;

        for (const document of snapshot.docs) {
            const data = document.data();

            if (data.sendAfter > nowIso) {
                continue; // Not time yet
            }

            const uid = data.uid;

            // 3. Check if user already submitted feedback
            let alreadySubmitted = false;
            if (uid) {
                const feedbackRef = collection(db, 'feedback');
                const qFeedback = query(feedbackRef, where('uid', '==', uid));
                const fbSnap = await getDocs(qFeedback);
                alreadySubmitted = !fbSnap.empty;
            }

            if (alreadySubmitted) {
                // Mark as sent to stop checking it
                await updateDoc(doc(db, 'pending_feedback_emails', document.id), {
                    sent: true,
                    skippedAt: nowIso,
                    reason: 'already_submitted',
                });
                skippedCount++;
            } else {
                // Send email
                const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
                const emailRes = await fetch(`${appUrl}/api/email/feedback-invite`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ to: data.to, firstName: data.firstName }),
                });

                if (emailRes.ok) {
                    await updateDoc(doc(db, 'pending_feedback_emails', document.id), {
                        sent: true,
                        sentAt: nowIso,
                    });
                    sentCount++;
                } else {
                    console.error('Failed to send invite email for', data.to);
                }
            }
        }

        return NextResponse.json({ sent: sentCount, skipped: skippedCount });
    } catch (error) {
        console.error('Feedback cron error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
