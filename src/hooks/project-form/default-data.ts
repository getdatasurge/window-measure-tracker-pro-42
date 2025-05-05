
import { ProjectFormData } from '@/types/project';

// Default form data for a new project
export const defaultFormData: ProjectFormData = {
  name: '',
  type: '',
  status: 'Planned',
  description: '',
  
  location: {
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zip: '',
  },
  
  timeline: {
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    completionDate: '',
  },
  
  team: {
    projectManager: '',
    installers: [],
  },
  estimatedWindows: 0,
  instructions: '',
  
  attachments: {
    blueprints: [],
    photos: [],
    contracts: [],
  },
  tags: [],
  priority: 'Medium',
  budgetEstimate: 0,
};
