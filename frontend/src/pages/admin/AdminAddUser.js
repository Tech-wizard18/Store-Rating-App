import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../api/axios';

const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,16}$/;

export default function AdminAddUser() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', address: '', role: 'user' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const validate = () => {
    const e = {};
    if (!form.name) e.name = 'Required';
    else if (form.name.length < 20) e.name = 'Min 20 characters';
    else if (form.name.length > 60) e.name = 'Max 60 characters';
    if (!form.email) e.email = 'Required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
    if (form.address && form.address.length > 400) e.address = 'Max 400 characters';
    if (!form.password) e.password = 'Required';
    else if (!passwordRegex.test(form.password)) e.password = '8-16 chars, uppercase + special char required';
    if (!form.role) e.role = 'Required';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    setApiError('');
    try {
      await api.post('/admin/users', form);
      toast.success('User created successfully!');
      navigate('/admin/users');
    } catch (err) {
      setApiError(err.response?.data?.message || 'Failed to create user.');
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
        <h1 className="page-title">Add New User</h1>
        <Link to="/admin/users" className="btn btn-outline">← Back</Link>
      </div>

      <div className="card" style={{ maxWidth: 520 }}>
        {apiError && <div className="alert alert-error">{apiError}</div>}
        <form onSubmit={handleSubmit} noValidate>
          <Field label="Full Name" id="name" type="text" name="name" value={form.name} onChange={handleChange} error={errors.name} placeholder="Min 20 characters" counter={`${form.name.length}/60`} />
          <Field label="Email" id="email" type="email" name="email" value={form.email} onChange={handleChange} error={errors.email} placeholder="user@example.com" />

          <div className="form-group">
            <label className="form-label" htmlFor="role">Role</label>
            <select id="role" name="role" className={`form-input form-select ${errors.role ? 'error' : ''}`} value={form.role} onChange={handleChange}>
              <option value="user">Normal User</option>
              <option value="store_owner">Store Owner</option>
              <option value="admin">Admin</option>
            </select>
            {errors.role && <p className="form-error">{errors.role}</p>}
          </div>

          <Field label="Address (optional)" id="address" type="text" name="address" value={form.address} onChange={handleChange} error={errors.address} placeholder="User's address" />
          <Field label="Password" id="password" type="password" name="password" value={form.password} onChange={handleChange} error={errors.password} placeholder="8-16 chars, uppercase + special char" />

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creating...' : 'Create User'}
            </button>
            <Link to="/admin/users" className="btn btn-outline">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, id, type, name, value, onChange, error, placeholder, counter }) {
  return (
    <div className="form-group">
      <label className="form-label" htmlFor={id}>{label}</label>
      <input
        id={id} type={type} name={name}
        className={`form-input ${error ? 'error' : ''}`}
        value={value} onChange={onChange} placeholder={placeholder}
      />
      {error && <p className="form-error">{error}</p>}
      {counter && <p style={{ fontSize: '0.75rem', color: 'var(--gray-400)', marginTop: 4 }}>{counter}</p>}
    </div>
  );
}
