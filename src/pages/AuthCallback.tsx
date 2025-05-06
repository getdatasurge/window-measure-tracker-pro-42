
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Spinner } from '@/components/ui/spinner';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Check for error in URL - Supabase redirects with error param on OAuth errors
        const errorParam = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');
        
        if (errorParam) {
          throw new Error(errorDescription || 'Error during authentication');
        }
        
        // Get redirect path
        const redirectTo = searchParams.get('redirect') || '/dashboard';
        
        // Get session to verify authentication was successful
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw sessionError;
        }
        
        // If we have a session, authentication was successful
        if (session) {
          // Redirect to the specified route or dashboard
          navigate(redirectTo, { replace: true });
        } else {
          // No session found
          setError('Authentication failed. Please try again.');
          setTimeout(() => navigate('/sign-in', { replace: true }), 3000);
        }
      } catch (error: any) {
        console.error('Auth callback error:', error);
        setError(error.message || 'Authentication process failed');
        // Redirect to login after showing error
        setTimeout(() => navigate('/sign-in', { replace: true }), 3000);
      }
    };
    
    handleAuthCallback();
  }, [navigate, searchParams]);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-900 text-white">
      {error ? (
        <div className="text-center">
          <h1 className="text-xl font-bold text-red-400 mb-2">Authentication Error</h1>
          <p className="text-zinc-300">{error}</p>
          <p className="text-zinc-400 mt-4">Redirecting to login...</p>
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
