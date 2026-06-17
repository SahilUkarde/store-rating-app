import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Layout.module.css';

export default function Layout() {
  const { user, logoutCtx } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutCtx();
    navigate('/login');
  };

  const adminLinks = [
    { to: '/admin/dashboard', label: 'Dashboard' },
    { to: '/admin/users', label: 'Users' },
    { to: '/admin/stores', label: 'Stores' },
  ];
  const userLinks = [{ to: '/stores', label: 'Browse Stores' }];
  const ownerLinks = [{ to: '/owner/dashboard', label: 'My Store' }];

  const links = user?.role === 'admin' ? adminLinks
    : user?.role === 'store_owner' ? ownerLinks
    : userLinks;

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <span className={styles.brandIcon}>⭐</span>
          <span className={styles.brandName}>StoreRate</span>
        </div>
        <nav className={styles.nav}>
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
            >
              {l.label}
            </NavLink>
          ))}
          {(user?.role === 'user' || user?.role === 'store_owner') && (
            <NavLink
              to="/change-password"
              className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
            >
              Change Password
            </NavLink>
          )}
        </nav>
        <div className={styles.sidebarFooter}>
          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>{user?.name?.[0]?.toUpperCase()}</div>
            <div>
              <div className={styles.userName}>{user?.name?.split(' ')[0]}</div>
              <div className={styles.userRole}>{user?.role?.replace('_', ' ')}</div>
            </div>
          </div>
          <button onClick={handleLogout} className={styles.logoutBtn}>Sign out</button>
        </div>
      </aside>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
