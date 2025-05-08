
/**
 * Activity API functions
 * 
 * Handles fetching and adding activity entries with offline support.
 */

import { v4 as uuidv4 } from 'uuid';
import { ActivityData, TeamActivity } from './types';
import * as offlineStore from '../../services/cache/offlineStore';
import * as syncQueue from '../../services/sync/syncQueue';
import { getOnlineStatus } from '../../services/network/networkStatus';
import { transformActivityData } from './utils';

// Sample activities for demo/offline mode
const SAMPLE_ACTIVITIES: ActivityData[] = [
  {
    id: 'act-1',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    type: 'update',
    user: {
      id: 'user-1',
      name: 'Jane Smith',
      avatar: '/lovable-uploads/f1ba8f91-019b-4932-9d0e-5414aef0ed47.png'
    },
    content: {
      title: 'Updated project status',
      description: 'Changed status to In Progress',
      project: {
        id: 'public-project-1',
        name: 'Residential Renovation'
      }
    }
  },
  {
    id: 'act-2',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    type: 'measurement',
    user: {
      id: 'user-2',
      name: 'Mike Johnson',
      avatar: '/lovable-uploads/f1ba8f91-019b-4932-9d0e-5414aef0ed47.png'
    },
    content: {
      title: 'Added new measurement',
      description: 'Living Room Window - 36" x 48"',
      project: {
        id: 'public-project-1',
        name: 'Residential Renovation'
      }
    }
  },
  {
    id: 'act-3',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    type: 'complete',
    user: {
      id: 'user-3',
      name: 'Sarah Adams',
      avatar: '/lovable-uploads/f1ba8f91-019b-4932-9d0e-5414aef0ed47.png'
    },
    content: {
      title: 'Completed installation',
      description: 'Finished installing windows on 2nd floor',
      project: {
        id: 'public-project-2',
        name: 'Office Building'
      }
    }
  }
];

/**
 * Fetch recent activities
 * Supports offline mode with local caching
 */
export async function fetchActivities(limit: number = 20): Promise<TeamActivity[]> {
  console.log(`Fetching ${limit} most recent activities`);
  
  try {
    // Check if we have cached activities
    const cachedActivities = await offlineStore.getAllEntities<ActivityData>('activity');
    
    let activities: ActivityData[];
    
    if (cachedActivities.length > 0) {
      console.log('Using cached activities:', cachedActivities.length);
      activities = cachedActivities;
    } else {
      // If no cached data, use sample activities
      console.log('Using sample activities');
      activities = SAMPLE_ACTIVITIES;
      
      // Cache the sample activities
      for (const activity of activities) {
        await offlineStore.storeEntity('activity', activity.id, activity);
      }
    }
    
    // Sort by timestamp (newest first) and limit
    activities.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    
    // Limit the number of results
    const limitedActivities = activities.slice(0, limit);
    
    // Transform to TeamActivity format
    return transformActivityData(limitedActivities);
  } catch (error) {
    console.error('Error fetching activities:', error);
    
    // Fallback to sample activities in case of error
    return transformActivityData(SAMPLE_ACTIVITIES);
  }
}

/**
 * Add a new activity
 * Works offline by storing locally and syncing later
 */
export async function addActivity(
  action: string,
  type: string,
  projectId?: string,
  projectName?: string,
  metadata?: Record<string, any>
): Promise<ActivityData> {
  const isOnline = getOnlineStatus();
  console.log(`Adding activity (${isOnline ? 'online' : 'offline'} mode):`, { action, type, projectId });
  
  try {
    const timestamp = new Date().toISOString();
    
    const newActivity: ActivityData = {
      id: `activity-${uuidv4()}`,
      timestamp,
      performed_at: timestamp,
      type,
      action_type: type,
      description: action,
      performed_by: 'demo-user',
      project_id: projectId,
      metadata,
      user: {
        id: 'demo-user',
        name: 'Demo User',
        avatar: '/lovable-uploads/f1ba8f91-019b-4932-9d0e-5414aef0ed47.png'
      },
      content: {
        title: type.charAt(0).toUpperCase() + type.slice(1),
        description: action,
        project: projectId ? {
          id: projectId,
          name: projectName || 'Unknown Project'
        } : undefined
      }
    };
    
    // Store locally
    await offlineStore.storeEntity('activity', newActivity.id, newActivity);
    
    // Add to sync queue if we're offline
    if (!isOnline) {
      await syncQueue.addToSyncQueue('activity', 'create', newActivity.id, newActivity);
      console.log('Added activity to sync queue');
    } else {
      // In a real app, would send to server here
      console.log('Activity recorded (simulated server response)');
    }
    
    return newActivity;
  } catch (error) {
    console.error('Error adding activity:', error);
    throw error;
  }
}

/**
 * Fetch project-specific activities
 */
export async function fetchProjectActivities(projectId: string, limit: number = 10): Promise<TeamActivity[]> {
  console.log(`Fetching activities for project ${projectId}`);
  
  try {
    // Get all activities
    const allActivities = await offlineStore.getAllEntities<ActivityData>('activity');
    
    // Filter by project ID
    const projectActivities = allActivities.filter(activity => 
      activity.project_id === projectId || 
      activity.content?.project?.id === projectId
    );
    
    // Sort by timestamp (newest first) and limit
    projectActivities.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    
    // Limit the number of results
    const limitedActivities = projectActivities.slice(0, limit);
    
    // Transform to TeamActivity format
    return transformActivityData(limitedActivities);
  } catch (error) {
    console.error(`Error fetching activities for project ${projectId}:`, error);
    
    // Return empty array in case of error
    return [];
  }
}
