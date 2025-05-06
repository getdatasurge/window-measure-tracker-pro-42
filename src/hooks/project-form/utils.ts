
import { ProjectFormData } from "./types";

/**
 * Combines partial form data with existing form data
 */
export const updateFormData = (
  currentData: ProjectFormData,
  newData: Partial<ProjectFormData>
): ProjectFormData => {
  // Deep merge for complex nested objects
  const mergedData = { ...currentData };
  
  // Handle basic fields
  if (newData.name !== undefined) mergedData.name = newData.name;
  if (newData.description !== undefined) mergedData.description = newData.description;
  if (newData.status !== undefined) mergedData.status = newData.status;
  if (newData.client !== undefined) mergedData.client = newData.client;
  if (newData.dueDate !== undefined) mergedData.dueDate = newData.dueDate;
  if (newData.type !== undefined) mergedData.type = newData.type;
  
  // Handle team-related fields
  if (newData.estimatedWindows !== undefined) mergedData.estimatedWindows = newData.estimatedWindows;
  if (newData.instructions !== undefined) mergedData.instructions = newData.instructions;
  if (newData.tags !== undefined) mergedData.tags = newData.tags;
  if (newData.priority !== undefined) mergedData.priority = newData.priority;
  if (newData.budgetEstimate !== undefined) mergedData.budgetEstimate = newData.budgetEstimate;
  
  // Handle location (which could be a string or an object)
  if (newData.location !== undefined) {
    if (typeof newData.location === 'string') {
      mergedData.location = newData.location;
    } else if (typeof currentData.location === 'string') {
      mergedData.location = { ...newData.location };
    } else {
      mergedData.location = {
        ...currentData.location,
        ...newData.location
      };
    }
  }
  
  // Handle nested timeline object
  if (newData.timeline !== undefined) {
    if (!mergedData.timeline) {
      mergedData.timeline = { startDate: null, endDate: null };
    }
    if (newData.timeline.startDate !== undefined) {
      mergedData.timeline.startDate = newData.timeline.startDate;
    }
    if (newData.timeline.endDate !== undefined) {
      mergedData.timeline.endDate = newData.timeline.endDate;
    }
    if (newData.timeline.phases !== undefined) {
      mergedData.timeline.phases = [...newData.timeline.phases];
    }
  }
  
  // Handle nested team object
  if (newData.team !== undefined) {
    if (!mergedData.team) {
      mergedData.team = { members: [], requiredRoles: [] };
    }
    if (newData.team.members !== undefined) {
      mergedData.team.members = [...newData.team.members];
    }
    if (newData.team.requiredRoles !== undefined) {
      mergedData.team.requiredRoles = [...newData.team.requiredRoles];
    }
  }
  
  // Handle attachments array
  if (newData.attachments !== undefined) {
    if (!mergedData.attachments) {
      mergedData.attachments = [];
    }
    mergedData.attachments = [...newData.attachments];
  }
  
  return mergedData;
};

/**
 * Validates form data and returns validation errors
 */
export const validateFormData = (formData: ProjectFormData) => {
  const errors: Record<string, string> = {};
  
  // Validate required fields
  if (!formData.name) errors.name = "Project name is required";
  if (!formData.description) errors.description = "Description is required";
  if (!formData.client) errors.client = "Client is required";
  if (!formData.type) errors.type = "Project type is required";
  
  // Validate location if it's an object
  if (typeof formData.location === 'object') {
    if (!formData.location.addressLine1) errors.addressLine1 = "Address is required";
    if (!formData.location.city) errors.city = "City is required";
    if (!formData.location.state) errors.state = "State is required";
    if (!formData.location.zip) errors.zip = "ZIP code is required";
  }
  
  // Validate timeline
  if (formData.timeline) {
    if (!formData.timeline.startDate) errors.startDate = "Start date is required";
    if (!formData.timeline.endDate) errors.endDate = "End date is required";
  }
  
  // Validate team
  if (formData.team && formData.team.requiredRoles.length === 0) {
    errors.requiredRoles = "At least one role is required";
  }
  
  return errors;
};
