import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard')
      .then((r) => setStats(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container page">
      <div className="page-header">
        <h1 className="page-title">Admin Dashboard</h1>
      </div>

      {loading ? (
        <p style={{ color: 'var(--gray-400)' }}>Loading...</p>
      ) : stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-value">{stats.totalUsers}</span>
            <span className="stat-label">Total Users</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{stats.totalStores}</span>
            <span className="stat-label">Total Stores</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{stats.totalRatings}</span>
            <span className="stat-label">Total Ratings</span>
          </div>
        </div>
      )}

      <div className="card">
        <h2 style={{ fontWeight: 600, marginBottom: '1.25rem', fontSize: '1rem' }}>Quick Actions</h2>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link to="/admin/users" className="btn btn-primary">Manage Users</Link>
          <Link to="/admin/stores" className="btn btn-primary">Manage Stores</Link>
          <Link to="/admin/users/new" className="btn btn-outline">Add New User</Link>
          <Link to="/admin/stores/new" className="btn btn-outline">Add New Store</Link>
        </div>
      </div>
    </div>
  );
}
