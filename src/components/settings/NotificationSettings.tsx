
import React from 'react';

const NotificationSettings: React.FC = () => {
  return (
    <div className="mt-8">
      <h3 className="text-lg font-medium mb-4">Notification Settings</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-4 border-b">
          <div>
            <h4 className="font-medium">Email Notifications</h4>
            <p className="text-sm text-gray-500">Receive project updates via email</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" defaultChecked />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-wintrack-green"></div>
          </label>
        </div>
        
        <div className="flex items-center justify-between pb-4 border-b">
          <div>
            <h4 className="font-medium">Push Notifications</h4>
            <p className="text-sm text-gray-500">Receive alerts in your browser</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" defaultChecked />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-wintrack-green"></div>
          </label>
        </div>
        
        <div className="flex items-center justify-between pb-4 border-b">
          <div>
            <h4 className="font-medium">Project Reminders</h4>
            <p className="text-sm text-gray-500">Get reminders about upcoming deadlines</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" defaultChecked />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-wintrack-green"></div>
          </label>
        </div>
        
        <div className="flex items-center justify-between pb-4 border-b">
          <div>
            <h4 className="font-medium">Team Activity</h4>
            <p className="text-sm text-gray-500">Get notified about team members' activities</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-wintrack-green"></div>
          </label>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Marketing Updates</h4>
            <p className="text-sm text-gray-500">Receive product news and updates</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-wintrack-green"></div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;
