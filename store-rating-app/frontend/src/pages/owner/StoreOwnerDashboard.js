import React, { useEffect, useState } from 'react';
import { getOwnerDashboard } from '../../services/api';
import Table from '../../components/Table';
import StarRating from '../../components/StarRating';
import styles from './StoreOwnerDashboard.module.css';

export default function StoreOwnerDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getOwnerDashboard()
      .then((r) => setData(r.data))
      .catch(() => setError('No store found for your account. Please contact an admin.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className={styles.loading}>Loading…</p>;
  if (error) return <div className={styles.error}>{error}</div>;

  const columns = [
    { key: 'name', label: 'Customer Name', sortable: false },
    { key: 'email', label: 'Email', sortable: false },
    { key: 'rating', label: 'Rating', render: (row) => <StarRating value={row.rating} readonly /> },
    { key: 'submittedAt', label: 'Date', render: (row) => new Date(row.submittedAt).toLocaleDateString() },
  ];

  return (
    <div>
      <h1 className={styles.title}>My Store Dashboard</h1>
      <div className={styles.storeInfo}>
        <div className={styles.storeName}>{data.store.name}</div>
        <div className={styles.storeAddress}>📍 {data.store.address}</div>
      </div>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Average Rating</div>
          <div className={styles.statValue}>
            {data.averageRating != null ? (
              <>
                <StarRating value={Math.round(data.averageRating)} readonly />
                <span className={styles.ratingNum}>{data.averageRating} / 5</span>
              </>
            ) : 'No ratings yet'}
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Total Ratings</div>
          <div className={styles.statBig}>{data.totalRatings}</div>
        </div>
      </div>
      <h2 className={styles.sectionTitle}>Customer Ratings</h2>
      <Table columns={columns} data={data.raters} />
    </div>
  );
}
