import {
    collection,
    addDoc,
    getDocs,
    getDoc,
    doc,
    query,
    orderBy,
    limit,
    where,
} from 'firebase/firestore';
import { db } from './firebase';
import type { ScanRecord } from '@/types/scan';
import type { Doctor } from '@/types/doctor';
import type { Appointment } from '@/types/appointment';

/* ══════════════════════════════════════════════
   SEVERITY HELPER
   ══════════════════════════════════════════════ */

/**
 * Derive severity from the top-predicted condition name.
 * Based on medical risk level — NOT confidence score.
 */
export function getSeverity(topCondition: string): 'High' | 'Moderate' | 'Low' {
    const high = ['Melanoma', 'Basal Cell Carcinoma', 'Squamous Cell Carcinoma'];
    const moderate = [
        'Eczema',
        'Atopic Dermatitis',
        'Psoriasis / Lichen Planus',
        'Tinea / Ringworm / Candidiasis',
        'Warts / Molluscum / Viral Infections',
    ];
    if (high.some(c => topCondition.toLowerCase().includes(c.toLowerCase()))) return 'High';
    if (moderate.some(c => topCondition.toLowerCase().includes(c.toLowerCase()))) return 'Moderate';
    return 'Low';
}


/* ══════════════════════════════════════════════
   SCANS
   ══════════════════════════════════════════════ */

/** Save a scan to users/{uid}/scans */
export async function saveScan(uid: string, scanData: ScanRecord): Promise<void> {
    await addDoc(collection(db, 'users', uid, 'scans'), scanData);
}

/** Get all scans for a user, newest first */
export async function getUserScans(uid: string): Promise<ScanRecord[]> {
    const q = query(
        collection(db, 'users', uid, 'scans'),
        orderBy('createdAt', 'desc')
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => d.data() as ScanRecord);
}

/** Get the single most recent scan */
export async function getLatestScan(uid: string): Promise<ScanRecord | null> {
    const q = query(
        collection(db, 'users', uid, 'scans'),
        orderBy('createdAt', 'desc'),
        limit(1)
    );
    const snap = await getDocs(q);
    if (snap.empty) return null;
    return snap.docs[0].data() as ScanRecord;
}

/* ══════════════════════════════════════════════
   DOCTORS
   ══════════════════════════════════════════════ */

/** Get all active doctors */
export async function getDoctors(): Promise<Doctor[]> {
    const q = query(
        collection(db, 'doctors'),
        where('active', '==', true)
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }) as Doctor);
}

/** Get a single doctor by Firestore document ID */
export async function getDoctorById(id: string): Promise<Doctor | null> {
    const ref = doc(db, 'doctors', id);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() } as Doctor;
}

/* ══════════════════════════════════════════════
   APPOINTMENTS
   ══════════════════════════════════════════════ */

/** Create a new appointment request */
export async function createAppointment(
    data: Omit<Appointment, 'id'>
): Promise<string> {
    const ref = await addDoc(collection(db, 'appointments'), data);
    return ref.id;
}

/** Get all appointments for a patient, newest first */
export async function getPatientAppointments(patientId: string): Promise<Appointment[]> {
    const q = query(
        collection(db, 'appointments'),
        where('patientId', '==', patientId),
        orderBy('createdAt', 'desc')
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }) as Appointment);
}

/* ══════════════════════════════════════════════
   USERS
   ══════════════════════════════════════════════ */

/** Get a user's Firestore profile document */
export async function getUserProfile(
    uid: string
): Promise<{ fullName?: string; email?: string;[key: string]: unknown } | null> {
    const ref = doc(db, 'users', uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    return snap.data() as { fullName?: string; email?: string;[key: string]: unknown };
}
