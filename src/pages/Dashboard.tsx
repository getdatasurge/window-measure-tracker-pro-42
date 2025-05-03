
import React from 'react';
import KpiCard from '../components/dashboard/KpiCard';
import ActivityFeed from '../components/dashboard/ActivityFeed';
import MeasurementOverview from '../components/dashboard/MeasurementOverview';
import ProjectTable from '../components/projects/ProjectTable';
import ActionCard from '../components/dashboard/ActionCard';
import { FileText, Calendar, BarChart2, PenLine } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const { toast } = useToast();
  
  const sampleProjects = [
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
  
  const handleActionClick = (action: string) => {
    toast({
      title: action,
      description: `This feature will be available in Phase ${action === 'New Measurement' ? '3' : action === 'Schedule Installation' ? '4' : '5'}`,
    });
  };
  
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
          title="Pending Measurements" 
          value="47" 
          trend={{ value: 12, direction: 'up' }}
          icon="pending"
        />
        <KpiCard 
          title="Completed This Month" 
          value="18" 
          trend={{ value: 5, direction: 'up' }}
          icon="completed"
        />
        <KpiCard 
          title="Team Members" 
          value="12" 
          trend={{ value: 2, direction: 'up' }}
          footnote="new this month"
          icon="team"
        />
      </div>
      
      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MeasurementOverview />
        </div>
        <div>
          <ActivityFeed />
        </div>
      </div>
      
      {/* Projects Table */}
      <div className="bg-white rounded-lg shadow-sm p-5">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Active Projects</h2>
          <div className="flex space-x-2 items-center">
            <div className="relative">
              <input
                type="text"
                placeholder="Search projects..."
                className="search-input"
              />
              <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
              </div>
            </div>
            <button className="px-4 py-2 bg-wintrack-dark-blue text-white rounded-md text-sm font-medium flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M12 5v14M5 12h14"/></svg>
              Add Project
            </button>
          </div>
        </div>
        
        <ProjectTable projects={sampleProjects} />
        
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
      
      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ActionCard
          title="Add New Measurement"
          description="Quickly add new window measurements to existing projects"
          buttonText="Start Measuring"
          icon={<PenLine size={24} />}
          onClick={() => handleActionClick("New Measurement")}
          color="blue"
        />
        <ActionCard
          title="Create New Project"
          description="Set up a new window installation project from scratch"
          buttonText="New Project"
          icon={<FileText size={24} />}
          onClick={() => handleActionClick("Create Project")}
          color="green"
        />
        <ActionCard
          title="Schedule Installation"
          description="Schedule installation teams for completed measurements"
          buttonText="Schedule Now"
          icon={<Calendar size={24} />}
          onClick={() => handleActionClick("Schedule Installation")}
          color="orange"
        />
        <ActionCard
          title="Generate Reports"
          description="Create detailed reports of measurements and installations"
          buttonText="Create Report"
          icon={<BarChart2 size={24} />}
          onClick={() => handleActionClick("Generate Reports")}
          color="purple"
        />
      </div>
    </div>
  );
};

export default Dashboard;
