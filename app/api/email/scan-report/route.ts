import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';
import { ScanReportEmail } from '@/emails/ScanReportEmail';
import { generateScanPDF } from '@/lib/generateScanPDF';

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
        const { to, firstName, topCondition, confidence, severity, scanId, otherConditions } = body;

        // Build full predictions array (top condition first, then the rest)
        const predictions = [
            { condition: topCondition, confidence },
            ...otherConditions,
        ];

        // ── Generate PDF ─────────────────────────────────────────────────
        // Non-blocking: if PDF fails, email still sends without attachment.
        let attachments: { filename: string; content: Buffer; contentType: string }[] | undefined;

        console.log('[scan-report] Starting PDF generation for scanId:', scanId);
        try {
            const pdfBytes = await generateScanPDF({
                firstName,
                scanId,
                date: new Date().toISOString(),
                topCondition,
                confidence,
                severity,
                predictions,
            });
            console.log('[scan-report] PDF generated, size:', pdfBytes.length, 'bytes');

            attachments = [{
                filename: `NIVARA-${firstName}-Skin-Report.pdf`,
                content: Buffer.from(pdfBytes),   // pass Buffer directly — most reliable
                contentType: 'application/pdf',
            }];

            console.log('[scan-report] Attachment built, sending email with PDF to:', to);
        } catch (pdfErr) {
            console.error(
                '[scan-report] PDF generation failed — sending email without attachment.',
                pdfErr instanceof Error
                    ? `${pdfErr.message}\n${pdfErr.stack}`
                    : String(pdfErr),
            );
        }

        // ── Send email ────────────────────────────────────────────────────
        await sendEmail({
            to,
            subject: `Your NIVARA scan report is ready — ${topCondition}`,
            react: ScanReportEmail({
                firstName,
                topCondition,
                confidence,
                severity,
                scanId,
                otherConditions,
            }),
            attachments,
        });

        console.log('[scan-report] Email sent successfully. Attachment included:', !!attachments);

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('[scan-report] Route error:', err instanceof Error ? err.stack : String(err));
        return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }
}
