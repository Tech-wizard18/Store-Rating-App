import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { StarDisplay } from '../../components/StarRating';
import SortIcon from '../../components/SortIcon';

export default function StoreOwnerDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('name');
  const [order, setOrder] = useState('asc');

  useEffect(() => {
    api.get('/store-owner/dashboard')
      .then((r) => setData(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const toggleSort = (field) => {
    if (sortBy === field) setOrder(o => o === 'asc' ? 'desc' : 'asc');
    else { setSortBy(field); setOrder('asc'); }
  };

  const sortedRaters = data?.raters ? [...data.raters].sort((a, b) => {
    const v1 = a[sortBy] || '';
    const v2 = b[sortBy] || '';
    return order === 'asc'
      ? String(v1).localeCompare(String(v2))
      : String(v2).localeCompare(String(v1));
  }) : [];

  if (loading) return <div className="container page"><p>Loading...</p></div>;

  if (!data?.store) {
    return (
      <div className="container page">
        <div className="page-header"><h1 className="page-title">My Store</h1></div>
        <div className="card"><p style={{ color: 'var(--gray-600)' }}>No store is assigned to your account yet. Please contact an administrator.</p></div>
      </div>
    );
  }

  const { store, raters } = data;

  return (
    <div className="container page">
      <div className="page-header">
        <h1 className="page-title">My Store Dashboard</h1>
      </div>

      {/* Store Summary */}
      <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="stat-card">
          <span className="stat-value" style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {store.avg_rating ? (
              <>
                {store.avg_rating}
                <StarDisplay value={store.avg_rating} />
              </>
            ) : '—'}
          </span>
          <span className="stat-label">Average Rating</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{store.total_ratings || 0}</span>
          <span className="stat-label">Total Ratings</span>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontWeight: 600, marginBottom: '0.75rem', fontSize: '1rem' }}>Store Info</h2>
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          <p><strong>Name:</strong> {store.name}</p>
          {store.address && <p><strong>Address:</strong> {store.address}</p>}
        </div>
      </div>

      {/* Raters list */}
      <div className="page-header">
        <h2 style={{ fontWeight: 600, fontSize: '1rem' }}>Users Who Rated Your Store</h2>
      </div>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th onClick={() => toggleSort('name')}>Name <SortIcon field="name" sortBy={sortBy} order={order} /></th>
              <th onClick={() => toggleSort('email')}>Email <SortIcon field="email" sortBy={sortBy} order={order} /></th>
              <th onClick={() => toggleSort('rating')}>Rating <SortIcon field="rating" sortBy={sortBy} order={order} /></th>
              <th>Review</th>
              <th onClick={() => toggleSort('rated_at')}>Rated On <SortIcon field="rated_at" sortBy={sortBy} order={order} /></th>
            </tr>
          </thead>
          <tbody>
            {sortedRaters.length === 0 ? (
              <tr><td colSpan={4} className="empty">No ratings submitted yet.</td></tr>
            ) : sortedRaters.map((r) => (
              <tr key={r.id}>
                <td>{r.name}</td>
                <td>{r.email}</td>
                <td>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <StarDisplay value={r.rating} />
                    <span style={{ color: 'var(--gray-600)', fontSize: '0.8rem' }}>{r.rating}/5</span>
                  </span>
                </td>
                <td style={{ color: 'var(--gray-600)', fontSize: '0.85rem', maxWidth: 220 }}>
                  {r.review || <span style={{ color: 'var(--gray-400)' }}>—</span>}
                </td>
                <td style={{ color: 'var(--gray-600)', fontSize: '0.8rem' }}>
                  {new Date(r.rated_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
