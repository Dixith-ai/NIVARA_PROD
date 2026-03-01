// ============================================
// NIVARA — Admin Portal Mock Data
// ============================================

export const mockAdminUser = {
    role: 'admin' as const,
    name: 'Rahul Verma',
    firstName: 'Rahul',
    title: 'Super Admin',
    lastLogin: 'Today at 8:42 AM',
};

export const mockPlatformStats = {
    totalUsers: 3847,
    activeToday: 284,
    newThisWeek: 127,
    suspendedAccounts: 12,
    totalDoctors: 24,
    pendingVerification: 3,
    activeDoctors: 21,
    suspendedDoctors: 0,
    totalScans: 18432,
    scansToday: 143,
    totalAppointments: 2841,
    kiosksOnline: 11,
    kiosksTotal: 13,
    devicesLinked: 892,
    pendingDoctorVerifications: 3,
    appointmentsToday: 38,
    appointmentsPendingPlatform: 91,
    appointmentsAcceptedWeek: 74,
    appointmentsDeclinedWeek: 17,
};

export const mockAlerts = [
    { id: 1, type: 'kiosk_offline', severity: 'Critical', message: 'Kiosk KSK-007 (Mumbai Central Mall) has been offline for 26 hours', time: '26 hours ago', action: 'View Kiosk', link: '/admin/kiosks' },
    { id: 2, type: 'high_severity_no_followup', severity: 'Warning', message: 'Patient Sneha Rao received a High severity scan 8 days ago with no doctor booking', time: '8 days since scan', action: 'View Patient', link: '/admin/users' },
    { id: 3, type: 'doctor_high_decline', severity: 'Warning', message: 'Dr. Aditya Menon has declined 7 of his last 10 appointment requests', time: 'Last 14 days', action: 'View Doctor', link: '/admin/doctors' },
    { id: 4, type: 'system_diagnosis', severity: 'Info', message: 'Diagnosis system confidence dropped below 70% on 3 scans today', time: 'Today', action: 'View Scans', link: '/admin/scans' },
];

export const mockActivityFeed = [
    { time: '2 min ago', event: 'New scan completed', detail: 'Kiosk KSK-003, Bengaluru — Contact Dermatitis flagged (Moderate)' },
    { time: '5 min ago', event: 'Appointment accepted', detail: 'Dr. Priya Nair accepted request from Arjun Mehta' },
    { time: '12 min ago', event: 'New user registered', detail: 'Divya Sharma joined from Hyderabad' },
    { time: '18 min ago', event: 'Doctor account created', detail: 'Admin created account for Dr. Karthik Iyer' },
    { time: '24 min ago', event: 'Scan completed', detail: 'Demo scan — Eczema flagged (Low) — User: Rohit Menon' },
    { time: '31 min ago', event: 'Appointment declined', detail: 'Dr. Aditya Menon declined request from Meera Iyer' },
    { time: '45 min ago', event: 'Device linked', detail: 'User Vijay Nair linked device NVR-2024-00891' },
    { time: '1 hr ago', event: 'Kiosk scan', detail: 'Kiosk KSK-001, Delhi AIIMS — Psoriasis flagged (High)' },
    { time: '1 hr ago', event: 'New appointment request', detail: 'Ananya Krishnan requested appointment with Dr. Anjali Rao' },
    { time: '2 hrs ago', event: 'User suspended', detail: 'Admin suspended account: fake_user_291 — reason: suspicious activity' },
];

export const mockGeoData = [
    { city: 'Bengaluru', scans: 847 },
    { city: 'Mumbai', scans: 623 },
    { city: 'Delhi', scans: 591 },
    { city: 'Hyderabad', scans: 412 },
    { city: 'Chennai', scans: 287 },
    { city: 'Pune', scans: 198 },
];

