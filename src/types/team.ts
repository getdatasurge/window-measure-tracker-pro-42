
export interface TeamMember {
  id: string;
  name: string;
  role: string;
  team: string;
  avatar?: string;
  status: 'active' | 'on-leave' | 'training';
  projects: number;
  email: string;
  phone: string;
  lastActive: string;
}

export interface TeamDistribution {
  name: string;
  value: number;
  color: string;
}

export interface RoleDistribution {
  name: string;
  value: number;
  color: string;
}

export const teamDistributionData: TeamDistribution[] = [
  { name: 'Residential', value: 8, color: 'bg-blue-600' },
  { name: 'Commercial', value: 5, color: 'bg-green-600' },
  { name: 'Specialty', value: 3, color: 'bg-purple-600' }
];

export const roleDistributionData: RoleDistribution[] = [
  { name: 'Team Lead', value: 3, color: 'bg-blue-600' },
  { name: 'Installer', value: 7, color: 'bg-teal-600' },
  { name: 'Measurer', value: 5, color: 'bg-indigo-600' },
  { name: 'Apprentice', value: 3, color: 'bg-purple-600' },
  { name: 'Project Manager', value: 2, color: 'bg-amber-600' }
];
