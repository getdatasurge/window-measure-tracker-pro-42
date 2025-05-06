
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthContext';
import LoginModal from '@/components/modals/LoginModal';
import useAuthModalStore from '@/stores/useAuthModalStore';
import { Spinner } from '@/components/ui/spinner';

const SignInPage: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { openLogin } = useAuthModalStore();

  // Get the intended destination from location state or default to dashboard
  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    // Automatically open the login modal when the page loads
    if (!loading && !user) {
      openLogin();
    }
  }, [openLogin, loading, user]);

  // Central redirect handler - redirect authenticated users
  useEffect(() => {
    // Only redirect if we're not in a loading state and have a user
    if (!loading && user) {
      navigate(from, { replace: true });
    }
  }, [user, loading, navigate, from]);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className="w-8 h-8 text-green-500" />
      </div>
    );
  }

  // Render a minimal container while showing the login modal
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-6">Welcome Back</h1>
      <p className="text-gray-400 mb-8 text-center max-w-md">
        Please sign in to continue to your account
      </p>
    </div>
  );
};

export default SignInPage;
