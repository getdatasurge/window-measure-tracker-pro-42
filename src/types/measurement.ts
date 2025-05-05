
export type Direction = 'North' | 'South' | 'East' | 'West' | 'N/A';

export interface Measurement {
  id: string;
  projectId: string;
  projectName: string;
  location: string;
  measurementDate: string;
  recordedBy: string;
  width?: string;
  height?: string;
  area?: string;
  quantity: number;
  direction: Direction;
  notes: string;
  status: string;
  glassType?: string;
  createdAt: string;
  updatedAt: string;
  updatedBy: string;
}
