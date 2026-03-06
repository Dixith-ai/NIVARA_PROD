import { NextResponse } from 'next/server';
import { setupSheetHeaders, setupWaitlistSheet } from '@/lib/setupSheetHeaders';

export async function GET() {
    try {
        const feedbackResult = await setupSheetHeaders();
        const waitlistResult = await setupWaitlistSheet();

        const messages = [];
        
        if (feedbackResult.status === 'exists') {
            messages.push('Feedback headers already set');
        } else {
            messages.push('Feedback headers written successfully');
        }

        if (waitlistResult.status === 'exists') {
            messages.push('Waitlist headers already set');
        } else {
            messages.push('Waitlist headers written successfully');
        }

        return NextResponse.json({ message: messages.join('. ') });
    } catch (err) {
        console.error('setup-sheet-headers error:', err);
        return NextResponse.json({ error: 'Failed to set headers' }, { status: 500 });
    }
}
