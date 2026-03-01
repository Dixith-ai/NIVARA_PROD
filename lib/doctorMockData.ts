/* Shared mock data for Doctor Portal pages */

export const mockDoctor = {
    role: 'doctor' as const,
    name: 'Dr. Priya Nair',
    firstName: 'Priya',
    specialization: 'General Dermatology',
    hospital: 'Manipal Hospital, Bengaluru',
    experience: 12,
    rating: 4.8,
    location: 'Bengaluru',
    email: 'priya.nair@manipalhospital.org',
    phone: '+91 98765 43210',
    languages: ['English', 'Malayalam', 'Hindi'],
    verified: true,
    bio: 'Board-certified dermatologist with 12 years of clinical experience. Specializing in inflammatory skin conditions, contact dermatitis, psoriasis, and skin allergy evaluation.',
    conditions: ['Contact Dermatitis', 'Eczema', 'Psoriasis', 'Acne', 'Skin Allergies', 'Urticaria', 'Fungal Infections', 'Pigmentation Disorders'],
    performance: {
        consultationsThisMonth: 24,
        avgResponseTime: '3.2 hours',
        satisfactionRating: 4.8,
        topConditions: ['Contact Dermatitis', 'Eczema', 'Psoriasis', 'Acne', 'Urticaria'],
        monthlyTrend: [18, 22, 19, 25, 21, 24, 20, 27, 23, 24, 26, 24], // Jan–Dec
    },
    credentials: {
        education: [
            { degree: 'MD, Dermatology', institution: 'Kasturba Medical College, Manipal', year: 2012 },
            { degree: 'MBBS', institution: 'Kasturba Medical College, Manipal', year: 2008 },
        ],
        affiliations: [
            'Manipal Hospital, Bengaluru (Current)',
            'St. John\'s Medical College Hospital, Bengaluru (2012–2018)',
        ],
        certifications: [
            'Member, IADVL',
            'Fellow, International Society of Dermatology',
            'Certified in Dermoscopy, European Academy of Dermatology',
        ],
        registrationNumber: 'KMC-DERM-2012-04821',
    },
};

export const mockStats = {
    totalPatients: 142,
    pendingRequests: 3,
    todayAppointments: 4,
    scansAwaitingReview: 2,
};

export interface AppointmentRequest {
    id: number;
    patient: { name: string; age: number; location: string; photo: null };
    requestedDate: string;
    requestedTime: string;
    note: string;
    scan: { topResult: string; confidence: number; severity: string; date: string };
    status: 'pending' | 'accepted' | 'declined';
}

export const mockAppointmentRequests: AppointmentRequest[] = [
    {
        id: 1,
        patient: { name: 'Arjun Mehta', age: 28, location: 'Bengaluru', photo: null },
        requestedDate: '20 Mar 2025', requestedTime: '11:00 AM',
        note: 'I\'ve been experiencing this rash for about 3 weeks now. The NIVARA scan flagged Contact Dermatitis. Hoping to get a proper diagnosis.',
        scan: { topResult: 'Contact Dermatitis', confidence: 78, severity: 'Moderate', date: '12 Feb 2025' },
        status: 'pending',
    },
    {
        id: 2,
        patient: { name: 'Sneha Rao', age: 34, location: 'Mysuru', photo: null },
        requestedDate: '21 Mar 2025', requestedTime: '2:30 PM',
        note: '',
        scan: { topResult: 'Psoriasis', confidence: 71, severity: 'High', date: '15 Feb 2025' },
        status: 'pending',
    },
    {
        id: 3,
        patient: { name: 'Kiran Patel', age: 22, location: 'Bengaluru', photo: null },
        requestedDate: '22 Mar 2025', requestedTime: '4:00 PM',
        note: 'First time using NIVARA. The device flagged eczema. Would like a professional opinion.',
        scan: { topResult: 'Eczema', confidence: 83, severity: 'Low', date: '18 Feb 2025' },
        status: 'pending',
    },
];

export const mockUpcomingAppointments = [
    { id: 4, patient: { name: 'Divya Sharma', age: 29, location: 'Bengaluru', photo: null }, date: '15 Mar 2025', time: '10:00 AM', scan: { topResult: 'Rosacea', severity: 'Moderate' } },
    { id: 5, patient: { name: 'Rohit Menon', age: 41, location: 'Bengaluru', photo: null }, date: '15 Mar 2025', time: '11:30 AM', scan: { topResult: 'Seborrheic Dermatitis', severity: 'Low' } },
    { id: 6, patient: { name: 'Ananya Krishnan', age: 26, location: 'Bengaluru', photo: null }, date: '15 Mar 2025', time: '2:00 PM', scan: { topResult: 'Contact Dermatitis', severity: 'Moderate' } },
    { id: 7, patient: { name: 'Vijay Nair', age: 55, location: 'Bengaluru', photo: null }, date: '15 Mar 2025', time: '4:30 PM', scan: { topResult: 'Psoriasis', severity: 'High' } },
];

