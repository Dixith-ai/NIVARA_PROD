import { NextResponse } from 'next/server';
import { resetSheet } from '@/lib/setupSheetHeaders';

export async function GET(req: Request) {
    // Verify CRON_SECRET before doing anything destructive
    const authHeader = req.headers.get('authorization');
    const expected = `Bearer ${process.env.CRON_SECRET}`;

    if (!authHeader || authHeader !== expected) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await resetSheet();
        return NextResponse.json({ message: 'Sheet reset complete' });
    } catch (err) {
        console.error('reset-sheet error:', err);
        return NextResponse.json({ error: String(err) }, { status: 500 });
    }
}
