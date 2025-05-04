
import React from 'react';

const ApplicationPreferences: React.FC = () => {
  return (
    <div className="mt-8">
      <h3 className="text-lg font-medium mb-4">Application Preferences</h3>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Measurement Units</label>
            <p className="text-xs text-gray-500">Select your preferred measurement system</p>
          </div>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input type="radio" name="units" className="mr-2 text-wintrack-green focus:ring-wintrack-green" defaultChecked />
              <span>Imperial (in)</span>
            </label>
            <label className="flex items-center">
              <input type="radio" name="units" className="mr-2 text-wintrack-green focus:ring-wintrack-green" />
              <span>Metric (cm)</span>
            </label>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="dateFormat" className="block text-sm font-medium text-gray-700 mb-1">Date Format</label>
            <p className="text-xs text-gray-500 mb-1">Choose how dates are displayed</p>
            <select id="dateFormat" className="search-input">
              <option>MM/DD/YYYY</option>
              <option>DD/MM/YYYY</option>
              <option>YYYY-MM-DD</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="timeFormat" className="block text-sm font-medium text-gray-700 mb-1">Time Format</label>
            <p className="text-xs text-gray-500 mb-1">Choose your preferred time format</p>
            <select id="timeFormat" className="search-input">
              <option>12-hour (AM/PM)</option>
              <option>24-hour</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">Language</label>
            <p className="text-xs text-gray-500 mb-1">Set your preferred language</p>
            <select id="language" className="search-input">
              <option>English (US)</option>
              <option>Spanish</option>
              <option>French</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="dashboard" className="block text-sm font-medium text-gray-700 mb-1">Default Dashboard View</label>
            <p className="text-xs text-gray-500 mb-1">Choose what you see first when you log in</p>
            <select id="dashboard" className="search-input">
              <option>Project Overview</option>
              <option>Team Dashboard</option>
              <option>Measurement Summary</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationPreferences;
