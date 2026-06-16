import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getUserById } from '../../services/api';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import StarRating from '../../components/StarRating';
import styles from './AdminUserDetail.module.css';

export default function AdminUserDetail() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getUserById(id)
      .then((r) => setUser(r.data))
      .catch(() => setError('User not found'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className={styles.loading}>Loading…</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Link to="/admin/users"><Button variant="secondary">← Back to Users</Button></Link>
        <h1 className={styles.title}>User Details</h1>
      </div>
      <Card>
        <div className={styles.grid}>
          <div className={styles.avatar}>{user.name?.[0]?.toUpperCase()}</div>
          <div className={styles.info}>
            <h2 className={styles.name}>{user.name}</h2>
            <Badge variant={user.role}>{user.role.replace('_', ' ')}</Badge>
            <div className={styles.fields}>
              <DetailRow label="Email" value={user.email} />
              <DetailRow label="Address" value={user.address} />
              <DetailRow label="Member Since" value={new Date(user.createdAt).toLocaleDateString()} />
              {user.role === 'store_owner' && (
                <div className={styles.row}>
                  <span className={styles.rowLabel}>Store Rating</span>
                  <span className={styles.rowValue}>
                    {user.storeRating != null
                      ? <><StarRating value={Math.round(user.storeRating)} readonly /><span style={{marginLeft:8, color:'var(--text-muted)'}}>({user.storeRating})</span></>
                      : 'No ratings yet'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className={styles.row}>
      <span className={styles.rowLabel}>{label}</span>
      <span className={styles.rowValue}>{value}</span>
    </div>
  );
}
