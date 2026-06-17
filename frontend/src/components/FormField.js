import React from 'react';
import styles from './FormField.module.css';

export default function FormField({ label, error, children }) {
  return (
    <div className={styles.field}>
      {label && <label className={styles.label}>{label}</label>}
      {children}
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}
