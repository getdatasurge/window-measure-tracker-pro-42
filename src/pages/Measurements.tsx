
import React from 'react';
import MeasurementStatusBoard from '@/components/measurements/MeasurementStatusBoard';
import withResponsiveLayout from '@/hoc/withResponsiveLayout';
import { useGetMeasurementsQuery } from '@/services/apiSlice';

const MeasurementsPage: React.FC = () => {
  const {
    data: measurementsResponse,
    error,
    isLoading,
    refetch
  } = useGetMeasurementsQuery();

  // Make sure we're sending valid props that match the expected MeasurementStatusBoardProps interface
  return (
    <MeasurementStatusBoard 
      measurements={measurementsResponse?.data || []} 
      onRefresh={refetch}
      isLoading={isLoading}
      error={error ? String(error) : null}
    />
  );
};

export default withResponsiveLayout(MeasurementsPage, {
  title: 'Measurements Dashboard - WinTrack',
  description: 'View and manage window measurements, track installation progress, and monitor scheduling.',
  className: 'measurements-page'
});
