
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
  project?: {
    id: string;
    name: string;
  };
  status?: string;
  priority?: 'low' | 'medium' | 'high';
  details?: Record<string, any>;
}

// Re-export existing types
export * from "@/types/activity";