export const mockKiosks = [
    { id: 'KSK-001', location: 'AIIMS Delhi', city: 'Delhi', type: 'Hospital', status: 'Online', totalScans: 3241, scansToday: 28, lastPing: '2 min ago', partnership: 'AIIMS Partnership', technician: 'Ramesh Kumar' },
    { id: 'KSK-002', location: 'Manipal Hospital', city: 'Bengaluru', type: 'Hospital', status: 'Online', totalScans: 2876, scansToday: 19, lastPing: '1 min ago', partnership: 'Manipal MoU', technician: 'Suresh Nair' },
    { id: 'KSK-003', location: 'Forum Mall', city: 'Bengaluru', type: 'Mall', status: 'Online', totalScans: 1923, scansToday: 31, lastPing: '3 min ago', partnership: null, technician: 'Suresh Nair' },
    { id: 'KSK-004', location: 'Kokilaben Hospital', city: 'Mumbai', type: 'Hospital', status: 'Online', totalScans: 1654, scansToday: 22, lastPing: '4 min ago', partnership: 'Kokilaben MoU', technician: 'Vinod Sharma' },
    { id: 'KSK-005', location: 'Phoenix Palladium', city: 'Mumbai', type: 'Mall', status: 'Online', totalScans: 1432, scansToday: 18, lastPing: '2 min ago', partnership: null, technician: 'Vinod Sharma' },
    { id: 'KSK-006', location: 'Collectorate Office', city: 'Mysuru', type: 'Government', status: 'Online', totalScans: 987, scansToday: 7, lastPing: '8 min ago', partnership: 'Karnataka Govt CSR', technician: 'Anand Rao' },
    { id: 'KSK-007', location: 'Mumbai Central Mall', city: 'Mumbai', type: 'Mall', status: 'Offline', totalScans: 1102, scansToday: 0, lastPing: '26 hrs ago', partnership: null, technician: 'Vinod Sharma' },
    { id: 'KSK-008', location: 'Apollo Hospital', city: 'Chennai', type: 'Hospital', status: 'Online', totalScans: 876, scansToday: 11, lastPing: '5 min ago', partnership: 'Apollo Partnership', technician: 'Kiran Reddy' },
    { id: 'KSK-009', location: 'Yashoda Hospital', city: 'Hyderabad', type: 'Hospital', status: 'Online', totalScans: 743, scansToday: 9, lastPing: '6 min ago', partnership: null, technician: 'Anil Verma' },
    { id: 'KSK-010', location: 'Lulu Mall', city: 'Hyderabad', type: 'Mall', status: 'Maintenance', totalScans: 654, scansToday: 0, lastPing: '3 hrs ago', partnership: null, technician: 'Anil Verma' },
    { id: 'KSK-011', location: 'Narayana Health', city: 'Bengaluru', type: 'Hospital', status: 'Online', totalScans: 521, scansToday: 14, lastPing: '1 min ago', partnership: 'Narayana CSR', technician: 'Suresh Nair' },
    { id: 'KSK-012', location: 'Civil Hospital', city: 'Pune', type: 'Government', status: 'Online', totalScans: 312, scansToday: 6, lastPing: '9 min ago', partnership: 'Maharashtra Govt CSR', technician: 'Pradeep Joshi' },
    { id: 'KSK-013', location: 'Express Avenue', city: 'Chennai', type: 'Mall', status: 'Online', totalScans: 109, scansToday: 3, lastPing: '7 min ago', partnership: null, technician: 'Kiran Reddy' },
];

export const mockLinkedDevices = [
    { id: 'NVR-2024-00112', user: 'Arjun Mehta', lastSync: '2 hrs ago', totalScans: 14, status: 'Active', userId: 1 },
    { id: 'NVR-2024-00445', user: 'Meera Iyer', lastSync: 'Yesterday', totalScans: 8, status: 'Active', userId: 2 },
    { id: 'NVR-2024-00891', user: 'Vijay Nair', lastSync: '45 min ago', totalScans: 22, status: 'Active', userId: 3 },
    { id: 'NVR-2024-01234', user: 'Divya Sharma', lastSync: '3 days ago', totalScans: 3, status: 'Inactive', userId: 4 },
    { id: 'NVR-2024-00567', user: 'Rohit Menon', lastSync: '1 hr ago', totalScans: 19, status: 'Active', userId: 5 },
];

