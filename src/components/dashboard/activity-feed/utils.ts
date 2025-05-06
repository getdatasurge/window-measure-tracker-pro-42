import { ActivityData, TeamActivity } from "./types";
import { format, formatDistanceToNow } from 'date-fns';
import { Json } from '@/integrations/supabase/types';

/**
 * Maps an action type to an icon type
 */
export const mapActionTypeToIcon = (actionType: string): "measurement" | "team" | "complete" | "issue" | "update" => {
  switch (actionType?.toLowerCase()) {
    case 'add':
    case 'create':
    case 'measurement':
      return 'measurement';
    case 'assign':
    case 'team':
      return 'team';
    case 'complete':
    case 'finish':
      return 'complete';
    case 'error':
    case 'issue':
      return 'issue';
    case 'update':
    case 'change':
    case 'modify':
      return 'update';
    default:
      return 'update';
  }
};

/**
 * Format the timestamp in a user-friendly way
 */
export const formatTimeDistance = (timestamp: string): string => {
  try {
    const date = new Date(timestamp);
    // If less than 24 hours ago, show relative time, otherwise show the date
    const now = new Date();
    const diffHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    return diffHours < 24
      ? formatDistanceToNow(date, { addSuffix: true })
      : format(date, 'MMM d, yyyy');
  } catch (e) {
    console.error('Error formatting date:', e);
    return 'Unknown time';
  }
};

/**
 * Process metadata from activity data
 */
export const processMetadata = (
  rawMetadata: Json | null | undefined
): { 
  metadata: Record<string, any> | null; 
  targetType: 'project' | 'team' | 'measurement' 
} => {
  let metadata: Record<string, any> | null = null;
  let targetType: 'project' | 'team' | 'measurement' = 'project';
  
  if (rawMetadata) {
    // If metadata is a string, try to parse it
    if (typeof rawMetadata === 'string') {
      try {
        metadata = JSON.parse(rawMetadata);
        targetType = metadata?.target_type as any || 'project';
      } catch (e) {
        console.error('Failed to parse metadata string:', e);
        metadata = null;
      }
    } 
    // If it's an object (or array), we can use it directly
    else if (typeof rawMetadata === 'object') {
      // Convert the Json type to Record<string, any>
      metadata = rawMetadata as Record<string, any>;
      targetType = (metadata?.target_type as any) || 'project';
    }
    // If it's a primitive value like number or boolean, we can't use it as metadata
    else {
      console.warn('Metadata is not an object or string, ignoring:', rawMetadata);
      metadata = null;
    }
  }
  
  return { metadata, targetType };
};

/**
 * Transform raw activity data to TeamActivity format
 */
export const transformActivityData = (data: ActivityData[]): TeamActivity[] => {
  return data.map(item => {
    // Safely access potentially null properties
    const profileName = item.profiles?.full_name || 'Unknown User';
    const avatarUrl = item.profiles?.avatar_url || `/lovable-uploads/f1ba8f91-019b-4932-9d0e-5414aef0ed47.png`;
    const projectName = item.projects?.name || 'Unknown Project';
    const actionType = item.action_type || 'update';
    const description = item.description || 'performed an action';
    
    // Process metadata
    const { metadata, targetType } = processMetadata(item.metadata);

    return {
      id: item.id,
      avatar: avatarUrl,
      name: profileName,
      action: description,
      target: projectName,
      targetType,
      timeAgo: formatTimeDistance(item.performed_at),
      icon: mapActionTypeToIcon(actionType),
      metadata
    };
  });
};
