
import React, { useState } from 'react';
import { AlertOctagon, RefreshCw, WifiOff, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { recordUtility } from '@/utils/knowledgeBase';

interface ApiFallbackProps {
  error: Error | null;
  onRetry?: () => Promise<void> | void;
  className?: string;
  children?: React.ReactNode;
  title?: string;
  description?: string;
  variant?: 'default' | 'inline' | 'minimal' | 'full';
}

/**
 * A component for displaying meaningful error states for API failures
 * with appropriate retry mechanisms and user feedback
 */
export function ApiFallback({
  error,
  onRetry,
  className,
  children,
  title,
  description,
  variant = 'default'
}: ApiFallbackProps) {
  const [isRetrying, setIsRetrying] = useState(false);

  // Record this utility in the knowledge base
  recordUtility(
    'ApiFallback', 
    'UI component for displaying API error states with retry functionality',
    '<ApiFallback error={error} onRetry={refetch} />'
  );
  
  // If there's no error and no children, don't render anything
  if (!error && !children) {
    return null;
  }

  // If there's no error but there are children, render the children
  if (!error) {
    return <>{children}</>;
  }

  const handleRetry = async () => {
    if (!onRetry || isRetrying) return;
    
    setIsRetrying(true);
    try {
      await onRetry();
    } finally {
      setIsRetrying(false);
    }
  };

  // Determine the appropriate error icon and message
  let Icon = AlertOctagon;
  let errorTitle = title || 'Something went wrong';
  let errorMessage = description || error?.message || 'An error occurred while fetching data';

  if (error.message.includes('network') || error.message.includes('NetworkError')) {
    Icon = WifiOff;
    errorTitle = title || 'Network Error';
    errorMessage = description || 'Check your internet connection and try again';
  } else if (error.message.includes('timeout')) {
    Icon = Clock;
    errorTitle = title || 'Request Timeout';
    errorMessage = description || 'The server took too long to respond';
  }

  // Render different variants based on the prop
  switch (variant) {
    case 'inline':
      return (
        <div className={cn('flex items-center gap-2 text-sm text-destructive', className)}>
          <Icon className="h-4 w-4" />
          <span className="flex-1">{errorMessage}</span>
          {onRetry && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 py-1"
              onClick={handleRetry}
              disabled={isRetrying}
            >
              <RefreshCw className={cn('h-3 w-3', isRetrying && 'animate-spin')} />
              <span className="sr-only">Retry</span>
            </Button>
          )}
        </div>
      );

    case 'minimal':
      return (
        <div className={cn('rounded-md border border-destructive/20 bg-destructive/5 p-2', className)}>
          <div className="flex items-center gap-2 text-sm text-destructive">
            <Icon className="h-4 w-4" />
            <span className="flex-1">{errorMessage}</span>
            {onRetry && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 py-1"
                onClick={handleRetry}
                disabled={isRetrying}
              >
                <RefreshCw className={cn('mr-1 h-3 w-3', isRetrying && 'animate-spin')} />
                {isRetrying ? 'Retrying...' : 'Retry'}
              </Button>
            )}
          </div>
        </div>
      );

    case 'full':
      return (
        <div className={cn('flex h-full w-full flex-col items-center justify-center p-8 text-center', className)}>
          <div className="rounded-full bg-destructive/10 p-3">
            <Icon className="h-6 w-6 text-destructive" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">{errorTitle}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{errorMessage}</p>
          {onRetry && (
            <Button
              className="mt-4"
              variant="outline"
              onClick={handleRetry}
              disabled={isRetrying}
            >
              <RefreshCw className={cn('mr-2 h-4 w-4', isRetrying && 'animate-spin')} />
              {isRetrying ? 'Retrying...' : 'Try Again'}
            </Button>
          )}
        </div>
      );

    default:
      return (
        <div className={cn('rounded-md border border-destructive/30 p-4', className)}>
          <div className="flex items-start">
            <div className="mr-3 rounded-full bg-destructive/10 p-2">
              <Icon className="h-5 w-5 text-destructive" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-destructive">{errorTitle}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{errorMessage}</p>
              {onRetry && (
                <Button
                  className="mt-3"
                  size="sm"
                  variant="outline"
                  onClick={handleRetry}
                  disabled={isRetrying}
                >
                  <RefreshCw className={cn('mr-2 h-3 w-3', isRetrying && 'animate-spin')} />
                  {isRetrying ? 'Retrying...' : 'Try Again'}
                </Button>
              )}
            </div>
          </div>
        </div>
      );
  }
}

export default ApiFallback;
