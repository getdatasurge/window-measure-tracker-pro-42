
import React from 'react';
import ActivityListItem from './ActivityListItem';
import { useActivityData } from './hooks/useActivityData';

const ActivityList: React.FC = () => {
  const activityItems = useActivityData();

  return (
    <div className="space-y-4">
      {activityItems.map((item, index) => (
        <ActivityListItem key={index} item={item} />
      ))}
    </div>
  );
};

export default ActivityList;
