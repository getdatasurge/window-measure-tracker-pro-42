
/**
 * Activity tracking hooks
 */

import { useState, useEffect, useCallback } from 'react';
import { Activity, ActivityType } from './types';
import { getActivities, getActivitiesByType, getActivitiesByEntity, logActivity } from './api';

/**
 * Hook for accessing and logging activities
 */
export function useActivityTracking() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load activities on initial render
  useEffect(() => {
    setActivities(getActivities());
    setIsLoading(false);
  }, []);
  
  // Log a new activity
  const logNewActivity = useCallback((
    type: ActivityType,
    details: Record<string, any>,
    options = {}
  ) => {
    const newActivity = logActivity(type, details, options);
    setActivities(prevActivities => [newActivity, ...prevActivities]);
    return newActivity;
  }, []);
  
  // Get activities by type
  const getByType = useCallback((type: ActivityType) => {
    return getActivitiesByType(type);
  }, []);
  
  // Get activities by entity
  const getByEntity = useCallback((entityType: string, entityId: string) => {
    return getActivitiesByEntity(entityType, entityId);
  }, []);
  
  return {
    activities,
    isLoading,
    logActivity: logNewActivity,
    getByType,
    getByEntity
  };
}

/**
 * Hook for tracking page views
 */
export function usePageViewTracking() {
  const { logActivity } = useActivityTracking();
  
  useEffect(() => {
    // Log a page view when the component mounts
    const path = window.location.pathname;
    logActivity('view_page', {
      path,
      title: document.title,
      referrer: document.referrer
    });
  }, [logActivity]);
}
