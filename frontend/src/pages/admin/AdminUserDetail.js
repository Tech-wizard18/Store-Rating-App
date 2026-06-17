import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axios';
import { StarDisplay } from '../../components/StarRating';

export default function AdminUserDetail() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/admin/users/${id}`)
      .then((r) => setUser(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="container page"><p>Loading...</p></div>;
  if (!user) return <div className="container page"><p>User not found.</p></div>;

  return (
    <div className="container page">
      <div className="page-header">
        <h1 className="page-title">User Detail</h1>
        <Link to="/admin/users" className="btn btn-outline">← Back</Link>
      </div>

      <div className="card" style={{ maxWidth: 560 }}>
        <div style={{ display: 'grid', gap: '1rem' }}>
          <Row label="Name" value={user.name} />
          <Row label="Email" value={user.email} />
          <Row label="Address" value={user.address || '—'} />
          <Row label="Role" value={<span className={`badge badge-${user.role}`}>{user.role.replace('_', ' ')}</span>} />
        </div>

        {user.role === 'store_owner' && user.stores?.length > 0 && (
          <div style={{ marginTop: '1.5rem' }}>
            <h3 style={{ fontWeight: 600, marginBottom: '0.75rem', fontSize: '0.95rem' }}>Owned Stores</h3>
            {user.stores.map((s) => (
              <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0', borderBottom: '1px solid var(--gray-100)' }}>
                <span style={{ fontWeight: 500 }}>{s.store_name}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <StarDisplay value={s.avg_rating || 0} />
                  <span style={{ color: 'var(--gray-600)', fontSize: '0.85rem' }}>
                    {s.avg_rating ? `${s.avg_rating} / 5` : 'No ratings yet'}
                  </span>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div style={{ display: 'flex', gap: '1rem' }}>
      <span style={{ minWidth: 100, color: 'var(--gray-600)', fontSize: '0.875rem', fontWeight: 500 }}>{label}</span>
      <span style={{ color: 'var(--gray-900)', fontSize: '0.875rem' }}>{value}</span>
    </div>
  );
}
