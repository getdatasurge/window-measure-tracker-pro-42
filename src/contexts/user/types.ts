
import { Session, User } from '@supabase/supabase-js';
import { Tables } from '@/integrations/supabase/types';

export type Profile = Tables<'profiles'> & {
  role?: string | null;
  phone_number?: string | null;
  avatar_url?: string | null;
};

export interface UserContextValue {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  role: string | null;
  isLoading: boolean;
  error: Error | null;
  refreshProfile: () => Promise<void>;
  profileNotFound: boolean;
}
