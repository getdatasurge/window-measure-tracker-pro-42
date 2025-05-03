
import React, { useState } from 'react';

const Reports = () => {
  const [activeReport, setActiveReport] = useState('measurements');
  
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-5">
        <h2 className="text-lg font-semibold mb-6">Reports Dashboard</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div 
            className={`border rounded-lg p-4 cursor-pointer transition hover:shadow-md ${activeReport === 'measurements' ? 'border-wintrack-green bg-green-50' : ''}`}
            onClick={() => setActiveReport('measurements')}
          >
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3 9H21" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 21V9" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-lg font-medium">Measurement Report</h3>
            </div>
            <p className="text-sm text-gray-600">Comprehensive data on all window measurements.</p>
          </div>
          
          <div 
            className={`border rounded-lg p-4 cursor-pointer transition hover:shadow-md ${activeReport === 'team' ? 'border-wintrack-green bg-green-50' : ''}`}
            onClick={() => setActiveReport('team')}
          >
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-lg font-medium">Team Performance</h3>
            </div>
            <p className="text-sm text-gray-600">Detailed analysis of team productivity and efficiency.</p>
          </div>
          
          <div 
            className={`border rounded-lg p-4 cursor-pointer transition hover:shadow-md ${activeReport === 'project' ? 'border-wintrack-green bg-green-50' : ''}`}
            onClick={() => setActiveReport('project')}
          >
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 19C22 19.5304 21.7893 20.0391 21.4142 20.4142C21.0391 20.7893 20.5304 21 20 21H4C3.46957 21 2.96086 20.7893 2.58579 20.4142C2.21071 20.0391 2 19.5304 2 19V5C2 4.46957 2.21071 3.96086 2.58579 3.58579C2.96086 3.21071 3.46957 3 4 3H9L11 6H20C20.5304 6 21.0391 6.21071 21.4142 6.58579C21.7893 6.96086 22 7.46957 22 8V19Z" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-lg font-medium">Project Status</h3>
            </div>
            <p className="text-sm text-gray-600">Status tracking and progress reports for all projects.</p>
          </div>
        </div>
      </div>
      
      {activeReport === 'measurements' && (
        <div className="bg-white rounded-lg shadow-sm p-5">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Measurement Reports</h2>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded text-sm font-medium hover:bg-gray-200">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1 inline">
                  <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Export
              </button>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded text-sm font-medium hover:bg-gray-200">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1 inline">
                  <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Share
              </button>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded text-sm font-medium hover:bg-gray-200">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1 inline">
                  <path d="M19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8.5 10C9.32843 10 10 9.32843 10 8.5C10 7.67157 9.32843 7 8.5 7C7.67157 7 7 7.67157 7 8.5C7 9.32843 7.67157 10 8.5 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M21 15L16 10L5 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Print
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="border rounded-lg p-4">
              <h3 className="text-sm text-gray-500 mb-1">Total Measurements</h3>
              <div className="text-2xl font-bold">1,254</div>
              <div className="text-xs text-green-600 mt-1">+12% from last month</div>
            </div>
            
            <div className="border rounded-lg p-4">
              <h3 className="text-sm text-gray-500 mb-1">Pending Measurements</h3>
              <div className="text-2xl font-bold">386</div>
              <div className="text-xs text-red-600 mt-1">-5% from last month</div>
            </div>
            
            <div className="border rounded-lg p-4">
              <h3 className="text-sm text-gray-500 mb-1">Average Time per Window</h3>
              <div className="text-2xl font-bold">14.5 min</div>
              <div className="text-xs text-green-600 mt-1">-2 min from last month</div>
            </div>
            
            <div className="border rounded-lg p-4">
              <h3 className="text-sm text-gray-500 mb-1">Most Active Project</h3>
              <div className="text-xl font-bold">Downtown Office</div>
              <div className="text-xs text-gray-500 mt-1">186 windows measured</div>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Measurement Trends (Last 6 Months)</h3>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center border">
              <div className="text-gray-400">
                Measurement trend charts will be implemented in Phase 5
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold">Recent Measurements</h3>
              <button className="text-sm text-blue-600">View All</button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-y-2">
                <thead>
                  <tr className="text-left text-xs text-gray-500 uppercase tracking-wider">
                    <th className="px-3 py-2">Date</th>
                    <th className="px-3 py-2">Project</th>
                    <th className="px-3 py-2">Location</th>
                    <th className="px-3 py-2">Team Member</th>
                    <th className="px-3 py-2">Windows</th>
                    <th className="px-3 py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white">
                    <td className="px-3 py-3 text-sm">Jun 24, 2025</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center">
                        <div className="w-6 h-6 rounded bg-blue-100 text-blue-600 flex items-center justify-center mr-2">L</div>
                        <span>Lakeside Residence</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-sm">Master Bedroom</td>
                    <td className="px-3 py-3 text-sm">Sarah Johnson</td>
                    <td className="px-3 py-3 text-sm">4</td>
                    <td className="px-3 py-3">
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Completed</span>
                    </td>
                  </tr>
                  
                  <tr className="bg-white">
                    <td className="px-3 py-3 text-sm">Jun 23, 2025</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center">
                        <div className="w-6 h-6 rounded bg-purple-100 text-purple-600 flex items-center justify-center mr-2">D</div>
                        <span>Downtown Office</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-sm">Floor 12 - South</td>
                    <td className="px-3 py-3 text-sm">David Wilson</td>
                    <td className="px-3 py-3 text-sm">18</td>
                    <td className="px-3 py-3">
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Completed</span>
                    </td>
                  </tr>
                  
                  <tr className="bg-white">
                    <td className="px-3 py-3 text-sm">Jun 22, 2025</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center">
                        <div className="w-6 h-6 rounded bg-orange-100 text-orange-600 flex items-center justify-center mr-2">H</div>
                        <span>Harbor View Apartments</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-sm">Building B - Units 301-308</td>
                    <td className="px-3 py-3 text-sm">Emma Chen</td>
                    <td className="px-3 py-3 text-sm">24</td>
                    <td className="px-3 py-3">
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">In Progress</span>
                    </td>
                  </tr>
                  
                  <tr className="bg-white">
                    <td className="px-3 py-3 text-sm">Jun 21, 2025</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center">
                        <div className="w-6 h-6 rounded bg-green-100 text-green-600 flex items-center justify-center mr-2">W</div>
                        <span>Westlake Tower</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-sm">Floor 5 - East Wing</td>
                    <td className="px-3 py-3 text-sm">Michael Brown</td>
                    <td className="px-3 py-3 text-sm">12</td>
                    <td className="px-3 py-3">
                      <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">Pending Review</span>
                    </td>
                  </tr>
                  
                  <tr className="bg-white">
                    <td className="px-3 py-3 text-sm">Jun 20, 2025</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center">
                        <div className="w-6 h-6 rounded bg-red-100 text-red-600 flex items-center justify-center mr-2">S</div>
                        <span>Sunnyvale Residence</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-sm">Living Room & Kitchen</td>
                    <td className="px-3 py-3 text-sm">Sarah Johnson</td>
                    <td className="px-3 py-3 text-sm">6</td>
                    <td className="px-3 py-3">
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Completed</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Measurement Types Distribution</h3>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center border">
                <div className="text-gray-400">
                  Measurement type pie chart will be implemented in Phase 5
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Measurement Efficiency by Team</h3>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center border">
                <div className="text-gray-400">
                  Team efficiency bar chart will be implemented in Phase 5
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {activeReport === 'team' && (
        <div className="bg-white rounded-lg shadow-sm p-5">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Team Performance Reports</h2>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded text-sm font-medium hover:bg-gray-200">
                Export
              </button>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded text-sm font-medium hover:bg-gray-200">
                Share
              </button>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded text-sm font-medium hover:bg-gray-200">
                Print
              </button>
            </div>
          </div>
          
          {/* Content for Team Performance Report */}
          <div className="text-center py-16 text-gray-400">
            Team Performance Reports will be implemented in Phase 5
          </div>
        </div>
      )}
      
      {activeReport === 'project' && (
        <div className="bg-white rounded-lg shadow-sm p-5">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Project Status Reports</h2>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded text-sm font-medium hover:bg-gray-200">
                Export
              </button>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded text-sm font-medium hover:bg-gray-200">
                Share
              </button>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded text-sm font-medium hover:bg-gray-200">
                Print
              </button>
            </div>
          </div>
          
          {/* Content for Project Status Report */}
          <div className="text-center py-16 text-gray-400">
            Project Status Reports will be implemented in Phase 5
          </div>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-sm p-5">
        <h2 className="text-lg font-semibold mb-6">Generate Custom Report</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
              <select className="search-input">
                <option>Measurement Summary</option>
                <option>Project Progress</option>
                <option>Team Performance</option>
                <option>Client Summary</option>
                <option>Installation Schedule</option>
                <option>Financial Overview</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Projects to Include</label>
              <select className="search-input" multiple size={5}>
                <option>All Projects</option>
                <option>Lakeside Residence</option>
                <option>Downtown Office Complex</option>
                <option>Harbor View Apartments</option>
                <option>Sunnyvale Residence</option>
                <option>Westlake Tower</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Team Members</label>
              <select className="search-input" multiple size={3}>
                <option>All Team Members</option>
                <option>Team Alpha</option>
                <option>Team Beta</option>
                <option>Team Gamma</option>
                <option>Team Delta</option>
              </select>
            </div>
          </div>
          
          <div>
            <div className="grid grid-cols-2 gap-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input type="date" className="search-input" />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input type="date" className="search-input" />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Data Groups</label>
              <div className="space-y-2 mt-2">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" defaultChecked />
                  <span className="text-sm">Window Measurements</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" defaultChecked />
                  <span className="text-sm">Installation Progress</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" defaultChecked />
                  <span className="text-sm">Team Performance</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-sm">Financial Data</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-sm">Client Feedback</span>
                </label>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Report Format</label>
              <div className="space-y-2 mt-2">
                <label className="flex items-center">
                  <input type="radio" name="format" className="mr-2" defaultChecked />
                  <span className="text-sm">PDF Document</span>
                </label>
                <label className="flex items-center">
                  <input type="radio" name="format" className="mr-2" />
                  <span className="text-sm">Excel Spreadsheet</span>
                </label>
                <label className="flex items-center">
                  <input type="radio" name="format" className="mr-2" />
                  <span className="text-sm">CSV Data File</span>
                </label>
                <label className="flex items-center">
                  <input type="radio" name="format" className="mr-2" />
                  <span className="text-sm">Interactive Dashboard</span>
                </label>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
          <button className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-50">
            Cancel
          </button>
          <button className="px-4 py-2 bg-wintrack-green hover:bg-wintrack-green-dark text-white rounded">
            Generate Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default Reports;
