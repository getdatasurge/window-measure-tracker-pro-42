
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { handleError } from '@/utils/error-handling';

type Profile = Tables<'profiles'> & {
  role?: string | null;
};

interface UserContextValue {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  role: string | null;
  isLoading: boolean;
  error: Error | null;
  refreshProfile: () => Promise<void>;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Cache of fetched user IDs to prevent redundant queries
  const fetchedUserIds = new Set<string>();

  // Add debugging logs
  const logDebug = (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[UserContext] ${message}`, data || '');
    }
  };

  const fetchProfile = async (userId: string) => {
    // Prevent fetch if we've already queried this ID
    if (!userId || fetchedUserIds.has(userId)) {
      logDebug(`Skipping profile fetch for user ${userId} (already fetched or invalid ID)`);
      return;
    }
    
    logDebug(`Fetching profile for user ${userId}`);
    fetchedUserIds.add(userId);

    try {
      const { data, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (profileError) {
        throw profileError;
      }

      logDebug('Profile fetch result:', data);
      
      if (data) {
        setProfile(data);
        setRole(data.role || null);
      } else {
        logDebug('No profile found for user');
        // Still set profile to null to indicate we tried fetching
        setProfile(null);
        setRole(null);
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch user profile'));
      handleError(err, { 
        title: 'Profile Error', 
        message: 'Unable to load your profile. Some features might be limited.', 
        showToast: true 
      });
    }
  };

  const refreshProfile = async () => {
    if (!user?.id) {
      logDebug('Refresh profile called, but no user ID available');
      return;
    }
    
    logDebug('Manually refreshing profile');
    fetchedUserIds.delete(user.id); // Clear cached fetch to allow refresh
    await fetchProfile(user.id);
  };

  // Handle initial session loading
  useEffect(() => {
    const setupUser = async () => {
      logDebug('Setting up initial user session');
      setIsLoading(true);
      
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        logDebug('Initial session retrieved', initialSession ? 'Session found' : 'No session');
        
        setSession(initialSession);
        const initialUser = initialSession?.user || null;
        setUser(initialUser);

        if (initialUser?.id) {
          await fetchProfile(initialUser.id);
        }
      } catch (err) {
        console.error('Error setting up user:', err);
        setError(err instanceof Error ? err : new Error('Failed to set up user'));
        handleError(err, { 
          title: 'Authentication Error', 
          message: 'There was a problem setting up your session', 
          showToast: true 
        });
      } finally {
        setIsLoading(false);
        logDebug('Initial setup complete, isLoading set to false');
      }
    };

    setupUser();
  }, []);

  // Handle auth state changes
  useEffect(() => {
    logDebug('Setting up auth state change listener');

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        logDebug(`Auth state changed: ${_event}`);
        
        const newUser = newSession?.user || null;
        // Only update if the user has changed
        const userChanged = newUser?.id !== user?.id;

        if (userChanged) {
          logDebug('User changed, updating state');
        } else {
          logDebug('Same user, only updating session');
        }

        setSession(newSession);
        setUser(newUser);

        if (userChanged) {
          // Reset profile state when user changes
          setProfile(null);
          setRole(null);
          
          // Only fetch profile for new user if we have a valid ID
          if (newUser?.id) {
            // Use setTimeout to break potential deadlock with auth state changes
            setTimeout(() => {
              fetchProfile(newUser.id);
            }, 0);
          } else {
            // Always ensure loading completes
            setIsLoading(false);
          }
        }

        // If signing out, clear profile data
        if (!newUser) {
          logDebug('User signed out, clearing profile data');
          setProfile(null);
          setRole(null);
          fetchedUserIds.clear();
        }
      }
    );

    return () => {
      logDebug('Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, [user?.id]); // Only re-register when user ID changes to prevent loops

  const contextValue: UserContextValue = {
    session,
    user,
    profile,
    role,
    isLoading,
    error,
    refreshProfile,
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export default UserContext;
