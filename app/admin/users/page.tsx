'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import AdminNavbar from '@/components/AdminNavbar';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { mockUsers, mockPlatformStats } from '@/lib/adminMockData';
import s from '../admin.module.css';

function Reveal({ children }: { children: React.ReactNode }) {
    const ref = useRef<HTMLDivElement>(null);
    const v = useIntersectionObserver(ref as React.RefObject<Element | null>, { threshold: 0.03 });
    return <div ref={ref} className={`reveal${v ? ' active' : ''}`}>{children}</div>;
}

function Initials({ name }: { name: string }) {
    const i = name.split(' ').map(w => w[0]).slice(0, 2).join('');
    return <div className={s.initials}>{i}</div>;
}

export default function UsersPage() {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [typeFilter, setTypeFilter] = useState('All');
    const [confirmSuspend, setConfirmSuspend] = useState<number | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
    const [users, setUsers] = useState(mockUsers);

    const filtered = users.filter(u => {
        const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === 'All' || u.status === statusFilter;
        const matchType = typeFilter === 'All' || u.type === typeFilter;
        return matchSearch && matchStatus && matchType;
    });

    const handleSuspend = (id: number) => {
        setUsers(u => u.map(x => x.id === id ? { ...x, status: x.status === 'Active' ? 'Suspended' : 'Active' } : x));
        setConfirmSuspend(null);
    };

    const handleDelete = (id: number) => {
        setUsers(u => u.filter(x => x.id !== id));
        setConfirmDelete(null);
    };

    return (
        <div className={s.portalPage}>
            <AdminNavbar />
            <div className="container" style={{ paddingBottom: 'var(--space-16)' }}>

                {/* Header */}
                <div className={`slide-up ${s.pageHeader}`}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
                        <div>
                            <p className="section-label">Admin</p>
                            <h1 className={s.pageTitle}>User Management</h1>
                            <div className={s.quickStats}>
                                <div className={s.quickStat}><span className={s.quickStatNum}>{users.length.toLocaleString()}</span><span className={s.quickStatLabel}>Total Users</span></div>
                                <div className={s.quickStat}><span className={s.quickStatNum}>{mockPlatformStats.activeToday}</span><span className={s.quickStatLabel}>Active Today</span></div>
                                <div className={s.quickStat}><span className={s.quickStatNum}>{mockPlatformStats.newThisWeek}</span><span className={s.quickStatLabel}>New This Week</span></div>
                                <div className={s.quickStat}><span className={s.quickStatNum}>{users.filter(u => u.status === 'Suspended').length}</span><span className={s.quickStatLabel}>Suspended</span></div>
                            </div>
                        </div>
                        <button className="btn btn-outline btn-small">Export User Data</button>
                    </div>
                </div>

                <Reveal>
                    {/* Filters */}
                    <div className={s.filterBar}>
                        <input className="input" placeholder="Search by name or email…" value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth: 300, height: 44 }} />
                        <select className={s.filterSelect} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                            {['All', 'Active', 'Suspended'].map(o => <option key={o}>{o}</option>)}
                        </select>
                        <select className={s.filterSelect} value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
                            {['All', 'Device Linked', 'Free'].map(o => <option key={o}>{o}</option>)}
                        </select>
                    </div>

                    {/* Table */}
                    <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
                        <table className={s.table}>
                            <thead>
                                <tr>
                                    <th>User</th><th>Email</th><th>Location</th><th>Registered</th>
                                    <th>Type</th><th>Scans</th><th>Last Active</th><th>Status</th><th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(u => (
                                    <tr key={u.id}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                                <Initials name={u.name} />
                                                <span style={{ fontWeight: 500 }}>{u.name}</span>
                                            </div>
                                        </td>
                                        <td style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-xs)' }}>{u.email}</td>
                                        <td style={{ color: 'var(--color-text-secondary)' }}>{u.location}</td>
                                        <td style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-xs)' }}>{u.registered}</td>
                                        <td><span className={`${s.badge} ${u.type === 'Device Linked' ? s.badgePending : s.badgeInfo}`}>{u.type}</span></td>
                                        <td style={{ fontFamily: 'var(--font-family-display)', color: 'var(--color-accent)', fontSize: 'var(--font-size-xl)' }}>{u.scans}</td>
                                        <td style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-xs)' }}>{u.lastActive}</td>
                                        <td><span className={`${s.badge} ${u.status === 'Active' ? s.badgeActive : s.badgeSuspended}`}>{u.status}</span></td>
                                        <td>
                                            <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                                                <Link href={`/admin/users/${u.id}`} className="btn btn-small btn-primary">View</Link>
                                                {confirmSuspend === u.id ? (
                                                    <>
                                                        <button className="btn btn-small" style={{ background: '#f59e0b', color: 'white', border: 'none', borderRadius: 'var(--radius-full)', cursor: 'pointer', fontSize: 'var(--font-size-xs)', padding: 'var(--space-2) var(--space-3)', fontFamily: 'var(--font-family-base)' }} onClick={() => handleSuspend(u.id)}>Confirm</button>
                                                        <button className="btn btn-small btn-outline" onClick={() => setConfirmSuspend(null)}>Cancel</button>
                                                    </>
                                                ) : (
                                                    <button className="btn btn-small btn-outline" onClick={() => setConfirmSuspend(u.id)}>{u.status === 'Active' ? 'Suspend' : 'Reinstate'}</button>
                                                )}
                                                {confirmDelete === u.id ? (
                                                    <>
                                                        <button className="btn btn-small" style={{ background: '#ef4444', color: 'white', border: 'none', borderRadius: 'var(--radius-full)', cursor: 'pointer', fontSize: 'var(--font-size-xs)', padding: 'var(--space-2) var(--space-3)', fontFamily: 'var(--font-family-base)' }} onClick={() => handleDelete(u.id)}>Confirm Delete</button>
                                                        <button className="btn btn-small btn-outline" onClick={() => setConfirmDelete(null)}>Cancel</button>
                                                    </>
                                                ) : (
                                                    <button className="btn btn-small" style={{ background: 'transparent', color: '#ef4444', border: '1px solid rgba(220,38,38,0.3)', borderRadius: 'var(--radius-full)', cursor: 'pointer', fontSize: 'var(--font-size-xs)', padding: 'var(--space-2) var(--space-3)', fontFamily: 'var(--font-family-base)' }} onClick={() => setConfirmDelete(u.id)}>Delete</button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filtered.length === 0 && (
                                    <tr><td colSpan={9} className={s.emptyState}>No users match your filters.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Reveal>
            </div>
        </div>
    );
}
