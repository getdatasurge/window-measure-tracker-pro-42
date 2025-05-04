
import React from 'react';

const DataPrivacy: React.FC = () => {
  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-1">Data & Privacy</h3>
      <p className="text-sm text-gray-500 mb-4">Manage your data and privacy preferences</p>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-4 border-b">
          <div>
            <h4 className="font-medium">Data Collection</h4>
            <p className="text-sm text-gray-500">Allow collection of usage data to improve the application</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" defaultChecked />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-wintrack-green"></div>
          </label>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Cookies</h4>
            <p className="text-sm text-gray-500">Manage cookie preferences</p>
          </div>
          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
            Manage Cookies
          </button>
        </div>
      </div>
      
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h4 className="font-medium mb-4">Account Actions</h4>
        
        <div className="flex flex-wrap gap-3">
          <button className="px-4 py-2 border border-gray-300 rounded text-gray-700 text-sm font-medium hover:bg-gray-50">
            Export My Data
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded text-gray-700 text-sm font-medium hover:bg-gray-50">
            Change Password
          </button>
          <button className="px-4 py-2 border border-red-300 rounded text-red-600 text-sm font-medium hover:bg-red-50">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataPrivacy;