export const mockUsers = [
    { id: 1, name: 'Arjun Mehta', email: 'arjun.mehta@gmail.com', location: 'Bengaluru', registered: '12 Jan 2025', type: 'Device Linked', scans: 14, lastActive: '2 hrs ago', status: 'Active' },
    { id: 2, name: 'Meera Iyer', email: 'meera.iyer@gmail.com', location: 'Chennai', registered: '19 Feb 2025', type: 'Free', scans: 8, lastActive: 'Yesterday', status: 'Active' },
    { id: 3, name: 'Vijay Nair', email: 'vijay.nair@gmail.com', location: 'Kochi', registered: '05 Mar 2025', type: 'Device Linked', scans: 22, lastActive: '45 min ago', status: 'Active' },
    { id: 4, name: 'Divya Sharma', email: 'divya.sharma@gmail.com', location: 'Hyderabad', registered: '22 Feb 2025', type: 'Free', scans: 3, lastActive: '3 days ago', status: 'Active' },
    { id: 5, name: 'Rohit Menon', email: 'rohit.menon@gmail.com', location: 'Mumbai', registered: '08 Jan 2025', type: 'Device Linked', scans: 19, lastActive: '1 hr ago', status: 'Active' },
    { id: 6, name: 'Sneha Rao', email: 'sneha.rao@gmail.com', location: 'Bengaluru', registered: '14 Dec 2024', type: 'Free', scans: 6, lastActive: '8 days ago', status: 'Active' },
    { id: 7, name: 'Ananya Krishnan', email: 'ananya.k@gmail.com', location: 'Delhi', registered: '30 Jan 2025', type: 'Free', scans: 2, lastActive: '1 hr ago', status: 'Active' },
    { id: 8, name: 'Kiran Patel', email: 'kiran.patel@gmail.com', location: 'Pune', registered: '11 Mar 2025', type: 'Free', scans: 1, lastActive: '5 days ago', status: 'Active' },
    { id: 9, name: 'fake_user_291', email: 'fakeemail@tempmail.com', location: 'Unknown', registered: '20 Mar 2025', type: 'Free', scans: 0, lastActive: '2 days ago', status: 'Suspended' },
    { id: 10, name: 'Priya Venkat', email: 'priya.venkat@gmail.com', location: 'Chennai', registered: '03 Feb 2025', type: 'Device Linked', scans: 11, lastActive: 'Today', status: 'Active' },
];

export const mockUserDetail = {
    id: 1,
    name: 'Arjun Mehta',
    email: 'arjun.mehta@gmail.com',
    phone: '+91 98765 43210',
    location: 'Bengaluru, Karnataka',
    registered: '12 Jan 2025',
    lastLogin: 'Today at 9:32 AM',
    accountType: 'Device Linked',
    status: 'Active',
    device: { id: 'NVR-2024-00112', linked: '12 Jan 2025', firmware: 'v2.4.1' },
    scanHistory: [
        { id: 'SCN-001', date: '15 Mar 2025', condition: 'Contact Dermatitis', confidence: 82, severity: 'Moderate', source: 'Device', reviewed: true },
        { id: 'SCN-002', date: '20 Feb 2025', condition: 'Eczema', confidence: 76, severity: 'Low', source: 'Kiosk', reviewed: false },
        { id: 'SCN-003', date: '05 Jan 2025', condition: 'Psoriasis', confidence: 91, severity: 'High', source: 'Device', reviewed: true },
    ],
    appointmentHistory: [
        { date: '22 Mar 2025', doctor: 'Dr. Priya Nair', status: 'Upcoming', condition: 'Contact Dermatitis' },
        { date: '10 Feb 2025', doctor: 'Dr. Anjali Rao', status: 'Completed', condition: 'Eczema' },
    ],
    activityLog: [
        { time: 'Today 9:32 AM', action: 'Logged in' },
        { time: 'Yesterday 7:14 PM', action: 'Scan completed via device' },
        { time: '20 Mar 2025', action: 'Appointment requested with Dr. Priya Nair' },
        { time: '15 Mar 2025', action: 'Scan completed via device' },
    ],
};

