
import React from 'react';
import { ArrowDown, ArrowUp, Calendar, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: number;
  delta: number;
  icon: React.ReactNode;
  color: string;
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, delta, icon, color }) => {
  const isDeltaPositive = delta > 0;
  const deltaColor = isDeltaPositive ? 'text-green-500' : 'text-red-500';
  const deltaIcon = isDeltaPositive ? <ArrowUp size={14} /> : <ArrowDown size={14} />;
  
  return (
    <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-4 flex flex-col">
      <div className="flex items-start justify-between">
        <div className="text-xs text-zinc-400 flex items-center gap-2">
          {title}
        </div>
        <div className={`p-1.5 rounded-md bg-opacity-20`} style={{ backgroundColor: `${color}30` }}>
          <div style={{ color }}>
            {icon}
          </div>
        </div>
      </div>
      <div className="mt-2 flex items-end gap-2">
        <span className="text-2xl font-semibold text-white">{value}</span>
        <div className={`text-xs flex items-center ${deltaColor}`}>
          {deltaIcon}
          <span>{Math.abs(delta)}%</span>
        </div>
      </div>
    </div>
  );
};

const ScheduleOverview: React.FC = () => {
  const kpiData = [
    {
      title: 'Scheduled Installations',
      value: 24,
      delta: 12,
      icon: <Calendar size={16} />,
      color: '#3b82f6',
    },
    {
      title: 'Completed Today',
      value: 8,
      delta: 5,
      icon: <CheckCircle size={16} />,
      color: '#22c55e',
    },
    {
      title: 'Pending Review',
      value: 16,
      delta: -5,
      icon: <Clock size={16} />,
      color: '#f59e0b',
    },
    {
      title: 'Issues Reported',
      value: 3,
      delta: 0,
      icon: <AlertTriangle size={16} />,
      color: '#ef4444',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpiData.map((card, index) => (
        <KpiCard key={index} {...card} />
      ))}
    </div>
  );
};

export default ScheduleOverview;
