'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { logOut } from '@/lib/auth';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, userRole, loading } = useAuth();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);
  const isActive = (path: string) => pathname === path;

  function dashboardFor(role: string | null) {
    if (role === 'admin') return '/admin/dashboard';
    if (role === 'doctor') return '/doctor/dashboard';
    return '/profile';
  }

  const handleLogout = async () => {
    await logOut();
    closeMenu();
    router.push('/');
  };

  const dashboardHref = dashboardFor(userRole);
  const displayName = user?.displayName?.split(' ')[0] ?? 'Account';

  return (
    <nav className="nav">
      <div className="nav-container">
        <Link href="/" className="nav-logo">NIVARA</Link>

        <ul className={`nav-links${isMenuOpen ? ' active' : ''}`}>
          <li><Link href="/#features" className={`nav-link${isActive('/#features') ? ' active' : ''}`} onClick={closeMenu}>Features</Link></li>
          <li><Link href="/features" className={`nav-link${isActive('/features') ? ' active' : ''}`} onClick={closeMenu}>Technology</Link></li>
          <li><Link href="/kiosks" className={`nav-link${isActive('/kiosks') ? ' active' : ''}`} onClick={closeMenu}>Kiosks</Link></li>
          <li><Link href="/learn" className={`nav-link${isActive('/learn') ? ' active' : ''}`} onClick={closeMenu}>Learn</Link></li>
          <li><Link href="/doctors" className={`nav-link${isActive('/doctors') ? ' active' : ''}`} onClick={closeMenu}>Doctors</Link></li>
          <li><Link href="/demo" className={`nav-link${isActive('/demo') ? ' active' : ''}`} onClick={closeMenu}>Try Demo</Link></li>

          {!loading && user ? (
            <>
              <li>
                <Link href={dashboardHref} className={`nav-link${isActive(dashboardHref) ? ' active' : ''}`} onClick={closeMenu}>
                  Dashboard
                </Link>
              </li>
              <li className="mobile-only">
                <button
                  className="nav-link"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, font: 'inherit', color: 'inherit' }}
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            !loading && (
              <li>
                <Link href="/login" className={`nav-link${isActive('/login') || isActive('/signup') ? ' active' : ''}`} onClick={closeMenu}>
                  Login
                </Link>
              </li>
            )
          )}
          <li className="mobile-only"><Link href="/buy" className="btn btn-primary" onClick={closeMenu}>Buy Device</Link></li>
        </ul>

        <div className="nav-actions">
          <Link href="/buy" className="nav-cta">Buy Device</Link>

          {!loading && user ? (
            <>
              {/* Display name */}
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', fontWeight: 500, letterSpacing: '0.03em' }}>
                {displayName}
              </span>

              {/* Logout button */}
              <button
                onClick={handleLogout}
                style={{
                  background: 'none',
                  border: '1.5px solid var(--color-border-warm)',
                  borderRadius: '6px',
                  color: 'var(--color-text-primary)',
                  fontSize: '0.78rem',
                  fontWeight: 500,
                  padding: '5px 12px',
                  cursor: 'pointer',
                  transition: 'all 200ms',
                  letterSpacing: '0.02em',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-primary)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-primary)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-border-warm)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-text-primary)'; }}
              >
                Logout
              </button>
            </>
          ) : (
            !loading && (
              <Link href="/signup" className="btn btn-outline" style={{ fontSize: '0.78rem', padding: '5px 14px' }}>
                Sign Up
              </Link>
            )
          )}

          {/* Profile icon */}
          <Link
            href="/profile"
            aria-label="Go to profile"
            style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: '34px', height: '34px', borderRadius: '50%',
              background: isActive('/profile') ? 'linear-gradient(135deg, #956D1F, #C4973A, #956D1F)' : 'transparent',
              border: isActive('/profile') ? '1.5px solid transparent' : '1.5px solid var(--color-border-warm)',
              color: isActive('/profile') ? '#fff' : 'var(--color-text-primary)',
              transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
              flexShrink: 0, textDecoration: 'none',
            }}
            onMouseEnter={(e) => {
              if (!isActive('/profile')) {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--color-primary)';
                (e.currentTarget as HTMLAnchorElement).style.background = 'var(--color-primary)';
                (e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-text-inverse)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive('/profile')) {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--color-border-warm)';
                (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
                (e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-text-primary)';
              }
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
            </svg>
          </Link>

          <button className="nav-toggle" aria-label="Toggle menu" onClick={toggleMenu}>
            <span style={isMenuOpen ? { transform: 'rotate(45deg) translate(4px, 4px)' } : {}} />
            <span style={isMenuOpen ? { opacity: 0 } : {}} />
            <span style={isMenuOpen ? { transform: 'rotate(-45deg) translate(4px, -4px)' } : {}} />
          </button>
        </div>
      </div>
    </nav>
  );
}
