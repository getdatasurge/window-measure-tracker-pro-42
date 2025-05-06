
import React from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import ActivityIcon from './ActivityIcon';
import { TeamActivity } from './types';

interface ActivityItemProps {
  activity: TeamActivity;
}

/**
 * Renders a single activity item in the feed
 */
const ActivityItem: React.FC<ActivityItemProps> = ({ activity }) => {
  const getTargetStyles = (targetType?: 'project' | 'team' | 'measurement') => {
    switch (targetType) {
      case 'project':
        return 'text-green-400';
      case 'team':
        return 'text-blue-400';
      case 'measurement':
        return 'text-purple-400';
      default:
        return 'text-zinc-200';
    }
  };
  
  return (
    <div className="flex gap-3 group">
      <div className="shrink-0 mt-0.5">
        <ActivityIcon iconType={activity.icon} />
      </div>
      <div className="flex-1">
        <div className="flex items-start">
          <div className="h-6 w-6 rounded-full overflow-hidden border border-zinc-700/50 mr-2 shrink-0">
            <img 
              src={activity.avatar} 
              alt={activity.name} 
              className="h-full w-full object-cover" 
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/lovable-uploads/f1ba8f91-019b-4932-9d0e-5414aef0ed47.png';
              }}
            />
          </div>
          <p className="text-sm">
            <span className="font-medium text-white">{activity.name}</span>{' '}
            <span className="text-zinc-400">{activity.action}</span>{' '}
            {activity.target && (
              <>
                <span className="text-zinc-400">on</span>{' '}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className={getTargetStyles(activity.targetType)}>
                      {activity.target}
                      {activity.targetType === 'measurement' && ' (Measurement)'}
                    </span>
                  </TooltipTrigger>
                  {activity.metadata && (
                    <TooltipContent className="bg-zinc-900 border-zinc-700 text-white">
                      {activity.metadata.field && <p>Field: {activity.metadata.field}</p>}
                      {activity.metadata.value && <p>Value: {activity.metadata.value}</p>}
                    </TooltipContent>
                  )}
                </Tooltip>
              </>
            )}
          </p>
        </div>
        <p className="text-xs text-zinc-500 mt-1.5 ml-8">{activity.timeAgo}</p>
      </div>
    </div>
  );
};

export default ActivityItem;
