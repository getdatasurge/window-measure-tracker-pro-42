
import { useState, useEffect } from 'react';
import { ActivityItem } from '../types';

export const useActivityData = (): ActivityItem[] => {
  const [activityItems, setActivityItems] = useState<ActivityItem[]>([
    {
      user: {
        name: 'Sarah Wilson',
        avatar: '/lovable-uploads/75ba837b-8924-4c3d-a163-ab9116a7c9fb.png',
        initials: 'SW'
      },
      action: 'measured',
      project: 'Harbor View Apartments',
      time: '2 hours ago',
      status: 'completed'
    },
    {
      user: {
        name: 'Alex Johnson',
        avatar: '/placeholder.svg',
        initials: 'AJ'
      },
      action: 'uploaded photos of',
      project: 'Downtown Office Complex',
      time: '3 hours ago',
      status: 'in-progress'
    },
    {
      user: {
        name: 'Michael Brown',
        avatar: '/placeholder.svg',
        initials: 'MB'
      },
      action: 'created',
      project: 'Sunnyvale Residence',
      time: '5 hours ago',
      status: 'just-started'
    },
    {
      user: {
        name: 'Emma Davis',
        avatar: '/placeholder.svg',
        initials: 'ED'
      },
      action: 'finalized',
      project: 'Lakeview Community Center',
      time: 'Yesterday',
      status: 'completed'
    }
  ]);

  return activityItems;
};
