import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('user');
      if (stored) setUser(JSON.parse(stored));
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback((userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  if (loading) {
    return (
      <div style={splashStyle}>
        <div style={cardStyle}>
          <h1 style={{ margin: 0, fontSize: '2rem', color: '#4f46e5' }}>StoreRater</h1>
          <p style={{ margin: '8px 0 0', color: '#6b7280' }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

const splashStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
  background: '#f9fafb',
};

const cardStyle = {
  textAlign: 'center',
  padding: '2rem 3rem',
  background: '#fff',
  borderRadius: '12px',
  boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
};
