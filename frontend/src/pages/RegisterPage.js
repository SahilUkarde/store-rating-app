import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { register } from '../services/api';
import Input from '../components/Input';
import Button from '../components/Button';
import { validateName, validateEmail, validateAddress, validatePassword } from '../utils/validation';
import styles from './AuthPage.module.css';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', address: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginCtx } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const e = {
      name: validateName(form.name),
      email: validateEmail(form.email),
      address: validateAddress(form.address),
      password: validatePassword(form.password),
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
      const res = await register(form);
      loginCtx(res.data.user, res.data.access_token);
      navigate('/stores');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const f = (field) => ({
    value: form[field],
    onChange: (e) => setForm({ ...form, [field]: e.target.value }),
  });

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logoBlock}>
          <span className={styles.logo}>⭐</span>
          <h1 className={styles.brand}>StoreRate</h1>
          <p className={styles.tagline}>Join to rate your favourite stores</p>
        </div>
        <form onSubmit={handleSubmit} className={styles.form}>
          <h2 className={styles.title}>Create account</h2>
          {serverError && <div className={styles.alert}>{serverError}</div>}

          {[
            { key: 'name', label: 'Full Name', type: 'text', placeholder: 'At least 20 characters' },
            { key: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com' },
            { key: 'address', label: 'Address', type: 'text', placeholder: 'Your address' },
            { key: 'password', label: 'Password', type: 'password', placeholder: '8-16 chars, 1 uppercase, 1 special' },
          ].map(({ key, label, type, placeholder }) => (
            <div key={key} className={styles.field}>
              <label className={styles.label}>{label}</label>
              <Input type={type} placeholder={placeholder} {...f(key)} />
              {errors[key] && <span style={{ fontSize: 12, color: 'var(--danger)' }}>{errors[key]}</span>}
            </div>
          ))}

          <Button type="submit" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Creating account…' : 'Create account'}
          </Button>
          <p className={styles.footer}>
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
