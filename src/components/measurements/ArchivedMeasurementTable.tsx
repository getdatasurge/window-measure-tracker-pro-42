
import React from 'react';
import { Measurement } from '@/data/measurementsData';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ArchivedMeasurementTableProps {
  measurements: Measurement[];
}

const getBadgeVariant = (status: string) => {
  switch(status) {
    case 'Pending': return 'bg-amber-500/20 text-amber-500 border-amber-500/20';
    case 'Film Cut': return 'bg-blue-500/20 text-blue-500 border-blue-500/20';
    case 'Installed': return 'bg-green-500/20 text-green-500 border-green-500/20';
    case 'Under Review': return 'bg-purple-500/20 text-purple-500 border-purple-500/20';
    case 'Completed': return 'bg-green-500/20 text-green-500 border-green-500/20';
    default: return 'bg-gray-500/20 text-gray-500 border-gray-500/20';
  }
};

const ArchivedMeasurementTable: React.FC<ArchivedMeasurementTableProps> = ({ measurements }) => {
  return (
    <div className="rounded-md border border-zinc-800 bg-zinc-900/50">
      <div className="p-4 border-b border-zinc-800">
        <h2 className="text-lg font-semibold text-white">All Filtered Measurements</h2>
        <p className="text-sm text-zinc-400">Showing all measurements based on your current filters, regardless of date</p>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-zinc-800/50 border-zinc-800">
              <TableHead className="w-[80px] text-zinc-400">ID</TableHead>
              <TableHead className="text-zinc-400">Project</TableHead>
              <TableHead className="text-zinc-400">Location</TableHead>
              <TableHead className="text-zinc-400">Dimensions</TableHead>
              <TableHead className="text-zinc-400">Recorded By</TableHead>
              <TableHead className="text-zinc-400">Date</TableHead>
              <TableHead className="text-zinc-400">Status</TableHead>
              <TableHead className="w-[50px] text-zinc-400"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {measurements.map((measurement) => (
              <TableRow key={measurement.id} className="hover:bg-zinc-800/50 border-zinc-800">
                <TableCell className="font-medium text-zinc-300">{measurement.id}</TableCell>
                <TableCell className="text-zinc-300">{measurement.projectName}</TableCell>
                <TableCell className="text-zinc-300">{measurement.location}</TableCell>
                <TableCell className="text-zinc-300">{`${measurement.width} × ${measurement.height} (${measurement.area})`}</TableCell>
                <TableCell className="text-zinc-300">{measurement.recordedBy}</TableCell>
                <TableCell className="text-zinc-300">{new Date(measurement.measurementDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge className={getBadgeVariant(measurement.status)}>{measurement.status}</Badge>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon">
                    <span className="sr-only">Action</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <circle cx="12" cy="12" r="1" />
                      <circle cx="19" cy="12" r="1" />
                      <circle cx="5" cy="12" r="1" />
                    </svg>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between px-4 py-4 border-t border-zinc-800">
        <div className="text-sm text-zinc-400">
          Showing 1 to {measurements.length} of {measurements.length} entries
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="h-8 px-2 bg-zinc-800 border-zinc-700">
            <ChevronLeft className="h-4 w-4" />
            <span className="ml-1">Previous</span>
          </Button>
          <Button size="sm" variant="outline" className="h-8 px-2 bg-zinc-800 border-zinc-700">
            <span className="mr-1">Next</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ArchivedMeasurementTable;
