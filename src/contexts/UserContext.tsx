
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
  profileNotFound: boolean; // New flag to indicate profile not found
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
  const [profileNotFound, setProfileNotFound] = useState<boolean>(false);
  
  // Track initialization state
  const [initialCheckDone, setInitialCheckDone] = useState<boolean>(false);

  // Cache of fetched user IDs to prevent redundant queries
  const fetchedUserIds = new Set<string>();

  // Add debugging logs
  const logDebug = (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[UserContext] ${message}`, data || '');
    }
  };

  // Modified fetchProfile with better error handling and caching
  const fetchProfile = async (userId: string) => {
    // Guard against empty userId
    if (!userId) {
      logDebug('Skipping profile fetch - no valid user ID provided');
      setProfileNotFound(true); // Consider this a "not found" case
      return;
    }
    
    // Prevent fetch if we've already queried this ID
    if (fetchedUserIds.has(userId)) {
      logDebug(`Skipping duplicate profile fetch for user ${userId}`);
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
        setProfileNotFound(false);
      } else {
        logDebug('No profile found for user');
        // Still set profile to null to indicate we tried fetching
        setProfile(null);
        setRole(null);
        setProfileNotFound(true); // Explicitly set not found flag
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch user profile'));
      setProfileNotFound(true); // Consider errors as "not found" for UI purposes
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

  // Handle initial session loading with retry for eventual consistency
  useEffect(() => {
    let isMounted = true;
    let retryCount = 0;
    const MAX_RETRIES = 3;
    const RETRY_DELAY = 800; // ms
    
    const setupUser = async () => {
      if (!isMounted) return;
      
      logDebug('Setting up initial user session');
      setIsLoading(true);
      
      try {
        // Get initial session
        const { data: { session: initialSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw sessionError;
        }
        
        if (initialSession) {
          logDebug('Initial session retrieved', 'Session found');
          
          // Handle clock skew warning - log it but continue
          if (initialSession.expires_at && initialSession.expires_at * 1000 > Date.now() + 120000) {
            console.warn('Possible clock skew detected. Server time may be ahead of local time.');
          }
          
          setSession(initialSession);
          
          const initialUser = initialSession?.user || null;
          setUser(initialUser);

          if (initialUser?.id) {
            // Fetch profile asynchronously - don't block loading state on this
            setTimeout(() => {
              if (isMounted) {
                fetchProfile(initialUser.id);
              }
            }, 0);
          }
          
          setInitialCheckDone(true);
        } else if (retryCount < MAX_RETRIES) {
          // Retry for eventual consistency after OAuth redirect
          logDebug(`No session found, retrying (${retryCount + 1}/${MAX_RETRIES})...`);
          retryCount++;
          setTimeout(setupUser, RETRY_DELAY);
          return; // Don't complete loading state yet
        } else {
          // No session after retries
          logDebug('No session found after retries');
          setInitialCheckDone(true);
        }
      } catch (err) {
        console.error('Error setting up user:', err);
        setError(err instanceof Error ? err : new Error('Failed to set up user'));
        handleError(err, { 
          title: 'Authentication Error', 
          message: 'There was a problem setting up your session', 
          showToast: true 
        });
        setInitialCheckDone(true);
      } finally {
        if (isMounted) {
          setIsLoading(false);
          logDebug('Initial setup complete, isLoading set to false');
        }
      }
    };

    setupUser();
    
    return () => { 
      isMounted = false; 
    };
  }, []);

  // Handle auth state changes separately from initial loading
  useEffect(() => {
    let isMounted = true;
    logDebug('Setting up auth state change listener');

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        if (!isMounted) return;
        
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
          setProfileNotFound(false);
          
          // Only fetch profile for new user if we have a valid ID
          if (newUser?.id) {
            // Use setTimeout to break potential deadlock with auth state changes
            setTimeout(() => {
              if (isMounted) {
                fetchProfile(newUser.id);
              }
            }, 0);
          }
        }

        // If signing out, clear profile data
        if (!newUser) {
          logDebug('User signed out, clearing profile data');
          setProfile(null);
          setRole(null);
          setProfileNotFound(false);
          fetchedUserIds.clear();
        }
      }
    );

    return () => {
      isMounted = false;
      logDebug('Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, [user?.id]); // Only re-register when user ID changes to prevent loops

  // Effect to ensure loading state resolves
  useEffect(() => {
    if (initialCheckDone && isLoading) {
      logDebug('Ensuring isLoading is set to false after initialization');
      setIsLoading(false);
    }
  }, [initialCheckDone, isLoading]);

  const contextValue: UserContextValue = {
    session,
    user,
    profile,
    role,
    isLoading,
    error,
    refreshProfile,
    profileNotFound,
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
