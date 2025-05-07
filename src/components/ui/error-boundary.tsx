
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { logError } from '@/utils/error-handling/errorLogger';
import { recordUtility } from '@/utils/knowledgeBase';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  level?: 'component' | 'feature' | 'app';
  name?: string;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary component that catches JavaScript errors in its child component tree.
 * Provides a hierarchical system for handling errors at different levels of the app.
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
    
    // Record this utility in the knowledge base
    recordUtility(
      'ErrorBoundary', 
      'React component that catches errors in its child component tree and displays a fallback UI',
      '<ErrorBoundary level="feature" name="Dashboard">\n  <DashboardContent />\n</ErrorBoundary>'
    );
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to our error tracking service
    logError(error, {
      component: this.props.name || 'Unknown',
      level: this.props.level || 'component',
      componentStack: errorInfo.componentStack
    });
    
    // Store errorInfo for display
    this.setState({
      errorInfo
    });
    
    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render(): ReactNode {
    const { hasError, error } = this.state;
    const { children, fallback, level = 'component' } = this.props;

    if (hasError) {
      // You can render a custom fallback UI
      if (fallback) {
        return fallback;
      }

      // Default error UI based on the boundary level
      switch (level) {
        case 'app':
          return (
            <div className="fixed inset-0 flex items-center justify-center bg-background p-6">
              <Card className="w-full max-w-md">
                <CardHeader className="bg-destructive/10 text-destructive">
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle /> Application Error
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="text-lg font-semibold">Something went wrong with the application</p>
                  <p className="mt-2 text-muted-foreground">
                    We're sorry for the inconvenience. The error has been reported to our team.
                  </p>
                  {error && <p className="mt-4 rounded bg-muted p-2 text-sm">{error.message}</p>}
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  <Button onClick={() => window.location.reload()}>
                    <RefreshCw className="mr-2 h-4 w-4" /> Reload Application
                  </Button>
                </CardFooter>
              </Card>
            </div>
          );

        case 'feature':
          return (
            <Card className="border-destructive/50 shadow-md">
              <CardHeader className="bg-destructive/10 text-destructive">
                <CardTitle className="text-base">Feature Error</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <p>This feature is currently unavailable. The issue has been reported.</p>
                {error && <p className="mt-2 rounded bg-muted p-2 text-xs">{error.message}</p>}
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button size="sm" variant="outline" onClick={this.handleReset}>
                  <RefreshCw className="mr-2 h-3 w-3" /> Try Again
                </Button>
              </CardFooter>
            </Card>
          );

        case 'component':
        default:
          return (
            <div className="rounded-md border border-destructive/50 p-4">
              <div className="flex items-center gap-2 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                <span>Component Error</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="mt-2"
                onClick={this.handleReset}
              >
                <RefreshCw className="mr-2 h-3 w-3" /> Retry
              </Button>
            </div>
          );
      }
    }

    return children;
  }
}

/**
 * Higher-order component that wraps a component with an ErrorBoundary
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  options?: Omit<ErrorBoundaryProps, 'children'>
): React.FC<P> {
  const displayName = Component.displayName || Component.name || 'Component';
  
  const WrappedComponent: React.FC<P> = (props) => (
    <ErrorBoundary 
      name={options?.name || displayName} 
      level={options?.level || 'component'} 
      fallback={options?.fallback}
      onError={options?.onError}
    >
      <Component {...props} />
    </ErrorBoundary>
  );
  
  WrappedComponent.displayName = `withErrorBoundary(${displayName})`;
  
  return WrappedComponent;
}

export default ErrorBoundary;
