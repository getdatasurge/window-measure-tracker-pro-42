import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { account } from '@/lib/appwrite';
import { ID } from 'appwrite';
import { toast } from 'react-toastify';

/**
 * @deprecated This context uses Appwrite and is deprecated. 
 * Please use UserContext from '@/contexts/UserContext' which uses Supabase auth instead.
 */
interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithOAuth: (provider: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * @deprecated This provider uses Appwrite and is deprecated. 
 * Please use UserProvider from '@/contexts/UserContext' which uses Supabase auth instead.
 */
export const AuthProvider = ({ children, initialState = false }: { children: ReactNode, initialState?: boolean }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(initialState);
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if the user is authenticated on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        const currentUser = await account.get();
        setUser(currentUser);
        setIsAuthenticated(true);
      } catch (error) {
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  // Login with email and password
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      await account.createEmailSession(email, password);
      const currentUser = await account.get();
      setUser(currentUser);
      setIsAuthenticated(true);
      toast.success('Logged in successfully!');
    } catch (error) {
      toast.error('Failed to login. Please check your credentials.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Login with OAuth provider
  const loginWithOAuth = async (provider: string) => {
    try {
      // Redirect to OAuth provider
      account.createOAuth2Session(provider);
    } catch (error) {
      toast.error(`Failed to login with ${provider}`);
      throw error;
    }
  };

  // Sign up with email and password
  const signup = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      await account.create(ID.unique(), email, password, name);
      await login(email, password);
      toast.success('Account created successfully!');
    } catch (error) {
      toast.error('Failed to create account. Please try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    try {
      await account.deleteSession('current');
      setUser(null);
      setIsAuthenticated(false);
      toast.success('Logged out successfully!');
    } catch (error) {
      toast.error('Failed to logout.');
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, loginWithOAuth, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * @deprecated This hook uses Appwrite and is deprecated. 
 * Please use useUser from '@/contexts/UserContext' which uses Supabase auth instead.
 */
export const useAuth = () => {
  console.warn('useAuth is deprecated. Please use useUser from @/contexts/UserContext instead.');
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
