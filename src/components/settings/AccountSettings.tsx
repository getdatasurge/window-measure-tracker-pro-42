
import React from 'react';

const AccountSettings: React.FC = () => {
  return (
    <div>
      <div>
        <h2 className="text-xl font-semibold mb-1">Account Settings</h2>
        <p className="text-sm text-gray-500">Manage your account information and preferences</p>
      </div>
      
      {/* Account Information */}
      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">Account Information</h3>
        
        <div className="flex items-center mb-6">
          <div className="relative">
            <img 
              src="/lovable-uploads/75ba837b-8924-4c3d-a163-ab9116a7c9fb.png" 
              alt="Alex Morgan" 
              className="w-24 h-24 rounded-full object-cover"
            />
            <button className="absolute bottom-0 right-0 bg-wintrack-dark-blue text-white p-1.5 rounded-full">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 4H8C7.44772 4 7 4.44772 7 5V19C7 19.5523 7.44772 20 8 20H16C16.5523 20 17 19.5523 17 19V5C17 4.44772 16.5523 4 16 4Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 17H12.01" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          <div className="ml-4 text-sm text-gray-500">
            <p>Change Photo</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <input 
              type="text" 
              id="firstName" 
              className="search-input" 
              defaultValue="Alex"
            />
          </div>
          
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <input 
              type="text" 
              id="lastName" 
              className="search-input" 
              defaultValue="Morgan"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input 
              type="email" 
              id="email" 
              className="search-input" 
              defaultValue="alex.morgan@example.com"
            />
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input 
              type="tel" 
              id="phone" 
              className="search-input" 
              defaultValue="(206) 555-0123"
            />
          </div>
          
          <div>
            <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
            <input 
              type="text" 
              id="jobTitle" 
              className="search-input" 
              defaultValue="Project Manager"
            />
          </div>
          
          <div>
            <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <select id="department" className="search-input">
              <option value="installation">Installation</option>
              <option value="sales">Sales</option>
              <option value="management">Management</option>
              <option value="engineering">Engineering</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
