
import React from 'react';
import MeasurementOverview from './MeasurementOverview';
import ActivityFeed from './ActivityFeed';

const DashboardChartsSection: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <MeasurementOverview />
      </div>
      <div>
        <ActivityFeed />
      </div>
    </div>
  );
};

export default DashboardChartsSection;
