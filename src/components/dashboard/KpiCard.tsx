
import React from 'react';
import { ArrowUp, ArrowDown, FileText, PenLine, CheckCircle, Users } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: number | string;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
  };
  footnote?: string;
  icon: 'projects' | 'pending' | 'completed' | 'team';
  className?: string;
}

const KpiCard: React.FC<KpiCardProps> = ({ 
  title, 
  value, 
  trend, 
  footnote,
  icon,
  className
}) => {
  const renderIcon = () => {
    switch(icon) {
      case 'projects':
        return (
          <div className="w-10 h-10 flex items-center justify-center rounded-md bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
            <FileText size={22} />
          </div>
        );
      case 'pending':
        return (
          <div className="w-10 h-10 flex items-center justify-center rounded-md bg-amber-100 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400">
            <PenLine size={22} />
          </div>
        );
      case 'completed':
        return (
          <div className="w-10 h-10 flex items-center justify-center rounded-md bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400">
            <CheckCircle size={22} />
          </div>
        );
      case 'team':
        return (
          <div className="w-10 h-10 flex items-center justify-center rounded-md bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400">
            <Users size={22} />
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className={`p-5 rounded-lg backdrop-blur-md bg-white/80 dark:bg-slate-800/60 shadow-md hover:shadow-lg transition-shadow duration-200 border border-white/20 dark:border-slate-700/40 hover:ring-2 hover:ring-primary/20 ${className}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{title}</p>
          <h3 className="text-3xl font-bold mt-1.5 mb-2 text-gray-900 dark:text-white">{value}</h3>
          
          {trend && (
            <div className="flex items-center text-xs">
              {trend.direction === 'up' ? (
                <span className="flex items-center text-green-600 dark:text-green-400">
                  <ArrowUp size={14} className="mr-0.5" />
                  {trend.value}%
                </span>
              ) : (
                <span className="flex items-center text-red-600 dark:text-red-400">
                  <ArrowDown size={14} className="mr-0.5" />
                  {trend.value}%
                </span>
              )}
              <span className="text-gray-500 dark:text-gray-400 ml-1.5">from last month</span>
            </div>
          )}
          
          {footnote && (
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {footnote}
            </div>
          )}
        </div>
        
        {renderIcon()}
      </div>
    </div>
  );
};

export default KpiCard;
