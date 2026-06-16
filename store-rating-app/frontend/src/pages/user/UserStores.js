import React, { useEffect, useState } from 'react';
import { getStores, submitRating } from '../../services/api';
import Input from '../../components/Input';
import Button from '../../components/Button';
import StarRating from '../../components/StarRating';
import styles from './UserStores.module.css';

function StoreCard({ store, onRated }) {
  const [ratingVal, setRatingVal] = useState(store.userRating);
  const [pending, setPending] = useState(store.userRating);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleSubmit = async () => {
    if (!pending) return;
    setLoading(true);
    setSuccess('');
    try {
      await submitRating({ storeId: store.id, value: pending });
      setRatingVal(pending);
      setSuccess('Rating saved!');
      onRated && onRated();
      setTimeout(() => setSuccess(''), 2000);
    } catch (e) {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div>
          <h3 className={styles.storeName}>{store.name}</h3>
          <p className={styles.storeAddress}>📍 {store.address}</p>
        </div>
        <div className={styles.overallRating}>
          {store.averageRating != null ? (
            <>
              <span className={styles.ratingNum}>⭐ {store.averageRating}</span>
              <span className={styles.ratingCount}>({store.totalRatings} ratings)</span>
            </>
          ) : (
            <span className={styles.noRating}>No ratings yet</span>
          )}
        </div>
      </div>
      <div className={styles.ratingSection}>
        <div>
          <p className={styles.ratingLabel}>{ratingVal ? 'Your rating' : 'Rate this store'}</p>
          <StarRating value={pending} onChange={setPending} />
        </div>
        <div className={styles.ratingActions}>
          {success && <span className={styles.success}>{success}</span>}
          <Button
            variant={ratingVal ? 'secondary' : 'primary'}
            onClick={handleSubmit}
            disabled={loading || !pending || pending === ratingVal}
          >
            {loading ? '…' : ratingVal ? 'Update' : 'Submit'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function UserStores() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ name: '', address: '' });

  const fetch = (f = filters) => {
    setLoading(true);
    getStores(f).then((r) => setStores(r.data)).finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  const handleSearch = (e) => { e.preventDefault(); fetch(); };

  return (
    <div>
      <h1 className={styles.title}>Browse Stores</h1>
      <p className={styles.subtitle}>Discover and rate stores on our platform</p>
      <form onSubmit={handleSearch} className={styles.filters}>
        <Input placeholder="Search by name" value={filters.name} onChange={(e) => setFilters({ ...filters, name: e.target.value })} />
        <Input placeholder="Search by address" value={filters.address} onChange={(e) => setFilters({ ...filters, address: e.target.value })} />
        <Button type="submit" variant="secondary">Search</Button>
        <Button type="button" variant="ghost" onClick={() => { const f={name:'',address:''}; setFilters(f); fetch(f); }}>Clear</Button>
      </form>
      {loading ? (
        <p className={styles.loading}>Loading stores…</p>
      ) : stores.length === 0 ? (
        <div className={styles.empty}>No stores found</div>
      ) : (
        <div className={styles.grid}>
          {stores.map((store) => (
            <StoreCard key={store.id} store={store} onRated={() => fetch()} />
          ))}
        </div>
      )}
    </div>
  );
}
