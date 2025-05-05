
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

// Define the Profile type based on your Supabase schema
type Profile = Tables<'profiles'> & {
  role?: string | null;
};

// Define what our context will contain
interface UserContextValue {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  role: string | null;
  isLoading: boolean;
  error: Error | null;
  refreshProfile: () => Promise<void>;
}

// Create the context with a default value
const UserContext = createContext<UserContextValue | undefined>(undefined);

// Props for the UserProvider component
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

  // Function to fetch the user's profile data
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (profileError) {
        throw profileError;
      }

      if (data) {
        setProfile(data);
        setRole(data.role || null);
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch user profile'));
    }
  };

  // Function to refresh the user's profile data
  const refreshProfile = async () => {
    if (user?.id) {
      await fetchProfile(user.id);
    }
  };

  // Effect to get the initial session
  useEffect(() => {
    const setupUser = async () => {
      setIsLoading(true);
      try {
        // Get the initial session
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        setSession(initialSession);
        
        if (initialSession?.user) {
          setUser(initialSession.user);
          await fetchProfile(initialSession.user.id);
        }
      } catch (err) {
        console.error('Error setting up user:', err);
        setError(err instanceof Error ? err : new Error('Failed to set up user'));
      } finally {
        setIsLoading(false);
      }
    };
    
    setupUser();
  }, []);

  // Set up the auth state change listener
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_, newSession) => {
        setSession(newSession);
        setUser(newSession?.user || null);
        
        if (newSession?.user) {
          // Use setTimeout to avoid potential auth deadlocks
          setTimeout(() => {
            fetchProfile(newSession.user!.id);
          }, 0);
        } else {
          setProfile(null);
          setRole(null);
        }
      }
    );

    // Clean up subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const contextValue: UserContextValue = {
    session,
    user,
    profile,
    role,
    isLoading,
    error,
    refreshProfile
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the UserContext
export const useUser = () => {
  const context = useContext(UserContext);
  
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  
  return context;
};

export default UserContext;
