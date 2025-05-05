
import React from 'react';
import withResponsiveLayout from '@/hoc/withResponsiveLayout';
import { MeasurementEntriesManager } from '@/components/entries/MeasurementEntriesManager';

const MeasurementEntriesPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Measurement Entries</h1>
        <p className="text-sm text-zinc-400">Create and manage window measurements by project</p>
      </div>
      
      <MeasurementEntriesManager />
    </div>
  );
};

export default withResponsiveLayout(MeasurementEntriesPage, {
  title: 'Measurement Entries - WinTrack',
  description: 'Manage and track window measurements for your projects',
  className: 'measurements-entries-page'
});
