
import React from 'react';
import KpiCard from './KpiCard';

const DashboardKpiSection: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 overflow-x-auto snap-x md:overflow-visible">
      <KpiCard 
        title="Active Projects" 
        value="24" 
        trend={{ value: 12, direction: 'up' }}
        icon="projects"
        className="snap-center min-w-[260px]"
      />
      <KpiCard 
        title="Pending Measurements" 
        value="47" 
        trend={{ value: 8, direction: 'up' }}
        icon="pending"
        className="snap-center min-w-[260px]"
      />
      <KpiCard 
        title="Completed This Month" 
        value="32" 
        trend={{ value: 24, direction: 'up' }}
        icon="completed"
        className="snap-center min-w-[260px]"
      />
      <KpiCard 
        title="Team Members" 
        value="18" 
        footnote="Across 3 teams"
        icon="team"
        className="snap-center min-w-[260px]"
      />
    </div>
  );
};

export default DashboardKpiSection;
