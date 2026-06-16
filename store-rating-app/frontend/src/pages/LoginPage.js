import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login } from '../services/api';
import Input from '../components/Input';
import Button from '../components/Button';
import styles from './AuthPage.module.css';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginCtx } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await login(form);
      loginCtx(res.data.user, res.data.access_token);
      const role = res.data.user.role;
      if (role === 'admin') navigate('/admin/dashboard');
      else if (role === 'store_owner') navigate('/owner/dashboard');
      else navigate('/stores');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logoBlock}>
          <span className={styles.logo}>⭐</span>
          <h1 className={styles.brand}>StoreRate</h1>
          <p className={styles.tagline}>Rate the places you love</p>
        </div>
        <form onSubmit={handleSubmit} className={styles.form}>
          <h2 className={styles.title}>Welcome back</h2>
          {error && <div className={styles.alert}>{error}</div>}
          <div className={styles.field}>
            <label className={styles.label}>Email</label>
            <Input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Password</label>
            <Input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <Button type="submit" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Signing in…' : 'Sign in'}
          </Button>
          <p className={styles.footer}>
            Don't have an account? <Link to="/register">Create one</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
