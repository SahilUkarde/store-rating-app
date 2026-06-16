import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getStores } from '../../services/api';
import Table from '../../components/Table';
import Button from '../../components/Button';
import Input from '../../components/Input';
import styles from './AdminList.module.css';

export default function AdminStores() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ name: '', address: '' });
  const [sort, setSort] = useState({ sortBy: 'name', order: 'ASC' });

  const fetch = (f = filters, s = sort) => {
    setLoading(true);
    getStores({ ...f, ...s })
      .then((r) => setStores(r.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  const handleSearch = (e) => { e.preventDefault(); fetch(); };
  const handleSort = (col, dir) => { const s = { sortBy: col, order: dir }; setSort(s); fetch(filters, s); };

  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'address', label: 'Address', sortable: true },
    { key: 'averageRating', label: 'Rating', sortable: false, render: (row) => row.averageRating ? `⭐ ${row.averageRating} (${row.totalRatings})` : 'No ratings' },
  ];

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Stores</h1>
        <Link to="/admin/stores/new"><Button>+ Add Store</Button></Link>
      </div>
      <form onSubmit={handleSearch} className={styles.filters}>
        <Input placeholder="Filter by name" value={filters.name} onChange={(e) => setFilters({ ...filters, name: e.target.value })} />
        <Input placeholder="Filter by address" value={filters.address} onChange={(e) => setFilters({ ...filters, address: e.target.value })} />
        <Button type="submit" variant="secondary">Search</Button>
        <Button type="button" variant="ghost" onClick={() => { const f={name:'',address:''}; setFilters(f); fetch(f); }}>Clear</Button>
      </form>
      {loading ? <p className={styles.loading}>Loading…</p> : <Table columns={columns} data={stores} onSort={handleSort} />}
    </div>
  );
}
