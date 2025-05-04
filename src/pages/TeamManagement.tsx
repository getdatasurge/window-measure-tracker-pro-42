
import React from 'react';
import { Users, Building, Briefcase, UserCog, Download, Upload, Plus, Search, Filter, UserPlus } from 'lucide-react';
import DashboardShell from '@/components/layout/DashboardShell';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import DashboardGridRow from '@/components/layout/DashboardGridRow';
import TeamListPanel from '@/components/teams/TeamListPanel';
import RoleDefinitionsPanel from '@/components/teams/RoleDefinitionsPanel';
import TeamStructurePanel from '@/components/teams/TeamStructurePanel';

const TeamManagement = () => {
  return (
    <DashboardShell>
      <div className="flex flex-col space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-2xl font-bold tracking-tight">Team Management</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Add Team Member
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4 border">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Team Members</p>
                <h3 className="text-2xl font-bold mt-1">18</h3>
                <div className="flex items-center mt-1">
                  <span className="text-xs font-medium text-green-600 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 mr-1">
                      <path fillRule="evenodd" d="M12.577 4.878a.75.75 0 01.919-.53l4.78 1.281a.75.75 0 01.531.919l-1.281 4.78a.75.75 0 01-1.449-.387l.81-3.022a19.407 19.407 0 00-5.594 5.203.75.75 0 01-1.139.093L7 10.06l-4.72 4.72a.75.75 0 01-1.06-1.061l5.25-5.25a.75.75 0 011.06 0l3.074 3.073a20.923 20.923 0 015.545-4.931l-3.042-.815a.75.75 0 01-.53-.919z" clipRule="evenodd" />
                    </svg>
                    2 new this month
                  </span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-4 border">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Teams</p>
                <h3 className="text-2xl font-bold mt-1">3</h3>
                <div className="flex items-center mt-1">
                  <span className="text-xs font-medium text-gray-500">
                    Residential, Commercial, Specialty
                  </span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                <Building className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </Card>

          <Card className="p-4 border">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Active Projects</p>
                <h3 className="text-2xl font-bold mt-1">24</h3>
                <div className="flex items-center mt-1">
                  <span className="text-xs font-medium text-green-600 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 mr-1">
                      <path fillRule="evenodd" d="M12.577 4.878a.75.75 0 01.919-.53l4.78 1.281a.75.75 0 01.531.919l-1.281 4.78a.75.75 0 01-1.449-.387l.81-3.022a19.407 19.407 0 00-5.594 5.203.75.75 0 01-1.139.093L7 10.06l-4.72 4.72a.75.75 0 01-1.06-1.061l5.25-5.25a.75.75 0 011.06 0l3.074 3.073a20.923 20.923 0 015.545-4.931l-3.042-.815a.75.75 0 01-.53-.919z" clipRule="evenodd" />
                    </svg>
                    12% from last month
                  </span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <Briefcase className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-4 border">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Roles</p>
                <h3 className="text-2xl font-bold mt-1">6</h3>
                <div className="flex items-center mt-1">
                  <span className="text-xs font-medium text-gray-500">
                    Team Lead, Installer, Measurer, etc.
                  </span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                <UserCog className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Team Filter Tabs */}
        <div className="border-b">
          <Tabs defaultValue="all-teams" className="w-full">
            <TabsList className="flex flex-wrap">
              <TabsTrigger value="all-teams" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600">
                All Teams
              </TabsTrigger>
              <TabsTrigger value="residential" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600">
                Residential
              </TabsTrigger>
              <TabsTrigger value="commercial" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600">
                Commercial
              </TabsTrigger>
              <TabsTrigger value="specialty" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600">
                Specialty
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex flex-1 flex-col sm:flex-row gap-3">
            <Select defaultValue="all-roles">
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-roles">All Roles</SelectItem>
                <SelectItem value="team-lead">Team Lead</SelectItem>
                <SelectItem value="installer">Installer</SelectItem>
                <SelectItem value="measurer">Measurer</SelectItem>
                <SelectItem value="apprentice">Apprentice</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="all-statuses">
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-statuses">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="on-leave">On Leave</SelectItem>
                <SelectItem value="training">Training</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input 
              placeholder="Search team members..." 
              className="pl-9 w-full sm:w-[250px]" 
            />
          </div>
        </div>

        {/* Team List Panel */}
        <TeamListPanel />

        {/* Role Definitions and Team Structure */}
        <DashboardGridRow>
          <RoleDefinitionsPanel />
          <TeamStructurePanel />
        </DashboardGridRow>
      </div>
    </DashboardShell>
  );
};

export default TeamManagement;
