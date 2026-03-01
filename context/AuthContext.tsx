'use client';

import {
    createContext,
    useContext,
    useEffect,
    useState,
    useCallback,
    type ReactNode,
} from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getUserRole } from '@/lib/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

type UserRole = 'patient' | 'doctor' | 'admin' | null;

interface AuthContextValue {
    user: User | null;
    userRole: UserRole;
    loading: boolean;
    needsOnboarding: boolean;
    refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
    user: null,
    userRole: null,
    loading: true,
    needsOnboarding: false,
    refreshProfile: async () => { },
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [userRole, setUserRole] = useState<UserRole>(null);
    const [loading, setLoading] = useState(true);
    const [needsOnboarding, setNeedsOnboarding] = useState(false);
    // Keep a ref to the current user uid for refreshProfile
    const [currentUid, setCurrentUid] = useState<string | null>(null);

    /** Re-fetch the Firestore profile and update needsOnboarding immediately. */
    const refreshProfile = useCallback(async () => {
        const uid = currentUid;
        if (!uid) return;
        try {
            const snap = await getDoc(doc(db, 'users', uid));
            const data = snap.data() as { onboardingComplete?: boolean } | undefined;
            setNeedsOnboarding(data?.onboardingComplete !== true);
        } catch {
            // silently ignore — guard stays as-is
        }
    }, [currentUid]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            setUser(firebaseUser);
            setCurrentUid(firebaseUser?.uid ?? null);

            if (firebaseUser) {
                try {
                    const role = await getUserRole(firebaseUser.uid);
                    setUserRole(role as UserRole);
                } catch {
                    setUserRole(null);
                }
                // Check onboardingComplete flag
                try {
                    const snap = await getDoc(doc(db, 'users', firebaseUser.uid));
                    const data = snap.data() as { onboardingComplete?: boolean } | undefined;
                    setNeedsOnboarding(data?.onboardingComplete !== true);
                } catch {
                    setNeedsOnboarding(false);
                }
            } else {
                setUserRole(null);
                setNeedsOnboarding(false);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, userRole, loading, needsOnboarding, refreshProfile }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
