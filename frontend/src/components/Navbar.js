import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname.startsWith(path);

  const adminLinks = [
    { to: '/admin', label: 'Dashboard' },
    { to: '/admin/users', label: 'Users' },
    { to: '/admin/stores', label: 'Stores' },
  ];

  const userLinks = [{ to: '/stores', label: 'Browse Stores' }];
  const ownerLinks = [{ to: '/store-owner', label: 'My Store' }];

  const links =
    user?.role === 'admin' ? adminLinks :
    user?.role === 'store_owner' ? ownerLinks :
    userLinks;

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">⭐</span> RateMyStore
        </Link>

        <button className="navbar-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          <span /><span /><span />
        </button>

        <div className={`navbar-menu ${menuOpen ? 'open' : ''}`}>
          <div className="navbar-links">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={`nav-link ${isActive(l.to) ? 'active' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                {l.label}
              </Link>
            ))}
          </div>
          <div className="navbar-right">
            <Link
              to="/change-password"
              className="nav-link"
              onClick={() => setMenuOpen(false)}
            >
              Change Password
            </Link>
            <div className="nav-user">{user?.name?.split(' ')[0]}</div>
            <button className="btn btn-outline btn-sm" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
