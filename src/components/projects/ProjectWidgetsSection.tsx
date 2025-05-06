
import React, { useState, useEffect } from 'react';
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
import { TeamActivityFeed } from '../dashboard/activity-feed';
import { supabase } from '@/integrations/supabase/client';
import { format, subDays } from 'date-fns';

interface WidgetCardProps {
  title: string;
  children: React.ReactNode;
}

interface MeasurementStat {
  name: string;
  windows: number;
  date: string;
}

interface ScheduleItem {
  date: string;
  project: string;
  task: string;
  team: string;
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
  const [measurementData, setMeasurementData] = useState<MeasurementStat[]>([]);
  const [scheduleData, setScheduleData] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMeasurementStats = async () => {
      try {
        // Get measurements for the past 5 days
        const today = new Date();
        const dates = Array.from({ length: 5 }, (_, i) => subDays(today, i));
        
        // Format dates for display and query
        const formattedDates = dates.map(date => ({
          name: format(date, 'EEE'),
          date: format(date, 'yyyy-MM-dd')
        }));
        
        // Fetch measurement counts for each date
        const statsPromises = formattedDates.map(async ({ date }) => {
          const { count } = await supabase
            .from('measurements')
            .select('*', { count: 'exact', head: true })
            .gte('measurement_date', `${date}T00:00:00`)
            .lt('measurement_date', `${date}T23:59:59`);
            
          return count || 0;
        });
        
        const counts = await Promise.all(statsPromises);
        
        // Create the data array
        const stats: MeasurementStat[] = formattedDates.map(({ name, date }, index) => ({
          name,
          windows: counts[index],
          date
        }));
        
        setMeasurementData(stats.reverse());
      } catch (error) {
        console.error('Error fetching measurement stats:', error);
        // Fallback empty data
        setMeasurementData([]);
      }
    };
    
    const fetchScheduleData = async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('id, name, deadline, status')
          .order('deadline', { ascending: true })
          .limit(3);
          
        if (error) throw error;
        
        if (data) {
          const schedule: ScheduleItem[] = data.map(project => {
            const deadline = project.deadline 
              ? new Date(project.deadline)
              : new Date();
              
            return {
              date: format(deadline, 'MMM d'),
              project: project.name || 'Unnamed Project',
              task: project.status === 'active' ? 'Implementation' : 'Planning',
              team: project.status === 'active' ? 'Team A' : 'Planning Team'
            };
          });
          
          setScheduleData(schedule);
        }
      } catch (error) {
        console.error('Error fetching schedule data:', error);
        setScheduleData([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMeasurementStats();
    fetchScheduleData();
  }, []);

  // Colors for the bars
  const getBarColor = (index: number) => {
    const colors = ['#4A90E2', '#9B87F5', '#10B981', '#F5A623', '#EA384C'];
    return colors[index % colors.length];
  };

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
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : scheduleData.length > 0 ? (
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
          ) : (
            <div className="flex justify-center items-center h-full text-zinc-400">
              No upcoming schedules found
            </div>
          )}
        </div>
      </WidgetCard>
    </div>
  );
};

export default ProjectWidgetsSection;
