
import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
};

// Rename UserContext to AuthContext to match expected imports
const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  isAuthenticated: false,
  refreshProfile: async () => {},
  signOut: async () => {},
});

// Export AuthProvider instead of UserProvider to match what's imported in App.tsx
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Function to refresh user profile
  const refreshProfile = useCallback(async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        throw error;
      }
      
      if (session) {
        setUser(session.user);
        setSession(session);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setSession(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error refreshing session:', error);
    }
  }, []);

  // Function to sign out
  const signOut = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      
      setUser(null);
      setSession(null);
      setIsAuthenticated(false);
      toast.success('You have been successfully logged out');
      navigate('/');
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error(error.message || 'Failed to log out');
    }
  }, [navigate]);

  useEffect(() => {
    // First, set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      // Update auth state based on event
      setSession(newSession);
      setUser(newSession?.user ?? null);
      setIsAuthenticated(!!newSession);
      
      // Handle specific auth events
      if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
        setUser(null);
        setSession(null);
        setIsAuthenticated(false);
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        setUser(newSession?.user ?? null);
        setSession(newSession);
        setIsAuthenticated(!!newSession);
      }
    });

    // Then check for existing session
    supabase.auth.getSession().then(({ data }) => {
      const sessionUser = data?.session?.user || null;
      setUser(sessionUser);
      setSession(data?.session);
      setIsAuthenticated(!!sessionUser);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      loading, 
      isAuthenticated, 
      refreshProfile, 
      signOut 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Export both useUser (for backward compatibility) and useAuth (as expected by Sidebar.tsx)
export const useUser = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useUser must be used within an AuthProvider');
  }
  return context;
};

// Add useAuth function that is expected by Sidebar component
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
