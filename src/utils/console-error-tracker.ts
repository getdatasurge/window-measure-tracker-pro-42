
import { toast } from "react-toastify";

interface ErrorLogEntry {
  timestamp: number;
  message: string;
}

/**
 * Utility to track repeated console errors and warnings, and alert users
 * when a threshold is exceeded, indicating potential infinite loops or recurring issues.
 */
export const setupConsoleErrorTracker = (options = {
  timeWindow: 30000, // 30 seconds
  maxErrors: 15,     // Maximum allowed errors in time window
  showOnce: true,    // Show toast only once per session
}) => {
  if (typeof window === 'undefined') return () => {}; // Skip for SSR

  const errorLogs: ErrorLogEntry[] = [];
  let hasShownToast = false;

  // Save original console methods
  const originalWarn = console.warn;
  const originalError = console.error;

  const checkErrorThreshold = (message: string) => {
    const now = Date.now();
    
    // Add new error to log
    errorLogs.push({
      timestamp: now,
      message
    });

    // Remove old entries outside the time window
    const timeThreshold = now - options.timeWindow;
    while (errorLogs.length > 0 && errorLogs[0].timestamp < timeThreshold) {
      errorLogs.shift();
    }

    // Check if threshold is exceeded
    if (errorLogs.length >= options.maxErrors && !hasShownToast) {
      // Group errors by message to identify the most common ones
      const errorCounts: Record<string, number> = {};
      errorLogs.forEach(entry => {
        const shortMessage = entry.message.substring(0, 100); // Truncate long messages
        errorCounts[shortMessage] = (errorCounts[shortMessage] || 0) + 1;
      });

      // Find the most frequent error
      let mostFrequentError = '';
      let maxCount = 0;
      Object.entries(errorCounts).forEach(([message, count]) => {
        if (count > maxCount) {
          mostFrequentError = message;
          maxCount = count;
        }
      });

      // Show toast notification
      toast.error(
        <div>
          <div className="font-semibold">Repeated errors detected</div>
          <p className="text-sm">This action is failing repeatedly. Please refresh the page or contact support.</p>
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-2 text-xs opacity-75 break-all">
              Most common: {mostFrequentError}
            </div>
          )}
        </div>,
        { 
          autoClose: 10000, // Stay visible longer
          toastId: 'repeated-errors' // Prevent duplicate toasts
        }
      );
      
      // Log additional details to console for developers
      if (process.env.NODE_ENV === 'development') {
        originalError(
          '%c Error loop detected!', 
          'background: #f44336; color: white; padding: 2px 4px; border-radius: 2px;',
          `\n${errorLogs.length} errors detected in ${options.timeWindow/1000}s window`,
          '\nMost frequent errors:',
          Object.entries(errorCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
        );
      }

      if (options.showOnce) {
        hasShownToast = true;
      }
    }
  };

  // Override console methods
  console.warn = function(...args) {
    const message = args.map(arg => String(arg)).join(' ');
    checkErrorThreshold(message);
    originalWarn.apply(console, args);
  };

  console.error = function(...args) {
    const message = args.map(arg => String(arg)).join(' ');
    checkErrorThreshold(message);
    originalError.apply(console, args);
  };

  // Return cleanup function
  return () => {
    console.warn = originalWarn;
    console.error = originalError;
  };
};
