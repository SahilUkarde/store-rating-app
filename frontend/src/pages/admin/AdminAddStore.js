import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createStore, getUsers } from '../../services/api';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { validateName, validateEmail, validateAddress } from '../../utils/validation';
import styles from '../FormPage.module.css';

export default function AdminAddStore() {
  const [form, setForm] = useState({ name: '', email: '', address: '', owner_id: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [usersLoaded, setUsersLoaded] = useState(false);
  const navigate = useNavigate();

  const loadUsers = () => {
    if (usersLoaded) return;
    getUsers({ role: 'user' }).then((r) => { setUsers(r.data); setUsersLoaded(true); });
  };

  const validate = () => {
    const e = {
      name: validateName(form.name),
      email: validateEmail(form.email),
      address: validateAddress(form.address),
    };
    setErrors(e);
    return !Object.values(e).some(Boolean);
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setServerError('');
    if (!validate()) return;
    setLoading(true);
    try {
      await createStore(form);
      navigate('/admin/stores');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Failed to create store');
    } finally {
      setLoading(false);
    }
  };

  const f = (field) => ({ value: form[field], onChange: (e) => setForm({ ...form, [field]: e.target.value }) });

  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>Add New Store</h1>
      <div className={styles.formWrapper}>
        <Card>
          <form onSubmit={handleSubmit} className={styles.form}>
            {serverError && <div className={styles.error}>{serverError}</div>}
            {[
              { key: 'name', label: 'Store Name', type: 'text', placeholder: 'Min 20 characters' },
              { key: 'email', label: 'Store Email', type: 'email', placeholder: 'store@example.com' },
              { key: 'address', label: 'Address', type: 'text', placeholder: 'Full address' },
            ].map(({ key, label, type, placeholder }) => (
              <div key={key} className={styles.field}>
                <label className={styles.label}>{label}</label>
                <Input type={type} placeholder={placeholder} {...f(key)} />
                {errors[key] && <span className={styles.fieldError}>{errors[key]}</span>}
              </div>
            ))}
            <div className={styles.field}>
              <label className={styles.label}>Assign Owner (optional)</label>
              <select
                style={{ padding:'10px 12px', border:'1px solid var(--border)', borderRadius:'6px', fontSize:14 }}
                value={form.owner_id}
                onChange={(e) => setForm({ ...form, owner_id: e.target.value })}
                onFocus={loadUsers}
              >
                <option value="">No owner</option>
                {users.map((u) => <option key={u.id} value={u.id}>{u.name} ({u.email})</option>)}
              </select>
            </div>
            <div className={styles.actions}>
              <Button type="submit" disabled={loading}>{loading ? 'Creating…' : 'Create Store'}</Button>
              <Link to="/admin/stores"><Button type="button" variant="secondary">Cancel</Button></Link>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
