
import React from 'react';
import { Measurement, MeasurementStatus } from '@/data/measurementsData';
import MeasurementCard from './MeasurementCard';
import { Ruler, Scissors, CheckCircle } from 'lucide-react';

interface StatusColumnProps {
  title: string;
  status: MeasurementStatus;
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
      case 'Pending':
      case 'Under Review':
        return <Ruler size={16} />;
      case 'Film Cut':
        return <Scissors size={16} />;
      case 'Installed':
      case 'Completed':
        return <CheckCircle size={16} />;
      default:
        return <Ruler size={16} />;
    }
  };

  const getBorderColor = () => {
    switch(status) {
      case 'Pending': return 'border-amber-700';
      case 'Film Cut': return 'border-blue-700';
      case 'Installed': return 'border-green-700';
      case 'Under Review': return 'border-purple-700';
      case 'Completed': return 'border-green-700';
      default: return 'border-zinc-700';
    }
  };
  
  const filteredMeasurements = measurements.filter(m => m.status === status);
  
  return (
    <div className="h-full flex-1 bg-zinc-900/50 rounded-md">
      <div className={`flex items-center gap-2 py-2 px-4 border-t-2 ${getBorderColor()}`}>
        <div className={`p-1 rounded-full ${color}`}>
          {getIcon()}
        </div>
        <h2 className="font-medium text-white">{title}</h2>
        <div className="flex items-center justify-center w-5 h-5 rounded-full bg-zinc-800 text-xs">
          {filteredMeasurements.length}
        </div>
      </div>
      <div className="p-2 h-[calc(100%-40px)] overflow-y-auto">
        {filteredMeasurements.map(measurement => (
          <MeasurementCard 
            key={measurement.id}
            measurement={measurement}
            onEdit={onEditMeasurement}
          />
        ))}
        {filteredMeasurements.length === 0 && (
          <div className="flex items-center justify-center h-20 border border-dashed border-zinc-800 rounded-md">
            <p className="text-sm text-zinc-500">No measurements</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusColumn;
