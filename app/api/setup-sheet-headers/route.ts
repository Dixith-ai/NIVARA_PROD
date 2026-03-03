import { NextResponse } from 'next/server';
import { setupSheetHeaders } from '@/lib/setupSheetHeaders';

export async function GET() {
    try {
        const result = await setupSheetHeaders();

        if (result.status === 'exists') {
            return NextResponse.json({ message: 'Headers already set' });
        }

        return NextResponse.json({ message: 'Headers written successfully' });
    } catch (err) {
        console.error('setup-sheet-headers error:', err);
        return NextResponse.json({ error: 'Failed to set headers' }, { status: 500 });
    }
}
