
import React from 'react';
import { Measurement } from '@/types/measurement';
import StatusColumn from './StatusColumn';
import { AnimatePresence } from 'framer-motion';

interface MeasurementColumnsProps {
  filteredMeasurements: Measurement[];
  onEditMeasurement: (measurement: Measurement) => void;
}

export function MeasurementColumns({ filteredMeasurements, onEditMeasurement }: MeasurementColumnsProps) {
  // Helper function to determine which column a measurement belongs to
  const getMeasurementsForColumn = (columnName: string) => {
    switch (columnName) {
      case 'Measured':
        return filteredMeasurements.filter(m => 
          m.status.toLowerCase() === 'pending'
        );
      case 'Cut':
        return filteredMeasurements.filter(m => 
          m.status.toLowerCase() === 'film_cut'
        );
      case 'Installed / Completed':
        return filteredMeasurements.filter(m => 
          m.status.toLowerCase() === 'installed' || 
          m.status.toLowerCase() === 'completed'
        );
      default:
        return [];
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <AnimatePresence>
        {['Measured', 'Cut', 'Installed / Completed'].map(columnName => (
          <StatusColumn
            key={columnName}
            title={`${columnName} (${getMeasurementsForColumn(columnName).length})`}
            status={columnName as any}
            measurements={getMeasurementsForColumn(columnName)}
            onEditMeasurement={onEditMeasurement}
            color={
              columnName === 'Measured' ? 'bg-amber-500/30' : 
              columnName === 'Cut' ? 'bg-blue-500/30' : 
              'bg-green-500/30'
            }
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
