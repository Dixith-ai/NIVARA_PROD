'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const MOCK_NOTIF_COUNT = 3;

export default function DoctorNavbar() {
    const pathname = usePathname();
    const [menuOpen, setMenuOpen] = useState(false);

    const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/');
    const close = () => setMenuOpen(false);

    const links = [
        { href: '/doctor/dashboard', label: 'Dashboard' },
        { href: '/doctor/appointments', label: 'Appointments' },
        { href: '/doctor/patients', label: 'My Patients' },
        { href: '/doctor/scans', label: 'Scan Reviews' },
        { href: '/doctor/profile', label: 'My Profile' },
    ];

    return (
        <nav className="nav">
            <div className="nav-container">
                {/* Logo — same style as main nav */}
                <Link href="/doctor/dashboard" className="nav-logo">
                    NIVARA<span style={{ color: 'var(--color-accent)', fontSize: '0.45em', marginLeft: 4, verticalAlign: 'super', fontFamily: 'var(--font-family-accent)', letterSpacing: '0.15em' }}>DOCTOR</span>
                </Link>

                {/* Desktop links */}
                <ul className={`nav-links${menuOpen ? ' active' : ''}`}>
                    {links.map(({ href, label }) => (
                        <li key={href}>
                            <Link
                                href={href}
                                onClick={close}
                                className={`nav-link${isActive(href) ? ' active' : ''}`}
                            >
                                {label}
                            </Link>
                        </li>
                    ))}
                    <li className="mobile-only">
                        <Link href="/login" className="btn btn-outline btn-small" onClick={close}>
                            Logout
                        </Link>
                    </li>
                </ul>

                {/* Right actions */}
                <div className="nav-actions">
                    {/* Notifications bell */}
                    <Link href="/doctor/dashboard" aria-label="Notifications"
                        style={{ position: 'relative', display: 'flex', alignItems: 'center', color: 'var(--color-text-secondary)', transition: 'color 0.2s' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" />
                        </svg>
                        {MOCK_NOTIF_COUNT > 0 && (
                            <span style={{
                                position: 'absolute', top: -6, right: -6,
                                background: 'var(--color-error)', color: 'white',
                                borderRadius: '50%', width: 16, height: 16, fontSize: '0.55rem',
                                fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                border: '1.5px solid var(--color-background)',
                            }}>
                                {MOCK_NOTIF_COUNT}
                            </span>
                        )}
                    </Link>

                    {/* Logout (desktop) */}
                    <Link href="/login" className="nav-cta">Logout</Link>

                    {/* Hamburger */}
                    <button className="nav-toggle" aria-label="Toggle menu" onClick={() => setMenuOpen(!menuOpen)}>
                        <span /><span /><span />
                    </button>
                </div>
            </div>
        </nav>
    );
}
