
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

interface MetricCardProps {
  title: string;
  value: string | number;
  trend: {
    value: string;
    positive: boolean;
  };
  description: string;
  colorAccent: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, trend, description, colorAccent }) => {
  return (
    <Card className="bg-zinc-800/50 border border-zinc-700/50 shadow-lg overflow-hidden">
      <CardContent className="p-0">
        <div className="flex items-stretch">
          <div className="py-4 px-5 flex-grow">
            <div className="text-sm font-medium text-zinc-400">{title}</div>
            <div className="mt-1 flex items-baseline">
              <span className="text-2xl font-semibold text-white">{value}</span>
              <span className={`ml-2 text-xs font-medium flex items-center ${trend.positive ? 'text-emerald-500' : 'text-red-500'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 mr-0.5">
                  <path fillRule="evenodd" d={trend.positive 
                    ? "M12.577 4.878a.75.75 0 01.919-.53l4.78 1.281a.75.75 0 01.531.919l-1.281 4.78a.75.75 0 01-1.449-.387l.81-3.022a19.407 19.407 0 00-5.594 5.203.75.75 0 01-1.139.093L7 10.06l-4.72 4.72a.75.75 0 01-1.06-1.06l5.25-5.25a.75.75 0 011.06 0l3.074 3.073a20.923 20.923 0 015.545-4.931l-3.042-.815a.75.75 0 01-.53-.919z" 
                    : "M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z"} 
                  clipRule="evenodd" />
                </svg>
                {trend.value}
              </span>
            </div>
            <div className="mt-1 text-xs text-zinc-500">{description}</div>
          </div>
          <div className={`w-2 ${colorAccent}`}></div>
        </div>
      </CardContent>
    </Card>
  );
};

const ProjectMetricsSection: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard 
        title="Active Projects"
        value={24}
        trend={{ value: "8%", positive: true }}
        description="vs last month"
        colorAccent="bg-indigo-500/20"
      />
      
      <MetricCard 
        title="Upcoming Projects"
        value={11}
        trend={{ value: "3%", positive: true }}
        description="vs last month"
        colorAccent="bg-purple-500/20"
      />
      
      <MetricCard 
        title="Windows Measured"
        value={1254}
        trend={{ value: "12%", positive: true }}
        description="total measured"
        colorAccent="bg-emerald-500/20"
      />
      
      <MetricCard 
        title="Pending Measurements"
        value={386}
        trend={{ value: "5%", positive: false }}
        description="remaining to measure"
        colorAccent="bg-amber-500/20"
      />
    </div>
  );
};

export default ProjectMetricsSection;
