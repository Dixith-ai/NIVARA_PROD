export interface Appointment {
    id: string;                          // Firestore document ID (set after fetch)
    patientId: string;
    patientName: string;
    patientEmail: string;
    doctorId: string;
    doctorName: string;
    doctorSpecialization: string;
    doctorHospital: string;
    requestedDate: string;
    requestedTime: string;
    note: string;
    status: 'pending' | 'accepted' | 'declined' | 'completed';
    createdAt: string;
    scanId: string | null;
    topCondition: string | null;
    severity: string | null;
}
