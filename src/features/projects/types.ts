
/**
 * Project types definition
 */

export type ProjectStatus = 'active' | 'pending' | 'completed' | 'archived';

export interface Project {
  id: string;
  name: string;
  client: string;
  location?: string;
  deadline?: string;
  status: ProjectStatus;
  createdAt: string;
  entries_count?: number;
  description?: string;
  budget?: number;
  tags?: string[];
  team_members?: string[];
  client_contact?: string;
  client_phone?: string;
  client_email?: string;
  notes?: string;
}

export interface ProjectFormData {
  name: string;
  client: string;
  location?: string;
  deadline?: string;
  status: string;
  description?: string;
  budget?: number;
  tags?: string[];
  team_members?: string[];
  client_contact?: string;
  client_phone?: string;
  client_email?: string;
  notes?: string;
}

export interface ProjectStats {
  total: number;
  active: number;
  pending: number;
  completed: number;
  archived: number;
}

export interface ProjectFilter {
  status?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
  tags?: string[];
}
