
import { Session, User } from '@supabase/supabase-js';
import { Tables } from '@/integrations/supabase/types';

// Define the Profile type based on your Supabase schema
export type Profile = Tables<'profiles'>;

export type SessionProfileContextType = {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  profileNotFound: boolean;
  error: Error | null;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
};
