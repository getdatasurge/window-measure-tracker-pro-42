
/**
 * Activity API functions
 * 
 * These functions handle activity logging operations.
 * In public mode, activities are only stored locally.
 */

import { v4 as uuidv4 } from 'uuid';
import { Activity, ActivityType, ActivityLogOptions } from './types';

// Storage key for local activities
const ACTIVITIES_STORAGE_KEY = 'wintracker_local_activities';

/**
 * Log a new activity
 * In public mode, stores the activity in localStorage
 */
export function logActivity(
  type: ActivityType,
  details: Record<string, any>,
  options: ActivityLogOptions = {}
): Activity {
  const { userId = 'public-user', userName = 'Public User', silent = false } = options;
  
  const activity: Activity = {
    id: uuidv4(),
    type,
    timestamp: new Date().toISOString(),
    userId,
    userName,
    details,
    entityId: details.entityId,
    entityType: details.entityType,
  };
  
  // In a real app, this would be sent to a server
  // In public mode, we just store it locally
  try {
    const storedActivities = getStoredActivities();
    storeActivities([activity, ...storedActivities].slice(0, 100)); // Keep only the 100 most recent
  } catch (err) {
    console.error('Error storing activity:', err);
  }
  
  if (!silent) {
    console.log('Activity logged:', activity);
  }
  
  return activity;
}

/**
 * Get all stored activities
 */
export function getActivities(): Activity[] {
  return getStoredActivities();
}

/**
 * Get activities filtered by type
 */
export function getActivitiesByType(type: ActivityType): Activity[] {
  const activities = getStoredActivities();
  return activities.filter(activity => activity.type === type);
}

/**
 * Get activities related to a specific entity
 */
export function getActivitiesByEntity(
  entityType: string,
  entityId: string
): Activity[] {
  const activities = getStoredActivities();
  return activities.filter(
    activity => activity.entityType === entityType && activity.entityId === entityId
  );
}

/**
 * Clear all stored activities
 */
export function clearActivities(): void {
  try {
    localStorage.removeItem(ACTIVITIES_STORAGE_KEY);
  } catch (err) {
    console.error('Error clearing activities:', err);
  }
}

// Helper function to get stored activities from localStorage
function getStoredActivities(): Activity[] {
  try {
    const storedData = localStorage.getItem(ACTIVITIES_STORAGE_KEY);
    if (storedData) {
      return JSON.parse(storedData) as Activity[];
    }
  } catch (err) {
    console.error('Error retrieving stored activities:', err);
  }
  
  return [];
}

// Helper function to store activities in localStorage
function storeActivities(activities: Activity[]): void {
  try {
    localStorage.setItem(ACTIVITIES_STORAGE_KEY, JSON.stringify(activities));
  } catch (err) {
    console.error('Error storing activities:', err);
  }
}
