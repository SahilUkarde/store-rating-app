import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getUsers } from '../../services/api';
import Table from '../../components/Table';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Badge from '../../components/Badge';
import styles from './AdminList.module.css';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ name: '', email: '', address: '', role: '' });
  const [sort, setSort] = useState({ sortBy: 'name', order: 'ASC' });

  const fetch = (f = filters, s = sort) => {
    setLoading(true);
    getUsers({ ...f, ...s })
      .then((r) => setUsers(r.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  const handleSearch = (e) => { e.preventDefault(); fetch(); };
  const handleSort = (col, dir) => { const s = { sortBy: col, order: dir }; setSort(s); fetch(filters, s); };

  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'address', label: 'Address', sortable: true },
    { key: 'role', label: 'Role', sortable: true, render: (row) => <Badge variant={row.role}>{row.role.replace('_', ' ')}</Badge> },
    { key: 'actions', label: '', render: (row) => <Link to={`/admin/users/${row.id}`} className={styles.viewLink}>View</Link> },
  ];

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Users</h1>
        <Link to="/admin/users/new"><Button>+ Add User</Button></Link>
      </div>
      <form onSubmit={handleSearch} className={styles.filters}>
        <Input placeholder="Filter by name" value={filters.name} onChange={(e) => setFilters({ ...filters, name: e.target.value })} />
        <Input placeholder="Filter by email" value={filters.email} onChange={(e) => setFilters({ ...filters, email: e.target.value })} />
        <Input placeholder="Filter by address" value={filters.address} onChange={(e) => setFilters({ ...filters, address: e.target.value })} />
        <select className={styles.select} value={filters.role} onChange={(e) => setFilters({ ...filters, role: e.target.value })}>
          <option value="">All roles</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
          <option value="store_owner">Store Owner</option>
        </select>
        <Button type="submit" variant="secondary">Search</Button>
        <Button type="button" variant="ghost" onClick={() => { const f = { name:'',email:'',address:'',role:'' }; setFilters(f); fetch(f); }}>Clear</Button>
      </form>
      {loading ? <p className={styles.loading}>Loading…</p> : <Table columns={columns} data={users} onSort={handleSort} />}
    </div>
  );
}
