
import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ServiceBlockProps {
  time: string;
  type: string;
  id: string;
  hasWarning?: boolean;
  color: string;
}

const ServiceBlock: React.FC<ServiceBlockProps> = ({ 
  time, 
  type, 
  id, 
  hasWarning = false,
  color
}) => {
  return (
    <div 
      className="p-3 mb-1 rounded text-white relative"
      style={{ backgroundColor: color }}
    >
      <div className="text-sm font-medium">{time}</div>
      <div className="text-sm">{type}</div>
      <div className="text-xs opacity-70">{id}</div>
      
      {hasWarning && (
        <div className="absolute top-2 right-2">
          <AlertTriangle size={16} className="text-amber-400" />
        </div>
      )}
    </div>
  );
};

export default ServiceBlock;
