
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
import { motion } from 'framer-motion';

type ProjectStatus = 'In Progress' | 'Completed' | 'Planning' | 'Delayed' | 'On Track';

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
      return 'bg-amber-900/30 text-amber-400 border border-amber-700/30';
    case 'Completed':
      return 'bg-green-900/30 text-green-400 border border-green-700/30';
    case 'Planning':
      return 'bg-blue-900/30 text-blue-400 border border-blue-700/30';
    case 'Delayed':
      return 'bg-red-900/30 text-red-400 border border-red-700/30';
    case 'On Track':
      return 'bg-green-900/30 text-green-400 border border-green-700/30';
    default:
      return 'bg-zinc-800 text-zinc-300 border border-zinc-700/30';
  }
};

const getProgressColor = (progress: number) => {
  if (progress >= 100) return 'bg-green-500';
  if (progress >= 75) return 'bg-emerald-500';
  if (progress >= 50) return 'bg-blue-500';
  if (progress >= 25) return 'bg-amber-500';
  return 'bg-orange-500';
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

  const tableContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        when: "beforeChildren"
      }
    }
  };

  const tableRow = {
    hidden: { opacity: 0, x: -10 },
    show: { opacity: 1, x: 0, transition: { duration: 0.4 } }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="show"
      variants={tableContainer}
      className="bg-[#1a1a1a] rounded-xl shadow-lg overflow-hidden border border-zinc-800/70"
    >
      <Table>
        <TableHeader>
          <TableRow className="border-zinc-700/50 bg-zinc-800/50">
            <TableHead className="text-xs uppercase tracking-wide text-zinc-400 font-medium">Project Name</TableHead>
            <TableHead className="text-xs uppercase tracking-wide text-zinc-400 font-medium">Client</TableHead>
            <TableHead className="text-xs uppercase tracking-wide text-zinc-400 font-medium">Status</TableHead>
            <TableHead className="text-xs uppercase tracking-wide text-zinc-400 font-medium">Measurements</TableHead>
            <TableHead className="text-xs uppercase tracking-wide text-zinc-400 font-medium">Deadline</TableHead>
            <TableHead className="text-xs uppercase tracking-wide text-zinc-400 font-medium text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project, i) => (
            <motion.tr 
              key={i} 
              variants={tableRow}
              className="border-zinc-700/30 hover:bg-zinc-800/40 transition-colors"
            >
              <TableCell className="font-medium text-white">{project.name}</TableCell>
              <TableCell className="text-zinc-300">{project.client}</TableCell>
              <TableCell>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyles(project.status)}`}>
                  {project.status}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-400">{project.measurements.completed}/{project.measurements.total}</span>
                    <span className="text-zinc-400">
                      {Math.round((project.measurements.completed / project.measurements.total) * 100)}%
                    </span>
                  </div>
                  <Progress 
                    value={(project.measurements.completed / project.measurements.total) * 100} 
                    className="h-1.5 bg-zinc-700"
                    indicatorClassName={getProgressColor((project.measurements.completed / project.measurements.total) * 100)}
                  />
                </div>
              </TableCell>
              <TableCell className="text-zinc-300">{project.deadline}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-700">
                    <Eye size={16} />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-700">
                    <Pencil size={16} />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-700">
                    <Share size={16} />
                  </Button>
                </div>
              </TableCell>
            </motion.tr>
          ))}
        </TableBody>
      </Table>
    </motion.div>
  );
};

export default RecentProjectsTable;
