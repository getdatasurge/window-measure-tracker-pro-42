import React, { useState } from 'react';
import { Filter, Download, Plus, Search, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import TeamFilterDropdown from '@/components/teams/TeamFilterDropdown';
import withResponsiveLayout from '@/hoc/withResponsiveLayout';

// Mock data for measurements
const measurementsData = [
  {
    id: 'WM-2024-001',
    project: 'Acme Corporation HQ Renovation',
    projectId: 'P-2023-045',
    location: 'Main Conference Room',
    recordedBy: 'Michael Thompson',
    glassType: 'Tinted',
    width: '72.50',
    height: '48.25',
    area: '24.31',
    qty: 4,
    orientation: 'South',
    notes: 'Minor frame damage on bottom edge',
    status: 'Completed',
    approval: {
      name: 'Sarah Johnson',
      date: 'Jun 17, 2024'
    },
    created: 'Jun 15, 2024',
    updated: 'Jun 18, 2024'
  },
  {
    id: 'WM-2024-002',
    project: 'Acme Corporation HQ Renovation',
    projectId: 'P-2023-045',
    location: 'Executive Office',
    recordedBy: 'Michael Thompson',
    glassType: 'Reflective',
    width: '96.75',
    height: '72.00',
    area: '48.38',
    qty: 2,
    orientation: 'East',
    notes: '-',
    status: 'Film Cut',
    approval: null,
    created: 'Jun 15, 2024',
    updated: 'Jun 17, 2024'
  },
  {
    id: 'WM-2024-003',
    project: 'TechStart Office Expansion',
    projectId: 'P-2023-052',
    location: 'Reception Area',
    recordedBy: 'Lisa Kim',
    glassType: 'Clear',
    width: '48.00',
    height: '36.50',
    area: '12.17',
    qty: 6,
    orientation: 'North',
    notes: 'Perfect condition, new construction',
    status: 'Installed',
    approval: {
      name: 'Robert Chen',
      date: 'Jun 19, 2024'
    },
    created: 'Jun 16, 2024',
    updated: 'Jun 20, 2024'
  },
  {
    id: 'WM-2024-004',
    project: 'TechStart Office Expansion',
    projectId: 'P-2023-052',
    location: 'Break Room',
    recordedBy: 'Lisa Kim',
    glassType: 'Frosted',
    width: '36.25',
    height: '24.75',
    area: '6.24',
    qty: 2,
    orientation: 'West',
    notes: '-',
    status: 'Under Review',
    approval: null,
    created: 'Jun 16, 2024',
    updated: 'Jun 19, 2024'
  },
  {
    id: 'WM-2024-005',
    project: 'Meridian Financial Center',
    projectId: 'P-2023-060',
    location: 'Meeting Room A',
    recordedBy: 'James Rodriguez',
    glassType: 'Tempered',
    width: '84.00',
    height: '60.50',
    area: '35.23',
    qty: 3,
    orientation: 'South',
    notes: 'Existing frame needs reinforcement',
    status: 'Pending',
    approval: null,
    created: 'Jun 17, 2024',
    updated: 'Jun 17, 2024'
  },
  {
    id: 'WM-2024-006',
    project: 'Meridian Financial Center',
    projectId: 'P-2023-060',
    location: 'Meeting Room B',
    recordedBy: 'James Rodriguez',
    glassType: 'Tempered',
    width: '84.00',
    height: '60.50',
    area: '35.23',
    qty: 3,
    orientation: 'North',
    notes: 'Identical to Meeting Room A',
    status: 'Pending',
    approval: null,
    created: 'Jun 17, 2024',
    updated: 'Jun 17, 2024'
  },
  {
    id: 'WM-2024-007',
    project: 'Horizon Hotel Remodel',
    projectId: 'P-2023-063',
    location: 'Lobby',
    recordedBy: 'Michael Thompson',
    glassType: 'Reflective',
    width: '120.25',
    height: '96.75',
    area: '80.92',
    qty: 1,
    orientation: 'East',
    notes: 'Large format window, requires special handling',
    status: 'Film Cut',
    approval: null,
    created: 'Jun 18, 2024',
    updated: 'Jun 21, 2024'
  },
  {
    id: 'WM-2024-008',
    project: 'Horizon Hotel Remodel',
    projectId: 'P-2023-063',
    location: 'Executive Bathroom',
    recordedBy: 'Michael Thompson',
    glassType: 'Frosted',
    width: '24.50',
    height: '36.75',
    area: '6.26',
    qty: 1,
    orientation: 'N/A',
    notes: 'Interior window, privacy required',
    status: 'Completed',
    approval: {
      name: 'Sarah Johnson',
      date: 'Jun 21, 2024'
    },
    created: 'Jun 18, 2024',
    updated: 'Jun 22, 2024'
  },
  {
    id: 'WM-2024-009',
    project: 'GreenSpace Tech Campus',
    projectId: 'P-2023-070',
    location: 'Open Office Area',
    recordedBy: 'Lisa Kim',
    glassType: 'Tinted',
    width: '60.00',
    height: '48.00',
    area: '20.00',
    qty: 8,
    orientation: 'West',
    notes: 'Afternoon sun exposure, heat reduction priority',
    status: 'Under Review',
    approval: null,
    created: 'Jun 19, 2024',
    updated: 'Jun 23, 2024'
  },
  {
    id: 'WM-2024-010',
    project: 'GreenSpace Tech Campus',
    projectId: 'P-2023-070',
    location: 'CEO Office',
    recordedBy: 'Lisa Kim',
    glassType: 'Other',
    width: '108.50',
    height: '84.25',
    area: '63.55',
    qty: 1,
    orientation: 'South',
    notes: 'Custom UV-blocking glass per specifications',
    status: 'Installed',
    approval: {
      name: 'Robert Chen',
      date: 'Jun 23, 2024'
    },
    created: 'Jun 19, 2024',
    updated: 'Jun 24, 2024'
  }
];

// Filter options
const statusOptions = [
  { label: 'All Statuses', value: 'all' },
  { label: 'Completed', value: 'completed' },
  { label: 'Film Cut', value: 'film-cut' },
  { label: 'Installed', value: 'installed' },
  { label: 'Pending', value: 'pending' },
  { label: 'Under Review', value: 'under-review' },
];

const projectOptions = [
  { label: 'All Projects', value: 'all' },
  { label: 'Acme Corporation', value: 'acme' },
  { label: 'TechStart Office', value: 'techstart' },
  { label: 'Meridian Financial', value: 'meridian' },
  { label: 'Horizon Hotel', value: 'horizon' },
  { label: 'GreenSpace Tech', value: 'greenspace' },
];

const glassTypeOptions = [
  { label: 'All Glass Types', value: 'all' },
  { label: 'Clear', value: 'clear' },
  { label: 'Tinted', value: 'tinted' },
  { label: 'Reflective', value: 'reflective' },
  { label: 'Frosted', value: 'frosted' },
  { label: 'Tempered', value: 'tempered' },
  { label: 'Other', value: 'other' },
];

const MeasurementsPage: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [projectFilter, setProjectFilter] = useState('all');
  const [glassTypeFilter, setGlassTypeFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  // Stats for summary cards
  const totalMeasurements = measurementsData.length;
  const inProgress = measurementsData.filter(m => 
    m.status === 'Film Cut' || m.status === 'Under Review' || m.status === 'Pending'
  ).length;
  const completed = measurementsData.filter(m => 
    m.status === 'Completed' || m.status === 'Installed'
  ).length;
  const totalWindows = measurementsData.reduce((acc, curr) => acc + curr.qty, 0);
  
  // Filter and search logic
  const filteredData = measurementsData.filter(item => {
    const matchesStatus = statusFilter === 'all' || 
      item.status.toLowerCase().replace(' ', '-') === statusFilter.toLowerCase();
    
    const matchesProject = projectFilter === 'all' || 
      item.project.toLowerCase().includes(projectFilter.toLowerCase().replace('-', ' '));
    
    const matchesGlassType = glassTypeFilter === 'all' || 
      item.glassType.toLowerCase() === glassTypeFilter.toLowerCase();
    
    const matchesSearch = searchQuery === '' || 
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.project.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesStatus && matchesProject && matchesGlassType && matchesSearch;
  });

  // Helper function to render status badges with appropriate colors
  const renderStatusBadge = (status: string) => {
    let badgeClass = '';
    
    switch(status) {
      case 'Completed':
        badgeClass = 'bg-green-500/20 text-green-400 hover:bg-green-500/30';
        break;
      case 'Installed':
        badgeClass = 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30';
        break;
      case 'Film Cut':
        badgeClass = 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30';
        break;
      case 'Pending':
        badgeClass = 'bg-zinc-500/20 text-zinc-400 hover:bg-zinc-500/30';
        break;
      case 'Under Review':
        badgeClass = 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30';
        break;
      default:
        badgeClass = 'bg-gray-500/20 text-gray-400 hover:bg-gray-500/30';
    }
    
    return (
      <Badge className={`${badgeClass} rounded-md px-2 py-1 text-xs font-medium`}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="flex flex-col space-y-6">
      {/* Page header - made responsive */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Entry Archive</h1>
          <p className="text-sm text-zinc-400 mt-1">View and manage all window measurement entries</p>
        </div>
        <div className="flex flex-wrap gap-2 self-end sm:self-auto">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2 bg-zinc-800/50 border-zinc-700 text-zinc-300 hover:bg-zinc-700/50"
          >
            <Filter size={14} />
            <span className="sm:inline">Advanced Filter</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2 bg-zinc-800/50 border-zinc-700 text-zinc-300 hover:bg-zinc-700/50"
          >
            <Download size={14} />
            <span className="sm:inline">Export</span>
          </Button>
          <Button 
            size="sm" 
            className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
          >
            <Plus size={14} />
            <span className="sm:inline">New Entry</span>
          </Button>
        </div>
      </div>

      {/* KPI summary cards - made responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-400">Total Measurements</p>
              <h3 className="text-2xl font-bold mt-1 text-white">{totalMeasurements}</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-900/30 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                <path d="M2 9h20M9 20h6M3 4h18a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z"></path>
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-400">In Progress</p>
              <h3 className="text-2xl font-bold mt-1 text-white">{inProgress}</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-amber-900/30 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-400">Completed</p>
              <h3 className="text-2xl font-bold mt-1 text-white">{completed}</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-green-900/30 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-400">Total Windows</p>
              <h3 className="text-2xl font-bold mt-1 text-white">{totalWindows}</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-purple-900/30 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500">
                <rect x="2" y="2" width="20" height="20" rx="2"></rect>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <line x1="12" y1="2" x2="12" y2="22"></line>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Row - made responsive */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <TeamFilterDropdown
            label="All Statuses"
            options={statusOptions}
            selectedValue={statusFilter}
            onSelect={setStatusFilter}
          />
          
          <TeamFilterDropdown
            label="All Projects"
            options={projectOptions}
            selectedValue={projectFilter}
            onSelect={setProjectFilter}
          />

          <TeamFilterDropdown
            label="All Glass Types"
            options={glassTypeOptions}
            selectedValue={glassTypeFilter}
            onSelect={setGlassTypeFilter}
          />
        </div>
        
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <Input 
            placeholder="Search measurements..." 
            className="pl-9 w-full bg-zinc-800/50 border-zinc-700 text-zinc-300"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} 
          />
        </div>
      </div>

      {/* Measurements Table - with overflow handling */}
      <div className="bg-zinc-800/30 border border-zinc-700/50 rounded-lg">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-zinc-800/70">
              <TableRow>
                <TableHead className="text-xs font-medium text-zinc-300">ID</TableHead>
                <TableHead className="text-xs font-medium text-zinc-300">Project</TableHead>
                <TableHead className="text-xs font-medium text-zinc-300">Location</TableHead>
                <TableHead className="text-xs font-medium text-zinc-300">Recorded By</TableHead>
                <TableHead className="text-xs font-medium text-zinc-300">Glass Type</TableHead>
                <TableHead className="text-xs font-medium text-zinc-300 text-center" colSpan={3}>
                  Dimensions
                  <div className="flex text-[10px] justify-around mt-1">
                    <span>Width (in)</span>
                    <span>Height (in)</span>
                    <span>Area (sq ft)</span>
                  </div>
                </TableHead>
                <TableHead className="text-xs font-medium text-zinc-300 text-center" colSpan={3}>
                  Additional Attributes
                  <div className="flex text-[10px] justify-around mt-1">
                    <span>Qty</span>
                    <span>Orientation</span>
                    <span>Notes</span>
                  </div>
                </TableHead>
                <TableHead className="text-xs font-medium text-zinc-300 text-center" colSpan={2}>
                  Status & Workflow
                  <div className="flex text-[10px] justify-around mt-1">
                    <span>Status</span>
                    <span>Approval</span>
                  </div>
                </TableHead>
                <TableHead className="text-xs font-medium text-zinc-300 text-center" colSpan={2}>
                  Timestamps
                  <div className="flex text-[10px] justify-around mt-1">
                    <span>Created</span>
                    <span>Updated</span>
                  </div>
                </TableHead>
                <TableHead className="w-[40px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((measurement, index) => (
                <TableRow 
                  key={measurement.id}
                  className={index % 2 === 0 ? 'bg-zinc-900/30' : 'bg-zinc-800/30'} 
                >
                  <TableCell className="text-xs font-medium text-zinc-300">
                    {measurement.id}
                  </TableCell>
                  <TableCell className="text-xs">
                    <div className="font-medium text-zinc-300">{measurement.project}</div>
                    <div className="text-[10px] text-zinc-400">{measurement.projectId}</div>
                  </TableCell>
                  <TableCell className="text-xs text-zinc-300">{measurement.location}</TableCell>
                  <TableCell className="text-xs text-zinc-300">{measurement.recordedBy}</TableCell>
                  <TableCell className="text-xs text-zinc-300">{measurement.glassType}</TableCell>
                  
                  {/* Dimensions */}
                  <TableCell className="text-xs text-zinc-300 text-center px-1">{measurement.width}</TableCell>
                  <TableCell className="text-xs text-zinc-300 text-center px-1">{measurement.height}</TableCell>
                  <TableCell className="text-xs text-zinc-300 text-center px-1">{measurement.area}</TableCell>
                  
                  {/* Additional Attributes */}
                  <TableCell className="text-xs text-zinc-300 text-center px-1">{measurement.qty}</TableCell>
                  <TableCell className="text-xs text-zinc-300 text-center px-1">{measurement.orientation}</TableCell>
                  <TableCell className="text-xs text-zinc-300 px-1 max-w-[120px] truncate">{measurement.notes}</TableCell>
                  
                  {/* Status & Workflow */}
                  <TableCell className="text-center px-1">
                    {renderStatusBadge(measurement.status)}
                  </TableCell>
                  <TableCell className="text-xs px-1">
                    {measurement.approval ? (
                      <div>
                        <div className="font-medium text-zinc-300">{measurement.approval.name}</div>
                        <div className="text-[10px] text-zinc-400">{measurement.approval.date}</div>
                      </div>
                    ) : (
                      <span className="text-zinc-500">-</span>
                    )}
                  </TableCell>
                  
                  {/* Timestamps */}
                  <TableCell className="text-xs text-zinc-300 text-center px-1">{measurement.created}</TableCell>
                  <TableCell className="text-xs text-zinc-300 text-center px-1">{measurement.updated}</TableCell>
                  
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4 text-zinc-400" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {/* Pagination - made responsive */}
        <div className="p-4 border-t border-zinc-800 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="text-xs text-zinc-400">
            Showing 1 to 10 of {filteredData.length} measurements
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">2</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
};

export default withResponsiveLayout(MeasurementsPage);
