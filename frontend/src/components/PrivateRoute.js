import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Wrap a route element to require login (and optionally a specific role)
export default function PrivateRoute({ children, allowedRole }) {
  const { user, loading } = useAuth();

  if (loading) return <p style={{ textAlign: 'center', marginTop: 40 }}>Loading...</p>;

  if (!user) return <Navigate to="/login" replace />;

  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}
