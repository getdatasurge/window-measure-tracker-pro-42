
import React from 'react';
import { FileText, UserPlus, CheckCircle, Calendar, AlertCircle } from 'lucide-react';

interface ActivityIconProps {
  iconType: "measurement" | "team" | "complete" | "issue" | "update" | string;
}

/**
 * Renders an appropriate icon for an activity type
 */
const ActivityIcon: React.FC<ActivityIconProps> = ({ iconType }) => {
  switch (iconType) {
    case 'measurement':
      return <div className="p-2 rounded-full bg-blue-900/30 text-blue-400"><FileText size={16} /></div>;
    case 'team':
      return <div className="p-2 rounded-full bg-purple-900/30 text-purple-400"><UserPlus size={16} /></div>;
    case 'complete':
      return <div className="p-2 rounded-full bg-green-900/30 text-green-400"><CheckCircle size={16} /></div>;
    case 'issue':
      return <div className="p-2 rounded-full bg-red-900/30 text-red-400"><AlertCircle size={16} /></div>;
    case 'update':
      return <div className="p-2 rounded-full bg-amber-900/30 text-amber-400"><Calendar size={16} /></div>;
    default:
      return <div className="p-2 rounded-full bg-gray-900/30 text-gray-400"><FileText size={16} /></div>;
  }
};

export default ActivityIcon;
