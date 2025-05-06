import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

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

  const fetchProfile = async (userId: string) => {
    if (fetchedUserIds.has(userId)) return;
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

      if (data) {
        setProfile(data);
        setRole(data.role || null);
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch user profile'));
    }
  };

  const refreshProfile = async () => {
    if (user?.id) {
      fetchedUserIds.delete(user.id); // Clear cached fetch to allow refresh
      await fetchProfile(user.id);
    }
  };

  useEffect(() => {
    const setupUser = async () => {
      setIsLoading(true);
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        setSession(initialSession);

        const initialUser = initialSession?.user || null;
        setUser(initialUser);

        if (initialUser?.id) {
          await fetchProfile(initialUser.id);
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

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        const newUser = newSession?.user || null;

        // Only update if the user has changed
        const userChanged = newUser?.id !== user?.id;

        setSession(newSession);
        setUser(newUser);

        if (userChanged && newUser?.id) {
          await fetchProfile(newUser.id);
        }

        if (!newUser) {
          setProfile(null);
          setRole(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [user?.id]);

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
