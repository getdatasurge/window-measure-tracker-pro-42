
export interface ProjectFormData {
  id?: string;
  name: string;
  description: string;
  status: string;
  client: string;
  deadline?: string;
  dueDate?: string | Date | null;
  
  // Location details
  location?: string | {
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    zip: string;
  };
  
  // Project metadata
  type?: string;
  tags?: string[];
  priority?: 'low' | 'medium' | 'high';
  budgetEstimate?: number | null;
  
  // Timeline information
  timeline?: {
    startDate: string | Date | null;
    endDate: string | Date | null;
    phases?: {
      name: string;
      startDate: string | Date | null;
      endDate: string | Date | null;
    }[];
  };
  
  // Team requirements
  team?: {
    members: {
      id: string;
      role: string;
    }[];
    requiredRoles: string[];
  };
  
  estimatedWindows?: number | null;
  instructions?: string;
  
  // File attachments
  attachments?: {
    id?: string;
    name?: string;
    size?: number;
    type?: string;
    url?: string;
    blueprints?: File[];
    photos?: File[];
    contracts?: File[];
  }[];
  
  // Audit information
  createdAt?: string | Date;
  updatedAt?: string | Date;
  createdBy?: string;
  updatedBy?: string;
  entries_count?: number;
}

export interface Project extends ProjectFormData {
  createdAt: string;
  updatedAt: string;
  entries_count: number;
}

export type ProjectStatus = 'active' | 'planned' | 'completed' | 'on hold' | 'canceled';
