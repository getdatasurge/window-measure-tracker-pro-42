
export interface ActivityItem {
  user: {
    name: string;
    avatar: string;
    initials: string;
  };
  action: string;
  project: string;
  time: string;
  status: string;
}

export interface TeamActivity {
  id: string;
  avatar: string;
  name: string;
  action: string;
  target: string;
  targetType?: 'project' | 'team' | 'measurement';
  timeAgo: string;
  icon: "measurement" | "team" | "complete" | "issue" | "update";
  metadata?: Record<string, any> | null;
}

export interface ActivityData {
  id: string;
  description?: string;
  action_type?: string;
  performed_at: string;
  metadata?: Record<string, any> | string | null;
  project_id?: string;
  projects?: {
    name?: string;
  };
  performed_by?: string;
  profiles?: {
    full_name?: string;
    avatar_url?: string;
  };
}
