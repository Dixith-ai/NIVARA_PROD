'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './login.module.css';
import { signInWithEmail, signInWithGoogle, getUserRole } from '@/lib/auth';
import { useAuth } from '@/context/AuthContext';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';

/* ── Role → route ── */
function dashboardFor(role: string | null) {
  if (role === 'admin') return '/admin/dashboard';
  if (role === 'doctor') return '/doctor/dashboard';
  return '/profile';
}

/* ── Firebase error codes → friendly text ── */
function friendlyError(code: string): string {
  switch (code) {
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Invalid email or password.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later.';
    default:
      return 'Sign-in failed. Please try again.';
  }
}

export default function LoginPage() {
  const router = useRouter();
  const { user, userRole, loading: authLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setErrors(prev => ({ ...prev, forgotPassword: 'Please enter your email address first.' }));
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email.trim());
      setResetSent(true);
      setErrors(prev => { const e = { ...prev }; delete e.forgotPassword; return e; });
    } catch {
      setErrors(prev => ({ ...prev, forgotPassword: 'Could not send reset email. Please check the address.' }));
    }
  };

  /* Redirect if already logged in */
  useEffect(() => {
    if (!authLoading && user) {
      router.push(dashboardFor(userRole));
    }
  }, [user, userRole, authLoading, router]);

  const validateField = (name: string, value: string): string => {
    if (!value.trim()) return 'This field is required';
    if (name === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address';
    if (name === 'password' && value.length < 8) return 'Password must be at least 8 characters';
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailErr = validateField('email', email);
    const passErr = validateField('password', password);
    if (emailErr || passErr) {
      setErrors({ email: emailErr, password: passErr });
      return;
    }
    setLoading(true);
    setErrors({});
    try {
      const loggedInUser = await signInWithEmail(email, password);
      // Device fingerprint check — fire login alert on new device
      try {
        const fingerprint = `${navigator.userAgent}|${navigator.platform}`;
        const fpKey = `nivara_device_fp_${loggedInUser.uid}`;
        const stored = localStorage.getItem(fpKey);
        if (stored && stored !== fingerprint && loggedInUser.email) {
          fetch('/api/email/login-alert', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              to: loggedInUser.email,
              firstName: loggedInUser.displayName?.split(' ')[0] || 'there',
              device: navigator.userAgent.split('(')[0].trim() || 'Unknown browser',
              platform: navigator.platform,
              time: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
            }),
          }).catch(console.error);
        }
        localStorage.setItem(fpKey, fingerprint);
      } catch { /* localStorage unavailable — skip */ }
      const role = await getUserRole(loggedInUser.uid);
      router.push(dashboardFor(role));
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? '';
      setErrors({ form: friendlyError(code) });
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    setErrors({});
    try {
      const user = await signInWithGoogle();
      const role = await getUserRole(user.uid);
      router.push(dashboardFor(role));
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? '';
      setErrors({ form: friendlyError(code) });
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginPage}>
      <section className="auth-section">
        <div className="auth-container fade-in">
          <div className="auth-header">
            <h1 className="mb-3">Welcome back</h1>
            <p className="text-secondary">Sign in to access your dashboard</p>
          </div>

          {/* Google button */}
          <button
            type="button"
            className="btn btn-outline btn-large w-full"
            style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            onClick={handleGoogle}
            disabled={loading}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '0.5rem 0 1rem' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--color-border)' }} />
            <span className="text-secondary" style={{ fontSize: '0.75rem' }}>or</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--color-border)' }} />
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {errors.form && <div className="error-message" style={{ marginBottom: '1rem' }}>{errors.form}</div>}
            <div className="form-group">
              <label className="label" htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                className={`input${errors.email ? ' input-error' : ''}`}
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: '' })); }}
                onBlur={() => setErrors(prev => ({ ...prev, email: validateField('email', email) }))}
              />
              {errors.email && <div className="error-message">{errors.email}</div>}
            </div>
            <div className="form-group">
              <label className="label" htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                className={`input${errors.password ? ' input-error' : ''}`}
                placeholder="Enter your password"
                required
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrors(prev => ({ ...prev, password: '' })); }}
                onBlur={() => setErrors(prev => ({ ...prev, password: validateField('password', password) }))}
              />
              {errors.password && <div className="error-message">{errors.password}</div>}
            </div>
            <div className="form-options">
              <label className="checkbox-label">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <button
                type="button"
                className="text-link"
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, font: 'inherit', color: 'inherit' }}
                onClick={handleForgotPassword}
              >
                Forgot password?
              </button>
            </div>
            {errors.forgotPassword && <div className="error-message" style={{ marginBottom: '0.5rem' }}>{errors.forgotPassword}</div>}
            {resetSent && <div className="error-message" style={{ marginBottom: '0.5rem', color: 'var(--color-accent)' }}>Password reset email sent. Check your inbox.</div>}
            <button type="submit" className="btn btn-primary btn-large w-full" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <div className="auth-footer">
            <p className="text-secondary">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="text-link">Sign up</Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
