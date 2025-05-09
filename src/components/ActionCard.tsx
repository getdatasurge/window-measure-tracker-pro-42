
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
      "UI Interactions": { 
        bgColor: "bg-green-50", 
        textColor: "text-green-800",
        borderColor: "border-green-200"  
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
      return (
        <div className="text-xs text-gray-400">
          No metadata available
        </div>
      );
    }
    
    return (
      <div className="mt-2 text-xs">
        {Object.entries(action.metadata).map(([key, value]) => (
          <Badge key={key} variant="outline" className="mr-2 mb-1">
            <span className="font-medium">{key}:</span> {JSON.stringify(value)}
          </Badge>
        ))}
      </div>
    );
  };
  
  return (
    <Card className={`mb-3 border ${borderColor} ${bgColor} hover:bg-gray-50 transition-all duration-200 hover:shadow-md`}>
      <CardContent className="p-4 space-y-1">
        <div className="flex justify-between items-start">
          <h3 className={`font-bold ${textColor}`}>
            {action.label || 'Unnamed Action'}
          </h3>
          
          {action.type !== 'unknown' && action.type !== 'error' && (
            <Badge variant="secondary" className={`${bgColor} ${textColor}`}>
              {action.type}
            </Badge>
          )}
        </div>
        
        {action.timestamp && action.timestamp !== 'Unknown' ? (
          <div className="text-sm text-gray-500">
            {action.timestamp}
          </div>
        ) : (
          <div className="text-sm text-gray-400">
            Unknown Time
          </div>
        )}
        
        {renderMetadata()}
      </CardContent>
    </Card>
  );
};

export default ActionCard;
