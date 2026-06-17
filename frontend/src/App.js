import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminStores from './pages/admin/AdminStores';
import AdminAddUser from './pages/admin/AdminAddUser';
import AdminAddStore from './pages/admin/AdminAddStore';
import AdminUserDetail from './pages/admin/AdminUserDetail';
import UserStores from './pages/user/UserStores';
import StoreOwnerDashboard from './pages/owner/StoreOwnerDashboard';
import ChangePassword from './pages/ChangePassword';
import Layout from './components/Layout';

function ProtectedRoute({ children, roles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

function HomeRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
  if (user.role === 'store_owner') return <Navigate to="/owner/dashboard" replace />;
  return <Navigate to="/stores" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeRedirect />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/admin" element={
            <ProtectedRoute roles={['admin']}>
              <Layout />
            </ProtectedRoute>
          }>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="users/new" element={<AdminAddUser />} />
            <Route path="users/:id" element={<AdminUserDetail />} />
            <Route path="stores" element={<AdminStores />} />
            <Route path="stores/new" element={<AdminAddStore />} />
          </Route>

          <Route path="/stores" element={
            <ProtectedRoute roles={['user']}>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<UserStores />} />
          </Route>

          <Route path="/owner" element={
            <ProtectedRoute roles={['store_owner']}>
              <Layout />
            </ProtectedRoute>
          }>
            <Route path="dashboard" element={<StoreOwnerDashboard />} />
          </Route>

          <Route path="/change-password" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<ChangePassword />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
