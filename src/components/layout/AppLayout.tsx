
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthContext';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

/**
 * AppLayout component that handles authentication states
 * - Shows loading spinner during authentication check
 * - Redirects to sign-in when not authenticated
 * - Handles profile loading issues
 * - Renders child routes using Outlet when authenticated
 */
const AppLayout: React.FC = () => {
  const {
    user,
    profile,
    loading,
    profileNotFound,
    error,
    refreshProfile
  } = useAuth();
  const location = useLocation();

  // While checking authentication status
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
        <Spinner className="w-8 h-8 text-green-500" />
      </div>;
  }

  // If not authenticated, redirect to sign-in
  if (!user) {
    return <Navigate to="/sign-in" state={{
      from: location
    }} replace />;
  }

  // If we have authentication errors
  if (error) {
    return <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Alert variant="destructive" className="max-w-md mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Authentication Error</AlertTitle>
          <AlertDescription>
            There was a problem with your authentication. Please try signing in again.
          </AlertDescription>
        </Alert>
        <button onClick={() => window.location.reload()} className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded">
          Refresh Page
        </button>
      </div>;
  }

  // If we have a user but no profile (and we've attempted to load it)
  if (profileNotFound) {
    return <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <div className="max-w-md">
          <Alert variant="warning" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Profile Not Found</AlertTitle>
            <AlertDescription>
              We couldn't find your profile information. This might be due to a synchronization issue.
            </AlertDescription>
          </Alert>
          <div className="flex space-x-4 justify-center mt-4">
            <button onClick={() => refreshProfile()} className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded">
              Retry
            </button>
            <button onClick={() => window.location.reload()} className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded">
              Refresh Page
            </button>
          </div>
        </div>
      </div>;
  }

  // If all checks pass, render the Outlet (child routes)
  return <div className="min-h-screen min-w-screen bg-gray-50 ">
      {/* Future placeholder for header/navigation */}
      <div className="header-placeholder">
        {/* You can add a persistent header here in the future */}
      </div>
      
      <main className="container min-w-full transition-all duration-300 ease-in-out px-0">
        <Outlet />
      </main>
    </div>;
};

export default AppLayout;
