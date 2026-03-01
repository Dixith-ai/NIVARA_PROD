'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './signup.module.css';
import { signUpWithEmail, signInWithGoogle } from '@/lib/auth';
import { useAuth } from '@/context/AuthContext';

function getPasswordStrength(password: string): number {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
  if (password.match(/[0-9]/)) strength++;
  if (password.match(/[^a-zA-Z0-9]/)) strength++;
  return strength;
}

const strengthClasses = ['', 'weak', 'fair', 'good', 'strong'];

/* ── Firebase error codes → friendly text ── */
function friendlyError(code: string): string {
  switch (code) {
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    default:
      return 'Sign-up failed. Please try again.';
  }
}

export default function SignupPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const strength = getPasswordStrength(password);

  /* Redirect if already logged in */
  useEffect(() => {
    if (!authLoading && user) router.push('/profile');
  }, [user, authLoading, router]);

  const validateField = (name: string, value: string): string => {
    if (!value.trim()) return 'This field is required';
    if (name === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address';
    if (name === 'password' && value.length < 8) return 'Password must be at least 8 characters';
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {
      firstName: validateField('firstName', firstName),
      lastName: validateField('lastName', lastName),
      email: validateField('email', email),
      password: validateField('password', password),
    };
    if (Object.values(newErrors).some(v => v)) { setErrors(newErrors); return; }

    setLoading(true);
    setErrors({});
    try {
      await signUpWithEmail(email, password, `${firstName} ${lastName}`.trim());
      router.push('/profile');
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
      await signInWithGoogle();
      router.push('/profile');
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? '';
      setErrors({ form: friendlyError(code) });
      setLoading(false);
    }
  };

  return (
    <div className={styles.signupPage}>
      <section className="auth-section">
        <div className="auth-container fade-in" style={{ maxWidth: '500px' }}>
          <div className="auth-header">
            <h1 className="mb-3">Create account</h1>
            <p className="text-secondary">Start your skin health journey</p>
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
            Sign up with Google
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '0.5rem 0 1rem' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--color-border)' }} />
            <span className="text-secondary" style={{ fontSize: '0.75rem' }}>or</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--color-border)' }} />
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {errors.form && <div className="error-message" style={{ marginBottom: '1rem' }}>{errors.form}</div>}
            <div className="form-row">
              <div className="form-group">
                <label className="label" htmlFor="firstName">First name</label>
                <input type="text" id="firstName" className={`input${errors.firstName ? ' input-error' : ''}`} placeholder="John" required value={firstName} onChange={(e) => { setFirstName(e.target.value); setErrors(prev => ({ ...prev, firstName: '' })); }} />
                {errors.firstName && <div className="error-message">{errors.firstName}</div>}
              </div>
              <div className="form-group">
                <label className="label" htmlFor="lastName">Last name</label>
                <input type="text" id="lastName" className={`input${errors.lastName ? ' input-error' : ''}`} placeholder="Doe" required value={lastName} onChange={(e) => { setLastName(e.target.value); setErrors(prev => ({ ...prev, lastName: '' })); }} />
                {errors.lastName && <div className="error-message">{errors.lastName}</div>}
              </div>
            </div>
            <div className="form-group">
              <label className="label" htmlFor="email">Email</label>
              <input type="email" id="email" className={`input${errors.email ? ' input-error' : ''}`} placeholder="you@example.com" required value={email} onChange={(e) => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: '' })); }} />
              {errors.email && <div className="error-message">{errors.email}</div>}
            </div>
            <div className="form-group">
              <label className="label" htmlFor="password">Password</label>
              <input type="password" id="password" className={`input${errors.password ? ' input-error' : ''}`} placeholder="At least 8 characters" required value={password} onChange={(e) => { setPassword(e.target.value); setErrors(prev => ({ ...prev, password: '' })); }} />
              <div className="password-strength">
                <div className={`strength-bar${strength > 0 ? ` ${strengthClasses[strength]}` : ''}`}></div>
              </div>
              {errors.password && <div className="error-message">{errors.password}</div>}
            </div>
            <div className="form-group">
              <label className="checkbox-label">
                <input type="checkbox" required />
                <span>I agree to the <a href="#" className="text-link">Terms of Service</a> and <a href="#" className="text-link">Privacy Policy</a></span>
              </label>
            </div>
            <button type="submit" className="btn btn-primary btn-large w-full" disabled={loading}>
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <div className="auth-footer">
            <p className="text-secondary">
              Already have an account?{' '}
              <Link href="/login" className="text-link">Sign in</Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
