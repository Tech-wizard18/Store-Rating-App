import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,16}$/;

export default function ChangePassword() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ currentPassword: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const validate = () => {
    const e = {};
    if (!form.currentPassword) e.currentPassword = 'Current password is required';
    if (!form.password) e.password = 'New password is required';
    else if (!passwordRegex.test(form.password)) e.password = '8-16 chars, must include uppercase and special character';
    if (!form.confirm) e.confirm = 'Please confirm your password';
    else if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    setApiError('');
    try {
      await api.put('/auth/change-password', {
        currentPassword: form.currentPassword,
        password: form.password,
      });
      toast.success('Password changed successfully!');
      const role = user?.role;
      navigate(role === 'admin' ? '/admin' : role === 'store_owner' ? '/store-owner' : '/stores');
    } catch (err) {
      setApiError(err.response?.data?.message || 'Failed to change password.');
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
        <h1 className="page-title">Change Password</h1>
      </div>

      <div className="card" style={{ maxWidth: 460 }}>
        {apiError && <div className="alert alert-error">{apiError}</div>}
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="currentPassword">Current Password</label>
            <input
              id="currentPassword" type="password" name="currentPassword"
              className={`form-input ${errors.currentPassword ? 'error' : ''}`}
              value={form.currentPassword} onChange={handleChange} placeholder="••••••••"
            />
            {errors.currentPassword && <p className="form-error">{errors.currentPassword}</p>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">New Password</label>
            <input
              id="password" type="password" name="password"
              className={`form-input ${errors.password ? 'error' : ''}`}
              value={form.password} onChange={handleChange} placeholder="8-16 chars, uppercase + special char"
            />
            {errors.password && <p className="form-error">{errors.password}</p>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="confirm">Confirm New Password</label>
            <input
              id="confirm" type="password" name="confirm"
              className={`form-input ${errors.confirm ? 'error' : ''}`}
              value={form.confirm} onChange={handleChange} placeholder="Repeat new password"
            />
            {errors.confirm && <p className="form-error">{errors.confirm}</p>}
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
