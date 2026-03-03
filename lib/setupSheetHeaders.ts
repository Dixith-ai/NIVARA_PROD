import { google } from 'googleapis';

const HEADERS = [
    'Timestamp', 'UID', 'Name', 'Email', 'Source',
    'Q1 Signup Smoothness', 'Q1 Detail',
    'Q2 Invasive Step', 'Q2 Detail',
    'Q3 Onboarding Length',
    'Q4 Photo Guidance', 'Q4 Detail',
    'Q5 Feeling During Scan', 'Q5 Detail',
    'Q6 First Reaction', 'Q6 Detail',
    'Q7 Confidence % Meaning', 'Q7 Detail',
    'Q8 Understood Skin Better', 'Q8 Detail',
    'Q9 Explored Doctors', 'Q9 Detail',
    'Q10 Booking Process', 'Q10 Detail',
    'Q11 Doctor Credibility', 'Q11 Detail',
    'Q12 Would Book Real Doctor', 'Q12 Detail',
    'Q13 Kiosk Awareness', 'Q13 Detail',
    'Q14 NIVARA Description', 'Q14 Detail',
    'Q15 Would Return', 'Q15 Detail',
    'Q16 Trust Score', 'Q16 Detail',
    'Q17 One Fix', 'Q17 Detail',
    'Q18 Would Recommend', 'Q18 Detail',
];

export async function setupSheetHeaders(): Promise<{ status: 'created' | 'exists' }> {
    const auth = new google.auth.GoogleAuth({
        credentials: {
            client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        },
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.GOOGLE_SHEETS_ID;

    // Check if row 1 col A already says "Timestamp"
    const existing = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'Sheet1!A1',
    });

    if (existing.data.values?.[0]?.[0] === 'Timestamp') {
        return { status: 'exists' };
    }

    // Write header row
    await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: 'Sheet1!A1',
        valueInputOption: 'RAW',
        requestBody: { values: [HEADERS] },
    });

    return { status: 'created' };
}
