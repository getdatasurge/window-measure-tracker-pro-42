
import React from 'react';

interface Measurement {
  project: string;
  floor: string;
  window: string;
  facing: string;
  dimensions: string;
  addedTime: string;
}

const RecentMeasurements: React.FC = () => {
  const measurements: Measurement[] = [
    {
      project: 'Downtown Office Tower',
      floor: 'Floor 12',
      window: 'Window #A42',
      facing: 'South facing',
      dimensions: '72" x 48"',
      addedTime: 'Added 2 hours ago'
    },
    {
      project: 'Downtown Office Tower',
      floor: 'Floor 12',
      window: 'Window #A43',
      facing: 'South facing',
      dimensions: '72" x 48"',
      addedTime: 'Added 2 hours ago'
    },
    {
      project: 'Downtown Office Tower',
      floor: 'Floor 11',
      window: 'Window #A32',
      facing: 'South facing',
      dimensions: '72" x 48"',
      addedTime: 'Added 3 hours ago'
    },
    {
      project: 'Downtown Office Tower',
      floor: 'Floor 11',
      window: 'Window #A33',
      facing: 'South facing',
      dimensions: '72" x 48"',
      addedTime: 'Added 3 hours ago'
    },
    {
      project: 'Riverside Apartments',
      floor: 'Building A',
      window: 'Window #203',
      facing: 'East facing',
      dimensions: '36" x 60"',
      addedTime: 'Added yesterday'
    }
  ];

  return (
    <div className="bg-zinc-800 rounded-xl shadow-lg overflow-hidden">
      <div className="max-h-[500px] overflow-y-auto">
        {measurements.map((measurement, index) => (
          <div 
            key={index} 
            className={`p-4 ${index !== measurements.length - 1 ? 'border-b border-zinc-700/50' : ''}`}
          >
            <div className="flex justify-between items-start mb-1">
              <div>
                <h3 className="font-medium text-zinc-100">{measurement.project} - {measurement.floor}</h3>
                <p className="text-sm text-zinc-400">{measurement.window} - {measurement.facing}</p>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-lg font-semibold text-zinc-100">{measurement.dimensions}</span>
                <span className="text-xs text-zinc-500">{measurement.addedTime}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentMeasurements;
