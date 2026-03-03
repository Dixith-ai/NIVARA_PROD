import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export interface ScanPDFData {
    firstName: string;
    scanId: string;
    date: string;
    topCondition: string;
    confidence: number;
    severity: 'High' | 'Moderate' | 'Low';
    predictions: { condition: string; confidence: number }[];
}

/* ── Colour palette ─────────────────────────────────────── */
const GOLD = rgb(201 / 255, 168 / 255, 76 / 255);
const DARK = rgb(15 / 255, 15 / 255, 15 / 255);
const DGREY = rgb(100 / 255, 100 / 255, 100 / 255);
const LGREY = rgb(180 / 255, 180 / 255, 180 / 255);
const NEAR_BK = rgb(15 / 255, 15 / 255, 15 / 255);
const WHITE = rgb(1, 1, 1);
const ROW_ALT = rgb(248 / 255, 248 / 255, 248 / 255);
const META_BG = rgb(248 / 255, 248 / 255, 248 / 255);

const SEV_HIGH = rgb(220 / 255, 38 / 255, 38 / 255);
const SEV_MOD = rgb(234 / 255, 179 / 255, 8 / 255);
const SEV_LOW = rgb(34 / 255, 197 / 255, 94 / 255);

function sevColor(s: 'High' | 'Moderate' | 'Low') {
    if (s === 'High') return SEV_HIGH;
    if (s === 'Moderate') return SEV_MOD;
    return SEV_LOW;
}

function confColor(c: number) {
    if (c > 50) return GOLD;
    if (c >= 10) return DGREY;
    return LGREY;
}

/** Spaced uppercase label: "HELLO" → "H E L L O" */
function spaced(s: string) {
    return s.split('').join(' ');
}

/** Format ISO date as "04 Mar 2026" */
function fmtDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric',
    });
}

/** Draw a rounded-rectangle pill. pdf-lib has no native rounded rect,
 *  so we approximate with a rect + clipping region using small corner cuts. */
function drawPill(
    page: ReturnType<PDFDocument['addPage']>,
    x: number, y: number,
    w: number, h: number,
    r: number,
    color: ReturnType<typeof rgb>,
) {
    // Two cross-shaped rects fill the pill body
    page.drawRectangle({ x: x + r, y, width: w - r * 2, height: h, color }); // vertical band
    page.drawRectangle({ x, y: y + r, width: w, height: h - r * 2, color }); // horizontal band
    // Four corner circles — pdf-lib drawEllipse x,y IS the centre of the ellipse
    page.drawEllipse({ x: x + r, y: y + r, xScale: r, yScale: r, color }); // bottom-left
    page.drawEllipse({ x: x + w - r, y: y + r, xScale: r, yScale: r, color }); // bottom-right
    page.drawEllipse({ x: x + r, y: y + h - r, xScale: r, yScale: r, color }); // top-left
    page.drawEllipse({ x: x + w - r, y: y + h - r, xScale: r, yScale: r, color }); // top-right
}

