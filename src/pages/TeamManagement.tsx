
import React, { useState, useEffect } from 'react';
import { Search, Download, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import TeamFilterTabs from '@/components/teams/TeamFilterTabs';
import TeamMemberList from '@/components/teams/TeamMemberList';
import TeamsGrid from '@/components/teams/TeamsGrid';
import RoleDefinitionsPanel from '@/components/teams/RoleDefinitionsPanel';
import TeamStructurePanel from '@/components/teams/TeamStructurePanel';
import TeamFilterDropdown from '@/components/teams/TeamFilterDropdown';
import DashboardGridRow from '@/components/layout/DashboardGridRow';
import withResponsiveLayout from '@/hoc/withResponsiveLayout';
import { supabase } from '@/integrations/supabase/client';

// Define type for role and status filter options
interface FilterOption {
  label: string;
  value: string;
}

// Define team member interface
interface TeamMember {
  id: string;
  name: string;
  role: string;
  team: string;
  avatar?: string;
  status: string;
  projects: number;
  email: string;
  phone: string;
  lastActive: string;
}

const TeamManagementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all-teams');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  // Role and status filter options
  const roleFilterOptions: FilterOption[] = [
    { label: 'All Roles', value: 'all' },
    { label: 'Team Lead', value: 'team-lead' },
    { label: 'Installer', value: 'installer' },
    { label: 'Measurer', value: 'measurer' },
    { label: 'Apprentice', value: 'apprentice' },
    { label: 'Project Manager', value: 'project-manager' },
    { label: 'Customer Service', value: 'customer-service' }
  ];
  
  const statusFilterOptions: FilterOption[] = [
    { label: 'All Statuses', value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'On Leave', value: 'on-leave' },
    { label: 'Training', value: 'training' }
  ];

  // Team filter options
  const teamFilterOptions: FilterOption[] = [
    { label: 'All Teams', value: 'all' },
    { label: 'Residential', value: 'residential' },
    { label: 'Commercial', value: 'commercial' },
    { label: 'Specialty', value: 'specialty' }
  ];

  // Fetch team members from Supabase
  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        setLoading(true);
        
        // Fetch team members from profiles table
        const { data, error } = await supabase
          .from('profiles')
          .select('*');
          
        if (error) {
          throw error;
        }
        
        // Transform data to match the expected format
        const members: TeamMember[] = data.map((profile) => ({
          id: profile.id,
          name: profile.full_name || 'Unknown User',
          role: profile.role || 'Team Member',
          team: 'Residential', // Default team if not available
          avatar: profile.avatar_url || '/lovable-uploads/f1ba8f91-019b-4932-9d0e-5414aef0ed47.png',
          status: 'active', // Default status
          projects: 0, // Default project count 
          email: profile.email || '',
          phone: profile.phone_number || '',
          lastActive: 'Today' // Default last active
        }));
        
        setTeamMembers(members);
      } catch (error) {
        console.error('Error fetching team members:', error);
        setTeamMembers([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTeamMembers();
  }, []);

  // Filter team members based on active filters
  const filteredMembers = teamMembers.filter(member => {
    const matchesTeam = activeTab === 'all-teams' || 
      member.team.toLowerCase() === activeTab.toLowerCase();
    
    const matchesRole = roleFilter === 'all' || 
      member.role.toLowerCase().replace(' ', '-') === roleFilter.toLowerCase();
    
    const matchesStatus = statusFilter === 'all' || 
      member.status === statusFilter;
    
    const matchesSearch = searchQuery === '' || 
      member.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesTeam && matchesRole && matchesStatus && matchesSearch;
  });

  return (
    <div className="flex flex-col space-y-6">
      {/* Page Header - Responsive */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Team Management</h1>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-2 border-zinc-700 bg-zinc-800/50 text-zinc-300 hover:bg-zinc-700/50">
            <Download className="h-4 w-4" />
            <span className="sm:inline">Export</span>
          </Button>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            <span className="sm:inline">Add Team Member</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards - Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-3 sm:p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-zinc-400">Total Team Members</p>
              <h3 className="text-xl sm:text-2xl font-bold mt-1 text-white">{teamMembers.length}</h3>
              <div className="flex items-center mt-1">
                <span className="text-xs font-medium text-green-500 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 mr-1">
                    <path fillRule="evenodd" d="M12.577 4.878a.75.75 0 01.919-.53l4.78 1.281a.75.75 0 01.531.919l-1.281 4.78a.75.75 0 01-1.449-.387l.81-3.022a19.407 19.407 0 00-5.594 5.203.75.75 0 01-1.139.093L7 10.06l-4.72 4.72a.75.75 0 01-1.06-1.061l5.25-5.25a.75.75 0 011.06 0l3.074 3.073a20.923 20.923 0 015.545-4.931l-3.042-.815a.75.75 0 01-.53-.919z" clipRule="evenodd" />
                  </svg>
                  {teamMembers.length > 0 ? `${teamMembers.length} active members` : 'No members yet'}
                </span>
              </div>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-900/30 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500 sm:hidden"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500 hidden sm:block"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            </div>
          </div>
        </div>

        <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-3 sm:p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-zinc-400">Teams</p>
              <h3 className="text-xl sm:text-2xl font-bold mt-1 text-white">3</h3>
              <div className="flex items-center mt-1">
                <span className="text-xs font-medium text-zinc-400">
                  Residential, Commercial, Specialty
                </span>
              </div>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-purple-900/30 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500 sm:hidden"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500 hidden sm:block"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
            </div>
          </div>
        </div>

        <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-3 sm:p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-zinc-400">Active Projects</p>
              <h3 className="text-xl sm:text-2xl font-bold mt-1 text-white">--</h3>
              <div className="flex items-center mt-1">
                <span className="text-xs font-medium text-zinc-400">
                  Loading project data...
                </span>
              </div>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-900/30 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 sm:hidden"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 hidden sm:block"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
            </div>
          </div>
        </div>

        <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-3 sm:p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-zinc-400">Roles</p>
              <h3 className="text-xl sm:text-2xl font-bold mt-1 text-white">6</h3>
              <div className="flex items-center mt-1">
                <span className="text-xs font-medium text-zinc-400">
                  Team Lead, Installer, Measurer, etc.
                </span>
              </div>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-yellow-900/30 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-500 sm:hidden"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-500 hidden sm:block"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            </div>
          </div>
        </div>
      </div>

      {/* Team Filter Tabs */}
      <TeamFilterTabs 
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Filters and Search - Now responsive */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <TeamFilterDropdown
            label="All Roles"
            options={roleFilterOptions}
            selectedValue={roleFilter}
            onSelect={setRoleFilter}
          />
          
          <TeamFilterDropdown
            label="All Statuses"
            options={statusFilterOptions}
            selectedValue={statusFilter}
            onSelect={setStatusFilter}
          />
        </div>
        
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <Input 
            placeholder="Search team members..." 
            className="pl-9 w-full bg-zinc-800/50 border-zinc-700 text-zinc-300"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} 
          />
        </div>
      </div>

      {/* Team Member List */}
      <TeamMemberList members={filteredMembers} />

      {/* Role Definitions and Team Structure */}
      <DashboardGridRow>
        <RoleDefinitionsPanel />
        <TeamStructurePanel />
      </DashboardGridRow>
    </div>
  );
};

export default withResponsiveLayout(TeamManagementPage);
