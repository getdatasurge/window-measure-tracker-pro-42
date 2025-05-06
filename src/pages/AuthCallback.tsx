
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Spinner } from '@/components/ui/spinner';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Clear any previous error
        setError(null);
        
        console.log('Auth callback initiated');
        
        // Check if we're in a callback context after OAuth redirect
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const queryParams = new URLSearchParams(window.location.search);
        
        // Check for error in URL - Supabase redirects with error param on OAuth errors
        const errorParam = queryParams.get('error') || hashParams.get('error');
        const errorDescription = queryParams.get('error_description') || hashParams.get('error_description');
        
        if (errorParam) {
          throw new Error(errorDescription || 'Error during authentication');
        }
        
        console.log('No error parameters found in URL');
        
        // Get redirect path from localStorage or default to dashboard
        const redirectTo = localStorage.getItem('authRedirectTo') || '/dashboard';
        localStorage.removeItem('authRedirectTo'); // Clean up after use
        
        console.log('Redirect path:', redirectTo);
        
        // Get session to verify authentication was successful
        console.log('Checking session');
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          throw sessionError;
        }
        
        // If we have a session, authentication was successful
        if (session) {
          console.log('Session found, redirecting to:', redirectTo);
          // Redirect to the specified route or dashboard
          navigate(redirectTo, { replace: true });
        } else {
          // No session found
          console.error('No session found after authentication');
          setError('Authentication failed. Please try again.');
          // Redirect to homepage instead of sign-in page
          setTimeout(() => window.location.href = `${window.location.origin}/`, 3000);
        }
      } catch (error: any) {
        console.error('Auth callback error:', error);
        setError(error.message || 'Authentication process failed');
        // Redirect to homepage after showing error
        setTimeout(() => window.location.href = `${window.location.origin}/`, 3000);
      }
    };
    
    handleAuthCallback();
  }, [navigate]);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-900 text-white">
      {error ? (
        <div className="text-center">
          <h1 className="text-xl font-bold text-red-400 mb-2">Authentication Error</h1>
          <p className="text-zinc-300">{error}</p>
          <p className="text-zinc-400 mt-4">Redirecting to homepage...</p>
        </div>
      ) : (
        <div className="text-center">
          <Spinner className="h-10 w-10 text-green-500 mb-4" />
          <h1 className="text-xl font-bold">Completing authentication...</h1>
          <p className="text-zinc-400 mt-2">Please wait while we log you in.</p>
        </div>
      )}
    </div>
  );
};

export default AuthCallback;
