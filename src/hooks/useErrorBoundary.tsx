
import React, { useState, useCallback } from 'react';

/**
 * Hook for creating error boundary behavior at the component level
 * @returns Error state and handler utilities
 */
export function useErrorBoundary() {
  const [error, setError] = useState<Error | null>(null);
  const [errorInfo, setErrorInfo] = useState<React.ErrorInfo | null>(null);
  
  /**
   * Reset the error state to recover from errors
   */
  const resetError = useCallback(() => {
    setError(null);
    setErrorInfo(null);
  }, []);
  
  /**
   * Handle caught errors
   * @param error The error object
   * @param info React error info
   */
  const handleError = useCallback((error: Error, info?: React.ErrorInfo) => {
    console.error('Error caught by useErrorBoundary:', error);
    setError(error);
    if (info) {
      setErrorInfo(info);
      console.error('Component stack:', info.componentStack);
    }
  }, []);
  
  return {
    error,
    errorInfo,
    isError: error !== null,
    resetError,
    handleError
  };
}

/**
 * Hook for wrapping async operations with error boundary functionality
 * @param callback Async function to protect
 * @param onError Optional error callback for custom handling
 * @returns Tuple with wrapper function and error state
 */
export function useAsyncErrorBoundary<T extends (...args: any[]) => Promise<any>>(
  callback: T,
  onError?: (error: Error) => void
): [(...args: Parameters<T>) => Promise<ReturnType<T>>, Error | null, () => void] {
  const [error, setError] = useState<Error | null>(null);
  
  const resetError = useCallback(() => {
    setError(null);
  }, []);
  
  const wrappedCallback = useCallback(async (...args: Parameters<T>) => {
    try {
      return await callback(...args);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      if (onError) {
        onError(error);
      }
      throw error;
    }
  }, [callback, onError]);
  
  return [wrappedCallback, error, resetError];
}
