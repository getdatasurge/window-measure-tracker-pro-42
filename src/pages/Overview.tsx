
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useUser } from '@/contexts/UserContext';
import useAuthModalStore from '@/stores/useAuthModalStore';
import LandingPage from './Landing';

const Overview = () => {
  const { user } = useUser();
  const { openLogin } = useAuthModalStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // If not authenticated, show the landing page
  if (!user) {
    return <LandingPage />;
  }

  // Redirect to dashboard if authenticated
  const handleContinueToDashboard = () => {
    setLoading(true);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-6">Welcome to WindowTracker</h1>
      <p className="text-gray-400 mb-8 text-center max-w-md">
        You're all set! Continue to your dashboard to start managing your window installations.
      </p>
      
      <div className="flex gap-4">
        <Button
          onClick={handleContinueToDashboard}
          className="bg-green-500 hover:bg-green-600 text-white px-6"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Continue to Dashboard'}
        </Button>
      </div>
    </div>
  );
};

export default Overview;
