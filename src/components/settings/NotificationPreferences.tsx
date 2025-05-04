
import React, { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const notificationTypes = [
  {
    id: 'email-notifications',
    title: 'Email Notifications',
    description: 'Receive project updates via email',
    enabled: true
  },
  {
    id: 'project-updates',
    title: 'Project Updates',
    description: 'Get notified when projects are created, updated or completed',
    enabled: true
  },
  {
    id: 'team-mentions',
    title: 'Team Mentions',
    description: 'Get notified when you are mentioned by team members',
    enabled: true
  },
  {
    id: 'status-changes',
    title: 'Status Changes',
    description: 'Get notified when measurement status changes',
    enabled: true
  },
  {
    id: 'team-activity',
    title: 'Team Activity',
    description: "Get notified about team members' activities",
    enabled: false
  },
  {
    id: 'marketing-updates',
    title: 'Marketing Updates',
    description: 'Receive product news and updates',
    enabled: false
  }
];

const NotificationPreferences = () => {
  const [notifications, setNotifications] = useState(notificationTypes);
  
  const handleToggle = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, enabled: !notif.enabled } : notif
      )
    );
  };
  
  return (
    <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-4">Notification Preferences</h2>
      
      <div className="space-y-4">
        <h3 className="text-md font-medium">Email Notifications</h3>
        
        <div className="space-y-4">
          {notifications.map(notification => (
            <div 
              key={notification.id} 
              className="flex items-center justify-between pb-4 border-b border-zinc-700/50"
            >
              <div>
                <h4 className="font-medium text-sm">{notification.title}</h4>
                <p className="text-sm text-zinc-400">{notification.description}</p>
              </div>
              <Switch 
                id={notification.id}
                checked={notification.enabled} 
                onCheckedChange={() => handleToggle(notification.id)}
                className="data-[state=checked]:bg-green-600"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotificationPreferences;
