
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { logError } from './errorLogger';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode | ((error: Error, resetError: () => void) => ReactNode);
  level?: 'component' | 'feature' | 'app';
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error boundary component that catches errors in its child component tree
 * Can be used at component, feature, or app level
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
    error: null
  };

  static defaultProps = {
    level: 'component',
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error
    logError({
      error,
      componentStack: errorInfo.componentStack,
      level: this.props.level || 'component',
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  resetError = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      // Render custom fallback
      if (this.props.fallback) {
        if (typeof this.props.fallback === 'function') {
          return this.props.fallback(this.state.error, this.resetError);
        }
        return this.props.fallback;
      }

      // Default fallback UI based on level
      switch (this.props.level) {
        case 'app':
          return (
            <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md flex flex-col items-center space-y-4 mt-10">
              <div className="text-center">
                <h2 className="text-xl font-medium text-red-600">Application Error</h2>
                <p className="text-gray-500 mt-2">
                  We're sorry, something went wrong with the application.
                </p>
                <button
                  onClick={this.resetError}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Reload Application
                </button>
              </div>
            </div>
          );
        case 'feature':
          return (
            <div className="p-4 border border-orange-300 bg-orange-50 rounded-md">
              <h3 className="text-lg font-medium text-orange-800">Feature Unavailable</h3>
              <p className="text-orange-700 mt-1">This feature is currently unavailable.</p>
              <button
                onClick={this.resetError}
                className="mt-2 text-sm text-orange-600 hover:text-orange-800"
              >
                Try Again
              </button>
            </div>
          );
        case 'component':
        default:
          return (
            <div className="p-3 border border-gray-300 bg-gray-50 rounded-md">
              <p className="text-gray-700 text-sm">Component could not be loaded.</p>
              <button
                onClick={this.resetError}
                className="mt-1 text-xs text-blue-600 hover:text-blue-800"
              >
                Reload
              </button>
            </div>
          );
      }
    }

    return this.props.children;
  }
}

/**
 * Higher order component that wraps a component in an error boundary
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  options: Omit<ErrorBoundaryProps, 'children'> = {}
): React.FC<P> {
  const WithErrorBoundary: React.FC<P> = (props) => {
    return (
      <ErrorBoundary {...options}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };

  WithErrorBoundary.displayName = `WithErrorBoundary(${
    Component.displayName || Component.name || 'Component'
  })`;

  return WithErrorBoundary;
}
