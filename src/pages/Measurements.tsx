
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

  return (
    <MeasurementStatusBoard 
      measurements={measurementsResponse?.data || []} 
      onRefresh={refetch}
    />
  );
};

export default withResponsiveLayout(MeasurementsPage, {
  title: 'Measurements Dashboard - WinTrack',
  description: 'View and manage window measurements, track installation progress, and monitor scheduling.',
  className: 'measurements-page'
});
