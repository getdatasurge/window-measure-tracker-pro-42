
import React from 'react';
import KpiCard from './KpiCard';

const DashboardKpiSection: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <KpiCard 
        title="Active Projects" 
        value="24" 
        trend={{ value: 8, direction: 'up' }}
        icon="projects"
      />
      <KpiCard 
        title="Pending Measurements" 
        value="47" 
        trend={{ value: 12, direction: 'up' }}
        icon="pending"
      />
      <KpiCard 
        title="Completed This Month" 
        value="18" 
        trend={{ value: 5, direction: 'up' }}
        icon="completed"
      />
      <KpiCard 
        title="Team Members" 
        value="12" 
        trend={{ value: 2, direction: 'up' }}
        footnote="new this month"
        icon="team"
      />
    </div>
  );
};

export default DashboardKpiSection;
