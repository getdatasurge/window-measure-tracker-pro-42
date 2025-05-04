
import React, { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import DashboardShell from '../components/layout/DashboardShell';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import { Card } from '@/components/ui/card';
import { 
  BarChart3, 
  Clock, 
  Users, 
  CheckCircle, 
  AlertTriangle,
  ChevronUp, 
  ChevronDown,
  Search,
  Download,
  Share2,
  Filter
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import KpiCard from '../components/dashboard/KpiCard';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const ReportsNew: React.FC = () => {
  const { theme } = useTheme();
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly'>('weekly');

  // Mock data for charts
  const projectMetricsData = [
    { week: 'W1', completed: 42, planned: 45 },
    { week: 'W2', completed: 38, planned: 40 },
    { week: 'W3', completed: 45, planned: 45 },
    { week: 'W4', completed: 40, planned: 42 },
    { week: 'W5', completed: 43, planned: 44 },
    { week: 'W6', completed: 45, planned: 45 },
    { week: 'W7', completed: 48, planned: 46 },
    { week: 'W8', completed: 50, planned: 48 },
    { week: 'W9', completed: 47, planned: 46 },
    { week: 'W10', completed: 52, planned: 50 },
    { week: 'W11', completed: 54, planned: 52 },
    { week: 'W12', completed: 52, planned: 50 }
  ];

  const teamPerformanceData = [
    { name: 'John Smith', productivity: 90 },
    { name: 'Sarah Johnson', productivity: 92 },
    { name: 'Mike Davis', productivity: 88 },
    { name: 'Lisa Chen', productivity: 85 },
    { name: 'Tom Wilson', productivity: 78 }
  ];

  const measurementAccuracyData = [
    { 
      project: 'Downtown Office Tower', 
      measurements: 45, 
      accuracy: '99.2%', 
      errors: 1, 
      deviation: '0.25 in', 
      status: 'Excellent' 
    },
    { 
      project: 'Riverside Apartments', 
      measurements: 36, 
      accuracy: '98.6%', 
      errors: 2, 
      deviation: '0.31 in', 
      status: 'Excellent' 
    },
    { 
      project: 'Lakeside Hotel', 
      measurements: 42, 
      accuracy: '97.8%', 
      errors: 4, 
      deviation: '0.42 in', 
      status: 'Good' 
    },
    { 
      project: 'Greenview Mall', 
      measurements: 12, 
      accuracy: '95.4%', 
      errors: 3, 
      deviation: '0.58 in', 
      status: 'Needs Review' 
    },
    { 
      project: 'Harbor View Complex', 
      measurements: 28, 
      accuracy: '99.1%', 
      errors: 1, 
      deviation: '0.27 in', 
      status: 'Excellent' 
    }
  ];

  const getStatusBadgeClass = (status: string) => {
    switch(status) {
      case 'Excellent':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'Good':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'Needs Review':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-400';
    }
  };

  return (
    <DashboardShell>
      <div className="flex flex-col space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <DashboardHeader title="Reports" />
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Performance metrics and measurement analytics
          </div>

          <div className="flex flex-wrap items-center justify-between mt-2 gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input 
                type="text" 
                placeholder="Search reports..." 
                className="pl-9 w-64 bg-white dark:bg-zinc-900" 
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Filter className="h-4 w-4" />
                <span>Filter</span>
              </Button>
              <Button variant="default" size="sm" className="bg-green-600 hover:bg-green-700 flex items-center gap-1">
                <Download className="h-4 w-4" />
                <span>Export Report</span>
              </Button>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="bg-zinc-800/60 border border-zinc-700/50 rounded-lg p-5">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-xs text-zinc-500 font-medium">Measurement Accuracy</div>
                <div className="text-3xl font-bold mt-1 text-white">98.7%</div>
                <div className="flex items-center text-xs mt-1 text-zinc-500">
                  <span>vs 2.5% last period</span>
                </div>
              </div>
              <div className="bg-indigo-900/30 text-indigo-400 p-2 rounded">
                <BarChart3 size={18} />
              </div>
            </div>
            <div className="mt-3 flex items-center text-xs">
              <span className="flex items-center text-green-400">
                <ChevronUp className="h-3.5 w-3.5" />
                2.6%
              </span>
            </div>
          </div>

          <div className="bg-zinc-800/60 border border-zinc-700/50 rounded-lg p-5">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-xs text-zinc-500 font-medium">Avg. Time per Measurement</div>
                <div className="text-3xl font-bold mt-1 text-white">3.2 min</div>
                <div className="flex items-center text-xs mt-1 text-zinc-500">
                  <span>vs 14% last period</span>
                </div>
              </div>
              <div className="bg-cyan-900/30 text-cyan-400 p-2 rounded">
                <Clock size={18} />
              </div>
            </div>
            <div className="mt-3 flex items-center text-xs">
              <span className="flex items-center text-green-400">
                <ChevronUp className="h-3.5 w-3.5" />
                14%
              </span>
            </div>
          </div>

          <div className="bg-zinc-800/60 border border-zinc-700/50 rounded-lg p-5">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-xs text-zinc-500 font-medium">Team Efficiency Score</div>
                <div className="text-3xl font-bold mt-1 text-white">87</div>
                <div className="flex items-center text-xs mt-1 text-zinc-500">
                  <span>vs 5% last period</span>
                </div>
              </div>
              <div className="bg-yellow-900/30 text-yellow-400 p-2 rounded">
                <Users size={18} />
              </div>
            </div>
            <div className="mt-3 flex items-center text-xs">
              <span className="flex items-center text-green-400">
                <ChevronUp className="h-3.5 w-3.5" />
                5%
              </span>
            </div>
          </div>

          <div className="bg-zinc-800/60 border border-zinc-700/50 rounded-lg p-5">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-xs text-zinc-500 font-medium">On-Time Completion Rate</div>
                <div className="text-3xl font-bold mt-1 text-white">92%</div>
                <div className="flex items-center text-xs mt-1 text-zinc-500">
                  <span>vs 4% last period</span>
                </div>
              </div>
              <div className="bg-purple-900/30 text-purple-400 p-2 rounded">
                <CheckCircle size={18} />
              </div>
            </div>
            <div className="mt-3 flex items-center text-xs">
              <span className="flex items-center text-green-400">
                <ChevronUp className="h-3.5 w-3.5" />
                4%
              </span>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Project Metrics Chart */}
          <div className="bg-zinc-800/60 border border-zinc-700/50 rounded-lg p-5">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-medium text-white">Project Metrics</h3>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-xs text-zinc-400">Completed</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-zinc-600"></div>
                    <span className="text-xs text-zinc-400">Planned</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center bg-zinc-900/80 rounded-md">
                <button 
                  className={`px-3 py-1 text-xs rounded-md ${timeRange === 'daily' ? 'bg-zinc-700 text-white' : 'text-zinc-400'}`}
                  onClick={() => setTimeRange('daily')}
                >
                  Daily
                </button>
                <button 
                  className={`px-3 py-1 text-xs rounded-md ${timeRange === 'weekly' ? 'bg-zinc-700 text-white' : 'text-zinc-400'}`}
                  onClick={() => setTimeRange('weekly')}
                >
                  Weekly
                </button>
                <button 
                  className={`px-3 py-1 text-xs rounded-md ${timeRange === 'monthly' ? 'bg-zinc-700 text-white' : 'text-zinc-400'}`}
                  onClick={() => setTimeRange('monthly')}
                >
                  Monthly
                </button>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={projectMetricsData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                  <XAxis dataKey="week" tick={{ fill: '#9CA3AF' }} axisLine={{ stroke: '#333' }} />
                  <YAxis tick={{ fill: '#9CA3AF' }} axisLine={{ stroke: '#333' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: 'none', 
                      borderRadius: '4px',
                      color: '#E5E7EB'
                    }} 
                  />
                  <Bar dataKey="planned" fill="#4B5563" radius={[4, 4, 0, 0]} maxBarSize={30} />
                  <Bar dataKey="completed" fill="#10B981" radius={[4, 4, 0, 0]} maxBarSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Team Performance Chart */}
          <div className="bg-zinc-800/60 border border-zinc-700/50 rounded-lg p-5">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-medium text-white">Team Performance</h3>
                <div className="text-sm text-zinc-400 mt-1">Team Member Productivity</div>
              </div>
              <div className="text-sm text-zinc-400">Last 30 days</div>
            </div>
            
            <div className="space-y-4">
              {teamPerformanceData.map((member, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-zinc-700 flex items-center justify-center text-xs">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="text-zinc-300 text-sm">{member.name}</span>
                    </div>
                    <span className="text-zinc-300 text-sm">{member.productivity}%</span>
                  </div>
                  <div className="w-full h-2 bg-zinc-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500 rounded-full" 
                      style={{ width: `${member.productivity}%` }}
                    ></div>
                  </div>
                </div>
              ))}

              <div className="border-t border-zinc-700 pt-4 mt-6">
                <div className="flex justify-between text-sm">
                  <div>
                    <div className="text-zinc-400">Team Average:</div>
                    <div className="text-zinc-300 font-medium">87.8%</div>
                  </div>
                  <div className="text-right">
                    <div className="text-zinc-400">Target:</div>
                    <div className="text-zinc-300 font-medium">85%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Measurement Accuracy Table */}
        <div className="bg-zinc-800/60 border border-zinc-700/50 rounded-lg p-5">
          <h3 className="text-lg font-medium text-white mb-4">Measurement Accuracy Analysis</h3>
          
          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-2">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-zinc-500">
                  <th className="px-6 py-3">Project</th>
                  <th className="px-6 py-3">Total Measurements</th>
                  <th className="px-6 py-3">Accuracy Rate</th>
                  <th className="px-6 py-3">Error Count</th>
                  <th className="px-6 py-3">Avg Deviation</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-700/30">
                {measurementAccuracyData.map((item, index) => (
                  <tr key={index} className="bg-zinc-900/40">
                    <td className="px-6 py-4 whitespace-nowrap text-zinc-300">{item.project}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-zinc-300">{item.measurements}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-zinc-300">{item.accuracy}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-zinc-300">{item.errors}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-zinc-300">{item.deviation}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeClass(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Insight Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Error Pattern Detection */}
          <div className="bg-zinc-800/60 border border-zinc-700/50 rounded-lg p-5">
            <div className="flex items-start">
              <div className="text-amber-500 bg-amber-900/30 p-2 rounded mr-3">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h3 className="text-lg font-medium text-white">Error Pattern Detection</h3>
                <div className="text-xs text-zinc-500 mt-0.5">From performance metrics analysis</div>
              </div>
            </div>
            <p className="mt-4 text-sm text-zinc-300 leading-relaxed">
              Analysis shows that 62% of measurement errors occur on curved or irregular windows. The new digital caliper tool appears to have reduced these errors by 30% in recent projects.
            </p>
          </div>

          {/* Team Composition */}
          <div className="bg-zinc-800/60 border border-zinc-700/50 rounded-lg p-5">
            <div className="flex items-start">
              <div className="text-purple-500 bg-purple-900/30 p-2 rounded mr-3">
                <Users size={20} />
              </div>
              <div>
                <h3 className="text-lg font-medium text-white">Team Composition</h3>
                <div className="text-xs text-zinc-500 mt-0.5">From team performance analysis</div>
              </div>
            </div>
            <p className="mt-4 text-sm text-zinc-300 leading-relaxed">
              Projects with mixed teams of experienced and new technicians show 12% higher accuracy rates than projects staffed with either all experienced or all new teams.
            </p>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
};

export default ReportsNew;
