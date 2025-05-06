
import React from 'react';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, MapPin, Calendar } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  client: string;
  location?: string;
  deadline: string;
  status: string;
  entries_count?: number;
}

interface ProjectTableProps {
  projects: Project[];
  loading?: boolean;
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'active':
      return 'bg-green-900/30 text-green-400 border border-green-700/30';
    case 'in progress':
      return 'bg-blue-900/30 text-blue-400 border border-blue-700/30';
    case 'planned':
      return 'bg-purple-900/30 text-purple-400 border border-purple-700/30';
    case 'pending':
      return 'bg-amber-900/30 text-amber-400 border border-amber-700/30';
    case 'delayed':
      return 'bg-red-900/30 text-red-400 border border-red-700/30';
    case 'on track':
      return 'bg-green-900/30 text-green-400 border border-green-700/30';
    default:
      return 'bg-zinc-800 text-zinc-300 border border-zinc-700/30';
  }
};

const ProjectTable: React.FC<ProjectTableProps> = ({ projects, loading = false }) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-zinc-400">
        <Loader2 className="h-8 w-8 animate-spin mb-2" />
        <p>Loading projects...</p>
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="text-center py-8 text-zinc-400">
        No active projects found
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-zinc-700/30">
            <TableHead className="text-zinc-400">Project</TableHead>
            <TableHead className="text-zinc-400">Client</TableHead>
            <TableHead className="text-zinc-400 hidden md:table-cell">Location</TableHead>
            <TableHead className="text-zinc-400">Status</TableHead>
            <TableHead className="text-zinc-400 hidden md:table-cell">Deadline</TableHead>
            <TableHead className="text-zinc-400 text-right">Entries</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <TableRow key={project.id} className="border-zinc-700/30">
              <TableCell className="font-medium text-white">{project.name}</TableCell>
              <TableCell className="text-zinc-300">
                {project.client}
                <div className="md:hidden mt-1 text-xs text-zinc-400 flex items-center gap-1">
                  {project.location && (
                    <>
                      <MapPin className="h-3 w-3" /> {project.location}
                    </>
                  )}
                </div>
                <div className="md:hidden mt-1 text-xs text-zinc-400 flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> {project.deadline}
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell text-zinc-300">{project.location || '—'}</TableCell>
              <TableCell>
                <Badge className={`px-2 py-0.5 ${getStatusColor(project.status)}`}>
                  {project.status}
                </Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell text-zinc-300">{project.deadline}</TableCell>
              <TableCell className="text-zinc-300 text-right">{project.entries_count}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProjectTable;
