
// Centralized project types to avoid circular dependencies

// Project basic data for listings and dropdowns
export interface ProjectOption {
  id: string;
  name: string;
  client_name?: string;
  location?: string;
  status?: string;
  deadline?: string;
}

// Extended project data for detailed views
export interface ProjectDetails extends ProjectOption {
  description?: string;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
}

// Input for creating new projects
export interface ProjectCreateInput {
  name: string;
  client_name?: string;
  location?: string;
  description?: string;
  deadline?: string;
}

// Input for updating existing projects
export interface ProjectUpdateInput {
  name?: string;
  client_name?: string;
  location?: string;
  description?: string;
  deadline?: string;
  status?: string;
}
