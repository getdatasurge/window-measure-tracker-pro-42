
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useMeasurements } from '@/hooks/useMeasurements';

const RecentMeasurements: React.FC = () => {
  // Use our centralized hook to fetch measurements with real-time updates
  const { measurements, isLoading: loading } = useMeasurements({});
  
  // Take only the 5 most recent measurements
  const recentMeasurements = measurements.slice(0, 5);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-500/20 text-green-300';
      case 'in progress':
      case 'film_cut':
        return 'bg-blue-500/20 text-blue-300';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-300';
      case 'under_review':
        return 'bg-purple-500/20 text-purple-300';
      default:
        return 'bg-gray-500/20 text-gray-300';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (e) {
      return 'Unknown time';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (recentMeasurements.length === 0) {
    return (
      <div className="text-center text-zinc-500 p-4">
        No recent measurements found.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {recentMeasurements.map((measurement) => (
        <div key={measurement.id} className="border-b border-zinc-700/50 pb-3 last:border-0">
          <div className="flex justify-between items-start mb-1">
            <span className="text-white font-medium">{measurement.projectName}</span>
            <span className={`text-xs px-2 py-0.5 rounded ${getStatusColor(measurement.status)}`}>
              {measurement.status}
            </span>
          </div>
          <div className="text-zinc-300 text-sm">{measurement.location}</div>
          <div className="flex justify-between mt-1">
            <span className="text-zinc-400 text-xs">
              {measurement.width} × {measurement.height}
            </span>
            <span className="text-zinc-500 text-xs">{formatTimeAgo(measurement.updatedAt)}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentMeasurements;
