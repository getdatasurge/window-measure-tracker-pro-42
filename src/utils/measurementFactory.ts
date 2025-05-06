
import { Measurement } from '@/types/measurement';

/**
 * Generate a new measurement with default values
 */
export const generateNewMeasurement = (defaultValues: Partial<Measurement> = {}): Measurement => {
  const now = new Date().toISOString();
  const datePart = now.split('T')[0];
  
  return {
    id: crypto.randomUUID(),
    projectId: defaultValues.projectId || '',
    projectName: defaultValues.projectName || 'Select Project',
    location: defaultValues.location || '',
    width: defaultValues.width || '0"',
    height: defaultValues.height || '0"',
    area: defaultValues.area || '0 ft²',
    quantity: defaultValues.quantity || 1,
    recordedBy: defaultValues.recordedBy || '',
    direction: (defaultValues.direction as any) || 'N/A',
    notes: defaultValues.notes || '',
    status: defaultValues.status || 'Pending',
    measurementDate: defaultValues.measurementDate || datePart,
    updatedAt: now,
    updatedBy: defaultValues.updatedBy || 'Current User',
  };
};
