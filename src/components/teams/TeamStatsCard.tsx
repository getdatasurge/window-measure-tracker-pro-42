
import React from 'react';
import { Card } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface TeamStatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: string;
    positive?: boolean;
  };
  icon: LucideIcon;
  iconColor: string;
}

const TeamStatsCard: React.FC<TeamStatsCardProps> = ({ 
  title, 
  value, 
  subtitle,
  trend, 
  icon: Icon,
  iconColor
}) => {
  return (
    <Card className="p-4 border border-zinc-800/50 bg-zinc-900/50">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-zinc-400">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
          {(subtitle || trend) && (
            <div className="flex items-center mt-1">
              {trend ? (
                <span className={`text-xs font-medium ${trend.positive ? 'text-green-500' : 'text-red-500'} flex items-center`}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 mr-1">
                    <path 
                      fillRule="evenodd" 
                      d={trend.positive 
                        ? "M12.577 4.878a.75.75 0 01.919-.53l4.78 1.281a.75.75 0 01.531.919l-1.281 4.78a.75.75 0 01-1.449-.387l.81-3.022a19.407 19.407 0 00-5.594 5.203.75.75 0 01-1.139.093L7 10.06l-4.72 4.72a.75.75 0 01-1.06-1.061l5.25-5.25a.75.75 0 011.06 0l3.074 3.073a20.923 20.923 0 015.545-4.931l-3.042-.815a.75.75 0 01-.53-.919z"
                        : "M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.061l-7.5 7.5a.75.75 0 01-1.06 0z M12.53 7.72a.75.75 0 010-1.06l1.5-1.5a.75.75 0 111.06 1.06l-1.5 1.5a.75.75 0 01-1.06 0zM10.468 9.21a.75.75 0 00-1.06 0l-3 3a.75.75 0 101.06 1.06l3-3a.75.75 0 000-1.06zM2.25 9a.75.75 0 00-.75.75v1.5a.75.75 0 001.5 0v-1.5A.75.75 0 002.25 9zM1.5 3.75a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75zM9 2.25a.75.75 0 00-.75.75v7.5a.75.75 0 001.5 0V3a.75.75 0 00-.75-.75zM16.5 3.75a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75zM18 9a.75.75 0 00-.75.75v1.5a.75.75 0 001.5 0v-1.5A.75.75 0 0018 9z"
                      } 
                      clipRule="evenodd" 
                    />
                  </svg>
                  {trend.value}
                </span>
              ) : subtitle ? (
                <span className="text-xs text-zinc-400">
                  {subtitle}
                </span>
              ) : null}
            </div>
          )}
        </div>
        <div className="w-10 h-10 rounded-full bg-opacity-20 flex items-center justify-center" style={{ backgroundColor: `${iconColor}20` }}>
          <Icon className="h-5 w-5" style={{ color: iconColor }} />
        </div>
      </div>
    </Card>
  );
};

export default TeamStatsCard;
