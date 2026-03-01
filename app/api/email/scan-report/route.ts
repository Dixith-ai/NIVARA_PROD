import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';
import { ScanReportEmail } from '@/emails/ScanReportEmail';

interface Body {
    to: string;
    firstName: string;
    topCondition: string;
    confidence: number;
    severity: 'High' | 'Moderate' | 'Low';
    scanId: string;
    otherConditions: { condition: string; confidence: number }[];
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json() as Body;
        await sendEmail({
            to: body.to,
            subject: `Your NIVARA scan report is ready — ${body.topCondition}`,
            react: ScanReportEmail({
                firstName: body.firstName,
                topCondition: body.topCondition,
                confidence: body.confidence,
                severity: body.severity,
                scanId: body.scanId,
                otherConditions: body.otherConditions,
            }),
        });
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }
}
