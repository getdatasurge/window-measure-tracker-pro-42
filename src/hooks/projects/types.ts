
// Project-related types for the hooks
export interface ProjectOption {
  id: string;
  name: string;
  client_name?: string;
  location?: string;
  status?: string;
  deadline?: string;
}

export interface ProjectDetails extends ProjectOption {
  description?: string;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
}

export interface ProjectCreateInput {
  name: string;
  client_name?: string;
  location?: string;
  description?: string;
  deadline?: string;
}

export interface ProjectUpdateInput {
  name?: string;
  client_name?: string;
  location?: string;
  description?: string;
  deadline?: string;
  status?: string;
}

export interface ProjectsHookState {
  loading: boolean;
  error: Error | null;
  projects: ProjectOption[];
  selectedProject: ProjectDetails | null;
}

export interface ProjectsHookActions {
  fetchProjects: (activeOnly?: boolean) => Promise<ProjectOption[]>;
  fetchProjectById: (id: string) => Promise<ProjectDetails | null>;
  createProject: (projectData: ProjectCreateInput) => Promise<ProjectDetails | null>;
  updateProject: (id: string, projectData: ProjectUpdateInput) => Promise<ProjectDetails | null>;
  deleteProject: (id: string) => Promise<boolean>;
}

export interface ProjectsHookReturn extends ProjectsHookState, ProjectsHookActions {
  isLoading: boolean;
}
