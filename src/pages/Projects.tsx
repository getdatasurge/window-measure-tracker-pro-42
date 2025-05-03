
import React, { useState } from 'react';
import KpiCard from '../components/dashboard/KpiCard';
import ProjectTable from '../components/projects/ProjectTable';
import { FileText, ArrowUp, ArrowDown } from 'lucide-react';

const Projects = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  
  const activeProjects = [
    {
      id: 1,
      name: 'Lakeside Residence',
      color: 'blue' as const,
      client: 'John & Mary Smith',
      location: 'Bellevue, WA',
      windows: 24,
      progress: 75,
      deadline: 'Jun 30, 2025',
      status: 'In Progress'
    },
    {
      id: 2,
      name: 'Downtown Office Complex',
      color: 'purple' as const,
      client: 'Axis Commercial Properties',
      location: 'Seattle, WA',
      windows: 186,
      progress: 25,
      deadline: 'Aug 15, 2025',
      status: 'Just Started'
    },
    {
      id: 3,
      name: 'Harbor View Apartments',
      color: 'orange' as const,
      client: 'Emerald Bay Management',
      location: 'Tacoma, WA',
      windows: 94,
      progress: 60,
      deadline: 'Jul 10, 2025',
      status: 'Needs Review'
    },
    {
      id: 4,
      name: 'Sunnyvale Residence',
      color: 'red' as const,
      client: 'Robert & Lisa Anderson',
      location: 'Kirkland, WA',
      windows: 18,
      progress: 90,
      deadline: 'Jun 25, 2025',
      status: 'Final Check'
    },
    {
      id: 5,
      name: 'Westlake Tower',
      color: 'green' as const,
      client: 'Summit Properties LLC',
      location: 'Seattle, WA',
      windows: 132,
      progress: 40,
      deadline: 'Jul 30, 2025',
      status: 'In Progress'
    }
  ];
  
  const upcomingProjects = [
    {
      id: 6,
      name: 'Emerald Heights Condos',
      color: 'blue' as const,
      client: 'Evergreen Developers',
      location: 'Redmond, WA',
      windows: 78,
      progress: 0,
      deadline: 'Jul 15, 2025',
      status: 'Scheduled'
    },
    {
      id: 7,
      name: 'Cascade Business Center',
      color: 'green' as const,
      client: 'Northwest Commercial Group',
      location: 'Bellevue, WA',
      windows: 210,
      progress: 0,
      deadline: 'Aug 5, 2025',
      status: 'Contract Signed'
    },
    {
      id: 8,
      name: 'Oakridge Manor',
      color: 'pink' as const,
      client: 'James & Patricia Wilson',
      location: 'Sammamish, WA',
      windows: 32,
      progress: 0,
      deadline: 'Jul 8, 2025',
      status: 'Pre-Assessment'
    }
  ];
  
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard 
          title="Active Projects" 
          value="24" 
          trend={{ value: 8, direction: 'up' }}
          icon="projects"
        />
        <KpiCard 
          title="Upcoming Projects" 
          value="11" 
          trend={{ value: 3, direction: 'up' }}
          icon="projects"
        />
        <KpiCard 
          title="Windows Measured" 
          value="1,254" 
          trend={{ value: 12, direction: 'up' }}
          footnote="total measured"
          icon="completed"
        />
        <KpiCard 
          title="Pending Measurements" 
          value="386" 
          trend={{ value: 5, direction: 'down' }}
          footnote="remaining to measure"
          icon="pending"
        />
      </div>
      
      {/* Project Filters */}
      <div className="bg-white rounded-lg shadow-sm p-5">
        <h2 className="text-lg font-semibold mb-4">Project Filters</h2>
        
        <div className="flex flex-wrap gap-3">
          <button 
            className={`tab-button ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            All Projects
          </button>
          <button 
            className={`tab-button ${activeFilter === 'active' ? 'active' : ''}`}
            onClick={() => setActiveFilter('active')}
          >
            Active
          </button>
          <button 
            className={`tab-button ${activeFilter === 'upcoming' ? 'active' : ''}`}
            onClick={() => setActiveFilter('upcoming')}
          >
            Upcoming
          </button>
          <button 
            className={`tab-button ${activeFilter === 'completed' ? 'active' : ''}`}
            onClick={() => setActiveFilter('completed')}
          >
            Completed
          </button>
        </div>
        
        <div className="mt-4 flex flex-col space-y-3 md:flex-row md:space-y-0 md:space-x-3">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search projects..."
              className="search-input"
            />
            <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
            </div>
          </div>
          
          <button className="px-4 py-2 border rounded-md text-gray-700 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
            More Filters
          </button>
          
          <button className="px-4 py-2 bg-wintrack-dark-blue text-white rounded-md text-sm font-medium flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M12 5v14M5 12h14"/></svg>
            Add Project
          </button>
        </div>
      </div>
      
      {/* Active Projects Table */}
      <div className="bg-white rounded-lg shadow-sm p-5">
        <h2 className="text-lg font-semibold mb-6">Active Projects</h2>
        <ProjectTable projects={activeProjects} />
        
        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Showing 5 of 24 projects
          </div>
          <div className="flex space-x-1">
            <button className="pagination-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <button className="pagination-button active">1</button>
            <button className="pagination-button">2</button>
            <button className="pagination-button">3</button>
            <button className="pagination-button">4</button>
            <button className="pagination-button">5</button>
            <button className="pagination-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Upcoming Projects Table */}
      <div className="bg-white rounded-lg shadow-sm p-5">
        <h2 className="text-lg font-semibold mb-6">Upcoming Projects</h2>
        <ProjectTable projects={upcomingProjects} />
        
        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Showing 3 of 11 upcoming projects
          </div>
          <div className="flex space-x-1">
            <button className="pagination-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <button className="pagination-button active">1</button>
            <button className="pagination-button">2</button>
            <button className="pagination-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Measurement Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Measurement Statistics</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Windows Measured</span>
                <span>684 (68%)</span>
              </div>
              <div className="progress-bar">
                <div className="progress-bar-value bg-green-500" style={{ width: '68%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Windows Pending</span>
                <span>386 (32%)</span>
              </div>
              <div className="progress-bar">
                <div className="progress-bar-value bg-orange-500" style={{ width: '32%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Film Installation</span>
                <span>512 (41%)</span>
              </div>
              <div className="progress-bar">
                <div className="progress-bar-value bg-blue-500" style={{ width: '41%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Quality Checks</span>
                <span>428 (34%)</span>
              </div>
              <div className="progress-bar">
                <div className="progress-bar-value bg-purple-500" style={{ width: '34%' }}></div>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="font-medium text-sm mb-4">Measurement Types</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-md">
                <div className="text-lg font-semibold">764</div>
                <div className="text-xs text-gray-500">Standard Windows</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-md">
                <div className="text-lg font-semibold">90</div>
                <div className="text-xs text-gray-500">Specialty Windows</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-md">
                <div className="text-lg font-semibold">284</div>
                <div className="text-xs text-gray-500">Large Format</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-md">
                <div className="text-lg font-semibold">116</div>
                <div className="text-xs text-gray-500">Custom Shapes</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Recent Measurements</h2>
            <button className="text-xs text-blue-600 font-medium">View All</button>
          </div>
          
          <div className="space-y-5">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-sm bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">L</div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <div className="font-medium">Lakeside Residence</div>
                  <div className="text-xs text-gray-500">Today, 10:23 AM</div>
                </div>
                <div className="text-xs text-gray-500 mt-1">Master Bedroom - 4 windows</div>
                <div className="flex items-center gap-2 mt-1">
                  <img src="/lovable-uploads/f1ba8f91-019b-4932-9d0e-5414aef0ed47.png" alt="Sarah Johnson" className="w-5 h-5 rounded-full" />
                  <span className="text-xs">Sarah Johnson</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-sm bg-purple-100 text-purple-600 flex items-center justify-center flex-shrink-0">D</div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <div className="font-medium">Downtown Office Complex</div>
                  <div className="text-xs text-gray-500">Today, 9:15 AM</div>
                </div>
                <div className="text-xs text-gray-500 mt-1">Floor 12 - South Wing (18 windows)</div>
                <div className="flex items-center gap-2 mt-1">
                  <img src="/lovable-uploads/211d8c12-4057-4c0f-80e4-5191abc30c81.png" alt="David Wilson" className="w-5 h-5 rounded-full" />
                  <span className="text-xs">David Wilson</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-sm bg-orange-100 text-orange-600 flex items-center justify-center flex-shrink-0">H</div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <div className="font-medium">Harbor View Apartments</div>
                  <div className="text-xs text-gray-500">Yesterday, 2:45 PM</div>
                </div>
                <div className="text-xs text-gray-500 mt-1">Building B - Units 301-308 (24 windows)</div>
                <div className="flex items-center gap-2 mt-1">
                  <img src="/lovable-uploads/1147f83d-d82c-4ab7-a3de-51400ce914c1.png" alt="Emma Chen" className="w-5 h-5 rounded-full" />
                  <span className="text-xs">Emma Chen</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-sm bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0">W</div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <div className="font-medium">Westlake Tower</div>
                  <div className="text-xs text-gray-500">Yesterday, 11:30 AM</div>
                </div>
                <div className="text-xs text-gray-500 mt-1">Floor 5 - East Wing (12 windows)</div>
                <div className="flex items-center gap-2 mt-1">
                  <img src="/lovable-uploads/e9f29315-c127-4c60-97d6-bc6eb6936a7a.png" alt="Michael Brown" className="w-5 h-5 rounded-full" />
                  <span className="text-xs">Michael Brown</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-sm bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0">S</div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <div className="font-medium">Sunnyvale Residence</div>
                  <div className="text-xs text-gray-500">Jun 20, 2:15 PM</div>
                </div>
                <div className="text-xs text-gray-500 mt-1">Living Room & Kitchen (6 windows)</div>
                <div className="flex items-center gap-2 mt-1">
                  <img src="/lovable-uploads/f1ba8f91-019b-4932-9d0e-5414aef0ed47.png" alt="Sarah Johnson" className="w-5 h-5 rounded-full" />
                  <span className="text-xs">Sarah Johnson</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Team Activity</h2>
            <button className="text-xs text-blue-600 font-medium">View All</button>
          </div>
          
          <div className="space-y-4">
            <div className="flex gap-3 items-center">
              <img src="/lovable-uploads/f1ba8f91-019b-4932-9d0e-5414aef0ed47.png" alt="Sarah Johnson" className="w-8 h-8 rounded-full" />
              <div>
                <div className="text-sm">Sarah Johnson added new measurements to Lakeside Residence</div>
                <div className="text-xs text-gray-500">Today, 10:23 AM</div>
              </div>
            </div>
            
            <div className="flex gap-3 items-center">
              <img src="/lovable-uploads/211d8c12-4057-4c0f-80e4-5191abc30c81.png" alt="David Wilson" className="w-8 h-8 rounded-full" />
              <div>
                <div className="text-sm">David Wilson completed measurements for Downtown Office Complex</div>
                <div className="text-xs text-gray-500">Today, 9:18 AM</div>
              </div>
            </div>
            
            <div className="flex gap-3 items-center">
              <img src="/lovable-uploads/75ba837b-8924-4c3d-a163-ab9116a7c9fb.png" alt="Alex Morgan" className="w-8 h-8 rounded-full" />
              <div>
                <div className="text-sm">Alex Morgan scheduled installation for Sunnyvale Residence</div>
                <div className="text-xs text-gray-500">Today, 8:45 AM</div>
              </div>
            </div>
            
            <div className="flex gap-3 items-center">
              <img src="/lovable-uploads/1147f83d-d82c-4ab7-a3de-51400ce914c1.png" alt="Emma Chen" className="w-8 h-8 rounded-full" />
              <div>
                <div className="text-sm">Emma Chen updated measurements for Harbor View Apartments</div>
                <div className="text-xs text-gray-500">Yesterday, 2:45 PM</div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 border-t border-gray-100 pt-4">
            <h3 className="font-medium text-sm mb-4">Upcoming Schedule</h3>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-blue-100 text-blue-800 rounded-md flex items-center justify-center text-xs font-medium mr-3 flex-shrink-0">
                  <div>JUN<br/>24</div>
                </div>
                <div>
                  <div className="text-sm font-medium">Lakeside Residence</div>
                  <div className="text-xs text-gray-500">Final measurements</div>
                  <div className="text-xs text-gray-500">9:00 AM - 12:00 PM • Sarah Johnson</div>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-8 h-8 bg-purple-100 text-purple-800 rounded-md flex items-center justify-center text-xs font-medium mr-3 flex-shrink-0">
                  <div>JUN<br/>25</div>
                </div>
                <div>
                  <div className="text-sm font-medium">Sunnyvale Residence</div>
                  <div className="text-xs text-gray-500">Installation</div>
                  <div className="text-xs text-gray-500">10:30 AM - 4:00 PM • Installation Team</div>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-8 h-8 bg-orange-100 text-orange-800 rounded-md flex items-center justify-center text-xs font-medium mr-3 flex-shrink-0">
                  <div>JUN<br/>27</div>
                </div>
                <div>
                  <div className="text-sm font-medium">Downtown Office Complex</div>
                  <div className="text-xs text-gray-500">Measurements - Floor 13</div>
                  <div className="text-xs text-gray-500">8:00 AM - 3:00 PM • David Wilson, Michael Brown</div>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-8 h-8 bg-green-100 text-green-800 rounded-md flex items-center justify-center text-xs font-medium mr-3 flex-shrink-0">
                  <div>JUN<br/>30</div>
                </div>
                <div>
                  <div className="text-sm font-medium">Harbor View Apartments</div>
                  <div className="text-xs text-gray-500">Measurements - Building C</div>
                  <div className="text-xs text-gray-500">9:30 AM - 3:30 PM • Emma Chen</div>
                </div>
              </div>
            </div>
            
            <button className="mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium">
              Full Calendar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projects;