export const mockDoctors = [
    { id: 1, name: 'Dr. Priya Nair', specialization: 'General Dermatology', hospital: 'Manipal Hospital, Bengaluru', location: 'Bengaluru', consultations: 94, rating: 4.8, acceptanceRate: 91, status: 'Active' },
    { id: 2, name: 'Dr. Anjali Rao', specialization: 'Trichology', hospital: 'Apollo, Hyderabad', location: 'Hyderabad', consultations: 67, rating: 4.6, acceptanceRate: 88, status: 'Active' },
    { id: 3, name: 'Dr. Karthik Iyer', specialization: 'Cosmetic Dermatology', hospital: 'AIIMS, Delhi', location: 'Delhi', consultations: 12, rating: 4.9, acceptanceRate: 95, status: 'Active' },
    { id: 4, name: 'Dr. Aditya Menon', specialization: 'General Dermatology', hospital: 'Fortis, Mumbai', location: 'Mumbai', consultations: 43, rating: 3.9, acceptanceRate: 30, status: 'Active' },
    { id: 5, name: 'Dr. Sunita Reddy', specialization: 'Pediatric Dermatology', hospital: 'Yashoda, Hyderabad', location: 'Hyderabad', consultations: 58, rating: 4.7, acceptanceRate: 85, status: 'Active' },
];

export const mockDoctorApplications = [
    { id: 1, name: 'Dr. Aisha Kapoor', specialization: 'General Dermatology', hospital: 'Fortis, Mumbai', applied: '3 days ago', stage: 'Application Received' as Stage, documents: ['Medical License', 'MBBS Certificate'], rejectionReason: '' },
    { id: 2, name: 'Dr. Sanjay Pillai', specialization: 'Trichology', hospital: 'NIMHANS, Bengaluru', applied: '1 week ago', stage: 'Under Review' as Stage, documents: ['Medical License', 'MD Certificate', 'Hospital Letter'], rejectionReason: '' },
    { id: 3, name: 'Dr. Fatima Sheikh', specialization: 'Cosmetic Dermatology', hospital: 'Max Hospital, Delhi', applied: '2 weeks ago', stage: 'Approved' as Stage, documents: ['Medical License', 'MD Certificate', 'Hospital Letter', 'IADVL Certificate'], rejectionReason: '' },
];
export type Stage = 'Application Received' | 'Under Review' | 'Approved' | 'Rejected';

export const mockAdminScans = [
    { id: 'SCN-001', patient: 'Arjun Mehta', date: '15 Mar 2025', source: 'Device', condition: 'Contact Dermatitis', confidence: 82, severity: 'Moderate', reviewed: true, agreement: 'Yes' },
    { id: 'SCN-002', patient: 'Meera Iyer', date: '14 Mar 2025', source: 'Kiosk', condition: 'Eczema', confidence: 76, severity: 'Low', reviewed: false, agreement: 'Pending' },
    { id: 'SCN-003', patient: 'Sneha Rao', date: '13 Mar 2025', source: 'Device', condition: 'Psoriasis', confidence: 91, severity: 'High', reviewed: true, agreement: 'Partially' },
    { id: 'SCN-004', patient: 'Rohit Menon', date: '12 Mar 2025', source: 'Demo', condition: 'Seborrhoeic Dermatitis', confidence: 63, severity: 'Low', reviewed: false, agreement: 'Pending' },
    { id: 'SCN-005', patient: 'Vijay Nair', date: '12 Mar 2025', source: 'Device', condition: 'Rosacea', confidence: 88, severity: 'Moderate', reviewed: true, agreement: 'Yes' },
    { id: 'SCN-006', patient: 'Ananya Krishnan', date: '11 Mar 2025', source: 'Kiosk', condition: 'Acne Vulgaris', confidence: 95, severity: 'Low', reviewed: false, agreement: 'Pending' },
    { id: 'SCN-007', patient: 'Kiran Patel', date: '10 Mar 2025', source: 'Demo', condition: 'Tinea Versicolor', confidence: 58, severity: 'Low', reviewed: false, agreement: 'Pending' },
    { id: 'SCN-008', patient: 'Priya Venkat', date: '10 Mar 2025', source: 'Device', condition: 'Melanoma Suspect', confidence: 79, severity: 'High', reviewed: true, agreement: 'No' },
];

