
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { WindowAction } from '@/lib/parseWindowActions';

interface ActionCardProps {
  action: WindowAction;
}

const ActionCard: React.FC<ActionCardProps> = ({ action }) => {
  // Get type-specific styling
  const getTypeStyles = () => {
    const typeMap: Record<string, { bgColor: string, textColor: string, borderColor: string }> = {
      "Navigation Actions": { 
        bgColor: "bg-blue-50", 
        textColor: "text-blue-800",
        borderColor: "border-blue-200" 
      },
      "Form Interactions": { 
        bgColor: "bg-purple-50", 
        textColor: "text-purple-800",
        borderColor: "border-purple-200"  
      },
      "System Events": { 
        bgColor: "bg-red-50", 
        textColor: "text-red-800",
        borderColor: "border-red-200"  
      },
      "unknown": { 
        bgColor: "bg-gray-50", 
        textColor: "text-gray-800",
        borderColor: "border-gray-200"  
      },
      "error": { 
        bgColor: "bg-amber-50", 
        textColor: "text-amber-800",
        borderColor: "border-amber-200"  
      }
    };
    
    return typeMap[action.type] || typeMap["unknown"];
  };
  
  const { bgColor, textColor, borderColor } = getTypeStyles();
  
  // Format metadata for display
  const renderMetadata = () => {
    if (!action.metadata || Object.keys(action.metadata).length === 0) {
      return null;
    }
    
    return (
      <div className="mt-2 text-xs">
        {Object.entries(action.metadata).map(([key, value]) => (
          <span key={key} className="inline-block mr-2 mb-1 px-2 py-0.5 rounded bg-gray-100">
            <span className="font-medium">{key}:</span> {JSON.stringify(value)}
          </span>
        ))}
      </div>
    );
  };
  
  return (
    <Card className={`mb-3 border ${borderColor} ${bgColor} hover:shadow-md transition-shadow duration-200`}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <h3 className={`font-medium ${textColor} flex-grow`}>
            {action.label || 'Unnamed Action'}
          </h3>
          
          {action.type !== 'unknown' && action.type !== 'error' && (
            <span className={`text-xs px-2 py-0.5 rounded-full ${bgColor} ${textColor} border ${borderColor}`}>
              {action.type}
            </span>
          )}
        </div>
        
        {action.timestamp && action.timestamp !== 'Unknown' && (
          <div className="text-xs text-gray-500 mt-1">
            {action.timestamp}
          </div>
        )}
        
        {renderMetadata()}
      </CardContent>
    </Card>
  );
};

export default ActionCard;
