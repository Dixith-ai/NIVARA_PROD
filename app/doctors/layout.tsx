'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import type { ReactNode } from 'react';

function OnboardingGuard({ children }: { children: ReactNode }) {
    const { needsOnboarding, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && needsOnboarding) {
            router.replace('/onboarding');
        }
    }, [needsOnboarding, loading, router]);

    if (loading || needsOnboarding) return null;
    return <>{children}</>;
}

export default function DoctorsLayout({ children }: { children: ReactNode }) {
    return (
        <ProtectedRoute>
            <OnboardingGuard>{children}</OnboardingGuard>
        </ProtectedRoute>
    );
}