export const mockAdminAppointments = [
    { id: 1, patient: 'Arjun Mehta', doctor: 'Dr. Priya Nair', date: '22 Mar 2025', time: '11:00 AM', condition: 'Contact Dermatitis', severity: 'Moderate', status: 'Upcoming', daysSince: 2, note: 'Rash on forearms for 3 weeks' },
    { id: 2, patient: 'Meera Iyer', doctor: 'Dr. Anjali Rao', date: '20 Mar 2025', time: '3:00 PM', condition: 'Eczema', severity: 'Low', status: 'Pending', daysSince: 4, note: 'Mild itching on scalp' },
    { id: 3, patient: 'Sneha Rao', doctor: 'Dr. Sunita Reddy', date: '18 Mar 2025', time: '10:30 AM', condition: 'Psoriasis', severity: 'High', status: 'Completed', daysSince: 6, note: 'Recurring patches on elbows' },
    { id: 4, patient: 'Rohit Menon', doctor: 'Dr. Priya Nair', date: '15 Mar 2025', time: '9:00 AM', condition: 'Seborrhoeic Dermatitis', 'severity': 'Low', status: 'Declined', daysSince: 9, note: 'Flaking on scalp and beard' },
    { id: 5, patient: 'Ananya Krishnan', doctor: 'Dr. Aditya Menon', date: '12 Mar 2025', time: '2:00 PM', condition: 'Acne Vulgaris', severity: 'Low', status: 'Declined', daysSince: 12, note: 'Persistent breakouts for 2 months' },
    { id: 6, patient: 'Vijay Nair', doctor: 'Dr. Karthik Iyer', date: '10 Mar 2025', time: '4:30 PM', condition: 'Rosacea', severity: 'Moderate', status: 'Upcoming', daysSince: 14, note: 'Facial redness' },
];

export const mockPartnerships = [
    { id: 1, name: 'AIIMS Delhi', type: 'Hospital', city: 'Delhi', kiosks: 1, totalScans: 3241, status: 'Active', start: 'Jan 2024', end: 'Dec 2025', contact: 'Dr. R. Sharma', contactEmail: 'rsharma@aiims.edu' },
    { id: 2, name: 'Manipal Hospitals', type: 'Hospital', city: 'Bengaluru', kiosks: 1, totalScans: 2876, status: 'Active', start: 'Mar 2024', end: 'Mar 2026', contact: 'Mr. S. Rao', contactEmail: 'srao@manipal.edu' },
    { id: 3, name: 'Karnataka Government', type: 'Government', city: 'Mysuru', kiosks: 1, totalScans: 987, status: 'Active', start: 'Jun 2024', end: 'Jun 2025', contact: 'Dept. Health', contactEmail: 'health@karnataka.gov.in' },
    { id: 4, name: 'Apollo Hospitals', type: 'Hospital', city: 'Chennai', kiosks: 1, totalScans: 876, status: 'Renewal Due', start: 'Feb 2024', end: 'Feb 2025', contact: 'Mr. P. Kumar', contactEmail: 'pkumar@apollo.com' },
    { id: 5, name: 'Narayana Health', type: 'CSR', city: 'Bengaluru', kiosks: 1, totalScans: 521, status: 'Active', start: 'Aug 2024', end: 'Aug 2026', contact: 'Dr. T. Nair', contactEmail: 'tnair@narayana.com' },
    { id: 6, name: 'Maharashtra Govt', type: 'Government', city: 'Pune', kiosks: 1, totalScans: 312, status: 'Active', start: 'Oct 2024', end: 'Oct 2025', contact: 'Dept. Health', contactEmail: 'health@maharashtra.gov.in' },
    { id: 7, name: 'Kokilaben Hospital', type: 'Hospital', city: 'Mumbai', kiosks: 1, totalScans: 1654, status: 'Active', start: 'Apr 2024', end: 'Apr 2026', contact: 'Dr. A. Mehta', contactEmail: 'amehta@kokilaben.com' },
];

