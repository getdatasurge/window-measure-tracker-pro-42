
import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const MeasurementOverview: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'week' | 'month' | 'quarter'>('month');
  
  // Sample data for chart
  const weeklyData = [
    { name: 'Week 1', completed: 67, current: 0 },
    { name: 'Week 2', completed: 83, current: 0 },
    { name: 'Week 3', completed: 52, current: 0 },
    { name: 'Week 4', completed: 98, current: 0 },
    { name: 'Current', completed: 0, current: 72 }
  ];
  
  const monthlyData = [
    { name: 'Jan', completed: 45, current: 0 },
    { name: 'Feb', completed: 65, current: 0 },
    { name: 'Mar', completed: 40, current: 0 },
    { name: 'Apr', completed: 78, current: 0 },
    { name: 'May', completed: 55, current: 0 },
    { name: 'Current', completed: 0, current: 90 }
  ];
  
  const quarterlyData = [
    { name: 'Q1', completed: 150, current: 0 },
    { name: 'Q2', completed: 210, current: 0 },
    { name: 'Q3', completed: 180, current: 0 },
    { name: 'Current Q', completed: 0, current: 120 }
  ];
  
  const getActiveData = () => {
    switch (activeTab) {
      case 'week':
        return weeklyData;
      case 'month':
        return monthlyData;
      case 'quarter':
        return quarterlyData;
      default:
        return monthlyData;
    }
  };
  
  return (
    <div className="backdrop-blur-md bg-white/80 dark:bg-slate-800/60 border border-white/20 dark:border-slate-700/40 rounded-lg shadow-md p-5">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Measurement Overview</h2>
        <div className="flex bg-gray-100 dark:bg-gray-800/50 p-0.5 rounded-md">
          <button 
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
              activeTab === 'week' 
                ? 'bg-wintrack-dark-blue text-white shadow-sm' 
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/50'
            }`}
            onClick={() => setActiveTab('week')}
          >
            Week
          </button>
          <button 
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
              activeTab === 'month' 
                ? 'bg-wintrack-dark-blue text-white shadow-sm' 
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/50'
            }`}
            onClick={() => setActiveTab('month')}
          >
            Month
          </button>
          <button 
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
              activeTab === 'quarter' 
                ? 'bg-wintrack-dark-blue text-white shadow-sm' 
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/50'
            }`}
            onClick={() => setActiveTab('quarter')}
          >
            Quarter
          </button>
        </div>
      </div>
      
      {/* Responsive chart */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={getActiveData()}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} width={40} />
            <Tooltip />
            <Bar dataKey="completed" name="Completed Measurements" fill="#1A2233" radius={[4, 4, 0, 0]} />
            <Bar dataKey="current" name="Current Week" fill="#4CAF50" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex justify-center mt-4 space-x-6">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-wintrack-dark-blue rounded-full mr-2"></div>
          <span className="text-xs text-gray-600 dark:text-gray-400">Completed Measurements</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-wintrack-green rounded-full mr-2"></div>
          <span className="text-xs text-gray-600 dark:text-gray-400">Current Week</span>
        </div>
      </div>
    </div>
  );
};

export default MeasurementOverview;
