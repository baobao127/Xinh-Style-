import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
export default function ProtectedAdminRoute({ children }: { children: React.ReactNode }) {
  const { isAdmin } = useAuth();
  if (!isAdmin) return <Navigate to="/admin/unlock" />;
  return <>{children}</>;
}