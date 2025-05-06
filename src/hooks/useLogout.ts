
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface UseLogoutOptions {
  redirectUrl?: string;
}

export const useLogout = (options: UseLogoutOptions = {}) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();
  const { redirectUrl = '/' } = options;

  const logout = async () => {
    setIsLoggingOut(true);
    
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      // Navigate to root after successful logout
      navigate(redirectUrl);
      
      toast({
        title: 'Logged out successfully',
        description: 'You have been logged out of your account.',
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: 'Logout failed',
        description: error instanceof Error ? error.message : 'Failed to log out. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  return { logout, isLoggingOut };
};
