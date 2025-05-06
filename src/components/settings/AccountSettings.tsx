
import React from 'react';
import { Spinner } from '@/components/ui/spinner';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  jobTitle: string;
  avatarUrl: string;
}

interface AccountSettingsProps {
  formData: FormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  isLoading: boolean;
}

const AccountSettings: React.FC<AccountSettingsProps> = ({ 
  formData,
  handleInputChange,
  isLoading
}) => {
  if (isLoading) {
    return <div className="flex justify-center py-8">
      <Spinner className="w-8 h-8 text-wintrack-green" />
    </div>;
  }
  
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
              src={formData.avatarUrl || "/lovable-uploads/75ba837b-8924-4c3d-a163-ab9116a7c9fb.png"} 
              alt="Profile" 
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
              name="firstName"
              className="search-input" 
              value={formData.firstName}
              onChange={handleInputChange}
            />
          </div>
          
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <input 
              type="text" 
              id="lastName"
              name="lastName" 
              className="search-input" 
              value={formData.lastName}
              onChange={handleInputChange}
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input 
              type="email" 
              id="email"
              name="email"
              className="search-input bg-gray-100" 
              value={formData.email}
              onChange={handleInputChange}
              readOnly
              disabled
            />
            <p className="text-xs text-gray-500 mt-1">Email address cannot be changed</p>
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input 
              type="tel" 
              id="phone"
              name="phone" 
              className="search-input" 
              value={formData.phone}
              onChange={handleInputChange}
            />
          </div>
          
          <div>
            <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
            <input 
              type="text" 
              id="jobTitle"
              name="jobTitle" 
              className="search-input" 
              value={formData.jobTitle}
              onChange={handleInputChange}
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
