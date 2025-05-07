
import React from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

type ErrorSeverity = 'low' | 'medium' | 'high';

interface ApiFallbackProps {
  message?: string;
  error?: Error | string;
  onRetry?: () => void;
  severity?: ErrorSeverity;
  isLoading?: boolean;
}

/**
 * Reusable fallback component for API errors with retry functionality
 */
export function ApiFallback({
  message = "We couldn't load this content",
  error,
  onRetry,
  severity = 'medium',
  isLoading = false
}: ApiFallbackProps) {
  // Determine styling based on severity
  const getSeverityStyles = () => {
    switch (severity) {
      case 'high':
        return {
          container: 'bg-red-50 border-red-300',
          text: 'text-red-800',
          subtext: 'text-red-600',
          button: 'bg-red-100 hover:bg-red-200 text-red-800'
        };
      case 'low':
        return {
          container: 'bg-gray-50 border-gray-300',
          text: 'text-gray-800',
          subtext: 'text-gray-600',
          button: 'bg-gray-100 hover:bg-gray-200 text-gray-800'
        };
      case 'medium':
      default:
        return {
          container: 'bg-amber-50 border-amber-300',
          text: 'text-amber-800',
          subtext: 'text-amber-600',
          button: 'bg-amber-100 hover:bg-amber-200 text-amber-800'
        };
    }
  };

  const styles = getSeverityStyles();

  return (
    <div className={`rounded-md border p-4 ${styles.container}`}>
      <div className="flex flex-col space-y-3">
        <div className="flex flex-col space-y-1">
          <h3 className={`text-sm font-medium ${styles.text}`}>{message}</h3>
          {error && (
            <p className={`text-xs ${styles.subtext}`}>
              {typeof error === 'string' ? error : error.message}
            </p>
          )}
        </div>
        
        {onRetry && (
          <Button
            size="sm"
            variant="outline"
            className={`flex items-center justify-center ${styles.button} w-full sm:w-auto`}
            onClick={onRetry}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <RefreshCw className="mr-2 h-3 w-3 animate-spin" />
                <span>Loading...</span>
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-3 w-3" />
                <span>Try again</span>
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}

/**
 * Specialized message for when no data is available
 */
export function NoDataFallback({
  message = "No data available",
  description,
  actionLabel,
  onAction
}: {
  message?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="rounded-md border border-gray-200 p-6 flex flex-col items-center justify-center text-center">
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-900">{message}</h3>
        {description && (
          <p className="text-xs text-gray-500">{description}</p>
        )}
      </div>
      
      {onAction && actionLabel && (
        <Button
          size="sm"
          variant="outline"
          className="mt-4"
          onClick={onAction}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
