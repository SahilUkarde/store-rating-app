import React, { useState } from 'react';
import styles from './StarRating.module.css';

export default function StarRating({ value, onChange, readonly = false }) {
  const [hover, setHover] = useState(null);
  const display = hover ?? value ?? 0;

  return (
    <div className={styles.stars}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          className={`${styles.star} ${display >= star ? styles.filled : ''}`}
          onClick={() => onChange && onChange(star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(null)}
          aria-label={`${star} star`}
        >
          ★
        </button>
      ))}
    </div>
  );
}
