
import { TeamMember } from '@/components/teams/TeamMemberList';

// Role distribution data
export const roleDistributionData = [
  { name: 'Team Lead', value: 3, color: '#8B5CF6' },
  { name: 'Installer', value: 8, color: '#3B82F6' },
  { name: 'Measurer', value: 4, color: '#10B981' },
  { name: 'Apprentice', value: 3, color: '#F59E0B' }
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
    count: 8,
    description: 'Installs windows and doors',
    color: '#3B82F6'
  },
  {
    id: '3',
    title: 'Measurer',
    count: 4,
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
    name: 'Alex Morgan',
    role: 'Team Lead',
    team: 'Residential',
    avatar: '/lovable-uploads/75ba837b-8924-4c3d-a163-ab9116a7c9fb.png',
    status: 'active',
    email: 'alex.m@wintrack.com'
  },
  {
    id: '2',
    name: 'Sarah Taylor',
    role: 'Installer',
    team: 'Residential',
    status: 'active',
    email: 'sarah.t@wintrack.com'
  },
  {
    id: '3',
    name: 'Michael Chen',
    role: 'Measurer',
    team: 'Commercial',
    status: 'active',
    email: 'michael.c@wintrack.com'
  },
  {
    id: '4',
    name: 'James Wilson',
    role: 'Team Lead',
    team: 'Commercial',
    status: 'on-leave',
    email: 'james.w@wintrack.com'
  },
  {
    id: '5',
    name: 'Emily Rodriguez',
    role: 'Installer',
    team: 'Specialty',
    status: 'training',
    email: 'emily.r@wintrack.com'
  },
  {
    id: '6',
    name: 'David Kim',
    role: 'Apprentice',
    team: 'Residential',
    status: 'active',
    email: 'david.k@wintrack.com'
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
  { label: 'Apprentice', value: 'apprentice' }
];

export const statusFilterOptions = [
  { label: 'All Statuses', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'On Leave', value: 'on-leave' },
  { label: 'Training', value: 'training' }
];
