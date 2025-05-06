
import { createContext, useContext, ReactNode } from 'react';
import { useSessionProfile } from '@/contexts/session-profile';
import { AuthContextType } from './types';

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  profile: null,
  loading: true,
  isLoading: true,
  isAuthenticated: false,
  profileNotFound: false,
  error: null,
  refreshProfile: async () => {},
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const sessionProfile = useSessionProfile();
  
  // Create a compatible auth object by mapping sessionProfile properties to AuthContextType
  const auth: AuthContextType = {
    ...sessionProfile,
    loading: sessionProfile.isLoading, // Map isLoading to loading for backward compatibility
  };
  
  return (
    <AuthContext.Provider value={auth}>
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
