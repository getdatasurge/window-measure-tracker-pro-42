
import { useState } from 'react';
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
      // Mock implementation - no Supabase
      console.log('Mock logout called');
      
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
