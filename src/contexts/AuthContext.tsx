
import React, { createContext, useContext, useState, useEffect } from 'react';

// Define the auth context state type
interface AuthContextState {
  isAuthenticated: boolean;
  user: any | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

// Create the context with default values
const AuthContext = createContext<AuthContextState>({
  isAuthenticated: false,
  user: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
});

// Create a provider component
export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Check if the user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Placeholder for actual auth check logic
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      // Placeholder for actual login logic
      const userData = { id: '1', email, name: 'User' };
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    } finally {
      setLoading(false);
    }
  };
  
  const logout = async () => {
    try {
      setLoading(true);
      // Placeholder for actual logout logic
      localStorage.removeItem('user');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <AuthContext.Provider 
      value={{
        isAuthenticated: !!user,
        user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Create a hook for easy access to the auth context
export const useAuth = () => useContext(AuthContext);
