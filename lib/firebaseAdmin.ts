import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

let adminApp: App;
let adminDb: Firestore;

export function getAdminApp(): App {
    if (adminApp) return adminApp;

    console.log('[firebaseAdmin] Initializing Firebase Admin SDK...');
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

    if (getApps().length === 0) {
        try {
            adminApp = initializeApp({
                credential: cert({
                    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
                    clientEmail: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
                    privateKey: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
                }),
            });
            console.log('[firebaseAdmin] Firebase Admin initialized successfully');
        } catch (initErr) {
            console.error('[firebaseAdmin] Initialization failed:', initErr);
            throw initErr;
        }
    } else {
        adminApp = getApps()[0];
        console.log('[firebaseAdmin] Using existing Firebase Admin app');
    }

    return adminApp;
}

export function getAdminDb(): Firestore {
    if (adminDb) {
        console.log('[firebaseAdmin] Returning cached Firestore instance');
        return adminDb;
    }
    
    console.log('[firebaseAdmin] Creating new Firestore instance');
    adminDb = getFirestore(getAdminApp());
    console.log('[firebaseAdmin] Firestore instance created');
    return adminDb;
}
