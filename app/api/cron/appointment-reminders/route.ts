import { NextRequest, NextResponse } from 'next/server';
import {
    collection,
    getDocs,
    doc,
    getDoc,
    updateDoc,
    query,
    where,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { sendEmail } from '@/lib/email';
import { AppointmentReminderEmail } from '@/emails/AppointmentReminderEmail';

export async function GET(req: NextRequest) {
    // Protect with cron secret
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const now = Date.now();
    const tomorrow = new Date(now + 24 * 60 * 60 * 1000);
    const tomorrowDateStr = tomorrow.toISOString().slice(0, 10); // YYYY-MM-DD

    const q = query(
        collection(db, 'appointments'),
        where('status', '==', 'accepted'),
        where('reminderSent', '!=', true),
    );

    const snap = await getDocs(q);
    const results: { id: string; status: string }[] = [];

    for (const apptDoc of snap.docs) {
        const appt = apptDoc.data() as {
            requestedDate: string;
            requestedTime: string;
            patientId: string;
            doctorName: string;
            doctorSpecialization: string;
            doctorHospital: string;
        };

        // Check if appointment is tomorrow
        if (!appt.requestedDate.startsWith(tomorrowDateStr)) continue;

        // Get patient email from users collection
        try {
            const userSnap = await getDoc(doc(db, 'users', appt.patientId));
            if (!userSnap.exists()) continue;
            const userData = userSnap.data() as { email?: string; fullName?: string };
            const email = userData.email;
            const firstName = userData.fullName?.split(' ')[0] ?? 'there';
            if (!email) continue;

            await sendEmail({
                to: email,
                subject: `Reminder: Your appointment with ${appt.doctorName} is tomorrow`,
                react: AppointmentReminderEmail({
                    firstName,
                    doctorName: appt.doctorName,
                    specialization: appt.doctorSpecialization,
                    hospital: appt.doctorHospital,
                    appointmentDate: appt.requestedDate,
                    appointmentTime: appt.requestedTime,
                }),
            });

            await updateDoc(apptDoc.ref, { reminderSent: true });
            results.push({ id: apptDoc.id, status: 'sent' });
        } catch (err) {
            console.error(`Failed reminder for appointment ${apptDoc.id}:`, err);
            results.push({ id: apptDoc.id, status: 'failed' });
        }
    }

    return NextResponse.json({ processed: results.length, results });
}
