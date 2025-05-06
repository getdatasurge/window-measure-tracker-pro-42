
import { createContext, useContext, ReactNode } from 'react';
import { useSessionProfileProvider } from './useSessionProfileProvider';
import { SessionProfileContextType } from './types';

const SessionProfileContext = createContext<SessionProfileContextType>({
  user: null,
  session: null,
  profile: null,
  isLoading: true,
  isAuthenticated: false,
  profileNotFound: false,
  error: null,
  refreshProfile: async () => {},
  signOut: async () => {},
});

export const SessionProfileProvider = ({ children }: { children: ReactNode }) => {
  const sessionProfile = useSessionProfileProvider();
  
  return (
    <SessionProfileContext.Provider value={sessionProfile}>
      {children}
    </SessionProfileContext.Provider>
  );
};

export const useSessionProfile = () => {
  const context = useContext(SessionProfileContext);
  if (context === undefined) {
    throw new Error('useSessionProfile must be used within a SessionProfileProvider');
  }
  return context;
};
