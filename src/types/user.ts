
// User-related type definitions
import { Tables } from '@/integrations/supabase/types';

export type Profile = Tables<'profiles'>;

export type UserRole = 'admin' | 'manager' | 'installer' | 'user';

export interface UserWithProfile {
  id: string;
  email?: string;
  role?: UserRole;
  profile?: Profile;
}
