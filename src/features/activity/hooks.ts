/**
 * React hooks for activity management
 */

import { useState, useCallback, useEffect } from 'react';
import { TeamActivity } from './types';
import { fetchActivities, fetchProjectActivities, addActivity } from './api';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';

/**
 * Hook for accessing the activity feed with offline support
 */
export function useActivityFeed(limit: number = 20) {
  const [activities, setActivities] = useState<TeamActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { isOnline, wasOffline } = useOnlineStatus();
  
  const loadActivities = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchActivities(limit);
      setActivities(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch activities'));
    } finally {
      setLoading(false);
    }
  }, [limit]);
  
  const logActivity = useCallback(async (
    action: string, 
    type: string,
    projectId?: string,
    projectName?: string,
    metadata?: Record<string, any>
  ) => {
    try {
      const newActivity = await addActivity(action, type, projectId, projectName, metadata);
      
      // Update the local state with the new activity (at the beginning)
      setActivities(prev => {
        const copy = [...prev];
        
        // Transform the new activity to TeamActivity format
        const transformed = {
          id: newActivity.id,
          user: { ...newActivity.user },
          action: newActivity.description || action,
          timestamp: newActivity.timestamp,
          timeAgo: 'just now',
          avatar: newActivity.user?.avatar,
          name: newActivity.user?.name,
          icon: type as "measurement" | "team" | "complete" | "issue" | "update",
          target: projectName,
          targetType: 'project' as const,
          metadata,
          project: projectId ? {
            id: projectId, 
            name: projectName || 'Unknown Project'
          } : undefined
        };
        
        // Add to the beginning (newest first)
        copy.unshift(transformed);
        
        // Keep only the specified limit
        return copy.slice(0, limit);
      });
      
      return newActivity;
    } catch (error) {
      console.error('Error logging activity:', error);
      throw error;
    }
  }, [limit]);
  
  // Load initial data
  useEffect(() => {
    loadActivities();
  }, [loadActivities]);
  
  // Refresh when coming back online
  useEffect(() => {
    if (isOnline && wasOffline) {
      loadActivities();
    }
  }, [isOnline, wasOffline, loadActivities]);
  
  return {
    activities,
    loading,
    error,
    refreshActivities: loadActivities,
    logActivity
  };
}

/**
 * Hook for accessing project-specific activities
 */
export function useProjectActivities(projectId: string, limit: number = 10) {
  const [activities, setActivities] = useState<TeamActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const loadActivities = useCallback(async () => {
    if (!projectId) {
      setActivities([]);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      const data = await fetchProjectActivities(projectId, limit);
      setActivities(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch project activities'));
    } finally {
      setLoading(false);
    }
  }, [projectId, limit]);
  
  // Load initial data
  useEffect(() => {
    loadActivities();
  }, [loadActivities]);
  
  return {
    activities,
    loading,
    error,
    refreshActivities: loadActivities
  };
}
