
import React, { useState } from 'react';

const MeasurementOverview: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');
  
  // Sample data for chart
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-5">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Measurement Overview</h2>
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
      
      {/* Simplified chart representation */}
      <div className="h-64 flex items-end justify-between">
        {months.map((month, index) => (
          <div key={month} className="flex flex-col items-center w-1/6">
            <div className="w-full flex justify-center space-x-2">
              <div 
                className="w-5 bg-gray-200 rounded-t"
                style={{ height: `${Math.random() * 100 + 30}px` }}
              ></div>
              <div 
                className="w-5 bg-green-500 rounded-t"
                style={{ height: `${Math.random() * 100 + 50}px` }}
              ></div>
            </div>
            <div className="mt-3 text-xs text-gray-600">{month}</div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-center mt-6 space-x-6">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-gray-200 rounded-full mr-2"></div>
          <span className="text-xs text-gray-600">Completed</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
          <span className="text-xs text-gray-600">Current Month</span>
        </div>
      </div>
    </div>
  );
};

export default MeasurementOverview;
