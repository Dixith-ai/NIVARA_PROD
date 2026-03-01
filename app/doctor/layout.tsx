import ProtectedRoute from '@/components/ProtectedRoute';
import type { ReactNode } from 'react';

export default function DoctorPortalLayout({ children }: { children: ReactNode }) {
    return <ProtectedRoute requiredRole="doctor">{children}</ProtectedRoute>;
}