export const mockAuditLog = [
    { time: 'Today, 9:14 AM', admin: 'Rahul Verma', action: 'Created doctor account', detail: 'Dr. Karthik Iyer (AIIMS, Delhi)' },
    { time: 'Today, 8:51 AM', admin: 'Rahul Verma', action: 'Suspended user account', detail: 'fake_user_291 — Reason: Suspicious activity' },
    { time: 'Yesterday, 6:32 PM', admin: 'Priya Admin', action: 'Updated kiosk status', detail: 'KSK-007 marked for maintenance' },
    { time: 'Yesterday, 3:18 PM', admin: 'Rahul Verma', action: 'Rejected doctor application', detail: 'Dr. XYZ — Reason: Invalid medical license' },
    { time: 'Yesterday, 11:05 AM', admin: 'Priya Admin', action: 'Added partnership', detail: 'Narayana Health, Bengaluru — CSR deployment' },
    { time: '2 days ago, 4:44 PM', admin: 'Rahul Verma', action: 'Changed platform setting', detail: 'Demo scan limit changed from 2 to 1' },
    { time: '2 days ago, 2:10 PM', admin: 'Rahul Verma', action: 'Approved doctor application', detail: 'Dr. Sunita Reddy (Yashoda Hospital)' },
    { time: '3 days ago, 10:30 AM', admin: 'Priya Admin', action: 'Registered new kiosk', detail: 'KSK-012, Chennai — Apollo Hospital' },
];

export const mockAdminAccounts = [
    { id: 1, name: 'Rahul Verma', email: 'rahul@nivara.in', role: 'Super Admin', lastLogin: 'Today at 8:42 AM', status: 'Active' },
    { id: 2, name: 'Priya Admin', email: 'priya@nivara.in', role: 'Admin', lastLogin: 'Yesterday', status: 'Active' },
    { id: 3, name: 'Dev Ops User', email: 'devops@nivara.in', role: 'Ops', lastLogin: '3 days ago', status: 'Active' },
];

export const mockNotifTemplates = [
    { id: 1, name: 'Appointment Reminder', trigger: 'Appointment T-24h', recipients: 'Patient', channel: 'In-App + SMS', content: 'Hi {{patient_name}}, your appointment with {{doctor_name}} is tomorrow at {{time}}. Please be ready.' },
    { id: 2, name: 'Scan Ready', trigger: 'Scan processing complete', recipients: 'Patient', channel: 'In-App', content: 'Hi {{patient_name}}, your skin scan results are ready. View your report inside the NIVARA app.' },
    { id: 3, name: 'Doctor Accepted', trigger: 'Doctor accepts request', recipients: 'Patient', channel: 'In-App + SMS', content: 'Great news! Dr. {{doctor_name}} has confirmed your appointment for {{date}} at {{time}}.' },
    { id: 4, name: 'Doctor Declined', trigger: 'Doctor declines request', recipients: 'Patient', channel: 'In-App', content: 'Dr. {{doctor_name}} is unavailable for your requested slot. Please select another doctor or time.' },
    { id: 5, name: 'Account Created', trigger: 'Admin creates account', recipients: 'Doctor', channel: 'Email', content: 'Welcome to NIVARA, Dr. {{doctor_name}}. Your login: {{email}}, Temp Password: {{password}}.' },
    { id: 6, name: 'Password Reset', trigger: 'Password reset request', recipients: 'Patient/Doctor', channel: 'Email', content: 'Hi {{name}}, a password reset was requested for your NIVARA account. Click the link to proceed: {{link}}' },
    { id: 7, name: 'Kiosk Nearby', trigger: 'User location update', recipients: 'Patient', channel: 'In-App', content: 'A NIVARA kiosk is available near you at {{location}}. Book a walk-in scan today!' },
];

export const mockRecentUsers = [
    { name: 'Divya Sharma', location: 'Hyderabad', date: '12 min ago' },
    { name: 'Kiran Patel', location: 'Pune', date: '18 min ago' },
    { name: 'Priya Venkat', location: 'Chennai', date: '4 hrs ago' },
    { name: 'Suresh Kumar', location: 'Delhi', date: 'Yesterday' },
    { name: 'Anita Singh', location: 'Jaipur', date: 'Yesterday' },
];

export const mockRecentDoctorActions = [
    { doctor: 'Dr. Priya Nair', action: 'Accepted', patient: 'Arjun Mehta', time: '5 min ago' },
    { doctor: 'Dr. Aditya Menon', action: 'Declined', patient: 'Meera Iyer', time: '31 min ago' },
    { doctor: 'Dr. Anjali Rao', action: 'Accepted', patient: 'Sneha Rao', time: '2 hrs ago' },
    { doctor: 'Dr. Sunita Reddy', action: 'Completed', patient: 'Rohit Menon', time: '3 hrs ago' },
    { doctor: 'Dr. Karthik Iyer', action: 'Accepted', patient: 'Vijay Nair', time: '5 hrs ago' },
];

