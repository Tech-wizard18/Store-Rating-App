import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../api/axios';

export default function AdminAddStore() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', address: '', owner_id: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [owners, setOwners] = useState([]);

  useEffect(() => {
    // Fetch store owners to populate dropdown
    api.get('/admin/users', { params: { role: 'store_owner' } })
      .then((r) => setOwners(r.data))
      .catch(console.error);
  }, []);

  const validate = () => {
    const e = {};
    if (!form.name) e.name = 'Required';
    else if (form.name.length < 20) e.name = 'Min 20 characters';
    else if (form.name.length > 60) e.name = 'Max 60 characters';
    if (!form.email) e.email = 'Required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
    if (form.address && form.address.length > 400) e.address = 'Max 400 characters';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    setApiError('');
    try {
      const payload = { ...form, owner_id: form.owner_id || undefined };
      await api.post('/admin/stores', payload);
      toast.success('Store created successfully!');
      navigate('/admin/stores');
    } catch (err) {
      setApiError(err.response?.data?.message || 'Failed to create store.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  return (
    <div className="container page">
      <div className="page-header">
        <h1 className="page-title">Add New Store</h1>
        <Link to="/admin/stores" className="btn btn-outline">← Back</Link>
      </div>

      <div className="card" style={{ maxWidth: 520 }}>
        {apiError && <div className="alert alert-error">{apiError}</div>}
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="name">Store Name</label>
            <input id="name" type="text" name="name" className={`form-input ${errors.name ? 'error' : ''}`} value={form.name} onChange={handleChange} placeholder="Min 20 characters" />
            {errors.name && <p className="form-error">{errors.name}</p>}
            <p style={{ fontSize: '0.75rem', color: 'var(--gray-400)', marginTop: 4 }}>{form.name.length}/60</p>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">Store Email</label>
            <input id="email" type="email" name="email" className={`form-input ${errors.email ? 'error' : ''}`} value={form.email} onChange={handleChange} placeholder="store@example.com" />
            {errors.email && <p className="form-error">{errors.email}</p>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="address">Address <span style={{ color: 'var(--gray-400)' }}>(optional)</span></label>
            <input id="address" type="text" name="address" className={`form-input ${errors.address ? 'error' : ''}`} value={form.address} onChange={handleChange} placeholder="Store address" />
            {errors.address && <p className="form-error">{errors.address}</p>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="owner_id">Store Owner <span style={{ color: 'var(--gray-400)' }}>(optional)</span></label>
            <select id="owner_id" name="owner_id" className="form-input form-select" value={form.owner_id} onChange={handleChange}>
              <option value="">No owner assigned</option>
              {owners.map((o) => (
                <option key={o.id} value={o.id}>{o.name} ({o.email})</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creating...' : 'Create Store'}
            </button>
            <Link to="/admin/stores" className="btn btn-outline">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
