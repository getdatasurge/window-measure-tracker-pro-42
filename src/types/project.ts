
export interface ProjectFormData {
  id: string;
  name: string;
  client: string;
  description: string;
  location?: string;
  deadline: string;
  status: string;
  budget?: number;
  teamMembers?: string[];
}

export interface Project extends ProjectFormData {
  createdAt: string;
  updatedAt: string;
  entries_count: number;
}

export type ProjectStatus = 'active' | 'planned' | 'completed' | 'on hold' | 'canceled';
