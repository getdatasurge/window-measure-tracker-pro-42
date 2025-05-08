
/**
 * Activity types definition
 */

export interface ActivityData {
  id: string;
  timestamp: string;
  type: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  content: {
    title: string;
    description: string;
    project?: {
      id: string;
      name: string;
    };
    meta?: Record<string, any>;
  };
  status?: string;
  priority?: 'low' | 'medium' | 'high';
  // Additional properties from Supabase data structure
  profiles?: { 
    full_name?: string; 
    avatar_url?: string;
  };
  projects?: { 
    name?: string;
  };
  action_type?: string;
  description?: string;
  metadata?: any;
  performed_at?: string;
  performed_by?: string;
  project_id?: string;
}

export interface TeamActivity {
  id: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
    role?: string;
  };
  action: string;
  timestamp: string;
  timeAgo: string;
  avatar?: string;
  name?: string;
  icon?: 'measurement' | 'team' | 'complete' | 'issue' | 'update';
  target?: string;
  targetType?: 'project' | 'team' | 'measurement';
  metadata?: Record<string, any>;
  project?: {
    id: string;
    name: string;
  };
  status?: string;
  priority?: 'low' | 'medium' | 'high';
  details?: Record<string, any>;
}
