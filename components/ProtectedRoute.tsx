'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
    children: ReactNode;
    requiredRole?: 'doctor' | 'admin';
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
    const { user, userRole, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (loading) return;
        if (!user) {
            router.push('/login');
            return;
        }
        if (requiredRole && userRole !== requiredRole) {
            router.push('/profile');
        }
    }, [user, userRole, loading, requiredRole, router]);

    if (loading) {
        return (
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                minHeight: '100vh', background: 'var(--color-bg)',
            }}>
                <div style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    border: '2.5px solid var(--color-border)',
                    borderTopColor: 'var(--color-accent)',
                    animation: 'spin 0.8s linear infinite',
                }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    if (!user) return null;
    if (requiredRole && userRole !== requiredRole) return null;

    return <>{children}</>;
}
