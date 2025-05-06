
import { ProjectFormData } from "./types";

// Default values for the project form
export const defaultProjectFormData: ProjectFormData = {
  name: "",
  description: "",
  status: "draft",
  client: "",
  dueDate: null,
  location: {
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zip: ""
  },
  type: "",
  tags: [],
  priority: 'medium',
  budgetEstimate: null,
  timeline: {
    startDate: null,
    endDate: null,
    phases: []
  },
  team: {
    members: [],
    requiredRoles: []
  },
  estimatedWindows: null,
  instructions: "",
  attachments: []
};
