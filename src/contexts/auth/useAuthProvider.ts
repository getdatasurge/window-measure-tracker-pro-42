
import { useState, useEffect, useCallback } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Profile } from './types';

export const useAuthProvider = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profileNotFound, setProfileNotFound] = useState(false);
  const navigate = useNavigate();

  // Function to create a new profile for a user if one doesn't exist
  const ensureProfileExists = useCallback(async (userData: User) => {
    try {
      // First check if profile already exists
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userData.id)
        .maybeSingle();
      
      if (fetchError) {
        console.error('Error checking for existing profile:', fetchError);
        return;
      }
      
      // If profile doesn't exist, create one
      if (!existingProfile) {
        console.log('No profile found for user, creating new profile');
        
        // Get the best available name from user metadata
        const userFullName = userData.user_metadata?.full_name || 
                            userData.user_metadata?.name ||
                            userData.user_metadata?.preferred_username ||
                            userData.email?.split('@')[0] ||
                            'User';
        
        // Insert the new profile
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: userData.id,
            email: userData.email,
            full_name: userFullName,
            // Use avatar_url from metadata if available
            ...(userData.user_metadata?.avatar_url && { avatar_url: userData.user_metadata.avatar_url })
          });
        
        if (insertError) {
          console.error('Error creating profile:', insertError);
          return;
        }
        
        console.log('Profile created successfully');
        
        // Fetch the newly created profile
        const { data: newProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userData.id)
          .maybeSingle();
        
        if (newProfile) {
          setProfile(newProfile);
          setProfileNotFound(false);
        }
      } else {
        // Profile exists, update it if necessary
        await syncProfileData(userData.id, userData);
      }
    } catch (error) {
      console.error('Unexpected error ensuring profile exists:', error);
    }
  }, []);

  // Function to sync user display_name to profile.full_name if needed
  const syncProfileData = useCallback(async (userId: string, userData: User) => {
    try {
      // First get the existing profile
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      
      if (fetchError) {
        console.error('Error fetching profile for sync:', fetchError);
        return;
      }
      
      // Determine the best user name to use for full_name
      const userFullName = userData.user_metadata?.full_name || 
                           userData.user_metadata?.name ||
                           userData.app_metadata?.name ||
                           userData.email?.split('@')[0] ||
                           'User';
      
      // Check if we need to update the profile
      if (existingProfile && (!existingProfile.full_name || existingProfile.full_name !== userFullName)) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ full_name: userFullName })
          .eq('id', userId);
          
        if (updateError) {
          console.error('Error updating profile full_name:', updateError);
        } else {
          console.log('Profile full_name updated successfully');
          
          // Update the local profile state with the new full_name
          setProfile(prev => prev ? { ...prev, full_name: userFullName } : null);
        }
      }
    } catch (error) {
      console.error('Unexpected error syncing profile data:', error);
    }
  }, []);

  // Function to fetch user profile
  const fetchProfile = useCallback(async (userId: string, userData: User) => {
    try {
      setLoading(true);
      setProfileNotFound(false);
      
      const { data, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();  // Use maybeSingle instead of single to avoid errors
      
      if (profileError) {
        console.error('Error fetching user profile:', profileError);
        // Don't set profileNotFound here as this is a query error, not a "not found" case
      } else if (!data) {
        console.warn('Profile not found for user', userId);
        setProfileNotFound(true);
        // If no profile exists, create one
        await ensureProfileExists(userData);
      } else {
        setProfile(data);
        setProfileNotFound(false);
        // If we have user data, ensure profile is in sync
        await syncProfileData(userId, userData);
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
      // Don't loop infinitely on failure
      setProfileNotFound(true);
    } finally {
      setLoading(false);
    }
  }, [syncProfileData, ensureProfileExists]);

  // Function to refresh user's profile data
  const refreshProfile = useCallback(async () => {
    if (user?.id) {
      await fetchProfile(user.id, user);
    }
  }, [user, fetchProfile]);

  // Function to sign out
  const signOut = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      
      setUser(null);
      setSession(null);
      setProfile(null);
      setIsAuthenticated(false);
      setProfileNotFound(false);
      toast.success('You have been successfully logged out');
      // Redirect to homepage instead of a specific route
      window.location.href = `${window.location.origin}/`;
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error(error.message || 'Failed to log out');
    }
  }, []);

  useEffect(() => {
    // First, set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        // Update auth state based on event
        setSession(newSession);
        setUser(newSession?.user ?? null);
        setIsAuthenticated(!!newSession);
        
        // Handle specific auth events
        if (event === 'SIGNED_OUT') {
          setUser(null);
          setSession(null);
          setProfile(null);
          setIsAuthenticated(false);
          setProfileNotFound(false);
        } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          setUser(newSession?.user ?? null);
          setSession(newSession);
          setIsAuthenticated(!!newSession);
          
          // Fetch user profile after sign-in
          // Using setTimeout to avoid potential auth deadlocks
          if (newSession?.user) {
            setTimeout(() => {
              ensureProfileExists(newSession.user).then(() => {
                fetchProfile(newSession.user.id, newSession.user);
              });
            }, 0);
          }
        }
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data }) => {
      const sessionUser = data?.session?.user || null;
      setUser(sessionUser);
      setSession(data?.session);
      setIsAuthenticated(!!sessionUser);
      
      // Fetch profile if user is authenticated
      if (sessionUser) {
        // First ensure profile exists, then fetch it
        ensureProfileExists(sessionUser).then(() => {
          fetchProfile(sessionUser.id, sessionUser);
        });
      } else {
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchProfile, ensureProfileExists]);

  return {
    user,
    session,
    profile,
    loading,
    isAuthenticated,
    profileNotFound,
    refreshProfile,
    signOut
  };
};
