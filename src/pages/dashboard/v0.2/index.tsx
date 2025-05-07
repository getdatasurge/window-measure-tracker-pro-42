
import React from 'react';
import DashboardShell from '../../../components/layout/DashboardShell';
import { useGetMeasurementsQuery } from '@/services/apiSlice';
import DashboardGridRow from '../../../components/layout/DashboardGridRow';
import DashboardMeasurementSection from '../../../components/dashboard/DashboardMeasurementSection';
import ActivityFeedCard from '../../../components/dashboard/activity-feed';
import DashboardProjectsSection from '../../../components/dashboard/DashboardProjectsSection';

const DashboardPage: React.FC = () => {
  // Use our RTK Query hook for measurements
  const { 
    data: measurementsResponse, 
    error: measurementsError, 
    isLoading: isMeasurementsLoading,
    refetch: refetchMeasurements
  } = useGetMeasurementsQuery();
  
  return (
    <DashboardShell>
      <div className="grid gap-4">
        {/* Pass the measurement data to the MeasurementSection */}
        <DashboardMeasurementSection 
          measurements={measurementsResponse?.data || []}
          isLoading={isMeasurementsLoading}
          error={measurementsError ? String(measurementsError) : null}
          onRefresh={refetchMeasurements}
        />
        
        {/* Team Activity and Active Projects Section using the reusable DashboardGridRow */}
        <DashboardGridRow>
          {/* Team Activity */}
          <div className="flex-1 w-full">
            <ActivityFeedCard />
          </div>
          
          {/* Active Projects */}
          <div className="flex-1 w-full">
            <DashboardProjectsSection />
          </div>
        </DashboardGridRow>
      </div>
    </DashboardShell>
  );
};

export default DashboardPage;
