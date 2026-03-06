import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';
import FeedbackSummaryEmail from '@/emails/FeedbackSummaryEmail';
import { createElement } from 'react';
import { appendFeedbackRow } from '@/lib/googleSheets';
import { getAdminDb } from '@/lib/firebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';

export async function POST(req: Request) {
    let payload;
    
    try {
        payload = await req.json();
    } catch (parseErr) {
        console.error('[feedback-submitted] JSON parse error:', parseErr);
        return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
    }

    // Write to Firestore using Admin SDK (bypasses security rules)
    console.log('[feedback-submitted] About to write to Firestore...');
    console.log('[feedback-submitted] Payload keys:', Object.keys(payload));
    
    let docRef;
    try {
        const adminDb = getAdminDb();
        console.log('[feedback-submitted] Admin DB instance obtained');
        
        const feedbackData = {
            ...payload,
            completedAt: FieldValue.serverTimestamp(),
        };
        
        docRef = await adminDb.collection('feedback').add(feedbackData);
        console.log('[feedback-submitted] Firestore write complete, doc id:', docRef.id);
    } catch (firestoreErr) {
        console.error('[feedback-submitted] FIRESTORE WRITE FAILED:', firestoreErr);
        console.error('[feedback-submitted] Error details:', {
            message: (firestoreErr as Error).message,
            stack: (firestoreErr as Error).stack,
            name: (firestoreErr as Error).name,
        });
        return NextResponse.json({ 
            error: 'Firestore write failed', 
            details: (firestoreErr as Error).message 
        }, { status: 500 });
    }

    // Send email notification
    try {
        await sendEmail({
            to: 'nivara.dermat@gmail.com',
            subject: 'New NIVARA Feedback Received',
            react: createElement(FeedbackSummaryEmail, payload),
        });
        console.log('[feedback-submitted] Email sent successfully');
    } catch (emailErr) {
        console.error('[feedback-submitted] Email send failed (non-blocking):', emailErr);
        // Don't fail the request if email fails
    }

    // Append to Google Sheet — non-blocking failure
    try {
        await appendFeedbackRow(payload);
        console.log('[feedback-submitted] Google Sheets append successful');
    } catch (sheetsErr) {
        console.error('[feedback-submitted] Google Sheets append error (non-blocking):', sheetsErr);
        // Don't fail the request if sheets fails
    }

    return NextResponse.json({ ok: true, docId: docRef.id });
}
