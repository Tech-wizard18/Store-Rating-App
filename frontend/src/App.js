import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminStores from './pages/admin/AdminStores';
import AdminAddUser from './pages/admin/AdminAddUser';
import AdminAddStore from './pages/admin/AdminAddStore';
import AdminUserDetail from './pages/admin/AdminUserDetail';
import StoreList from './pages/user/StoreList';
import StoreOwnerDashboard from './pages/storeowner/StoreOwnerDashboard';
import ChangePassword from './pages/shared/ChangePassword';

function PrivateRoute({ children, roles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/unauthorized" replace />;
  return children;
}

function RedirectByRole() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'admin') return <Navigate to="/admin" replace />;
  if (user.role === 'store_owner') return <Navigate to="/store-owner" replace />;
  return <Navigate to="/stores" replace />;
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <>
      {user && <Navbar />}
      <Routes>
        <Route path="/" element={user ? <RedirectByRole /> : <Landing />} />
        <Route path="/login" element={user ? <RedirectByRole /> : <Login />} />
        <Route path="/register" element={user ? <RedirectByRole /> : <Register />} />

        {/* Admin */}
        <Route path="/admin" element={<PrivateRoute roles={['admin']}><AdminDashboard /></PrivateRoute>} />
        <Route path="/admin/users" element={<PrivateRoute roles={['admin']}><AdminUsers /></PrivateRoute>} />
        <Route path="/admin/users/new" element={<PrivateRoute roles={['admin']}><AdminAddUser /></PrivateRoute>} />
        <Route path="/admin/users/:id" element={<PrivateRoute roles={['admin']}><AdminUserDetail /></PrivateRoute>} />
        <Route path="/admin/stores" element={<PrivateRoute roles={['admin']}><AdminStores /></PrivateRoute>} />
        <Route path="/admin/stores/new" element={<PrivateRoute roles={['admin']}><AdminAddStore /></PrivateRoute>} />

        {/* Normal user */}
        <Route path="/stores" element={<PrivateRoute roles={['user']}><StoreList /></PrivateRoute>} />

        {/* Store owner */}
        <Route path="/store-owner" element={<PrivateRoute roles={['store_owner']}><StoreOwnerDashboard /></PrivateRoute>} />

        {/* Shared */}
        <Route path="/change-password" element={<PrivateRoute roles={['user', 'store_owner', 'admin']}><ChangePassword /></PrivateRoute>} />

        <Route path="/unauthorized" element={<div className="container page"><h2>403 - Unauthorized</h2></div>} />
        <Route path="*" element={<div className="container page"><h2>404 - Page Not Found</h2></div>} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
