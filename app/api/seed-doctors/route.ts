import { NextResponse } from 'next/server';

// ── DISABLED ──────────────────────────────────────────────────────────────────
// Seeded 5 doctors on 2026-03-04. Name fix (Chethan H → Chethan G) applied same day.
// Route is now permanently disabled.
// ─────────────────────────────────────────────────────────────────────────────

export async function GET() {
    return NextResponse.json(
        { error: 'This seed route has already run and is now disabled.' },
        { status: 410 }
    );
}
