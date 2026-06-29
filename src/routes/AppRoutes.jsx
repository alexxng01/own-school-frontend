import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Signup from '../pages/Signup';
import Profile from '../pages/Profile';
import Settings from '../pages/Settings';
import Security from '../pages/Security';
import AdminDashboard from '../pages/AdminDashboard';
import ReceptionDashboard from '../pages/ReceptionDashboard';
import StudentDashboard from '../pages/StudentDashboard';
import ParentDashboard from '../pages/ParentDashboard';
import TeacherDashboard from '../pages/TeacherDashboard';
import AdminThemeCustomizer from '../components/AdminThemeCustomizer';
import ManageDashboard from '../pages/ManageDashboard';
import DashboardLayout from '../components/DashboardLayout';
import { AdminAnnouncementPage } from '../components/Announcements';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user } = useAuth();
  console.log('🔍 ProtectedRoute check — user from context:', user, '| allowedRoles:', allowedRoles, '| raw currentUser in localStorage:', window.localStorage.getItem('currentUser'));

  if (!user) {
    console.log('🚪 Redirecting to /login because user is falsy:', user);
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    console.log('🚪 Redirecting to /login because role mismatch. user.role =', user.role, '| allowedRoles =', allowedRoles);
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Public Route Component (redirects to dashboard if already logged in)
const PublicRoute = ({ children }) => {
  const { user } = useAuth();

  if (user) {
    return <Navigate to={`/${user.role}`} replace />;
  }

  return children;
};

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />

      {/* Public Routes */}
      <Route path="/login" element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      } />
      <Route path="/signup" element={
        <PublicRoute>
          <Signup />
        </PublicRoute>
      } />

      {/* Protected Profile Route */}
      <Route path="/profile" element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } />

      {/* Protected Settings Route */}
      <Route path="/settings" element={
        <ProtectedRoute>
          <Settings />
        </ProtectedRoute>
      } />

      {/* Protected Security Route */}
      <Route path="/security" element={
        <ProtectedRoute>
          <Security />
        </ProtectedRoute>
      } />

      {/* Protected Dashboard Routes */}
      <Route path="/admin/*" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminDashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin/theme" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <DashboardLayout>
            <AdminThemeCustomizer />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/announcements" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <DashboardLayout>
            <AdminAnnouncementPage />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/manage/*" element={
        <ProtectedRoute allowedRoles={['admin', 'teacher', 'manager']}>
          <ManageDashboard />
        </ProtectedRoute>
      } />
      <Route path="/manager/*" element={
        <ProtectedRoute allowedRoles={["manager"]}>
          <ManageDashboard />
        </ProtectedRoute>
      } />
      <Route path="/receptionist/*" element={
        <ProtectedRoute allowedRoles={['reception', 'receptionist']}>
          <ReceptionDashboard />
        </ProtectedRoute>
      } />
      <Route path="/student/*" element={
        <ProtectedRoute allowedRoles={['student']}>
          <StudentDashboard />
        </ProtectedRoute>
      } />
      <Route path="/parent/*" element={
        <ProtectedRoute allowedRoles={['parent']}>
          <ParentDashboard />
        </ProtectedRoute>
      } />
      <Route path="/teacher/*" element={
        <ProtectedRoute allowedRoles={['teacher']}>
          <TeacherDashboard />
        </ProtectedRoute>
      } />

      <Route path="*" element={
        <div>
          404 Not Found<br />
          <strong>Debug Info:</strong><br />
          <pre>{JSON.stringify(user, null, 2)}</pre>
          <pre>Current path: {window.location.pathname}</pre>
        </div>
      } />
    </Routes>
  );
};

export default AppRoutes;