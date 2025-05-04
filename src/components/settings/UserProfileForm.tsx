
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface UserProfileFormProps {
  userId?: string;
}

const UserProfileForm = ({ userId }: UserProfileFormProps) => {
  const [formData, setFormData] = useState({
    firstName: 'John',
    lastName: 'Installer',
    email: 'john.smith@example.com',
    phone: '(555) 123-4567',
    jobTitle: 'Team Lead - Commercial'
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Profile form submitted:', formData);
    // Show success toast or feedback
  };
  
  return (
    <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-4">Profile Information</h2>
      
      <div className="mb-6 flex items-center">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-zinc-700 flex items-center justify-center text-xl">
            {formData.firstName.charAt(0)}{formData.lastName.charAt(0)}
          </div>
          <button className="absolute right-0 bottom-0 bg-green-600 rounded-full p-1.5 text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
              <path d="m15 5 4 4"/>
            </svg>
          </button>
        </div>
        <button className="ml-4 text-sm text-green-400 hover:text-green-300">
          Change Photo
        </button>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-zinc-400 mb-1">
              First Name
            </label>
            <Input
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="bg-zinc-900/50 border-zinc-700 text-white"
            />
          </div>
          
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-zinc-400 mb-1">
              Last Name
            </label>
            <Input
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="bg-zinc-900/50 border-zinc-700 text-white"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-zinc-400 mb-1">
              Email Address
            </label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="bg-zinc-900/50 border-zinc-700 text-white"
            />
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-zinc-400 mb-1">
              Phone Number
            </label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="bg-zinc-900/50 border-zinc-700 text-white"
            />
          </div>
          
          <div className="md:col-span-2">
            <label htmlFor="jobTitle" className="block text-sm font-medium text-zinc-400 mb-1">
              Job Title
            </label>
            <Input
              id="jobTitle"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleChange}
              className="bg-zinc-900/50 border-zinc-700 text-white"
            />
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button className="bg-green-600 hover:bg-green-700 text-white">
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UserProfileForm;
