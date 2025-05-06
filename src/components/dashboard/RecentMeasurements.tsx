
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';

interface Measurement {
  id: string;
  projectName: string;
  location: string;
  width: string;
  height: string;
  status: string;
  updatedAt: string;
}

const RecentMeasurements: React.FC = () => {
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentMeasurements = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('measurements')
          .select(`
            id,
            location,
            width,
            height,
            status,
            updated_at,
            project_id,
            projects (name)
          `)
          .order('updated_at', { ascending: false })
          .limit(5);

        if (error) throw error;

        if (data) {
          const formattedMeasurements: Measurement[] = data.map(item => ({
            id: item.id,
            projectName: item.projects?.name || 'Unknown Project',
            location: item.location || 'No location specified',
            width: item.width ? `${item.width}"` : 'N/A',
            height: item.height ? `${item.height}"` : 'N/A',
            status: item.status || 'pending',
            updatedAt: item.updated_at || new Date().toISOString()
          }));
          setMeasurements(formattedMeasurements);
        }
      } catch (err) {
        console.error('Error fetching recent measurements:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentMeasurements();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-500/20 text-green-300';
      case 'in progress':
      case 'film cut':
        return 'bg-blue-500/20 text-blue-300';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-300';
      case 'under review':
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

  if (measurements.length === 0) {
    return (
      <div className="text-center text-zinc-500 p-4">
        No recent measurements found.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {measurements.map((measurement) => (
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
