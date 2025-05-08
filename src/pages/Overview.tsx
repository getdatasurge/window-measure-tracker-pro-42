
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import LandingPage from './Landing';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Clock } from 'lucide-react';

const Overview = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [clockSkewed, setClockSkewed] = useState(false);

  // Check for significant clock skew on load
  React.useEffect(() => {
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

  // Redirect to dashboard
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
            Your device's clock is not synchronized with our servers. This may cause issues.
            Please check your system time settings.
          </AlertDescription>
        </Alert>
      )}
      
      <p className="text-gray-400 mb-8 text-center max-w-md">
        Continue to your dashboard to start viewing window installations.
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
