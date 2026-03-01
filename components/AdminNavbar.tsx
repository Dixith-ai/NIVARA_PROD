'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { mockAdminUser } from '@/lib/adminMockData';

const MOCK_ALERT_COUNT = 4;

const links = [
    { href: '/admin/command-center', label: 'Command Center' },
    { href: '/admin/users', label: 'Users' },
    { href: '/admin/doctors', label: 'Doctors' },
    { href: '/admin/appointments', label: 'Appointments' },
    { href: '/admin/kiosks', label: 'Kiosks & Devices' },
    { href: '/admin/scans', label: 'Scans' },
    { href: '/admin/analytics', label: 'Analytics' },
    { href: '/admin/partnerships', label: 'CSR & Partnerships' },
    { href: '/admin/system', label: 'System' },
];

export default function AdminNavbar() {
    const pathname = usePathname();
    const [menuOpen, setMenuOpen] = useState(false);

    const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/');

    return (
        <header style={{
            position: 'fixed',
            top: 0, left: 0, right: 0,
            zIndex: 'var(--z-fixed)' as string | number,
            background: 'rgba(250, 248, 244, 0.95)',
            backdropFilter: 'blur(20px) saturate(1.2)',
            WebkitBackdropFilter: 'blur(20px) saturate(1.2)',
            borderBottom: '1px solid rgba(214, 208, 199, 0.5)',
        }}>
            {/* ── Row 1: Logo + right actions ── */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 'var(--space-3) var(--space-6)',
                maxWidth: 1600,
                margin: '0 auto',
                gap: 'var(--space-4)',
            }}>
                {/* Logo */}
                <Link href="/admin/command-center" className="nav-logo">
                    NIVARA
                    <span style={{
                        color: 'var(--color-accent)',
                        fontSize: '0.42em',
                        marginLeft: 5,
                        verticalAlign: 'super',
                        fontFamily: 'var(--font-family-accent)',
                        letterSpacing: '0.18em',
                        fontWeight: 600,
                    }}>
                        ADMIN
                    </span>
                </Link>

                {/* Right: bell + name + logout + hamburger */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                    {/* Alert bell */}
                    <Link href="/admin/command-center" aria-label="Flagged Alerts" style={{
                        position: 'relative', display: 'flex', alignItems: 'center',
                        color: 'var(--color-text-secondary)',
                    }}>
                        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
                            <path d="M13.73 21a2 2 0 01-3.46 0" />
                        </svg>
                        <span style={{
                            position: 'absolute', top: -5, right: -5,
                            background: 'var(--color-error, #ef4444)', color: 'white',
                            borderRadius: '50%', width: 14, height: 14,
                            fontSize: '0.5rem', fontWeight: 700,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            border: '1.5px solid rgba(250,248,244,0.9)',
                        }}>{MOCK_ALERT_COUNT}</span>
                    </Link>

                    {/* Admin identity */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', lineHeight: 1.25, gap: 0 }}>
                        <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--color-text-primary)', whiteSpace: 'nowrap' }}>
                            {mockAdminUser.name}
                        </span>
                        <span style={{ fontSize: '0.62rem', color: 'var(--color-accent)', letterSpacing: '0.06em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                            {mockAdminUser.title}
                        </span>
                    </div>

                    {/* Logout */}
                    <Link href="/login" className="nav-cta">Logout</Link>

                    {/* Mobile hamburger */}
                    <button
                        className="nav-toggle"
                        aria-label="Toggle menu"
                        onClick={() => setMenuOpen(m => !m)}
                    >
                        <span style={menuOpen ? { transform: 'rotate(45deg) translate(4px,4px)' } : {}} />
                        <span style={menuOpen ? { opacity: 0 } : {}} />
                        <span style={menuOpen ? { transform: 'rotate(-45deg) translate(4px,-4px)' } : {}} />
                    </button>
                </div>
            </div>

            {/* ── Row 2: nav links strip ── */}
            <div style={{
                borderTop: '1px solid rgba(214, 208, 199, 0.4)',
                background: 'rgba(250,248,244,0.6)',
                display: menuOpen ? 'none' : undefined,  /* hide on mobile when burger is open (we show column below) */
            }}>
                <div style={{
                    maxWidth: 1600,
                    margin: '0 auto',
                    padding: '0 var(--space-6)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0,
                    overflowX: 'auto',
                }}>
                    {links.map(({ href, label }) => (
                        <Link
                            key={href}
                            href={href}
                            style={{
                                display: 'block',
                                padding: 'var(--space-2) var(--space-3)',
                                fontSize: 'var(--font-size-xs)',
                                fontWeight: 500,
                                color: isActive(href) ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                                textDecoration: 'none',
                                whiteSpace: 'nowrap',
                                borderBottom: isActive(href) ? '2px solid var(--color-accent)' : '2px solid transparent',
                                transition: 'color 0.2s, border-color 0.2s',
                                letterSpacing: '0.01em',
                            }}
                            onMouseEnter={e => { if (!isActive(href)) { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-text-primary)'; } }}
                            onMouseLeave={e => { if (!isActive(href)) { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-text-secondary)'; } }}
                        >
                            {label}
                        </Link>
                    ))}
                </div>
            </div>

            {/* ── Mobile dropdown menu ── */}
            {menuOpen && (
                <div style={{
                    borderTop: '1px solid var(--color-border)',
                    background: 'rgba(250,248,244,0.98)',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: 'var(--space-4) var(--space-6)',
                    gap: 'var(--space-1)',
                }}>
                    {links.map(({ href, label }) => (
                        <Link
                            key={href}
                            href={href}
                            onClick={() => setMenuOpen(false)}
                            style={{
                                display: 'block',
                                padding: 'var(--space-3) var(--space-2)',
                                fontFamily: 'var(--font-family-display)',
                                fontSize: 'var(--font-size-lg)',
                                color: isActive(href) ? 'var(--color-accent)' : 'var(--color-text-primary)',
                                textDecoration: 'none',
                                borderBottom: '1px solid var(--color-border)',
                            }}
                        >
                            {label}
                        </Link>
                    ))}
                    <Link href="/login" className="btn btn-outline btn-small" style={{ marginTop: 'var(--space-4)', alignSelf: 'center' }}>
                        Logout
                    </Link>
                </div>
            )}
        </header>
    );
}
