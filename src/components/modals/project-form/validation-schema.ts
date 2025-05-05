
import { z } from 'zod';

// Define validation schema for the form
export const projectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  type: z.string().min(1, "Project type is required"),
  description: z.string().optional(),
  location: z.object({
    addressLine1: z.string().optional(),
    addressLine2: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zip: z.string().optional(),
  }).optional(),
  timeline: z.object({
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    completionDate: z.string().optional(),
  }),
  team: z.object({
    projectManager: z.string().optional(),
    installers: z.array(z.string()).optional(),
  }),
  estimatedWindows: z.number().optional(),
  instructions: z.string().optional(),
  tags: z.array(z.string()).optional(),
  priority: z.enum(["Low", "Medium", "High"]).optional(),
  budgetEstimate: z.number().optional(),
  attachments: z.object({
    blueprints: z.array(z.any()).optional(),
    photos: z.array(z.any()).optional(),
    contracts: z.array(z.any()).optional(),
  }).optional(),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;
