
import { createContext, useContext, ReactNode } from 'react';

// Define a basic Profile type to satisfy component requirements
export interface Profile {
  id: string;
  full_name?: string;
  email?: string;
  role?: string;
  avatar_url?: string;
  [key: string]: any;
}

// Define the auth context value with public, non-authenticated defaults
export interface AuthContextValue {
  user: { id: string; email: string } | null;
  session: null;
  profile: Profile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  profileNotFound: boolean;
  error: Error | null;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
}

// Create a context with default values for public access
const AuthContext = createContext<AuthContextValue>({
  user: { id: 'public-user', email: 'public@example.com' },
  session: null,
  profile: {
    id: 'public-user',
    full_name: 'Public User',
    email: 'public@example.com',
    role: 'viewer'
  },
  isLoading: false,
  isAuthenticated: true,  // Always "authenticated" as public user
  profileNotFound: false,
  error: null,
  refreshProfile: async () => {},
  signOut: async () => {}
});

// Export the useAuth hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  return context;
};

export const useUser = useAuth;

// Provider component that wraps app with public auth context
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const defaultValue: AuthContextValue = {
    user: { id: 'public-user', email: 'public@example.com' },
    session: null,
    profile: {
      id: 'public-user',
      full_name: 'Public User',
      email: 'public@example.com',
      role: 'viewer'
    },
    isLoading: false,
    isAuthenticated: true,
    profileNotFound: false,
    error: null,
    refreshProfile: async () => {},
    signOut: async () => {}
  };

  return (
    <AuthContext.Provider value={defaultValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
