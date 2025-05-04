
import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LabelList
} from 'recharts';

interface ChartProps {
  title: string;
  subtitle?: string;
}

const weeklyData = [
  { name: 'Mon', scheduled: 32, completed: 25 },
  { name: 'Tue', scheduled: 45, completed: 35 },
  { name: 'Wed', scheduled: 28, completed: 22 },
  { name: 'Thu', scheduled: 51, completed: 42 },
  { name: 'Fri', scheduled: 38, completed: 30 },
  { name: 'Sat', scheduled: 25, completed: 20 },
  { name: 'Sun', scheduled: 18, completed: 15 },
];

const windowTypesData = [
  { name: 'Double Hung', value: 56 },
  { name: 'Casement', value: 42 },
  { name: 'Sliding', value: 36 },
  { name: 'Picture', value: 28 },
  { name: 'Bay', value: 21 },
];

const ChartPanel: React.FC<React.PropsWithChildren<ChartProps>> = ({ 
  title, subtitle, children 
}) => {
  return (
    <div className="bg-black/20 rounded-lg p-5">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-white">{title}</h3>
        {subtitle && <p className="text-xs text-zinc-400">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
};

const WeeklyInstallationChart: React.FC = () => {
  return (
    <ChartPanel title="Weekly Installation Tracking">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={weeklyData}
            margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#888', fontSize: 12 }}
            />
            <YAxis 
              hide={true}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#222', 
                border: '1px solid #444',
                borderRadius: '4px',
                color: '#fff'
              }}
            />
            <Bar dataKey="scheduled" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={16} />
            <Bar dataKey="completed" fill="#22c55e" radius={[4, 4, 0, 0]} barSize={16} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartPanel>
  );
};

const WindowTypesChart: React.FC = () => {
  return (
    <ChartPanel title="Window Types Distribution">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={windowTypesData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#333" />
            <XAxis 
              type="number" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#888', fontSize: 12 }}
            />
            <YAxis 
              dataKey="name" 
              type="category" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#888', fontSize: 12 }}
              width={80}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#222', 
                border: '1px solid #444',
                borderRadius: '4px',
                color: '#fff'
              }}
            />
            <Bar dataKey="value" fill="#9333ea" radius={[0, 4, 4, 0]} barSize={20}>
              <LabelList dataKey="value" position="right" fill="#fff" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartPanel>
  );
};

const ScheduleCharts: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      <WeeklyInstallationChart />
      <WindowTypesChart />
    </div>
  );
};

export default ScheduleCharts;
