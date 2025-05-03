
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
}

const KpiCard: React.FC<KpiCardProps> = ({ 
  title, 
  value, 
  trend, 
  footnote,
  icon 
}) => {
  const renderIcon = () => {
    switch(icon) {
      case 'projects':
        return <FileText className="text-blue-500" size={20} />;
      case 'pending':
        return <PenLine className="text-orange-500" size={20} />;
      case 'completed':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'team':
        return <Users className="text-purple-500" size={20} />;
      default:
        return null;
    }
  };
  
  return (
    <div className="kpi-card">
      <div className="flex justify-between items-center">
        <span className="kpi-card-title">{title}</span>
        {renderIcon()}
      </div>
      
      <div className="kpi-card-value">{value}</div>
      
      {trend && (
        <div className="kpi-card-trend">
          {footnote || 'vs last month'}
          <div className="ml-auto flex items-center">
            {trend.direction === 'up' && (
              <>
                <ArrowUp size={16} className="text-green-500 mr-1" />
                <span className="text-green-500">{trend.value}%</span>
              </>
            )}
            {trend.direction === 'down' && (
              <>
                <ArrowDown size={16} className="text-red-500 mr-1" />
                <span className="text-red-500">{trend.value}%</span>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default KpiCard;
