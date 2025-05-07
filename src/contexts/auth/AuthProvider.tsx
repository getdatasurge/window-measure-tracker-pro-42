import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
  useRef
} from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';
import { handleError } from '@/utils/error-handling';

export interface Profile {
  id: string;
  full_name?: string;
  email?: string;
  role?: string;
  avatar_url?: string;
  [key: string]: any;
}

export interface AuthContextValue {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  profileNotFound: boolean;
  error: Error | null;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useUser = useAuth;

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profileNotFound, setProfileNotFound] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const fetchedIds = useRef<Set<string>>(new Set());
  const isMounted = useRef(true);

  const fetchProfile = useCallback(async (userId: string) => {
    if (!userId || fetchedIds.current.has(userId)) return;

    console.debug(`[Auth] Fetching profile for user ${userId}`);
    fetchedIds.current.add(userId);

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) throw error;

      if (isMounted.current) {
        setProfile(data);
        setProfileNotFound(!data);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      if (isMounted.current) {
        setProfileNotFound(true);
        setError(err instanceof Error ? err : new Error('Failed to fetch profile'));
        handleError(err, {
          title: 'Profile Error',
          message: 'Failed to load your profile. Some features may be limited.',
          showToast: true
        });
      }
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user?.id) {
      fetchedIds.current.delete(user.id);
      await fetchProfile(user.id);
    }
  }, [user?.id, fetchProfile]);

  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setProfile(null);
      fetchedIds.current.clear();
      setError(null);
    } catch (err) {
      console.error('Error signing out:', err);
      if (isMounted.current) {
        setError(err instanceof Error ? err : new Error('Failed to sign out'));
        handleError(err, {
          title: 'Sign Out Error',
          message: 'There was a problem signing you out.',
          showToast: true
        });
      }
      throw err;
    }
  }, []);

  useEffect(() => {
    isMounted.current = true;
    const MAX_RETRIES = 3;
    const RETRY_DELAY = 800;
    let retryCount = 0;

    const checkSession = async () => {
      try {
        setIsLoading(true);
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        if (error) throw error;

        if (currentSession) {
          setSession(currentSession);
          setUser(currentSession.user);

          queueMicrotask(() => {
            if (currentSession.user?.id) {
              fetchProfile(currentSession.user.id);
            }
          });

          setIsLoading(false);
        } else if (retryCount < MAX_RETRIES) {
          retryCount++;
          setTimeout(checkSession, RETRY_DELAY);
        } else {
          setSession(null);
          setUser(null);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        if (isMounted.current) {
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

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, currentSession) => {
      if (!isMounted.current) return;
      console.debug(`[Auth] Auth state changed: ${event}`);

      setSession(currentSession);
      const newUser = currentSession?.user ?? null;
      setUser(newUser);

      if (newUser?.id !== user?.id) {
        setProfile(null);
        setProfileNotFound(false);
        queueMicrotask(() => {
          fetchProfile(newUser?.id!);
        });
      }

      setIsLoading(false);
      setError(null);
    });

    checkSession();

    return () => {
      isMounted.current = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile, user?.id]);

  // Safety timeout to forcibly resolve loading state
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isLoading && isMounted.current) {
        console.warn('[Auth] Force completing loading state due to timeout');
        setIsLoading(false);
      }
    }, 5000);
    return () => clearTimeout(timeout);
  }, [isLoading]);

  const contextValue: AuthContextValue = {
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

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