export const mockRecentScans = [
    { patient: 'Rohit Menon', condition: 'Eczema', severity: 'Low', time: '24 min ago' },
    { patient: 'Ananya Krishnan', condition: 'Acne Vulgaris', severity: 'Low', time: '1 hr ago' },
    { patient: 'Vijay Nair', condition: 'Rosacea', severity: 'Moderate', time: '1 hr ago' },
    { patient: 'Priya Venkat', condition: 'Melanoma Suspect', severity: 'High', time: '3 hrs ago' },
    { patient: 'Kiran Patel', condition: 'Tinea Versicolor', severity: 'Low', time: '4 hrs ago' },
];

export const mockAnalytics = {
    dateRanges: ['Last 7 Days', 'Last 30 Days', 'Last 90 Days', 'All Time'] as const,
    metrics: {
        'Last 7 Days': { revenue: 41300, scans: 1001, users: 127, consultations: 74, nps: 72, kioskUtil: 78 },
        'Last 30 Days': { revenue: 183200, scans: 4312, users: 492, consultations: 312, nps: 74, kioskUtil: 81 },
        'Last 90 Days': { revenue: 529800, scans: 12841, users: 1384, consultations: 891, nps: 73, kioskUtil: 79 },
        'All Time': { revenue: 1840000, scans: 18432, users: 3847, consultations: 2841, nps: 74, kioskUtil: 80 },
    },
    scanTrend: [42, 58, 71, 49, 88, 103, 91, 67, 112, 98, 143, 122, 89, 131], // 14 day mock
    userGrowth: [210, 340, 520, 810, 1100, 1450, 1820, 2190, 2580, 3020, 3420, 3847], // 12 months
    conditions: [
        { name: 'Eczema', pct: 24 },
        { name: 'Contact Dermatitis', pct: 18 },
        { name: 'Acne Vulgaris', pct: 16 },
        { name: 'Psoriasis', pct: 12 },
        { name: 'Rosacea', pct: 9 },
        { name: 'Tinea Versicolor', pct: 7 },
        { name: 'Seborrhoeic Dermatitis', pct: 6 },
        { name: 'Melanoma Suspect', pct: 3 },
        { name: 'Vitiligo', pct: 3 },
        { name: 'Other', pct: 2 },
    ],
    geoTable: [
        { city: 'Bengaluru', scans: 5341, users: 1124, kiosks: 3, topCondition: 'Eczema' },
        { city: 'Mumbai', scans: 4188, users: 832, kiosks: 3, topCondition: 'Contact Dermatitis' },
        { city: 'Delhi', scans: 3832, users: 721, kiosks: 1, topCondition: 'Psoriasis' },
        { city: 'Hyderabad', scans: 2397, users: 512, kiosks: 2, topCondition: 'Acne Vulgaris' },
        { city: 'Chennai', scans: 1733, users: 341, kiosks: 2, topCondition: 'Rosacea' },
        { city: 'Pune', scans: 941, users: 211, kiosks: 1, topCondition: 'Eczema' },
    ],
    scanSources: { Device: 48, Kiosk: 34, Demo: 18 },
    doctorPerformance: [
        { name: 'Dr. Priya Nair', consultations: 94, acceptRate: 91, avgResponseHrs: 3, satisfaction: 4.8 },
        { name: 'Dr. Anjali Rao', consultations: 67, acceptRate: 88, avgResponseHrs: 5, satisfaction: 4.6 },
        { name: 'Dr. Sunita Reddy', consultations: 58, acceptRate: 85, avgResponseHrs: 8, satisfaction: 4.7 },
        { name: 'Dr. Aditya Menon', consultations: 43, acceptRate: 30, avgResponseHrs: 28, satisfaction: 3.9 },
        { name: 'Dr. Karthik Iyer', consultations: 12, acceptRate: 95, avgResponseHrs: 2, satisfaction: 4.9 },
    ],
};

export const mockPlatformSettings = {
    demoScanLimit: 1,
    maxApptPerWeek: 3,
    highSeverityFollowUpDays: 7,
    doctorResponseWarningHrs: 48,
    kioskOfflineAlertHrs: 2,
};
