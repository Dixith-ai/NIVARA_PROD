import { google } from 'googleapis';

export async function appendFeedbackRow(data: Record<string, unknown>) {
    const auth = new google.auth.GoogleAuth({
        credentials: {
            client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        },
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    const row = [
        new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        data.uid || 'Anonymous',
        data.userName || '—',
        data.userEmail || '—',
        data.source,
        data.q1_signup || '—',
        data.q1_detail || '—',
        data.q2_onboarding || '—',
        data.q2_detail || '—',
        data.q3_length || '—',
        data.q4_photo || '—',
        data.q4_detail || '—',
        data.q5_feeling || '—',
        data.q5_detail || '—',
        data.q6_reaction || '—',
        data.q6_detail || '—',
        data.q7_confidence || '—',
        data.q7_detail || '—',
        data.q8_understood || '—',
        data.q8_detail || '—',
        data.q9_doctors || '—',
        data.q9_detail || '—',
        data.q10_booking || '—',
        data.q10_detail || '—',
        data.q11_credibility || '—',
        data.q11_detail || '—',
        data.q12_would_book || '—',
        data.q12_detail || '—',
        data.q13_kiosk || '—',
        data.q13_detail || '—',
        data.q14_description || '—',
        data.q14_detail || '—',
        data.q15_return || '—',
        data.q15_detail || '—',
        data.q16_trust_score || '—',
        data.q16_detail || '—',
        data.q17_fix || '—',
        data.q17_detail || '—',
        data.q18_recommend || '—',
        data.q18_detail || '—',
    ];

    await sheets.spreadsheets.values.append({
        spreadsheetId: process.env.GOOGLE_SHEETS_ID,
        range: 'Sheet1!A1',
        valueInputOption: 'RAW',
        requestBody: { values: [row] },
    });
}
