
/**
 * Activity tracking types
 */

export type ActivityType = 
  | 'project_created'
  | 'project_updated'
  | 'project_deleted'
  | 'measurement_created'
  | 'measurement_updated'
  | 'measurement_deleted'
  | 'user_login'
  | 'user_logout'
  | 'report_generated'
  | 'settings_changed'
  | 'view_page'
  | 'search'
  | 'filter_applied'
  | 'export_data'
  | 'import_data';

export interface Activity {
  id: string;
  type: ActivityType;
  timestamp: string;
  userId: string;
  userName?: string;
  details: Record<string, any>;
  entityId?: string;
  entityType?: 'project' | 'measurement' | 'user' | 'report';
}

export interface ActivityLogOptions {
  userId?: string;
  userName?: string;
  silent?: boolean;  // If true, don't show toasts or other notifications
}
