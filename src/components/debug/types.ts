
/**
 * Shared types for debug components
 */

export interface WindowAction {
  id: string;
  type: string;
  label: string;
  timestamp: string;
  featureArea?: string;
  metadata?: Record<string, any>;
}
