
import React, { useState } from 'react';

const Settings = () => {
  const [accountTab, setAccountTab] = useState('account');
  const [theme, setTheme] = useState('light');
  const [accentColor, setAccentColor] = useState('green');
  const [density, setDensity] = useState('regular');
  const [fontSize, setFontSize] = useState(50);
  
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex gap-2 overflow-x-auto pb-3 mb-4 border-b">
          <button 
            className={`px-4 py-2 rounded-md text-sm font-medium ${accountTab === 'account' ? 'bg-wintrack-dark-blue text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            onClick={() => setAccountTab('account')}
          >
            Account
          </button>
          <button 
            className={`px-4 py-2 rounded-md text-sm font-medium ${accountTab === 'profile' ? 'bg-wintrack-dark-blue text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            onClick={() => setAccountTab('profile')}
          >
            Profile
          </button>
          <button 
            className={`px-4 py-2 rounded-md text-sm font-medium ${accountTab === 'notifications' ? 'bg-wintrack-dark-blue text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            onClick={() => setAccountTab('notifications')}
          >
            Notifications
          </button>
          <button 
            className={`px-4 py-2 rounded-md text-sm font-medium ${accountTab === 'display' ? 'bg-wintrack-dark-blue text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            onClick={() => setAccountTab('display')}
          >
            Display
          </button>
          <button 
            className={`px-4 py-2 rounded-md text-sm font-medium ${accountTab === 'teams' ? 'bg-wintrack-dark-blue text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            onClick={() => setAccountTab('teams')}
          >
            Teams
          </button>
          <button 
            className={`px-4 py-2 rounded-md text-sm font-medium ${accountTab === 'security' ? 'bg-wintrack-dark-blue text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            onClick={() => setAccountTab('security')}
          >
            Security
          </button>
          <button 
            className={`px-4 py-2 rounded-md text-sm font-medium ${accountTab === 'integrations' ? 'bg-wintrack-dark-blue text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            onClick={() => setAccountTab('integrations')}
          >
            Integrations
          </button>
        </div>
        
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold mb-1">Account Settings</h2>
            <p className="text-sm text-gray-500">Manage your account information and preferences</p>
          </div>
          
          {/* Account Information */}
          <div>
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
          
          {/* Application Preferences */}
          <div>
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
          
          {/* Display Settings */}
          <div>
            <h3 className="text-lg font-medium mb-4">Display Settings</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Theme</label>
                <p className="text-xs text-gray-500 mb-3">Choose your preferred visual theme</p>
                
                <div className="flex gap-4">
                  <button 
                    className={`w-16 h-10 rounded-md border-2 flex items-center justify-center ${theme === 'light' ? 'border-wintrack-green' : 'border-transparent'}`}
                    onClick={() => setTheme('light')}
                  >
                    <div className="w-12 h-6 bg-gray-100 rounded flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="5" stroke="black" strokeWidth="2"/>
                        <path d="M12 2V4" stroke="black" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M12 20V22" stroke="black" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M4 12L2 12" stroke="black" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M22 12L20 12" stroke="black" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M19.7778 4.22266L17.5558 6.25424" stroke="black" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M4.22217 4.22266L6.44418 6.25424" stroke="black" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M6.44434 17.5557L4.22211 19.7779" stroke="black" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M19.7778 19.7773L17.5558 17.5551" stroke="black" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </div>
                  </button>
                  
                  <button 
                    className={`w-16 h-10 rounded-md border-2 flex items-center justify-center ${theme === 'dark' ? 'border-wintrack-green' : 'border-transparent'}`}
                    onClick={() => setTheme('dark')}
                  >
                    <div className="w-12 h-6 bg-gray-800 rounded flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 12.79C20.8427 14.4922 20.2039 16.1144 19.1582 17.4668C18.1126 18.8192 16.7035 19.8458 15.0957 20.4265C13.4879 21.0073 11.748 21.1181 10.0794 20.7461C8.41087 20.3741 6.88299 19.5345 5.67423 18.3258C4.46546 17.117 3.62594 15.5891 3.25391 13.9206C2.88188 12.252 2.99272 10.5121 3.57346 8.9043C4.1542 7.29651 5.18083 5.88737 6.53321 4.84175C7.88559 3.79614 9.5078 3.15731 11.21 3C10.2134 4.34827 9.73387 6.00945 9.85856 7.68141C9.98324 9.35338 10.7039 10.9251 11.8894 12.1106C13.0749 13.2961 14.6466 14.0168 16.3186 14.1414C17.9906 14.2661 19.6517 13.7866 21 12.79V12.79Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </button>
                  
                  <button 
                    className={`w-16 h-10 rounded-md border-2 flex items-center justify-center ${theme === 'system' ? 'border-wintrack-green' : 'border-transparent'}`}
                    onClick={() => setTheme('system')}
                  >
                    <div className="w-12 h-6 bg-gray-200 rounded flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M22 12L23 12" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 2V1" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 23V22" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M20 20L19 19" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M20 4L19 5" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M4 20L5 19" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M4 4L5 5" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M1 12L2 12" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Color Accent</label>
                <p className="text-xs text-gray-500 mb-3">Choose your accent color</p>
                
                <div className="flex gap-4">
                  <button 
                    className={`w-8 h-8 rounded-full bg-green-500 ${accentColor === 'green' ? 'ring-2 ring-offset-2 ring-green-500' : ''}`}
                    onClick={() => setAccentColor('green')}
                  ></button>
                  <button 
                    className={`w-8 h-8 rounded-full bg-blue-500 ${accentColor === 'blue' ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
                    onClick={() => setAccentColor('blue')}
                  ></button>
                  <button 
                    className={`w-8 h-8 rounded-full bg-purple-500 ${accentColor === 'purple' ? 'ring-2 ring-offset-2 ring-purple-500' : ''}`}
                    onClick={() => setAccentColor('purple')}
                  ></button>
                  <button 
                    className={`w-8 h-8 rounded-full bg-orange-500 ${accentColor === 'orange' ? 'ring-2 ring-offset-2 ring-orange-500' : ''}`}
                    onClick={() => setAccentColor('orange')}
                  ></button>
                  <button 
                    className={`w-8 h-8 rounded-full bg-red-500 ${accentColor === 'red' ? 'ring-2 ring-offset-2 ring-red-500' : ''}`}
                    onClick={() => setAccentColor('red')}
                  ></button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Display Density</label>
                <p className="text-xs text-gray-500 mb-3">Adjust the spacing between elements</p>
                
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="density" 
                      className="mr-2 text-wintrack-green focus:ring-wintrack-green" 
                      checked={density === 'compact'}
                      onChange={() => setDensity('compact')}
                    />
                    <span>Compact</span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="density" 
                      className="mr-2 text-wintrack-green focus:ring-wintrack-green" 
                      checked={density === 'regular'}
                      onChange={() => setDensity('regular')}
                    />
                    <span>Regular</span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="density" 
                      className="mr-2 text-wintrack-green focus:ring-wintrack-green" 
                      checked={density === 'comfortable'}
                      onChange={() => setDensity('comfortable')}
                    />
                    <span>Comfortable</span>
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Font Size</label>
                <p className="text-xs text-gray-500 mb-3">Adjust text size throughout the application</p>
                
                <div className="flex items-center gap-4">
                  <span className="text-xs">Small</span>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={fontSize} 
                    onChange={(e) => setFontSize(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-base">Large</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Notification Settings */}
          <div>
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
          
          {/* Data & Privacy */}
          <div>
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
        </div>
      </div>
      
      <div className="flex justify-end">
        <button className="px-4 py-2 text-gray-700 font-medium mr-4">
          Cancel
        </button>
        <button className="px-6 py-2 bg-wintrack-green hover:bg-wintrack-green-dark text-white font-medium rounded">
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default Settings;
