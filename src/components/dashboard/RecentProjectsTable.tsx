
import React from 'react';
import { Eye, Pencil, Share } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type ProjectStatus = 'In Progress' | 'Completed' | 'Planning' | 'Delayed';

interface Project {
  name: string;
  client: string;
  status: ProjectStatus;
  measurements: {
    completed: number;
    total: number;
  };
  deadline: string;
}

const getStatusStyles = (status: ProjectStatus) => {
  switch(status) {
    case 'In Progress':
      return 'bg-amber-700/80 text-amber-200';
    case 'Completed':
      return 'bg-green-700/80 text-green-200';
    case 'Planning':
      return 'bg-blue-700/80 text-blue-200';
    case 'Delayed':
      return 'bg-red-700/80 text-red-200';
    default:
      return 'bg-gray-700 text-gray-200';
  }
};

const RecentProjectsTable: React.FC = () => {
  const projects: Project[] = [
    {
      name: 'Downtown Office Tower',
      client: 'Acme Corporation',
      status: 'In Progress',
      measurements: { completed: 24, total: 48 },
      deadline: 'May 15, 2025'
    },
    {
      name: 'Riverside Apartments',
      client: 'Riverfront Properties',
      status: 'Completed',
      measurements: { completed: 36, total: 36 },
      deadline: 'Apr 28, 2025'
    },
    {
      name: 'Greenview Mall',
      client: 'Metro Retail Group',
      status: 'Planning',
      measurements: { completed: 0, total: 72 },
      deadline: 'Jun 10, 2025'
    },
    {
      name: 'Lakeside Hotel',
      client: 'Grand Hospitality',
      status: 'Delayed',
      measurements: { completed: 18, total: 42 },
      deadline: 'Apr 30, 2025'
    }
  ];

  return (
    <div className="bg-zinc-800 rounded-xl shadow-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-zinc-700 bg-zinc-800/70">
            <TableHead className="text-zinc-400 font-medium">PROJECT NAME</TableHead>
            <TableHead className="text-zinc-400 font-medium">CLIENT</TableHead>
            <TableHead className="text-zinc-400 font-medium">STATUS</TableHead>
            <TableHead className="text-zinc-400 font-medium">MEASUREMENTS</TableHead>
            <TableHead className="text-zinc-400 font-medium">DEADLINE</TableHead>
            <TableHead className="text-zinc-400 font-medium text-right">ACTIONS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project, i) => (
            <TableRow key={i} className="border-zinc-700/50 hover:bg-zinc-700/20">
              <TableCell className="font-medium text-zinc-100">{project.name}</TableCell>
              <TableCell>{project.client}</TableCell>
              <TableCell>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyles(project.status)}`}>
                  {project.status}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-xs">
                    <span>{project.measurements.completed}/{project.measurements.total}</span>
                  </div>
                  <Progress 
                    value={(project.measurements.completed / project.measurements.total) * 100} 
                    className="h-1.5 bg-zinc-700"
                  />
                </div>
              </TableCell>
              <TableCell>{project.deadline}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-zinc-100">
                    <Eye size={16} />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-zinc-100">
                    <Pencil size={16} />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-zinc-100">
                    <Share size={16} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default RecentProjectsTable;
