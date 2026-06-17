import React, { useState } from 'react';
import styles from './Table.module.css';

export default function Table({ columns, data, onSort }) {
  const [sortCol, setSortCol] = useState(null);
  const [sortDir, setSortDir] = useState('ASC');

  const handleSort = (col) => {
    if (!col.sortable) return;
    const newDir = sortCol === col.key && sortDir === 'ASC' ? 'DESC' : 'ASC';
    setSortCol(col.key);
    setSortDir(newDir);
    onSort && onSort(col.key, newDir);
  };

  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={`${styles.th} ${col.sortable ? styles.sortable : ''}`}
                onClick={() => handleSort(col)}
              >
                {col.label}
                {col.sortable && (
                  <span className={styles.sortIcon}>
                    {sortCol === col.key ? (sortDir === 'ASC' ? ' ↑' : ' ↓') : ' ↕'}
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className={styles.empty}>No records found</td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr key={row.id || i} className={styles.row}>
                {columns.map((col) => (
                  <td key={col.key} className={styles.td}>
                    {col.render ? col.render(row) : row[col.key] ?? '—'}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
