
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Rename UserContext to AuthContext to match expected imports
const AuthContext = createContext<any>(undefined);

// Export AuthProvider instead of UserProvider to match what's imported in App.tsx
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const session = supabase.auth.getSession().then(({ data }) => {
      const sessionUser = data?.session?.user || null;
      setUser(sessionUser);
      setIsAuthenticated(!!sessionUser);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const newUser = session?.user ?? null;
      setUser(newUser);
      setIsAuthenticated(!!newUser);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const signInWithProvider = async (provider: 'google' | 'github') => {
    const { error } = await supabase.auth.signInWithOAuth({ provider });
    if (error) console.error(`OAuth error with ${provider}:`, error);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated, signInWithProvider, logout }}>
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
