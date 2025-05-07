
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { cleanupAuthState } from '@/features/auth/cleanupAuthState';
import { useToast } from '@/hooks/use-toast';

interface UseLogoutOptions {
  redirectUrl?: string;
}

export const useLogout = (options: UseLogoutOptions = {}) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { toast } = useToast();
  const { redirectUrl = '/' } = options;

  const logout = async () => {
    setIsLoggingOut(true);
    try {
      // Clean up auth state
      cleanupAuthState();
      
      // Try global sign out (catching any errors)
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        console.error('Error during global sign out:', err);
        // Continue even if this fails
      }
      
      // Force page reload for a clean state
      if (redirectUrl) {
        window.location.href = redirectUrl;
      }
      
      return true;
    } catch (error) {
      console.error('Error during logout:', error);
      toast({
        title: 'Logout failed',
        description: 'There was a problem signing you out. Please try again.',
        variant: 'destructive',
      });
      setIsLoggingOut(false);
      return false;
    }
  };

  return { logout, isLoggingOut };
};
