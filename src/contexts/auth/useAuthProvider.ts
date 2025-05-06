
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { AuthContextType } from './types';
import { handleError } from '@/utils/error-handling';

export const useAuthProvider = (): AuthContextType => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileNotFound, setProfileNotFound] = useState(false);
  const [error, setError] = useState<Error | null>(null);  // Added error state
  
  // Cache fetched profile IDs to avoid redundant fetches
  const fetchedIds = new Set<string>();

  // Fetch user profile from Supabase
  const fetchProfile = useCallback(async (userId: string) => {
    if (!userId || fetchedIds.has(userId)) return;
    
    console.log(`[Auth] Fetching profile for user ${userId}`);
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
      setError(error instanceof Error ? error : new Error('Failed to fetch profile'));  // Set error state
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
  
  // Sign out function
  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setProfile(null);
      fetchedIds.clear();
      setError(null);  // Clear any errors on sign out
    } catch (error) {
      console.error('Error signing out:', error);
      setError(error instanceof Error ? error : new Error('Failed to sign out'));  // Set error state
      handleError(error, {
        title: 'Sign Out Error',
        message: 'There was a problem signing you out.',
        showToast: true
      });
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
            
            setLoading(false);
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
            setLoading(false);
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        if (isMounted) {
          setLoading(false);
          setError(err instanceof Error ? err : new Error('Authentication error'));  // Set error state
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
      
      console.log(`[Auth] Auth state changed: ${event}`);
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
      setLoading(false);
      setError(null);  // Clear errors on successful auth state change
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
      if (loading) {
        console.warn('[Auth] Force completing loading state due to timeout');
        setLoading(false);
      }
    }, 5000);
    
    return () => clearTimeout(timeoutId);
  }, [loading]);
  
  return {
    user,
    session,
    profile,
    loading,
    isAuthenticated: !!user,
    profileNotFound,
    error,  // Added error to return value
    refreshProfile,
    signOut
  };
};
