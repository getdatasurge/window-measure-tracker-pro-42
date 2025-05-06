
import React from 'react';
import { Measurement } from '@/types/measurement';
import MeasurementCard from './MeasurementCard';
import { Ruler, Scissors, CheckCircle, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface StatusColumnProps {
  title: string;
  status: string;
  measurements: Measurement[];
  onEditMeasurement: (measurement: Measurement) => void;
  color: string;
}

const StatusColumn: React.FC<StatusColumnProps> = ({ 
  title, 
  status, 
  measurements,
  onEditMeasurement,
  color
}) => {
  const getIcon = () => {
    switch(status) {
      case 'Measured':
        return <Ruler size={16} />;
      case 'Cut':
        return <Scissors size={16} />;
      case 'Installed / Completed':
        return <CheckCircle size={16} />;
      default:
        return <Ruler size={16} />;
    }
  };

  const getBorderColor = () => {
    switch(status) {
      case 'Measured': return 'border-amber-700';
      case 'Cut': return 'border-blue-700';
      case 'Installed / Completed': return 'border-green-700';
      default: return 'border-zinc-700';
    }
  };
  
  return (
    <div className="h-full flex-1 bg-zinc-900/50 rounded-md">
      <div className={`flex items-center gap-2 py-2 px-4 border-t-2 ${getBorderColor()}`}>
        <div className={`p-1 rounded-full ${color}`}>
          {getIcon()}
        </div>
        <h2 className="font-medium text-white">{title}</h2>
        <div className="flex items-center justify-center w-5 h-5 rounded-full bg-zinc-800 text-xs">
          {measurements.length}
        </div>
      </div>
      <div className="p-2 h-[calc(100%-40px)] overflow-y-auto">
        {measurements.map(measurement => (
          <motion.div
            key={measurement.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <MeasurementCard 
              measurement={measurement}
              onEdit={onEditMeasurement}
            />
          </motion.div>
        ))}
        {measurements.length === 0 && (
          <div className="flex items-center justify-center h-20 border border-dashed border-zinc-800 rounded-md">
            <p className="text-sm text-zinc-500">No measurements</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusColumn;
