
import React, { useState } from 'react';
import KpiCard from '../components/dashboard/KpiCard';

const Teams = () => {
  const [activeTab, setActiveTab] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');
  
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard 
          title="Total Teams" 
          value="4" 
          trend={{ value: 1, direction: 'up' }}
          icon="team"
        />
        <KpiCard 
          title="Team Members" 
          value="12" 
          trend={{ value: 2, direction: 'up' }}
          footnote="new this month"
          icon="team"
        />
        <KpiCard 
          title="Projects Assigned" 
          value="18" 
          trend={{ value: 4, direction: 'up' }}
          footnote="active projects"
          icon="projects"
        />
        <KpiCard 
          title="Avg. Team Efficiency" 
          value="87%" 
          trend={{ value: 3, direction: 'up' }}
          icon="completed"
        />
      </div>
      
      {/* Team Performance */}
      <div className="bg-white rounded-lg shadow-sm p-5">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Team Performance</h2>
          <div className="flex space-x-2">
            <button 
              className={`tab-button ${activeTab === 'weekly' ? 'active' : ''}`}
              onClick={() => setActiveTab('weekly')}
            >
              Weekly
            </button>
            <button 
              className={`tab-button ${activeTab === 'monthly' ? 'active' : ''}`}
              onClick={() => setActiveTab('monthly')}
            >
              Monthly
            </button>
            <button 
              className={`tab-button ${activeTab === 'yearly' ? 'active' : ''}`}
              onClick={() => setActiveTab('yearly')}
            >
              Yearly
            </button>
          </div>
        </div>
        
        <div className="h-64 flex justify-center items-center">
          {/* Placeholder for charts */}
          <div className="text-gray-400">
            Team performance charts will be implemented in Phase 5
          </div>
        </div>
      </div>
      
      {/* Team Announcements */}
      <div className="bg-white rounded-lg shadow-sm p-5">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Team Announcements</h2>
          <button className="text-gray-400 hover:bg-gray-100 p-1 rounded">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="border-l-4 border-blue-500 pl-4 py-1">
            <h3 className="font-medium">New Safety Protocol</h3>
            <p className="text-sm text-gray-600">Updated safety guidelines for high-rise installations effective June 1st</p>
            <div className="flex justify-between items-center mt-2">
              <div className="text-xs text-gray-500">Posted by Alex Morgan</div>
              <div className="text-xs text-gray-500">2 days ago</div>
            </div>
          </div>
          
          <div className="border-l-4 border-green-500 pl-4 py-1">
            <h3 className="font-medium">Team Beta Recognition</h3>
            <p className="text-sm text-gray-600">Congratulations to Team Beta for completing the Westlake project ahead of schedule!</p>
            <div className="flex justify-between items-center mt-2">
              <div className="text-xs text-gray-500">Posted by Management</div>
              <div className="text-xs text-gray-500">1 week ago</div>
            </div>
          </div>
          
          <div className="border-l-4 border-orange-500 pl-4 py-1">
            <h3 className="font-medium">Training Session</h3>
            <p className="text-sm text-gray-600">Mandatory training session on new measurement tools on June 15th, 9:00 AM</p>
            <div className="flex justify-between items-center mt-2">
              <div className="text-xs text-gray-500">Posted by Training Dept.</div>
              <div className="text-xs text-gray-500">3 days ago</div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 text-center">
          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
            View All Announcements
          </button>
        </div>
      </div>
      
      {/* Installation Teams */}
      <div className="bg-white rounded-lg shadow-sm p-5">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Installation Teams</h2>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search teams..."
                className="search-input"
              />
              <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
              </div>
            </div>
            <button className="px-4 py-2 bg-wintrack-dark-blue text-white rounded-md text-sm font-medium flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M12 5v14M5 12h14"/></svg>
              Create Team
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Team Alpha */}
          <div className="border rounded-lg p-5 bg-purple-50">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-purple-200 p-2 rounded-md">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="#7E22CE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="#7E22CE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="#7E22CE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="#7E22CE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Team Alpha</h3>
                  <div className="text-sm text-gray-600">Commercial Installations</div>
                </div>
              </div>
              <div className="bg-green-100 text-green-800 px-3 py-1 text-xs font-medium rounded-full">Active</div>
              <button className="text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-sm text-gray-500 mb-2">Team Lead</div>
                <div className="flex items-center">
                  <img src="/lovable-uploads/e9f29315-c127-4c60-97d6-bc6eb6936a7a.png" alt="Michael Brown" className="w-8 h-8 rounded-full mr-2" />
                  <div className="text-sm font-medium">Michael Brown</div>
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-2">Team Members</div>
                <div className="flex -space-x-2">
                  <img src="/lovable-uploads/f1ba8f91-019b-4932-9d0e-5414aef0ed47.png" alt="Team Member" className="w-8 h-8 rounded-full border-2 border-white" />
                  <img src="/lovable-uploads/1147f83d-d82c-4ab7-a3de-51400ce914c1.png" alt="Team Member" className="w-8 h-8 rounded-full border-2 border-white" />
                  <img src="/lovable-uploads/211d8c12-4057-4c0f-80e4-5191abc30c81.png" alt="Team Member" className="w-8 h-8 rounded-full border-2 border-white" />
                </div>
                <div className="text-xs mt-1">John Davis, James Wilson, Mark Taylor</div>
              </div>
            </div>
            
            <div>
              <div className="text-sm text-gray-500 mb-2">Current Project</div>
              <div className="mb-2 text-sm font-medium">Downtown Office Complex</div>
              <div className="flex items-center">
                <div className="progress-bar w-3/4 mr-3">
                  <div className="progress-bar-value bg-purple-500" style={{ width: '75%' }}></div>
                </div>
                <span className="text-xs font-medium">75% Complete</span>
              </div>
            </div>
            
            <div className="flex justify-between mt-4 pt-4 border-t border-gray-200">
              <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                View Details
              </button>
              <button className="px-3 py-1.5 bg-wintrack-dark-blue text-white rounded text-sm font-medium">
                Manage Team
              </button>
            </div>
          </div>
          
          {/* Team Beta */}
          <div className="border rounded-lg p-5 bg-blue-50">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-blue-200 p-2 rounded-md">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Team Beta</h3>
                  <div className="text-sm text-gray-600">Residential Installations</div>
                </div>
              </div>
              <div className="bg-green-100 text-green-800 px-3 py-1 text-xs font-medium rounded-full">Active</div>
              <button className="text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-sm text-gray-500 mb-2">Team Lead</div>
                <div className="flex items-center">
                  <img src="/lovable-uploads/f1ba8f91-019b-4932-9d0e-5414aef0ed47.png" alt="Sarah Johnson" className="w-8 h-8 rounded-full mr-2" />
                  <div className="text-sm font-medium">Sarah Johnson</div>
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-2">Team Members</div>
                <div className="flex -space-x-2">
                  <img src="/lovable-uploads/75ba837b-8924-4c3d-a163-ab9116a7c9fb.png" alt="Team Member" className="w-8 h-8 rounded-full border-2 border-white" />
                  <img src="/lovable-uploads/1147f83d-d82c-4ab7-a3de-51400ce914c1.png" alt="Team Member" className="w-8 h-8 rounded-full border-2 border-white" />
                </div>
                <div className="text-xs mt-1">Lisa Martinez, Emma Chen</div>
              </div>
            </div>
            
            <div>
              <div className="text-sm text-gray-500 mb-2">Current Project</div>
              <div className="mb-2 text-sm font-medium">Sunnyvale Residence</div>
              <div className="flex items-center">
                <div className="progress-bar w-3/4 mr-3">
                  <div className="progress-bar-value bg-blue-500" style={{ width: '90%' }}></div>
                </div>
                <span className="text-xs font-medium">90% Complete</span>
              </div>
            </div>
            
            <div className="flex justify-between mt-4 pt-4 border-t border-gray-200">
              <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                View Details
              </button>
              <button className="px-3 py-1.5 bg-wintrack-dark-blue text-white rounded text-sm font-medium">
                Manage Team
              </button>
            </div>
          </div>
          
          {/* Team Gamma */}
          <div className="border rounded-lg p-5 bg-green-50">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-green-200 p-2 rounded-md">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Team Gamma</h3>
                  <div className="text-sm text-gray-600">Mixed Installations</div>
                </div>
              </div>
              <div className="bg-green-100 text-green-800 px-3 py-1 text-xs font-medium rounded-full">Active</div>
              <button className="text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-sm text-gray-500 mb-2">Team Lead</div>
                <div className="flex items-center">
                  <img src="/lovable-uploads/211d8c12-4057-4c0f-80e4-5191abc30c81.png" alt="David Wilson" className="w-8 h-8 rounded-full mr-2" />
                  <div className="text-sm font-medium">David Wilson</div>
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-2">Team Members</div>
                <div className="flex -space-x-2">
                  <img src="/lovable-uploads/e9f29315-c127-4c60-97d6-bc6eb6936a7a.png" alt="Team Member" className="w-8 h-8 rounded-full border-2 border-white" />
                  <img src="/lovable-uploads/75ba837b-8924-4c3d-a163-ab9116a7c9fb.png" alt="Team Member" className="w-8 h-8 rounded-full border-2 border-white" />
                </div>
                <div className="text-xs mt-1">Thomas Lee, Jennifer Kim</div>
              </div>
            </div>
            
            <div>
              <div className="text-sm text-gray-500 mb-2">Current Project</div>
              <div className="mb-2 text-sm font-medium">Harbor View Apartments</div>
              <div className="flex items-center">
                <div className="progress-bar w-3/4 mr-3">
                  <div className="progress-bar-value bg-green-500" style={{ width: '60%' }}></div>
                </div>
                <span className="text-xs font-medium">60% Complete</span>
              </div>
            </div>
            
            <div className="flex justify-between mt-4 pt-4 border-t border-gray-200">
              <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                View Details
              </button>
              <button className="px-3 py-1.5 bg-wintrack-dark-blue text-white rounded text-sm font-medium">
                Manage Team
              </button>
            </div>
          </div>
          
          {/* Team Delta */}
          <div className="border rounded-lg p-5 bg-orange-50">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-orange-200 p-2 rounded-md">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="#EA580C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="#EA580C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="#EA580C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="#EA580C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Team Delta</h3>
                  <div className="text-sm text-gray-600">Specialty Installations</div>
                </div>
              </div>
              <div className="bg-orange-100 text-orange-800 px-3 py-1 text-xs font-medium rounded-full">Training</div>
              <button className="text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-sm text-gray-500 mb-2">Team Lead</div>
                <div className="flex items-center">
                  <img src="/lovable-uploads/e9f29315-c127-4c60-97d6-bc6eb6936a7a.png" alt="Robert Adams" className="w-8 h-8 rounded-full mr-2" />
                  <div className="text-sm font-medium">Robert Adams</div>
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-2">Team Members</div>
                <div className="flex -space-x-2">
                  <img src="/lovable-uploads/f1ba8f91-019b-4932-9d0e-5414aef0ed47.png" alt="Team Member" className="w-8 h-8 rounded-full border-2 border-white" />
                  <img src="/lovable-uploads/75ba837b-8924-4c3d-a163-ab9116a7c9fb.png" alt="Team Member" className="w-8 h-8 rounded-full border-2 border-white" />
                </div>
                <div className="text-xs mt-1">Maria Lopez, Steve Rogers</div>
              </div>
            </div>
            
            <div>
              <div className="text-sm text-gray-500 mb-2">Current Project</div>
              <div className="mb-2 text-sm font-medium">Westlake Tower</div>
              <div className="flex items-center">
                <div className="progress-bar w-3/4 mr-3">
                  <div className="progress-bar-value bg-orange-500" style={{ width: '40%' }}></div>
                </div>
                <span className="text-xs font-medium">40% Complete</span>
              </div>
            </div>
            
            <div className="flex justify-between mt-4 pt-4 border-t border-gray-200">
              <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                View Details
              </button>
              <button className="px-3 py-1.5 bg-wintrack-dark-blue text-white rounded text-sm font-medium">
                Manage Team
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Team Roles & Skills Matrix */}
      <div className="bg-white rounded-lg shadow-sm p-5">
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-1">Team Roles & Skills Matrix</h2>
          <p className="text-sm text-gray-500">Overview of team member skills and certifications</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border-separate border-spacing-y-2">
            <thead>
              <tr className="text-left text-xs text-gray-500 uppercase tracking-wider">
                <th className="px-3 py-2">Team Member</th>
                <th className="px-3 py-2">Role</th>
                <th className="px-3 py-2">Team</th>
                <th className="px-3 py-2 text-center">Residential</th>
                <th className="px-3 py-2 text-center">Commercial</th>
                <th className="px-3 py-2 text-center">High-Rise</th>
                <th className="px-3 py-2 text-center">Specialty</th>
                <th className="px-3 py-2 text-center">Safety Cert.</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-3">
                  <div className="flex items-center">
                    <img src="/lovable-uploads/e9f29315-c127-4c60-97d6-bc6eb6936a7a.png" alt="Michael Brown" className="w-8 h-8 rounded-full mr-2" />
                    <div>
                      <div className="font-medium">Michael Brown</div>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3">Team Lead</td>
                <td className="px-3 py-3">
                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-md text-xs font-medium">Alpha</span>
                </td>
                <td className="px-3 py-3 text-center">
                  <svg className="mx-auto" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </td>
                <td className="px-3 py-3 text-center">
                  <svg className="mx-auto" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </td>
                <td className="px-3 py-3 text-center">
                  <svg className="mx-auto" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </td>
                <td className="px-3 py-3 text-center">
                  <div className="mx-auto w-3 h-0.5 bg-gray-400 rounded"></div>
                </td>
                <td className="px-3 py-3 text-center">
                  <svg className="mx-auto" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </td>
                <td className="px-3 py-3">
                  <button className="p-1 rounded-full hover:bg-gray-100">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                  </button>
                </td>
              </tr>
              
              <tr>
                <td className="px-3 py-3">
                  <div className="flex items-center">
                    <img src="/lovable-uploads/f1ba8f91-019b-4932-9d0e-5414aef0ed47.png" alt="Sarah Johnson" className="w-8 h-8 rounded-full mr-2" />
                    <div>
                      <div className="font-medium">Sarah Johnson</div>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3">Team Lead</td>
                <td className="px-3 py-3">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs font-medium">Beta</span>
                </td>
                <td className="px-3 py-3 text-center">
                  <svg className="mx-auto" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </td>
                <td className="px-3 py-3 text-center">
                  <div className="mx-auto w-3 h-0.5 bg-gray-400 rounded"></div>
                </td>
                <td className="px-3 py-3 text-center">
                  <div className="mx-auto w-3 h-0.5 bg-gray-400 rounded"></div>
                </td>
                <td className="px-3 py-3 text-center">
                  <svg className="mx-auto" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </td>
                <td className="px-3 py-3 text-center">
                  <svg className="mx-auto" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </td>
                <td className="px-3 py-3">
                  <button className="p-1 rounded-full hover:bg-gray-100">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                  </button>
                </td>
              </tr>
              
              <tr>
                <td className="px-3 py-3">
                  <div className="flex items-center">
                    <img src="/lovable-uploads/211d8c12-4057-4c0f-80e4-5191abc30c81.png" alt="David Wilson" className="w-8 h-8 rounded-full mr-2" />
                    <div>
                      <div className="font-medium">David Wilson</div>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3">Team Lead</td>
                <td className="px-3 py-3">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-md text-xs font-medium">Gamma</span>
                </td>
                <td className="px-3 py-3 text-center">
                  <svg className="mx-auto" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </td>
                <td className="px-3 py-3 text-center">
                  <svg className="mx-auto" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </td>
                <td className="px-3 py-3 text-center">
                  <div className="mx-auto w-3 h-0.5 bg-gray-400 rounded"></div>
                </td>
                <td className="px-3 py-3 text-center">
                  <svg className="mx-auto" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </td>
                <td className="px-3 py-3 text-center">
                  <svg className="mx-auto" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </td>
                <td className="px-3 py-3">
                  <button className="p-1 rounded-full hover:bg-gray-100">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                  </button>
                </td>
              </tr>
              
              <tr>
                <td className="px-3 py-3">
                  <div className="flex items-center">
                    <img src="/lovable-uploads/e9f29315-c127-4c60-97d6-bc6eb6936a7a.png" alt="Robert Adams" className="w-8 h-8 rounded-full mr-2" />
                    <div>
                      <div className="font-medium">Robert Adams</div>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3">Team Lead</td>
                <td className="px-3 py-3">
                  <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-md text-xs font-medium">Delta</span>
                </td>
                <td className="px-3 py-3 text-center">
                  <div className="mx-auto w-3 h-0.5 bg-gray-400 rounded"></div>
                </td>
                <td className="px-3 py-3 text-center">
                  <svg className="mx-auto" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </td>
                <td className="px-3 py-3 text-center">
                  <svg className="mx-auto" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </td>
                <td className="px-3 py-3 text-center">
                  <svg className="mx-auto" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </td>
                <td className="px-3 py-3 text-center">
                  <svg className="mx-auto" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </td>
                <td className="px-3 py-3">
                  <button className="p-1 rounded-full hover:bg-gray-100">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                  </button>
                </td>
              </tr>
              
              <tr>
                <td className="px-3 py-3">
                  <div className="flex items-center">
                    <img src="/lovable-uploads/f1ba8f91-019b-4932-9d0e-5414aef0ed47.png" alt="Lisa Martinez" className="w-8 h-8 rounded-full mr-2" />
                    <div>
                      <div className="font-medium">Lisa Martinez</div>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3">Senior Installer</td>
                <td className="px-3 py-3">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs font-medium">Beta</span>
                </td>
                <td className="px-3 py-3 text-center">
                  <svg className="mx-auto" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </td>
                <td className="px-3 py-3 text-center">
                  <svg className="mx-auto" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </td>
                <td className="px-3 py-3 text-center">
                  <div className="mx-auto w-3 h-0.5 bg-gray-400 rounded"></div>
                </td>
                <td className="px-3 py-3 text-center">
                  <div className="mx-auto w-3 h-0.5 bg-gray-400 rounded"></div>
                </td>
                <td className="px-3 py-3 text-center">
                  <svg className="mx-auto" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </td>
                <td className="px-3 py-3">
                  <button className="p-1 rounded-full hover:bg-gray-100">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Showing 5 of 12 team members
          </div>
          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
            View All Team Members
          </button>
        </div>
      </div>
      
      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-wintrack-dark-blue text-white action-card">
          <div className="bg-white bg-opacity-10 p-3 rounded-lg inline-block mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          
          <h3 className="text-lg font-semibold mb-2">Add Team Member</h3>
          <p className="text-sm opacity-80 mb-4">Add new installers or team members to your installation crews</p>
          
          <button className="w-full py-2 bg-white bg-opacity-10 hover:bg-opacity-20 rounded text-white text-sm font-medium border border-white border-opacity-20">
            Add Member
          </button>
        </div>
        
        <div className="bg-green-600 text-white action-card">
          <div className="bg-white bg-opacity-10 p-3 rounded-lg inline-block mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="4" width="18" height="18" rx="2" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 2V6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8 2V6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 10H21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8 14H8.01" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 14H12.01" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 14H16.01" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8 18H8.01" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 18H12.01" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 18H16.01" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          
          <h3 className="text-lg font-semibold mb-2">Schedule Training</h3>
          <p className="text-sm opacity-80 mb-4">Schedule training sessions for team skill development</p>
          
          <button className="w-full py-2 bg-white bg-opacity-10 hover:bg-opacity-20 rounded text-white text-sm font-medium border border-white border-opacity-20">
            Schedule Training
          </button>
        </div>
        
        <div className="bg-blue-600 text-white action-card">
          <div className="bg-white bg-opacity-10 p-3 rounded-lg inline-block mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 21V5C16 4.46957 15.7893 3.96086 15.4142 3.58579C15.0391 3.21071 14.5304 3 14 3H10C9.46957 3 8.96086 3.21071 8.58579 3.58579C8.21071 3.96086 8 4.46957 8 5V21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          
          <h3 className="text-lg font-semibold mb-2">Assign Projects</h3>
          <p className="text-sm opacity-80 mb-4">Assign installation teams to new or existing projects</p>
          
          <button className="w-full py-2 bg-white bg-opacity-10 hover:bg-opacity-20 rounded text-white text-sm font-medium border border-white border-opacity-20">
            Assign Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Teams;
