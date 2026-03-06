import { google } from 'googleapis';

export const SHEET_HEADERS = [
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

function buildAuth() {
    return new google.auth.GoogleAuth({
        credentials: {
            client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        },
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
}

export async function setupSheetHeaders(): Promise<{ status: 'created' | 'exists' }> {
    const sheets = google.sheets({ version: 'v4', auth: buildAuth() });
    const spreadsheetId = process.env.GOOGLE_SHEETS_ID;

    // 1. Check if A1 already says "Timestamp" — if so, nothing to do
    const existing = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'Sheet1!A1',
    });

    if (existing.data.values?.[0]?.[0] === 'Timestamp') {
        return { status: 'exists' };
    }

    // 2. Clear the entire sheet first to avoid duplicate rows
    await sheets.spreadsheets.values.clear({
        spreadsheetId,
        range: 'Sheet1',
    });

    // 3. Write the correct header row to row 1
    await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: 'Sheet1!A1',
        valueInputOption: 'RAW',
        requestBody: { values: [SHEET_HEADERS] },
    });

    return { status: 'created' };
}

/** Hard reset: wipe Sheet1 completely and re-write the header row.
 *  Used by the /api/reset-sheet route. */
export async function resetSheet(): Promise<void> {
    const sheets = google.sheets({ version: 'v4', auth: buildAuth() });
    const spreadsheetId = process.env.GOOGLE_SHEETS_ID;

    await sheets.spreadsheets.values.clear({
        spreadsheetId,
        range: 'Sheet1',
    });

    await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: 'Sheet1!A1',
        valueInputOption: 'RAW',
        requestBody: { values: [SHEET_HEADERS] },
    });
}

export const WAITLIST_HEADERS = ['Timestamp', 'First Name', 'Email', 'City', 'UID'];

export async function setupWaitlistSheet(): Promise<{ status: 'created' | 'exists' }> {
    const sheets = google.sheets({ version: 'v4', auth: buildAuth() });
    const spreadsheetId = process.env.GOOGLE_SHEETS_ID;

    // 1. Get all sheets in the spreadsheet
    const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId });
    const existingSheets = spreadsheet.data.sheets || [];
    const waitlistSheet = existingSheets.find(s => s.properties?.title === 'Waitlist');

    // 2. If Waitlist sheet doesn't exist, create it
    if (!waitlistSheet) {
        await sheets.spreadsheets.batchUpdate({
            spreadsheetId,
            requestBody: {
                requests: [
                    {
                        addSheet: {
                            properties: {
                                title: 'Waitlist',
                            },
                        },
                    },
                ],
            },
        });
    }

    // 3. Check if headers already exist
    const existing = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'Waitlist!A1',
    });

    if (existing.data.values?.[0]?.[0] === 'Timestamp') {
        return { status: 'exists' };
    }

    // 4. Write headers
    await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: 'Waitlist!A1',
        valueInputOption: 'RAW',
        requestBody: { values: [WAITLIST_HEADERS] },
    });

    return { status: 'created' };
}
