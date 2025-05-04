
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Project } from "../../data/projectsData";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface ProjectTableProps {
  projects: Project[];
}

const ProjectTable: React.FC<ProjectTableProps> = ({ projects }) => {
  const [sortField, setSortField] = useState<keyof Project>('deadline');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 5;
  
  // Sort projects based on current sort field and direction
  const sortedProjects = [...projects].sort((a, b) => {
    if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });
  
  // Get current page projects
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = sortedProjects.slice(indexOfFirstProject, indexOfLastProject);
  
  // Total pages calculation
  const totalPages = Math.ceil(projects.length / projectsPerPage);
  
  // Handle sort change
  const handleSort = (field: keyof Project) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  // Status badge color mapping
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'Just Started': return 'bg-blue-500/20 text-blue-300';
      case 'In Progress': return 'bg-indigo-500/20 text-indigo-300';
      case 'Needs Review': return 'bg-amber-500/20 text-amber-300';
      case 'Final Check': return 'bg-purple-500/20 text-purple-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };
  
  // Progress color mapping
  const getProgressColor = (progress: number): string => {
    if (progress < 30) return '#4A90E2';
    if (progress < 70) return '#9B87F5';
    return '#10B981';
  };
  
  // Generate pagination links
  const paginationLinks = [];
  for (let i = 1; i <= totalPages; i++) {
    paginationLinks.push(
      <PaginationItem key={i}>
        <PaginationLink
          onClick={() => setCurrentPage(i)}
          isActive={currentPage === i}
          className={`${currentPage === i ? 'bg-indigo-600/30 border-indigo-500' : 'bg-zinc-800/50'}`}
        >
          {i}
        </PaginationLink>
      </PaginationItem>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="rounded-md border border-zinc-700/50 overflow-hidden">
        <Table className="w-full">
          <TableHeader className="bg-zinc-900/50">
            <TableRow className="hover:bg-zinc-800/50 border-zinc-700/50">
              <TableHead 
                className="text-xs font-medium text-zinc-400 cursor-pointer"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center">
                  Project Name
                  {sortField === 'name' && (
                    sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                  )}
                </div>
              </TableHead>
              <TableHead 
                className="text-xs font-medium text-zinc-400 cursor-pointer hidden sm:table-cell"
                onClick={() => handleSort('client')}
              >
                <div className="flex items-center">
                  Client
                  {sortField === 'client' && (
                    sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                  )}
                </div>
              </TableHead>
              <TableHead 
                className="text-xs font-medium text-zinc-400 cursor-pointer hidden md:table-cell"
                onClick={() => handleSort('location')}
              >
                <div className="flex items-center">
                  Location
                  {sortField === 'location' && (
                    sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                  )}
                </div>
              </TableHead>
              <TableHead 
                className="text-xs font-medium text-zinc-400 cursor-pointer hidden md:table-cell"
                onClick={() => handleSort('windows')}
              >
                <div className="flex items-center">
                  Windows
                  {sortField === 'windows' && (
                    sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                  )}
                </div>
              </TableHead>
              <TableHead 
                className="text-xs font-medium text-zinc-400 cursor-pointer"
                onClick={() => handleSort('progress')}
              >
                <div className="flex items-center">
                  Progress
                  {sortField === 'progress' && (
                    sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                  )}
                </div>
              </TableHead>
              <TableHead 
                className="text-xs font-medium text-zinc-400 cursor-pointer hidden lg:table-cell"
                onClick={() => handleSort('deadline')}
              >
                <div className="flex items-center">
                  Deadline
                  {sortField === 'deadline' && (
                    sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                  )}
                </div>
              </TableHead>
              <TableHead 
                className="text-xs font-medium text-zinc-400 cursor-pointer"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center">
                  Status
                  {sortField === 'status' && (
                    sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                  )}
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentProjects.map((project) => (
              <TableRow 
                key={project.id} 
                className="hover:bg-zinc-800/30 border-zinc-700/50"
              >
                <TableCell className="py-3">
                  <div className="flex items-center gap-3">
                    <div 
                      className={`w-3 h-3 rounded-full`}
                      style={{ backgroundColor: project.color === 'blue' ? '#4A90E2' : 
                                           project.color === 'purple' ? '#9B87F5' :
                                           project.color === 'orange' ? '#F5A623' : 
                                           project.color === 'red' ? '#EA384C' : 
                                           project.color === 'green' ? '#10B981' : 
                                           project.color === 'pink' ? '#F472B6' : '#9B87F5' }}
                    />
                    <span className="font-medium text-white">{project.name}</span>
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell text-zinc-300">
                  {project.client}
                </TableCell>
                <TableCell className="hidden md:table-cell text-zinc-300">
                  {project.location}
                </TableCell>
                <TableCell className="hidden md:table-cell text-zinc-300">
                  {project.windows}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <Progress 
                      value={project.progress} 
                      className="h-2"
                      style={{ 
                        '--progress-indicator-color': getProgressColor(project.progress)
                      } as React.CSSProperties}
                    />
                    <span className="text-xs text-zinc-400">{project.progress}%</span>
                  </div>
                </TableCell>
                <TableCell className="hidden lg:table-cell text-zinc-300">
                  {project.deadline}
                </TableCell>
                <TableCell>
                  <Badge className={`${getStatusColor(project.status)} font-normal`}>
                    {project.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className={`${currentPage === 1 ? 'pointer-events-none opacity-50' : ''} bg-zinc-800/50 border-zinc-700/50 text-zinc-300 hover:bg-zinc-700`}
              />
            </PaginationItem>
            
            {paginationLinks}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className={`${currentPage === totalPages ? 'pointer-events-none opacity-50' : ''} bg-zinc-800/50 border-zinc-700/50 text-zinc-300 hover:bg-zinc-700`}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default ProjectTable;
