
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import RecentMeasurements from '../dashboard/RecentMeasurements';
import TeamActivityFeed from '../dashboard/TeamActivityFeed';

interface WidgetCardProps {
  title: string;
  children: React.ReactNode;
}

const WidgetCard: React.FC<WidgetCardProps> = ({ title, children }) => {
  return (
    <Card className="bg-zinc-800/50 border border-zinc-700/50 shadow-lg h-full">
      <CardContent className="p-4">
        <h2 className="text-lg font-semibold text-white mb-4">{title}</h2>
        {children}
      </CardContent>
    </Card>
  );
};

const ProjectWidgetsSection: React.FC = () => {
  // Measurement statistics data
  const measurementData = [
    { name: 'Mon', windows: 18 },
    { name: 'Tue', windows: 24 },
    { name: 'Wed', windows: 16 },
    { name: 'Thu', windows: 30 },
    { name: 'Fri', windows: 22 },
  ];

  // Colors for the bars
  const getBarColor = (index: number) => {
    const colors = ['#4A90E2', '#9B87F5', '#10B981', '#F5A623', '#EA384C'];
    return colors[index % colors.length];
  };

  // Schedule data
  const scheduleData = [
    { 
      date: 'Tomorrow', 
      project: 'Downtown Office Complex',
      task: 'Floor 3 measurements',
      team: 'Team A' 
    },
    { 
      date: 'May 6', 
      project: 'Harbor View Apartments',
      task: 'Final verification',
      team: 'Team C' 
    },
    { 
      date: 'May 10', 
      project: 'Sunnyvale Residence',
      task: 'Installation prep',
      team: 'Team B' 
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <WidgetCard title="Measurement Statistics">
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={measurementData}
              margin={{ top: 5, right: 20, left: 0, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} stroke="#888" />
              <YAxis axisLine={false} tickLine={false} stroke="#888" width={30} />
              <Tooltip
                contentStyle={{ backgroundColor: '#222', border: '1px solid #444', borderRadius: '4px' }}
                labelStyle={{ color: '#fff' }}
                itemStyle={{ color: '#fff' }}
              />
              <Bar dataKey="windows" name="Windows Measured" radius={[4, 4, 0, 0]}>
                {measurementData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(index)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </WidgetCard>
      
      <WidgetCard title="Recent Measurements">
        <div className="h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-800/30">
          <RecentMeasurements />
        </div>
      </WidgetCard>
      
      <WidgetCard title="Team Activity">
        <div className="h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-800/30">
          <TeamActivityFeed />
        </div>
      </WidgetCard>
      
      <WidgetCard title="Upcoming Schedule">
        <div className="h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-800/30">
          <ul className="space-y-4">
            {scheduleData.map((item, index) => (
              <li key={index} className="border-b border-zinc-700/50 pb-3 last:border-0">
                <div className="flex justify-between mb-1">
                  <span className="text-white font-medium">{item.project}</span>
                  <span className="text-zinc-400 text-sm">{item.date}</span>
                </div>
                <div className="text-zinc-300 text-sm">{item.task}</div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-zinc-400 text-xs">{item.team}</span>
                  <span className="bg-indigo-900/40 text-indigo-300 text-xs px-2 py-0.5 rounded">Scheduled</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </WidgetCard>
    </div>
  );
};

export default ProjectWidgetsSection;
