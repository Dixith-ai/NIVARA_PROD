import { initializeApp, getApp, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

const ADMIN_APP_NAME = 'nivara-admin';

export function getAdminApp(): App {
    console.log('[firebaseAdmin] Getting Admin App...');
    console.log('[firebaseAdmin] Project ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
    console.log('[firebaseAdmin] Service Account Email:', process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL);
    console.log('[firebaseAdmin] Private Key exists:', !!process.env.GOOGLE_PRIVATE_KEY);
    console.log('[firebaseAdmin] Private Key length:', process.env.GOOGLE_PRIVATE_KEY?.length);

    if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
        throw new Error('NEXT_PUBLIC_FIREBASE_PROJECT_ID is not set');
    }
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL) {
        throw new Error('GOOGLE_SERVICE_ACCOUNT_EMAIL is not set');
    }
    if (!process.env.GOOGLE_PRIVATE_KEY) {
        throw new Error('GOOGLE_PRIVATE_KEY is not set');
    }

    try {
        const app = getApp(ADMIN_APP_NAME);
        console.log('[firebaseAdmin] Using existing named Admin app:', ADMIN_APP_NAME);
        return app;
    } catch {
        console.log('[firebaseAdmin] Named app not found, initializing new Admin app:', ADMIN_APP_NAME);
        try {
            const app = initializeApp({
                credential: cert({
                    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
                    clientEmail: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
                    privateKey: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
                }),
            }, ADMIN_APP_NAME);
            console.log('[firebaseAdmin] Firebase Admin initialized successfully with name:', ADMIN_APP_NAME);
            return app;
        } catch (initErr) {
            console.error('[firebaseAdmin] Initialization failed:', initErr);
            throw initErr;
        }
    }
}

export function getAdminDb(): Firestore {
    console.log('[firebaseAdmin] Getting Firestore instance from Admin app');
    const db = getFirestore(getAdminApp());
    console.log('[firebaseAdmin] Firestore instance obtained');
    return db;
}
