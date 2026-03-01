export interface DoctorEducation {
    degree: string;
    institution: string;
    year: number;
}

export interface DoctorCredentials {
    education: DoctorEducation[];
    affiliations: string[];
    certifications: string[];
    registrationNumber: string;
}

export interface DoctorReview {
    name: string;
    rating: number;
    date: string;
    text: string;
}

export interface Doctor {
    id: string;                         // Firestore document ID (set after fetch)
    name: string;
    specialization: string;
    hospital: string;
    experience: number;
    rating: number;
    reviews: number;
    languages: string[];
    availability: string;
    consultationType: 'Both' | 'In-Person' | 'Video';
    conditions: string[];
    location: string;
    verified: boolean;
    bio: string;
    focus: string;
    credentials: DoctorCredentials;
    availableSlots: Record<string, string[]>;
    patientReviews: DoctorReview[];
    ratingBreakdown: Record<string, number>;
    active: boolean;
    uid: string | null;
}
