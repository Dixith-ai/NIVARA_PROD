import ProtectedRoute from '@/components/ProtectedRoute';
import type { ReactNode } from 'react';

export default function AdminLayout({ children }: { children: ReactNode }) {
    return <ProtectedRoute requiredRole="admin">{children}</ProtectedRoute>;
}
