
export interface ProjectFormData {
  name: string;
  type: string;
  status?: string;
  description?: string;
  location?: {
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    zip?: string;
  };
  timeline?: {
    startDate: string;
    endDate?: string;
    completionDate?: string;
  };
  team?: {
    projectManager?: string;
    installers?: string[];
  };
  estimatedWindows?: number;
  instructions?: string;
  attachments?: {
    blueprints?: File[];
    photos?: File[];
    contracts?: File[];
  };
  tags?: string[];
  priority?: 'Low' | 'Medium' | 'High';
  budgetEstimate?: number;
}
