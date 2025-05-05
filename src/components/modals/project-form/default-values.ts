
import { ProjectFormValues } from './validation-schema';

// Default form data for a new project
export const defaultValues: ProjectFormValues = {
  name: '',
  type: '',
  description: '',
  location: {
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zip: '',
  },
  timeline: {
    startDate: '',
    endDate: '',
    completionDate: '',
  },
  team: {
    projectManager: '',
    installers: [],
  },
  estimatedWindows: 0,
  instructions: '',
  tags: [],
  priority: 'Medium',
  budgetEstimate: 0,
  attachments: {
    blueprints: [],
    photos: [],
    contracts: [],
  },
};
