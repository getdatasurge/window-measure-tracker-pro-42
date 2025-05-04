import React, { useEffect, useState } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import ActionCard from './ActionCard';
import { WindowAction, groupActionsByType, parseWindowActions } from '@/lib/parseWindowActions';
import { useLiveFileSync } from '@/hooks/useLiveFileSync';

interface ActionPanelProps {
  filePath?: string;
  jsonPath?: string;
  maxHeight?: string | number;
  actions?: WindowAction[]; // New prop for direct actions input
}

const ActionPanel: React.FC<ActionPanelProps> = ({ 
  filePath = 'window-tracker-prd.md',
  jsonPath = '/data/window-actions.json',
  maxHeight = '70vh',
  actions: providedActions // Renamed to avoid collision
}) => {
  const [groupedActions, setGroupedActions] = useState<Record<string, WindowAction[]>>({});
  const isDev = process.env.NODE_ENV === 'development';
  
  // If actions are provided directly, use those
  // Otherwise, use live file sync in development or load from generated JSON
  const { actions, loading, error } = providedActions 
    ? { actions: providedActions, loading: false, error: null }
    : isDev && filePath 
      ? useLiveFileSync(filePath)
      : useStaticJson(jsonPath);
  
  // Group actions by type whenever actions change
  useEffect(() => {
    if (actions.length > 0) {
      setGroupedActions(groupActionsByType(actions));
    }
  }, [actions]);
  
  // Render loading state
  if (loading) {
    return (
      <div className="p-4 border rounded-lg bg-gray-50">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded-full bg-blue-500 animate-pulse"></div>
          <p className="text-gray-500">Loading actions...</p>
        </div>
      </div>
    );
  }
  
  // Render error state
  if (error) {
    return (
      <div className="p-4 border rounded-lg bg-red-50 text-red-700">
        <h3 className="font-medium">Error loading actions</h3>
        <p className="text-sm">{error}</p>
      </div>
    );
  }
  
  // Render empty state
  if (Object.keys(groupedActions).length === 0) {
    return (
      <div className="p-8 border rounded-lg bg-gray-50 text-center">
        <h3 className="text-lg font-medium text-gray-500">No actions found</h3>
        <p className="text-sm text-gray-400 mt-2">
          {isDev ? 'Create or modify the markdown file to see actions.' : 'No actions have been recorded yet.'}
        </p>
      </div>
    );
  }
  
  // Render action groups
  return (
    <div className="border rounded-lg bg-white shadow-sm">
      <div className="border-b p-4">
        <h2 className="text-lg font-medium">Action History</h2>
        <p className="text-sm text-gray-500">
          {actions.length} action{actions.length !== 1 ? 's' : ''} recorded
        </p>
      </div>
      
      <ScrollArea className="p-4" style={{ maxHeight }}>
        <div className="space-y-6">
          {Object.entries(groupedActions).map(([type, typeActions]) => (
            <div key={type} className="space-y-2">
              <h3 className="font-medium text-sm text-gray-500 uppercase tracking-wider">
                {type}
                <span className="ml-2 text-xs bg-gray-200 px-2 py-0.5 rounded-full">
                  {typeActions.length}
                </span>
              </h3>
              <div>
                {typeActions.map(action => (
                  <ActionCard key={action.id} action={action} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

// Hook for loading static JSON in production
function useStaticJson(jsonPath: string) {
  const [data, setData] = useState<{
    actions: WindowAction[];
    loading: boolean;
    error: string | null;
  }>({
    actions: [],
    loading: true,
    error: null
  });
  
  useEffect(() => {
    const loadJson = async () => {
      try {
        const response = await fetch(jsonPath);
        
        if (!response.ok) {
          throw new Error(`Failed to load JSON: ${response.status}`);
        }
        
        const actions = await response.json();
        setData({
          actions,
          loading: false,
          error: null
        });
      } catch (error) {
        console.error('Error loading actions JSON:', error);
        setData({
          actions: [],
          loading: false,
          error: `Failed to load actions: ${(error as Error).message}`
        });
      }
    };
    
    loadJson();
  }, [jsonPath]);
  
  return data;
}

export default ActionPanel;
