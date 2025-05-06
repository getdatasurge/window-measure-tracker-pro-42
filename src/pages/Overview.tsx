
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useUser } from '@/contexts/auth/AuthContext';
import useAuthModalStore from '@/stores/useAuthModalStore';
import LandingPage from './Landing';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Clock } from 'lucide-react';

const Overview = () => {
  const { user, profile, profileNotFound } = useUser();
  const { openLogin } = useAuthModalStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [clockSkewed, setClockSkewed] = useState(false);

  // Check for significant clock skew on load
  useEffect(() => {
    // Send request to get server time
    fetch('https://worldtimeapi.org/api/ip')
      .then(res => res.json())
      .then(data => {
        const serverTime = new Date(data.utc_datetime).getTime();
        const localTime = new Date().getTime();
        const timeDiff = Math.abs(serverTime - localTime);
        
        // If time difference is more than 30 seconds, show warning
        if (timeDiff > 30000) {
          console.warn(`Clock skew detected: ${timeDiff}ms difference`);
          setClockSkewed(true);
        }
      })
      .catch(err => console.error('Error checking clock skew:', err));
  }, []);

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
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-6">Welcome to WindowTracker</h1>
      
      {clockSkewed && (
        <Alert variant="warning" className="max-w-md mb-6 bg-yellow-900 border-yellow-600">
          <Clock className="h-4 w-4" />
          <AlertTitle>System Clock Skew Detected</AlertTitle>
          <AlertDescription>
            Your device's clock is not synchronized with our servers. This may cause authentication issues.
            Please check your system time settings.
          </AlertDescription>
        </Alert>
      )}
      
      {profileNotFound ? (
        <div className="text-center mb-6">
          <p className="text-yellow-400 mb-4">
            We couldn't load your profile data. Some features may be limited.
          </p>
          <Button 
            onClick={() => window.location.reload()} 
            variant="outline"
            className="mr-4"
          >
            Refresh Page
          </Button>
        </div>
      ) : (
        <p className="text-gray-400 mb-8 text-center max-w-md">
          {profile ? `Hello, ${profile.full_name || 'there'}! ` : ''}
          Continue to your dashboard to start managing your window installations.
        </p>
      )}
      
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
