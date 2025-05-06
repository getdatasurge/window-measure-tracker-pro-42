
import { Session, User } from '@supabase/supabase-js';
import { Tables } from '@/integrations/supabase/types';

// Define the Profile type based on your Supabase schema
export type Profile = Tables<'profiles'>;

export type AuthContextType = {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  isAuthenticated: boolean;
  profileNotFound: boolean;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
};
