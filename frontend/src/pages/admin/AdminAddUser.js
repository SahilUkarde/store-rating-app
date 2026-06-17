import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUser } from '../../services/api';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { validateName, validateEmail, validateAddress, validatePassword } from '../../utils/validation';
import styles from '../FormPage.module.css';

export default function AdminAddUser() {
  const [form, setForm] = useState({ name: '', email: '', address: '', password: '', role: 'user' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const e = {
      name: validateName(form.name),
      email: validateEmail(form.email),
      address: validateAddress(form.address),
      password: validatePassword(form.password),
      role: form.role ? '' : 'Role is required',
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
      await createUser(form);
      navigate('/admin/users');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  const f = (field) => ({ value: form[field], onChange: (e) => setForm({ ...form, [field]: e.target.value }) });

  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>Add New User</h1>
      <div className={styles.formWrapper}>
        <Card>
          <form onSubmit={handleSubmit} className={styles.form}>
            {serverError && <div className={styles.error}>{serverError}</div>}
            {[
              { key: 'name', label: 'Full Name', type: 'text', placeholder: 'Min 20 characters' },
              { key: 'email', label: 'Email', type: 'email', placeholder: 'user@example.com' },
              { key: 'address', label: 'Address', type: 'text', placeholder: 'Full address' },
              { key: 'password', label: 'Password', type: 'password', placeholder: '8-16 chars, 1 uppercase, 1 special' },
            ].map(({ key, label, type, placeholder }) => (
              <div key={key} className={styles.field}>
                <label className={styles.label}>{label}</label>
                <Input type={type} placeholder={placeholder} {...f(key)} />
                {errors[key] && <span className={styles.fieldError}>{errors[key]}</span>}
              </div>
            ))}
            <div className={styles.field}>
              <label className={styles.label}>Role</label>
              <select style={{ padding:'10px 12px', border:'1px solid var(--border)', borderRadius:'6px', fontSize:14 }} {...f('role')}>
                <option value="user">Normal User</option>
                <option value="admin">Admin</option>
                <option value="store_owner">Store Owner</option>
              </select>
              {errors.role && <span className={styles.fieldError}>{errors.role}</span>}
            </div>
            <div className={styles.actions}>
              <Button type="submit" disabled={loading}>{loading ? 'Creating…' : 'Create User'}</Button>
              <Link to="/admin/users"><Button type="button" variant="secondary">Cancel</Button></Link>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