export const mockPastAppointments = [
    { id: 8, patient: { name: 'Meera Iyer', age: 38 }, date: '5 Mar 2025', scan: { topResult: 'Eczema', severity: 'Low' } },
    { id: 9, patient: { name: 'Suresh Kumar', age: 47 }, date: '1 Mar 2025', scan: { topResult: 'Fungal Infection', severity: 'Moderate' } },
];

export const mockScansAwaitingReview = [
    {
        id: 1, patient: { name: 'Sneha Rao', age: 34 }, date: '15 Feb 2025', source: 'Device', severity: 'High',
        diagnosis: {
            primary: { condition: 'Psoriasis', confidence: 71 },
            secondary: [{ condition: 'Eczema', confidence: 18 }, { condition: 'Seborrheic Dermatitis', confidence: 8 }],
        },
    },
    {
        id: 2, patient: { name: 'Arjun Mehta', age: 28 }, date: '12 Feb 2025', source: 'Demo', severity: 'Moderate',
        diagnosis: {
            primary: { condition: 'Contact Dermatitis', confidence: 78 },
            secondary: [{ condition: 'Eczema', confidence: 14 }, { condition: 'Psoriasis', confidence: 5 }],
        },
    },
];

export interface AvailabilityDay {
    active: boolean;
    slots: string[];
}

export const mockAvailability: Record<string, AvailabilityDay> = {
    Monday: { active: true, slots: ['9:00 AM', '10:30 AM', '2:00 PM', '4:30 PM'] },
    Tuesday: { active: true, slots: ['11:00 AM', '3:00 PM'] },
    Wednesday: { active: true, slots: ['9:30 AM', '1:00 PM', '5:00 PM'] },
    Thursday: { active: false, slots: [] },
    Friday: { active: true, slots: ['10:00 AM', '2:30 PM', '4:00 PM'] },
    Saturday: { active: true, slots: ['9:00 AM', '11:30 AM'] },
    Sunday: { active: false, slots: [] },
};

export const mockPatients = [
    { id: 1, name: 'Arjun Mehta', age: 28, location: 'Bengaluru', condition: 'Contact Dermatitis', severity: 'Moderate', scans: 2, appointments: 1, lastSeen: '12 Feb 2025' },
    { id: 2, name: 'Sneha Rao', age: 34, location: 'Mysuru', condition: 'Psoriasis', severity: 'High', scans: 3, appointments: 2, lastSeen: '15 Feb 2025' },
    { id: 3, name: 'Kiran Patel', age: 22, location: 'Bengaluru', condition: 'Eczema', severity: 'Low', scans: 1, appointments: 1, lastSeen: '18 Feb 2025' },
    { id: 4, name: 'Divya Sharma', age: 29, location: 'Bengaluru', condition: 'Rosacea', severity: 'Moderate', scans: 2, appointments: 3, lastSeen: '5 Mar 2025' },
    { id: 5, name: 'Rohit Menon', age: 41, location: 'Bengaluru', condition: 'Seborrheic Dermatitis', severity: 'Low', scans: 1, appointments: 1, lastSeen: '1 Mar 2025' },
    { id: 6, name: 'Meera Iyer', age: 38, location: 'Chennai', condition: 'Eczema', severity: 'Low', scans: 4, appointments: 2, lastSeen: '5 Mar 2025' },
];

export const mockPatientDossier = {
    id: 1,
    name: 'Arjun Mehta',
    age: 28,
    location: 'Bengaluru',
    skinType: 'Type III (Medium)',
    memberSince: 'January 2025',
    totalScans: 2,
    appointmentsWithDoctor: 1,
    lastSeen: '12 Feb 2025',
    scanHistory: [
        { id: 'S1', date: '12 Feb 2025', source: 'NIVARA Device', topResult: 'Contact Dermatitis', confidence: 78, severity: 'Moderate' },
        { id: 'S2', date: '20 Jan 2025', source: 'Demo Scan', topResult: 'Eczema', confidence: 62, severity: 'Low' },
    ],
    appointmentHistory: [
        { date: '20 Mar 2025 · 11:00 AM', status: 'upcoming', scan: 'Contact Dermatitis (78%)' },
        { date: '12 Feb 2025 · 10:00 AM', status: 'past', scan: 'Eczema (62%)' },
    ],
};
