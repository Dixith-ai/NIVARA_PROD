import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    updateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';

/* ── Helpers ── */
async function createUserDoc(uid: string, email: string, fullName: string, profilePhoto: string | null = null) {
    await setDoc(doc(db, 'users', uid), {
        uid,
        email,
        fullName,
        role: 'patient',
        createdAt: serverTimestamp(),
        skinType: null,
        profilePhoto,
        deviceLinked: false,
        deviceId: null,
        demoScanUsed: false,
    });
}

/* ── Auth functions ── */
export async function signUpWithEmail(email: string, password: string, fullName: string) {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(user, { displayName: fullName });
    await createUserDoc(user.uid, email, fullName, null);
    return user;
}

export async function signInWithEmail(email: string, password: string) {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    return user;
}

export async function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    const { user } = await signInWithPopup(auth, provider);

    // Only create Firestore doc on first Google login
    const snap = await getDoc(doc(db, 'users', user.uid));
    if (!snap.exists()) {
        await createUserDoc(
            user.uid,
            user.email ?? '',
            user.displayName ?? '',
            user.photoURL ?? null,
        );
    }
    return user;
}

export async function logOut() {
    await signOut(auth);
}

export async function getUserRole(uid: string): Promise<string | null> {
    const snap = await getDoc(doc(db, 'users', uid));
    if (!snap.exists()) return null;
    return (snap.data()?.role as string) ?? null;
}
