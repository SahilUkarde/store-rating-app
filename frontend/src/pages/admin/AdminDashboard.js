import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardStats } from '../../services/api';
import styles from './AdminDashboard.module.css';

function StatCard({ label, value, icon, to }) {
  return (
    <Link to={to} className={styles.statCard}>
      <div className={styles.statIcon}>{icon}</div>
      <div className={styles.statValue}>{value ?? '—'}</div>
      <div className={styles.statLabel}>{label}</div>
    </Link>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats().then((r) => setStats(r.data)).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className={styles.title}>Admin Dashboard</h1>
      <p className={styles.subtitle}>Platform overview at a glance</p>
      {loading ? <p className={styles.loading}>Loading…</p> : (
        <div className={styles.grid}>
          <StatCard label="Total Users" value={stats?.totalUsers} icon="👥" to="/admin/users" />
          <StatCard label="Total Stores" value={stats?.totalStores} icon="🏪" to="/admin/stores" />
          <StatCard label="Total Ratings" value={stats?.totalRatings} icon="⭐" to="/admin/stores" />
        </div>
      )}
      <div className={styles.quickLinks}>
        <h2 className={styles.sectionTitle}>Quick Actions</h2>
        <div className={styles.linkGrid}>
          <Link to="/admin/users/new" className={styles.actionCard}><span className={styles.actionIcon}>➕</span><span>Add New User</span></Link>
          <Link to="/admin/stores/new" className={styles.actionCard}><span className={styles.actionIcon}>🏪</span><span>Add New Store</span></Link>
          <Link to="/admin/users" className={styles.actionCard}><span className={styles.actionIcon}>📋</span><span>Manage Users</span></Link>
          <Link to="/admin/stores" className={styles.actionCard}><span className={styles.actionIcon}>📊</span><span>Manage Stores</span></Link>
        </div>
      </div>
    </div>
  );
}
