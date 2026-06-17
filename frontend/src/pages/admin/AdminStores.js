import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import SortIcon from '../../components/SortIcon';
import { StarDisplay } from '../../components/StarRating';

export default function AdminStores() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ name: '', email: '', address: '' });
  const [sortBy, setSortBy] = useState('name');
  const [order, setOrder] = useState('asc');

  const fetchStores = useCallback(() => {
    const params = { ...filters, sortBy, order };
    api.get('/admin/stores', { params })
      .then((r) => setStores(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [filters, sortBy, order]);

  useEffect(() => { fetchStores(); }, [fetchStores]);

  const toggleSort = (field) => {
    if (sortBy === field) setOrder(o => o === 'asc' ? 'desc' : 'asc');
    else { setSortBy(field); setOrder('asc'); }
  };

  return (
    <div className="container page">
      <div className="page-header">
        <h1 className="page-title">Stores</h1>
        <Link to="/admin/stores/new" className="btn btn-primary">+ Add Store</Link>
      </div>

      <div className="card" style={{ marginBottom: '1rem' }}>
        <div className="filter-bar">
          {['name', 'email', 'address'].map((f) => (
            <div className="form-group" key={f}>
              <label className="form-label" style={{ textTransform: 'capitalize' }}>{f}</label>
              <input
                className="form-input"
                name={f}
                value={filters[f]}
                onChange={(e) => setFilters({ ...filters, [f]: e.target.value })}
                placeholder={`Search ${f}...`}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th onClick={() => toggleSort('name')}>Name <SortIcon field="name" sortBy={sortBy} order={order} /></th>
              <th onClick={() => toggleSort('email')}>Email <SortIcon field="email" sortBy={sortBy} order={order} /></th>
              <th onClick={() => toggleSort('address')}>Address <SortIcon field="address" sortBy={sortBy} order={order} /></th>
              <th onClick={() => toggleSort('avg_rating')}>Rating <SortIcon field="avg_rating" sortBy={sortBy} order={order} /></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="empty">Loading...</td></tr>
            ) : stores.length === 0 ? (
              <tr><td colSpan={4} className="empty">No stores found.</td></tr>
            ) : stores.map((s) => (
              <tr key={s.id}>
                <td style={{ fontWeight: 500 }}>{s.name}</td>
                <td>{s.email}</td>
                <td>{s.address || '—'}</td>
                <td>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <StarDisplay value={s.avg_rating || 0} />
                    <span style={{ color: 'var(--gray-600)', fontSize: '0.8rem' }}>
                      {s.avg_rating ? s.avg_rating : '—'}
                    </span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
