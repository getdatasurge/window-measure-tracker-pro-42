
import { formatDistanceToNow } from 'date-fns';

/**
 * Format a date to a relative time string (e.g. "5 minutes ago")
 */
export const formatTimeAgo = (dateString: string) => {
  try {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  } catch (e) {
    return 'Unknown time';
  }
};
