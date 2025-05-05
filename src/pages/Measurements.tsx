
import React from 'react';
import MeasurementStatusBoard from '@/components/measurements/MeasurementStatusBoard';
import withResponsiveLayout from '@/hoc/withResponsiveLayout';

const MeasurementsPage: React.FC = () => {
  return (
    <MeasurementStatusBoard />
  );
};

export default withResponsiveLayout(MeasurementsPage, {
  title: 'Measurements Dashboard - WinTrack',
  description: 'View and manage window measurements, track installation progress, and monitor scheduling.',
  className: 'measurements-page'
});
