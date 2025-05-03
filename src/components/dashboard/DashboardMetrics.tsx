
import React from 'react';
import { ClipboardList, Ruler, Users, CheckCircle } from 'lucide-react';

type MetricCardProps = {
  title: string;
  value: number;
  subtext: string;
  icon: React.ReactNode;
  change: {
    value: string;
    positive: boolean;
  };
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, subtext, icon, change }) => {
  return (
    <div className="bg-zinc-800 rounded-xl p-6 shadow-lg">
      <div className="flex items-start justify-between mb-2">
        <div className="p-2 bg-zinc-700/50 rounded-lg">
          {icon}
        </div>
        <div className={`flex items-center ${change.positive ? 'text-green-500' : 'text-red-500'}`}>
          <span>{change.value}</span>
          <svg 
            className="w-4 h-4 ml-1" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d={change.positive ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
            />
          </svg>
        </div>
      </div>
      <div className="mt-4">
        <h3 className="text-zinc-400 text-sm">{title}</h3>
        <p className="text-4xl font-bold mt-1">{value}</p>
        <p className="text-zinc-400 text-xs mt-2">{subtext}</p>
      </div>
    </div>
  );
};

const DashboardMetrics: React.FC = () => {
  const metrics = [
    {
      title: 'Active Projects',
      value: 24,
      subtext: '3 added this week',
      icon: <ClipboardList size={20} className="text-green-400" />,
      change: { value: '+12%', positive: true }
    },
    {
      title: 'Pending Measurements',
      value: 42,
      subtext: '12 due this week',
      icon: <Ruler size={20} className="text-blue-400" />,
      change: { value: '+5%', positive: true }
    },
    {
      title: 'Team Members',
      value: 8,
      subtext: '2 new this month',
      icon: <Users size={20} className="text-purple-400" />,
      change: { value: '+2', positive: true }
    },
    {
      title: 'Completed Projects',
      value: 156,
      subtext: '5 completed this week',
      icon: <CheckCircle size={20} className="text-green-400" />,
      change: { value: '+18%', positive: true }
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <MetricCard key={index} {...metric} />
      ))}
    </div>
  );
};

export default DashboardMetrics;
