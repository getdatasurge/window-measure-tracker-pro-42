
import React from 'react';
import { motion } from 'framer-motion';
import { Check, AlertTriangle, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Measurement {
  project: string;
  floor: string;
  window: string;
  facing: string;
  dimensions: string;
  addedTime: string;
  status?: 'verified' | 'pending' | 'issue';
}

const getStatusIcon = (status?: 'verified' | 'pending' | 'issue') => {
  switch (status) {
    case 'verified':
      return <Check size={14} className="text-green-400" />;
    case 'pending':
      return <Clock size={14} className="text-amber-400" />;
    case 'issue':
      return <AlertTriangle size={14} className="text-red-400" />;
    default:
      return null;
  }
};

const getStatusBadge = (status?: 'verified' | 'pending' | 'issue') => {
  switch (status) {
    case 'verified':
      return (
        <Badge variant="outline" className="bg-green-900/30 text-green-400 border-green-700/50">
          <Check size={12} className="mr-1" /> Verified
        </Badge>
      );
    case 'pending':
      return (
        <Badge variant="outline" className="bg-amber-900/30 text-amber-400 border-amber-700/50">
          <Clock size={12} className="mr-1" /> Pending
        </Badge>
      );
    case 'issue':
      return (
        <Badge variant="outline" className="bg-red-900/30 text-red-400 border-red-700/50">
          <AlertTriangle size={12} className="mr-1" /> Issue
        </Badge>
      );
    default:
      return null;
  }
};

const RecentMeasurements: React.FC = () => {
  const measurements: Measurement[] = [
    {
      project: 'Downtown Office Tower',
      floor: 'Floor 12',
      window: 'Window #A42',
      facing: 'South facing',
      dimensions: '72" x 48"',
      addedTime: 'Added 2 hours ago',
      status: 'verified'
    },
    {
      project: 'Downtown Office Tower',
      floor: 'Floor 12',
      window: 'Window #A43',
      facing: 'South facing',
      dimensions: '72" x 48"',
      addedTime: 'Added 2 hours ago',
      status: 'verified'
    },
    {
      project: 'Downtown Office Tower',
      floor: 'Floor 11',
      window: 'Window #A32',
      facing: 'South facing',
      dimensions: '72" x 48"',
      addedTime: 'Added 3 hours ago',
      status: 'pending'
    },
    {
      project: 'Downtown Office Tower',
      floor: 'Floor 11',
      window: 'Window #A33',
      facing: 'South facing',
      dimensions: '72" x 48"',
      addedTime: 'Added 3 hours ago',
      status: 'pending'
    },
    {
      project: 'Riverside Apartments',
      floor: 'Building A',
      window: 'Window #203',
      facing: 'East facing',
      dimensions: '36" x 60"',
      addedTime: 'Added yesterday',
      status: 'issue'
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="show"
      variants={container}
      className="bg-[#1a1a1a] rounded-xl shadow-lg overflow-hidden border border-zinc-800/70"
    >
      <div className="max-h-[500px] overflow-y-auto">
        {measurements.map((measurement, index) => (
          <motion.div
            key={index}
            variants={item}
            className={`p-4 hover:bg-zinc-800/40 transition-colors ${
              index !== measurements.length - 1 ? 'border-b border-zinc-700/40' : ''
            }`}
          >
            <div className="flex justify-between items-start mb-1">
              <div>
                <h3 className="font-medium text-white flex items-center space-x-2">
                  <span>{measurement.project} - {measurement.floor}</span>
                  {measurement.status && (
                    <span className="ml-2">{getStatusBadge(measurement.status)}</span>
                  )}
                </h3>
                <p className="text-sm text-zinc-400 mt-1">{measurement.window} - {measurement.facing}</p>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-lg font-semibold text-white">
                  {measurement.dimensions}
                </span>
                <span className="text-xs text-zinc-500 mt-1">{measurement.addedTime}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default RecentMeasurements;
