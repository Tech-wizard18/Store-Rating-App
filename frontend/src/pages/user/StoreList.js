import React, { useEffect, useState, useCallback, useRef } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import { StarDisplay, StarPicker } from '../../components/StarRating';
import SortIcon from '../../components/SortIcon';

export default function StoreList() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ name: '', address: '' });
  const [debouncedFilters, setDebouncedFilters] = useState(filters);
  const [sortBy, setSortBy] = useState('name');
  const [order, setOrder] = useState('asc');
  const [ratingModal, setRatingModal] = useState(null);
  const [selectedRating, setSelectedRating] = useState(0);
  const [review, setReview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const debounceTimer = useRef(null);

  // Debounce filter changes by 400ms
  useEffect(() => {
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setDebouncedFilters(filters);
    }, 400);
    return () => clearTimeout(debounceTimer.current);
  }, [filters]);

  const fetchStores = useCallback(() => {
    setLoading(true);
    const params = { ...debouncedFilters, sortBy, order };
    api.get('/stores', { params })
      .then((r) => setStores(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [debouncedFilters, sortBy, order]);

  useEffect(() => { fetchStores(); }, [fetchStores]);

  const toggleSort = (field) => {
    if (sortBy === field) setOrder(o => o === 'asc' ? 'desc' : 'asc');
    else { setSortBy(field); setOrder('asc'); }
  };

  const openRating = (store) => {
    setRatingModal({ storeId: store.id, storeName: store.name, current: store.user_rating });
    setSelectedRating(store.user_rating || 0);
    setReview(store.user_review || '');
  };

  const submitRating = async () => {
    if (!selectedRating) { toast.error('Please select a rating.'); return; }
    setSubmitting(true);
    try {
      await api.post(`/stores/${ratingModal.storeId}/rate`, { rating: selectedRating, review });
      toast.success(ratingModal.current ? 'Rating updated!' : 'Rating submitted!');
      setRatingModal(null);
      fetchStores();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit rating.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container page">
      <div className="page-header">
        <h1 className="page-title">Browse Stores</h1>
      </div>

      <div className="card" style={{ marginBottom: '1rem' }}>
        <div className="filter-bar">
          <div className="form-group">
            <label className="form-label">Store Name</label>
            <input className="form-input" value={filters.name} onChange={(e) => setFilters({ ...filters, name: e.target.value })} placeholder="Search by name..." />
          </div>
          <div className="form-group">
            <label className="form-label">Address</label>
            <input className="form-input" value={filters.address} onChange={(e) => setFilters({ ...filters, address: e.target.value })} placeholder="Search by address..." />
          </div>
        </div>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th onClick={() => toggleSort('name')}>Store Name <SortIcon field="name" sortBy={sortBy} order={order} /></th>
              <th onClick={() => toggleSort('address')}>Address <SortIcon field="address" sortBy={sortBy} order={order} /></th>
              <th onClick={() => toggleSort('avg_rating')}>Overall Rating <SortIcon field="avg_rating" sortBy={sortBy} order={order} /></th>
              <th>Your Rating</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="empty">Loading...</td></tr>
            ) : stores.length === 0 ? (
              <tr><td colSpan={5} className="empty">No stores found.</td></tr>
            ) : stores.map((s) => (
              <tr key={s.id}>
                <td style={{ fontWeight: 500 }}>{s.name}</td>
                <td>{s.address || '—'}</td>
                <td>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <StarDisplay value={s.avg_rating || 0} />
                    <span style={{ color: 'var(--gray-600)', fontSize: '0.8rem' }}>
                      {s.avg_rating ? `${s.avg_rating} (${s.total_ratings})` : 'No ratings yet'}
                    </span>
                  </span>
                </td>
                <td>
                  {s.user_rating ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                      <StarDisplay value={s.user_rating} />
                      <span style={{ color: 'var(--gray-600)', fontSize: '0.8rem' }}>{s.user_rating}/5</span>
                    </span>
                  ) : (
                    <span style={{ color: 'var(--gray-400)', fontSize: '0.85rem' }}>Not rated</span>
                  )}
                </td>
                <td>
                  <button className="btn btn-outline btn-sm" onClick={() => openRating(s)}>
                    {s.user_rating ? 'Modify Rating' : 'Rate Store'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Rating Modal */}
      {ratingModal && (
        <div className="modal-overlay" onClick={() => setRatingModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">{ratingModal.current ? 'Update' : 'Rate'} Store</h2>
            <p style={{ color: 'var(--gray-600)', marginBottom: '1.25rem', fontSize: '0.9rem' }}>
              {ratingModal.storeName}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1rem 0' }}>
              <StarPicker value={selectedRating} onChange={setSelectedRating} />
            </div>
            <div className="form-group" style={{ marginTop: '0.5rem' }}>
              <label className="form-label">Write a review <span style={{ color: 'var(--gray-400)' }}>(optional)</span></label>
              <textarea
                className="form-input"
                rows={3}
                maxLength={500}
                placeholder="Share your experience with this store..."
                value={review}
                onChange={(e) => setReview(e.target.value)}
                style={{ resize: 'vertical' }}
              />
              <p style={{ fontSize: '0.75rem', color: 'var(--gray-400)', marginTop: 4 }}>{review.length}/500</p>
            </div>
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={() => setRatingModal(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={submitRating} disabled={submitting || !selectedRating}>
                {submitting ? 'Submitting...' : 'Submit Rating'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