export async function generateScanPDF(data: ScanPDFData): Promise<Uint8Array> {
    const { firstName, scanId, date, topCondition, confidence, severity, predictions } = data;

    const pdfDoc = await PDFDocument.create();
    const W = 595, H = 842; // A4 points
    const page = pdfDoc.addPage([W, H]);

    const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const regular = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const MAR = 50;          // left/right margin
    const BODY = W - MAR * 2; // content width
    let y = H;                // cursor starts at top

    /* ══════════════════════════════════════════════════════════
       1. HEADER — dark bar + "NIVARA" centred in gold
       ══════════════════════════════════════════════════════════ */
    const HDR_H = 80;
    page.drawRectangle({ x: 0, y: H - HDR_H, width: W, height: HDR_H, color: NEAR_BK });

    const nivaraText = 'NIVARA';
    const nivaraSize = 28;
    const nivaraW = bold.widthOfTextAtSize(nivaraText, nivaraSize);
    page.drawText(nivaraText, {
        x: (W - nivaraW) / 2,
        y: H - HDR_H + (HDR_H - nivaraSize) / 2 - 2,
        size: nivaraSize, font: bold, color: GOLD,
    });

    y = H - HDR_H;

    // Thin gold line below header bar
    page.drawLine({ start: { x: 0, y }, end: { x: W, y }, thickness: 1.5, color: GOLD });
    y -= 1.5;

    /* ══════════════════════════════════════════════════════════
       2. META SECTION — light grey bg, two-column lines
       ══════════════════════════════════════════════════════════ */
    const META_PAD = 15;
    const META_H = 58;

    page.drawRectangle({ x: 0, y: y - META_H, width: W, height: META_H, color: META_BG });

    // Line 1 — left: "Skin Analysis Report"  right: "Report ID: {scanId}"
    const line1Y = y - META_PAD - 13;
    page.drawText('Skin Analysis Report', {
        x: MAR, y: line1Y, size: 14, font: bold, color: DARK,
    });
    const idText = `Report ID: ${scanId}`;
    const idW = regular.widthOfTextAtSize(idText, 10);
    page.drawText(idText, {
        x: W - MAR - idW, y: line1Y + 2, size: 10, font: regular, color: DGREY,
    });

    // Line 2 — left: "Prepared for: {firstName}"  right: "Generated: {date}"
    const line2Y = line1Y - 18;
    page.drawText(`Prepared for: ${firstName}`, {
        x: MAR, y: line2Y, size: 11, font: regular, color: DARK,
    });
    const genText = `Generated: ${fmtDate(date)}`;
    const genW = regular.widthOfTextAtSize(genText, 10);
    page.drawText(genText, {
        x: W - MAR - genW, y: line2Y, size: 10, font: regular, color: DGREY,
    });

    y -= META_H;

    // Gold divider
    page.drawLine({ start: { x: MAR, y }, end: { x: W - MAR, y }, thickness: 1, color: GOLD });
    y -= 24;

    /* ══════════════════════════════════════════════════════════
       3. PRIMARY DIAGNOSIS
       ══════════════════════════════════════════════════════════ */
    // Spaced label
    page.drawText(spaced('PRIMARY DIAGNOSIS'), {
        x: MAR, y, size: 9, font: bold, color: GOLD,
    });
    y -= 20;

    // Condition name
    page.drawText(topCondition, {
        x: MAR, y, size: 20, font: bold, color: DARK,
    });
    y -= 22;

    // Confidence
    page.drawText(`${confidence.toFixed(1)}% confidence`, {
        x: MAR, y, size: 12, font: regular, color: GOLD,
    });
    y -= 26;

    // Severity pill: 120 × 22, radius 11
    const PILL_W = 130, PILL_H = 22, PILL_R = 11;
    const sc = sevColor(severity);
    drawPill(page, MAR, y - PILL_H, PILL_W, PILL_H, PILL_R, sc);

    const pillLabel = `${severity.toUpperCase()} SEVERITY`;
    const pillLabelW = bold.widthOfTextAtSize(pillLabel, 10);
    page.drawText(pillLabel, {
        x: MAR + (PILL_W - pillLabelW) / 2,
        y: y - PILL_H + (PILL_H - 10) / 2 + 1,
        size: 10, font: bold, color: WHITE,
    });

    y -= PILL_H + 20;

    // Gold divider
    page.drawLine({ start: { x: MAR, y }, end: { x: W - MAR, y }, thickness: 1, color: GOLD });
    y -= 24;

    /* ══════════════════════════════════════════════════════════
       4. DIFFERENTIAL ANALYSIS TABLE
       ══════════════════════════════════════════════════════════ */
    page.drawText(spaced('DIFFERENTIAL ANALYSIS'), {
        x: MAR, y, size: 9, font: bold, color: GOLD,
    });
    y -= 14;

    const ROW_H = 24;
    const TABLE_W = BODY;
    const MAX_CONF = 100;

    for (let i = 0; i < predictions.length; i++) {
        const pred = predictions[i];
        const isTop = i === 0;
        const rowBg = i % 2 === 0 ? WHITE : ROW_ALT;
        const rowX = MAR;
        const rowY = y - ROW_H;

        // Row background
        page.drawRectangle({ x: rowX, y: rowY, width: TABLE_W, height: ROW_H, color: rowBg });

        // Confidence bar (gold @ 15% opacity effect — draw a low-opacity gold rect)
        const barW = TABLE_W * Math.min(pred.confidence / MAX_CONF, 1);
        // Approximate 15% opacity by blending gold with white: gold*0.15 + white*0.85
        const barColor = rgb(
            201 / 255 * 0.15 + 1 * 0.85,
            168 / 255 * 0.15 + 1 * 0.85,
            76 / 255 * 0.15 + 1 * 0.85,
        );
        page.drawRectangle({ x: rowX, y: rowY, width: barW, height: ROW_H, color: barColor });

        // Gold left border for top row (3px)
        if (isTop) {
            page.drawRectangle({ x: rowX, y: rowY, width: 3, height: ROW_H, color: GOLD });
        }

        // Condition name
        const textX = rowX + (isTop ? 12 : 10);
        const textY = rowY + (ROW_H - 11) / 2 + 1;
        page.drawText(pred.condition, {
            x: textX, y: textY,
            size: 11,
            font: isTop ? bold : regular,
            color: DARK,
        });

        // Confidence % — right-aligned, colour by value
        const confStr = `${pred.confidence.toFixed(1)}%`;
        const confStrW = bold.widthOfTextAtSize(confStr, 11);
        page.drawText(confStr, {
            x: rowX + TABLE_W - confStrW - 10, y: textY,
            size: 11, font: bold,
            color: confColor(pred.confidence),
        });

        y -= ROW_H;
    }

    y -= 16;

    /* ══════════════════════════════════════════════════════════
       5. FOOTER — gold line + dark bar
       ══════════════════════════════════════════════════════════ */
    const FTR_H = 60;
    const FTR_Y = 0;           // stick to page bottom
    const GOLD_LY = FTR_H;       // gold line sits on top of footer bar

    // Gold line above footer
    page.drawLine({
        start: { x: 0, y: FTR_Y + FTR_H },
        end: { x: W, y: FTR_Y + FTR_H },
        thickness: 1, color: GOLD,
    });

    // Dark bar
    page.drawRectangle({ x: 0, y: FTR_Y, width: W, height: FTR_H, color: NEAR_BK });

    // Line 1 — disclaimer
    const disc1 = 'This report is AI-assisted and not a substitute for professional medical advice. Consult a qualified dermatologist.';
    const disc1Size = 9;
    const disc1W = regular.widthOfTextAtSize(disc1, disc1Size);
    // May overflow — centre it accepting overflow on narrow text
    page.drawText(disc1, {
        x: Math.max(10, (W - disc1W) / 2),
        y: FTR_Y + FTR_H - 22,
        size: disc1Size, font: regular, color: WHITE,
    });

    // Line 2 — copyright
    const disc2 = '© NIVARA Health Technologies · Confidential';
    const disc2Size = 9;
    const disc2W = regular.widthOfTextAtSize(disc2, disc2Size);
    page.drawText(disc2, {
        x: (W - disc2W) / 2,
        y: FTR_Y + FTR_H - 38,
        size: disc2Size, font: regular,
        color: LGREY,
    });

    void GOLD_LY; // suppress unused var warning

    return pdfDoc.save();
}
