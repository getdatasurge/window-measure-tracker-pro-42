import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { SessionProfileContextType } from './types';
import { handleError } from '@/utils/error-handling';
import type { User, Session } from '@supabase/supabase-js';
import type { Profile } from './types';

export const useSessionProfileProvider = (): SessionProfileContextType => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profileNotFound, setProfileNotFound] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Cache fetched profile IDs to avoid redundant fetches
  const fetchedIds = new Set<string>();

  // Fetch user profile from Supabase
  const fetchProfile = useCallback(async (userId: string) => {
    if (!userId || fetchedIds.has(userId)) return;
    
    console.log(`[SessionProfile] Fetching profile for user ${userId}`);
    fetchedIds.add(userId);
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
        
      if (error) throw error;
      
      setProfile(data);
      setProfileNotFound(!data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setProfileNotFound(true);
      setError(error instanceof Error ? error : new Error('Failed to fetch profile'));
      handleError(error, { 
        title: 'Profile Error',
        message: 'Failed to load your profile. Some features may be limited.',
        showToast: true
      });
    }
  }, []);
  
  // Refresh profile data
  const refreshProfile = useCallback(async () => {
    if (!user?.id) return;
    fetchedIds.delete(user.id);
    await fetchProfile(user.id);
  }, [user?.id, fetchProfile]);
  
  // Sign out function - updated to not handle navigation
  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setProfile(null);
      fetchedIds.clear();
      setError(null);
      
      // Navigation is now handled by the useLogout hook
    } catch (error) {
      console.error('Error signing out:', error);
      setError(error instanceof Error ? error : new Error('Failed to sign out'));
      handleError(error, {
        title: 'Sign Out Error',
        message: 'There was a problem signing you out.',
        showToast: true
      });
      throw error; // Re-throw to allow the calling code to handle it
    }
  }, []);
  
  // Set up auth listener and initial session
  useEffect(() => {
    let isMounted = true;
    let retryCount = 0;
    const MAX_RETRIES = 3;
    const RETRY_DELAY = 800;
    
    // Check for session with retries for eventual consistency
    const checkSession = async () => {
      try {
        // Set isLoading true when starting session check
        setIsLoading(true);
        
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        if (currentSession) {
          if (isMounted) {
            setSession(currentSession);
            setUser(currentSession.user);
            
            // Fetch profile asynchronously
            if (currentSession.user?.id) {
              setTimeout(() => {
                if (isMounted) fetchProfile(currentSession.user.id);
              }, 0);
            }
            
            setIsLoading(false);
          }
        } else if (retryCount < MAX_RETRIES) {
          // Retry for eventual consistency after auth redirects
          retryCount++;
          setTimeout(checkSession, RETRY_DELAY);
        } else {
          // No session after retries
          if (isMounted) {
            setSession(null);
            setUser(null);
            setIsLoading(false);
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        if (isMounted) {
          setIsLoading(false);
          setError(err instanceof Error ? err : new Error('Authentication error'));
          handleError(err, {
            title: 'Authentication Error',
            message: 'There was a problem setting up your session.',
            showToast: true
          });
        }
      }
    };
    
    // Set up auth change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, currentSession) => {
      if (!isMounted) return;
      
      console.log(`[SessionProfile] Auth state changed: ${event}`);
      setSession(currentSession);
      
      const currentUser = currentSession?.user || null;
      setUser(currentUser);
      
      // Reset profile when user changes
      if (currentUser?.id !== user?.id) {
        setProfile(null);
        setProfileNotFound(false);
        
        // Fetch profile for new user
        if (currentUser?.id) {
          // Use setTimeout to break potential deadlock
          setTimeout(() => {
            if (isMounted) fetchProfile(currentUser.id);
          }, 0);
        }
      }
      
      // Ensure loading completes even during auth changes
      setIsLoading(false);
      setError(null);
    });
    
    // Start the session check
    checkSession();
    
    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile, user?.id]);
  
  // Force loading to complete after 5 seconds as a safety mechanism
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (isLoading) {
        console.warn('[SessionProfile] Force completing loading state due to timeout');
        setIsLoading(false);
      }
    }, 5000);
    
    return () => clearTimeout(timeoutId);
  }, [isLoading]);
  
  return {
    user,
    session,
    profile,
    isLoading,
    isAuthenticated: !!user,
    profileNotFound,
    error,
    refreshProfile,
    signOut
  };
};
