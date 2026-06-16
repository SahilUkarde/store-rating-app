import React, { useState } from 'react';
import { updatePassword } from '../services/api';
import Input from '../components/Input';
import Button from '../components/Button';
import Card from '../components/Card';
import { validatePassword } from '../utils/validation';
import styles from './FormPage.module.css';

export default function ChangePassword() {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '' });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {
      currentPassword: form.currentPassword ? '' : 'Current password is required',
      newPassword: validatePassword(form.newPassword),
    };
    setErrors(e);
    return !Object.values(e).some(Boolean);
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setMessage(''); setServerError('');
    if (!validate()) return;
    setLoading(true);
    try {
      await updatePassword(form);
      setMessage('Password updated successfully!');
      setForm({ currentPassword: '', newPassword: '' });
    } catch (err) {
      setServerError(err.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>Change Password</h1>
      <div className={styles.formWrapper}>
        <Card>
          <form onSubmit={handleSubmit} className={styles.form}>
            {message && <div className={styles.success}>{message}</div>}
            {serverError && <div className={styles.error}>{serverError}</div>}
            <div className={styles.field}>
              <label className={styles.label}>Current Password</label>
              <Input type="password" placeholder="Your current password"
                value={form.currentPassword}
                onChange={(e) => setForm({ ...form, currentPassword: e.target.value })} />
              {errors.currentPassword && <span className={styles.fieldError}>{errors.currentPassword}</span>}
            </div>
            <div className={styles.field}>
              <label className={styles.label}>New Password</label>
              <Input type="password" placeholder="8-16 chars, 1 uppercase, 1 special"
                value={form.newPassword}
                onChange={(e) => setForm({ ...form, newPassword: e.target.value })} />
              {errors.newPassword && <span className={styles.fieldError}>{errors.newPassword}</span>}
            </div>
            <Button type="submit" disabled={loading}>{loading ? 'Updating…' : 'Update Password'}</Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
