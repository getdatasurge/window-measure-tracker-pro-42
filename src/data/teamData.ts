
import { TeamMember } from '@/components/teams/TeamMemberList';

// Role distribution data
export const roleDistributionData = [
  { name: 'Team Lead', value: 3, color: '#8B5CF6' },
  { name: 'Installer', value: 7, color: '#3B82F6' },
  { name: 'Measurer', value: 5, color: '#10B981' },
  { name: 'Apprentice', value: 3, color: '#F59E0B' }
];

// Team distribution data
export const teamDistributionData = [
  { name: 'Commercial', value: 8, color: '#3B82F6' },
  { name: 'Residential', value: 7, color: '#10B981' },
  { name: 'Specialty', value: 3, color: '#8B5CF6' }
];

// Team roles data
export const teamRolesData = [
  {
    id: '1',
    title: 'Team Lead',
    count: 3,
    description: 'Manages projects and team members',
    color: '#8B5CF6'
  },
  {
    id: '2',
    title: 'Installer',
    count: 7,
    description: 'Installs windows and doors',
    color: '#3B82F6'
  },
  {
    id: '3',
    title: 'Measurer',
    count: 5,
    description: 'Takes precise measurements on-site',
    color: '#10B981'
  },
  {
    id: '4',
    title: 'Apprentice',
    count: 3,
    description: 'Learning all aspects of installation',
    color: '#F59E0B'
  },
  {
    id: '5',
    title: 'Project Manager',
    count: 2,
    description: 'Oversees multiple project sites',
    color: '#EC4899'
  },
  {
    id: '6',
    title: 'Customer Service',
    count: 1,
    description: 'Handles client communications',
    color: '#EF4444'
  }
];

// Team members mock data
export const teamMembersData: TeamMember[] = [
  {
    id: '1',
    name: 'John Smith',
    role: 'Team Lead',
    team: 'Commercial',
    avatar: '/lovable-uploads/75ba837b-8924-4c3d-a163-ab9116a7c9fb.png',
    status: 'active',
    projects: 8,
    email: 'john.s@example.com',
    phone: '(555) 234-5678',
    lastActive: 'Today, 9:41 AM'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    role: 'Measurer',
    team: 'Commercial',
    status: 'active',
    projects: 3,
    email: 'sarah.j@example.com',
    phone: '(555) 234-5678',
    lastActive: 'Today, 9:23 AM'
  },
  {
    id: '3',
    name: 'Michael Chen',
    role: 'Installer',
    team: 'Commercial',
    status: 'active',
    projects: 6,
    email: 'michael.c@example.com',
    phone: '(555) 345-6789',
    lastActive: 'Today, 8:15 AM'
  },
  {
    id: '4',
    name: 'Emily Davis',
    role: 'Team Lead',
    team: 'Residential',
    status: 'active',
    projects: 9,
    email: 'emily.d@example.com',
    phone: '(555) 456-7890',
    lastActive: 'Yesterday, 4:52 PM'
  },
  {
    id: '5',
    name: 'Sarah Johnson',
    role: 'Measurer',
    team: 'Commercial',
    status: 'active',
    projects: 3,
    email: 'sarah.j@example.com',
    phone: '(555) 234-5678',
    lastActive: 'Today, 9:23 AM'
  },
  {
    id: '6',
    name: 'Michael Chen',
    role: 'Installer',
    team: 'Commercial',
    status: 'active',
    projects: 6,
    email: 'michael.c@example.com',
    phone: '(555) 345-6789',
    lastActive: 'Today, 8:15 AM'
  },
  {
    id: '7',
    name: 'Emily Davis',
    role: 'Team Lead',
    team: 'Residential',
    status: 'active',
    projects: 9,
    email: 'emily.d@example.com',
    phone: '(555) 456-7890',
    lastActive: 'Yesterday, 4:52 PM'
  },
  {
    id: '8',
    name: 'Robert Wilson',
    role: 'Team Lead',
    team: 'Specialty',
    status: 'on-leave',
    projects: 4,
    email: 'robert.w@example.com',
    phone: '(555) 567-8901',
    lastActive: '3 days ago'
  },
  {
    id: '9',
    name: 'David Lopez',
    role: 'Installer',
    team: 'Residential',
    status: 'training',
    projects: 2,
    email: 'david.l@example.com',
    phone: '(555) 678-9012',
    lastActive: 'Today, 10:37 AM'
  }
];

// Filter options
export const teamFilterOptions = [
  { label: 'All Teams', value: 'all' },
  { label: 'Residential', value: 'residential' },
  { label: 'Commercial', value: 'commercial' },
  { label: 'Specialty', value: 'specialty' }
];

export const roleFilterOptions = [
  { label: 'All Roles', value: 'all' },
  { label: 'Team Lead', value: 'team-lead' },
  { label: 'Installer', value: 'installer' },
  { label: 'Measurer', value: 'measurer' },
  { label: 'Apprentice', value: 'apprentice' },
  { label: 'Project Manager', value: 'project-manager' },
  { label: 'Customer Service', value: 'customer-service' }
];

export const statusFilterOptions = [
  { label: 'All Statuses', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'On Leave', value: 'on-leave' },
  { label: 'Training', value: 'training' }
];
