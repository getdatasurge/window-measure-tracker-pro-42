
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthContext';
import { Spinner } from '@/components/ui/spinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireProfile?: boolean;
}

/**
 * ProtectedRoute component that checks if the user is authenticated
 * If loading, shows a loading spinner
 * If not authenticated, redirects to /sign-in with the current location
 * If authenticated, renders the children
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireProfile = false 
}) => {
  const { user, loading, isAuthenticated, profile, profileNotFound } = useAuth();
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
  
  // If we require a profile but none was found, show profile not found message
  if (requireProfile && profileNotFound) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <div className="max-w-md">
          <h1 className="text-2xl font-bold mb-4">Profile Not Found</h1>
          <p className="text-gray-600 mb-6">
            We couldn't find your profile information. This might be due to a synchronization issue.
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  // If all checks pass, render the protected component
  return <>{children}</>;
};

export default ProtectedRoute;
