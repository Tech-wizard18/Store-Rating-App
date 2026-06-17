import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import './Auth.css';

const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,16}$/;

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', address: '', password: '', role: 'user' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const validate = () => {
    const e = {};
    if (!form.name) e.name = 'Name is required';
    else if (form.name.length < 20) e.name = 'Name must be at least 20 characters';
    else if (form.name.length > 60) e.name = 'Name must be at most 60 characters';
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email address';
    if (form.address && form.address.length > 400) e.address = 'Address max 400 characters';
    if (!form.password) e.password = 'Password is required';
    else if (!passwordRegex.test(form.password))
      e.password = 'Password: 8-16 chars, must include uppercase and special character';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    setApiError('');
    try {
      await api.post('/auth/register', form);
      toast.success('Account created! You can now log in.');
      navigate('/login');
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Registration failed.';
      setApiError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">⭐ RateMyStore</div>
        <h1 className="auth-title">Create an account</h1>

        {apiError && <div className="alert alert-error">{apiError}</div>}

        {/* Role selector */}
        <div className="role-selector">
          {[
            { value: 'user', label: '👤 User' },
            { value: 'store_owner', label: '🏪 Store Owner' },
            { value: 'admin', label: '🛡️ Admin' },
          ].map(({ value, label }) => (
            <button
              key={value}
              type="button"
              className={`role-btn ${form.role === value ? 'active' : ''}`}
              onClick={() => setForm({ ...form, role: value })}
            >
              {label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              name="name"
              className={`form-input ${errors.name ? 'error' : ''}`}
              value={form.name}
              onChange={handleChange}
              placeholder="Your full name (min. 20 characters)"
            />
            {errors.name && <p className="form-error">{errors.name}</p>}
            <p style={{ fontSize: '0.75rem', color: 'var(--gray-400)', marginTop: 4 }}>
              {form.name.length}/60 characters
            </p>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              name="email"
              className={`form-input ${errors.email ? 'error' : ''}`}
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
            />
            {errors.email && <p className="form-error">{errors.email}</p>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="address">Address <span style={{ color: 'var(--gray-400)' }}>(optional)</span></label>
            <input
              id="address"
              type="text"
              name="address"
              className={`form-input ${errors.address ? 'error' : ''}`}
              value={form.address}
              onChange={handleChange}
              placeholder="Your address"
            />
            {errors.address && <p className="form-error">{errors.address}</p>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              className={`form-input ${errors.password ? 'error' : ''}`}
              value={form.password}
              onChange={handleChange}
              placeholder="8-16 chars, uppercase + special char"
            />
            {errors.password && <p className="form-error">{errors.password}</p>}
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
