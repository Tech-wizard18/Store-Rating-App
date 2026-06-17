import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import SortIcon from '../../components/SortIcon';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ name: '', email: '', address: '', role: '' });
  const [sortBy, setSortBy] = useState('name');
  const [order, setOrder] = useState('asc');

  const fetchUsers = useCallback(() => {
    const params = { ...filters, sortBy, order };
    api.get('/admin/users', { params })
      .then((r) => setUsers(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [filters, sortBy, order]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const toggleSort = (field) => {
    if (sortBy === field) setOrder(o => o === 'asc' ? 'desc' : 'asc');
    else { setSortBy(field); setOrder('asc'); }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="container page">
      <div className="page-header">
        <h1 className="page-title">Users</h1>
        <Link to="/admin/users/new" className="btn btn-primary">+ Add User</Link>
      </div>

      <div className="card" style={{ marginBottom: '1rem' }}>
        <div className="filter-bar">
          <div className="form-group">
            <label className="form-label">Name</label>
            <input className="form-input" name="name" value={filters.name} onChange={handleFilterChange} placeholder="Search name..." />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" name="email" value={filters.email} onChange={handleFilterChange} placeholder="Search email..." />
          </div>
          <div className="form-group">
            <label className="form-label">Address</label>
            <input className="form-input" name="address" value={filters.address} onChange={handleFilterChange} placeholder="Search address..." />
          </div>
          <div className="form-group">
            <label className="form-label">Role</label>
            <select className="form-input form-select" name="role" value={filters.role} onChange={handleFilterChange}>
              <option value="">All roles</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
              <option value="store_owner">Store Owner</option>
            </select>
          </div>
        </div>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th onClick={() => toggleSort('name')}>Name <SortIcon field="name" sortBy={sortBy} order={order} /></th>
              <th onClick={() => toggleSort('email')}>Email <SortIcon field="email" sortBy={sortBy} order={order} /></th>
              <th onClick={() => toggleSort('address')}>Address <SortIcon field="address" sortBy={sortBy} order={order} /></th>
              <th onClick={() => toggleSort('role')}>Role <SortIcon field="role" sortBy={sortBy} order={order} /></th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="empty">Loading...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={5} className="empty">No users found.</td></tr>
            ) : users.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.address || '—'}</td>
                <td><span className={`badge badge-${u.role}`}>{u.role.replace('_', ' ')}</span></td>
                <td><Link to={`/admin/users/${u.id}`} className="btn btn-outline btn-sm">View</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
