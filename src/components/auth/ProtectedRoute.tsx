
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthContext';
import { Spinner } from '@/components/ui/spinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * ProtectedRoute component that checks if the user is authenticated
 * If loading, shows a loading spinner
 * If not authenticated, redirects to /sign-in with the current location
 * If authenticated, renders the children
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication status
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className="w-8 h-8 text-green-500" />
      </div>
    );
  }

  // If not authenticated, redirect to sign-in page with the current location
  if (!isAuthenticated) {
    // Store the current location so we can redirect after login
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  // If authenticated, render the protected component
  return <>{children}</>;
};

export default ProtectedRoute;
