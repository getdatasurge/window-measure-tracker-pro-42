
import React from 'react';
import ActionCard from './ActionCard';
import { FileText, Calendar, BarChart2, PenLine } from 'lucide-react';

interface DashboardActionsSectionProps {
  onActionClick: (action: string) => void;
}

const DashboardActionsSection: React.FC<DashboardActionsSectionProps> = ({
  onActionClick
}) => {
  return (
    <div className="pt-6">
      <h2 className="text-lg font-semibold mb-4">Upcoming Projects</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="backdrop-blur-md bg-white/80 dark:bg-slate-800/60 border border-white/20 dark:border-slate-700/40 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center mb-3">
            <div className="p-2 rounded-md bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">🏢</div>
            <div className="ml-3">
              <div className="font-semibold">Riverfront Tower</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Commercial • 42 windows</div>
            </div>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">Starts: Jun 25, 2025</div>
          <div className="flex justify-end">
            <button className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
              View Details
            </button>
          </div>
        </div>

        <div className="backdrop-blur-md bg-white/80 dark:bg-slate-800/60 border border-white/20 dark:border-slate-700/40 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center mb-3">
            <div className="p-2 rounded-md bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400">🏡</div>
            <div className="ml-3">
              <div className="font-semibold">Sunset Villas</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Residential • 28 windows</div>
            </div>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">Starts: Jul 08, 2025</div>
          <div className="flex justify-end">
            <button className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
              View Details
            </button>
          </div>
        </div>

        <div className="backdrop-blur-md bg-white/80 dark:bg-slate-800/60 border border-white/20 dark:border-slate-700/40 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center mb-3">
            <div className="p-2 rounded-md bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400">🏛️</div>
            <div className="ml-3">
              <div className="font-semibold">City Library</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Public • 56 windows</div>
            </div>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">Starts: Jul 15, 2025</div>
          <div className="flex justify-end">
            <button className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
              View Details
            </button>
          </div>
        </div>

        <div className="backdrop-blur-md bg-white/80 dark:bg-slate-800/60 border border-white/20 dark:border-slate-700/40 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center mb-3">
            <div className="p-2 rounded-md bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400">🏫</div>
            <div className="ml-3">
              <div className="font-semibold">Westside Academy</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Educational • 98 windows</div>
            </div>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">Starts: Aug 03, 2025</div>
          <div className="flex justify-end">
            <button className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
              View Details
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-4">
        <button className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center gap-1">
          View All Upcoming Projects
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </button>
      </div>
    </div>
  );
};

export default DashboardActionsSection;
