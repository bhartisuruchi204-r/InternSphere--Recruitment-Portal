import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
        <p className="text-slate-400 text-sm font-medium">Verifying authentication session...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login with intended location state
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // Role not authorized, redirect to jobs listing or dashboard
    return <Navigate to="/jobs" replace />;
  }

  return children;
};

export default ProtectedRoute;
