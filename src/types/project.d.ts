export interface ProjectOption {
  id: string;
  name: string;
  client_name?: string;
  location?: string;
  status?: string;
}

export interface ProjectDetails extends ProjectOption {
  deadline?: string;
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
