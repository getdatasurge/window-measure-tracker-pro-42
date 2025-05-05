
import { format } from 'date-fns';
import { Measurement } from '@/data/measurementsData';

export const generateNewMeasurement = (defaultValues?: Partial<Measurement>): Measurement => {
  const now = new Date().toISOString();
  return {
    id: `WM-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
    projectId: defaultValues?.projectId || '',
    projectName: defaultValues?.projectName || '',
    location: defaultValues?.location || '',
    measurementDate: format(new Date(), 'yyyy-MM-dd'),
    recordedBy: defaultValues?.recordedBy || '',
    width: defaultValues?.width || '0"',
    height: defaultValues?.height || '0"',
    area: defaultValues?.area || '0 ft²',
    quantity: defaultValues?.quantity || 1,
    direction: defaultValues?.direction || 'N/A',
    notes: defaultValues?.notes || '',
    status: 'Pending',
    createdAt: now,
    updatedAt: now,
    updatedBy: 'Current User'
  };
};
