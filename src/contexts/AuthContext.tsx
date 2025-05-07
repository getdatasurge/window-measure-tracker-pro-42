// src/contexts/auth-context.tsx

import {
  createContext,
  useContext,
  useCallback,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { useSessionContext, useSupabaseClient, Session } from '@supabase/auth-helpers-react';
import { User } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';
import { handleError } from '@/utils/error-handling';

interface AuthContextState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  session: Session | null;
}

const AuthContext = createContext<AuthContextState | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { session, isLoading: sessionLoading } = useSessionContext();
  const supabase = useSupabaseClient();
  const toast = useToast();

  const [loading, setLoading] = useState(false);
  const user = session?.user || null;

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (err) {
      handleError(err, {
        title: 'Login Failed',
        message: 'Invalid credentials or network error.',
        showToast: true,
      });
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (err) {
      handleError(err, {
        title: 'Logout Failed',
        message: 'There was an error signing out.',
        showToast: true,
      });
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  const value: AuthContextState = {
    isAuthenticated: !!user,
    user,
    session,
    loading: loading || sessionLoading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={val
