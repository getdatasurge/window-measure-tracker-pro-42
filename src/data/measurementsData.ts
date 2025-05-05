
export type MeasurementStatus = 'Pending' | 'Film Cut' | 'Installed' | 'Under Review' | 'Completed';
export type Direction = 'North' | 'South' | 'East' | 'West' | 'N/A';

export interface Measurement {
  id: string;
  projectId: string;
  projectName: string;
  location: string;
  measurementDate: string;
  recordedBy: string;
  width: string;
  height: string;
  area: string;
  quantity: number;
  direction: Direction;
  notes: string;
  status: MeasurementStatus;
  reviewComments?: string;
  approvalBy?: string;
  approvalDate?: string;
  createdAt: string;
  updatedAt: string;
  updatedBy: string;
  changeMade?: string;
  glassType?: string;
}

// Mock data for measurements
export const mockMeasurements: Measurement[] = [
  {
    id: 'WM-2024-005',
    projectId: 'P-2024-001',
    projectName: 'Meridian Financial Center',
    location: 'Meeting Room A',
    measurementDate: '2024-06-16',
    recordedBy: 'James Rodriguez',
    width: '84.00"',
    height: '60.50"',
    area: '35.23 ft²',
    quantity: 3,
    direction: 'North',
    notes: 'Existing frame needs reinforcement',
    status: 'Pending',
    createdAt: '2024-06-16T08:00:00Z',
    updatedAt: '2024-06-17T08:05:00Z',
    updatedBy: 'James Rodriguez',
    glassType: 'Tempered'
  },
  {
    id: 'WM-2024-002',
    projectId: 'P-2024-002',
    projectName: 'Acme Corporation HQ Renovation',
    location: 'Executive Office',
    measurementDate: '2024-06-14',
    recordedBy: 'Michael Thompson',
    width: '96.75"',
    height: '72.00"',
    area: '48.38 ft²',
    quantity: 2,
    direction: 'East',
    notes: '',
    status: 'Film Cut',
    createdAt: '2024-06-14T10:00:00Z',
    updatedAt: '2024-06-17T09:30:00Z',
    updatedBy: 'Michael Thompson',
    glassType: 'Reflective'
  },
  {
    id: 'WM-2024-003',
    projectId: 'P-2024-003',
    projectName: 'TechStart Office Expansion',
    location: 'Reception Area',
    measurementDate: '2024-06-15',
    recordedBy: 'Lisa Kim',
    width: '48.00"',
    height: '36.50"',
    area: '12.17 ft²',
    quantity: 6,
    direction: 'South',
    notes: 'Perfect condition, new construction',
    status: 'Installed',
    approvalBy: 'John Smith',
    approvalDate: '2024-06-20T14:00:00Z',
    createdAt: '2024-06-15T11:00:00Z',
    updatedAt: '2024-06-20T12:45:00Z',
    updatedBy: 'Lisa Kim',
    glassType: 'Clear'
  },
  {
    id: 'WM-2024-007',
    projectId: 'P-2024-004',
    projectName: 'Horizon Hotel Remodel',
    location: 'Lobby',
    measurementDate: '2024-06-17',
    recordedBy: 'Michael Thompson',
    width: '120.25"',
    height: '96.75"',
    area: '80.92 ft²',
    quantity: 1,
    direction: 'West',
    notes: 'Large format window, requires special handling',
    status: 'Film Cut',
    createdAt: '2024-06-17T14:00:00Z',
    updatedAt: '2024-06-21T08:20:00Z',
    updatedBy: 'Michael Thompson',
    glassType: 'Reflective'
  },
  {
    id: 'WM-2024-006',
    projectId: 'P-2024-001',
    projectName: 'Meridian Financial Center',
    location: 'Meeting Room B',
    measurementDate: '2024-06-16',
    recordedBy: 'James Rodriguez',
    width: '84.00"',
    height: '60.50"',
    area: '35.23 ft²',
    quantity: 3,
    direction: 'North',
    notes: 'Identical to Meeting Room A',
    status: 'Pending',
    createdAt: '2024-06-16T09:15:00Z',
    updatedAt: '2024-06-17T08:30:00Z',
    updatedBy: 'James Rodriguez',
    glassType: 'Tempered'
  }
];

// Projects data
export const projects = [
  { id: 'all', name: 'All Projects' },
  { id: 'P-2024-001', name: 'Meridian Financial Center' },
  { id: 'P-2024-002', name: 'Acme Corporation HQ Renovation' },
  { id: 'P-2024-003', name: 'TechStart Office Expansion' },
  { id: 'P-2024-004', name: 'Horizon Hotel Remodel' }
];

// Installers data
export const installers = [
  { id: 'all', name: 'All Installers' },
  { id: 'james.rodriguez', name: 'James Rodriguez' },
  { id: 'michael.thompson', name: 'Michael Thompson' },
  { id: 'lisa.kim', name: 'Lisa Kim' }
];

// Statuses with colors
export const statuses = [
  { value: 'all', label: 'All Statuses', color: 'gray' },
  { value: 'Pending', label: 'Pending', color: 'amber' },
  { value: 'Film Cut', label: 'Film Cut', color: 'blue' },
  { value: 'Installed', label: 'Installed', color: 'green' },
  { value: 'Under Review', label: 'Under Review', color: 'purple' },
  { value: 'Completed', label: 'Completed', color: 'green' }
];

// Glass types
export const glassTypes = [
  { value: 'all', label: 'All Glass Types' },
  { value: 'Clear', label: 'Clear' },
  { value: 'Tinted', label: 'Tinted' },
  { value: 'Reflective', label: 'Reflective' },
  { value: 'Frosted', label: 'Frosted' },
  { value: 'Tempered', label: 'Tempered' },
  { value: 'Other', label: 'Other' }
];

// Helper function to get measurements for a specific day
export const getMeasurementsForDay = (date: Date): Measurement[] => {
  const dateString = date.toISOString().split('T')[0];
  return mockMeasurements.filter(m => m.measurementDate === dateString);
};

// Helper function to get measurements by status
export const getMeasurementsByStatus = (measurements: Measurement[], status: MeasurementStatus | 'all'): Measurement[] => {
  if (status === 'all') return measurements;
  return measurements.filter(m => m.status === status);
};

// Get all archived measurements (just for display in the table)
export const getArchivedMeasurements = (): Measurement[] => {
  return [
    // Add more archived measurements here if needed
    {
      id: 'WM-2024-001',
      projectId: 'P-2024-001',
      projectName: 'Meridian Financial Center',
      location: 'Executive Suite',
      measurementDate: '2024-06-10',
      recordedBy: 'James Rodriguez',
      width: '72.00"',
      height: '48.00"',
      area: '24.00 ft²',
      quantity: 1,
      direction: 'North',
      notes: 'Archived - replaced with newer measurement',
      status: 'Completed',
      approvalBy: 'John Smith',
      approvalDate: '2024-06-11T16:00:00Z',
      createdAt: '2024-06-10T10:30:00Z',
      updatedAt: '2024-06-11T16:30:00Z',
      updatedBy: 'James Rodriguez',
      changeMade: 'Archived',
      glassType: 'Tinted'
    },
  ];
};
