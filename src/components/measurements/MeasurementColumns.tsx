
import React from 'react';
import { Measurement } from '@/types/measurement';
import StatusColumn from './StatusColumn';
import { AnimatePresence } from 'framer-motion';

interface MeasurementColumnsProps {
  filteredMeasurements: Measurement[];
  onEditMeasurement: (measurement: Measurement) => void;
}

export function MeasurementColumns({ filteredMeasurements, onEditMeasurement }: MeasurementColumnsProps) {
  // Define column configurations
  const columns = [
    {
      title: 'Measured',
      status: 'pending',
      color: 'bg-amber-500/30',
      getMeasurements: () => filteredMeasurements.filter(m => m.status.toLowerCase() === 'pending')
    },
    {
      title: 'Cut',
      status: 'film_cut',
      color: 'bg-blue-500/30',
      getMeasurements: () => filteredMeasurements.filter(m => m.status.toLowerCase() === 'film_cut')
    },
    {
      title: 'Installed / Completed',
      status: ['installed', 'completed'],
      color: 'bg-green-500/30',
      getMeasurements: () => filteredMeasurements.filter(m => 
        m.status.toLowerCase() === 'installed' || 
        m.status.toLowerCase() === 'completed'
      )
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <AnimatePresence>
        {columns.map((column) => {
          const measurements = column.getMeasurements();
          return (
            <StatusColumn
              key={column.title}
              title={`${column.title} (${measurements.length})`}
              status={column.status as any}
              measurements={measurements}
              onEditMeasurement={onEditMeasurement}
              color={column.color}
            />
          );
        })}
      </AnimatePresence>
    </div>
  );
}
