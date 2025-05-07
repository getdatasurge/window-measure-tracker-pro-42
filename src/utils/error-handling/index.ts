
/**
 * Core error handling utilities for the application
 */

import { toast } from '@/components/ui/use-toast';

// Export the logger function directly from the module
export { logError } from './errorLogger';
export * from './errorBoundary';

// Define standard error types for consistent handling
export type ApiErrorType = 
  | 'NETWORK_ERROR' 
  | 'TIMEOUT_ERROR'
  | 'VALIDATION_ERROR'
  | 'AUTHENTICATION_ERROR'
  | 'AUTHORIZATION_ERROR'
  | 'NOT_FOUND_ERROR'
  | 'SERVER_ERROR'
  | 'UNKNOWN_ERROR';

// Structured error object
export interface StructuredError {
  message: string;
  type: ApiErrorType;
  code?: string;
  details?: any;
  context?: Record<string, any>;
  timestamp: string;
}

/**
 * Creates a formatted error object for consistent handling
 */
export function createStructuredError(
  message: string,
  type: ApiErrorType,
  options?: {
    code?: string;
    details?: any;
    context?: Record<string, any>;
  }
): StructuredError {
  return {
    message,
    type,
    code: options?.code,
    details: options?.details,
    context: options?.context,
    timestamp: new Date().toISOString()
  };
}

/**
 * Type-safe async error handler utility
 * @param promise The promise to handle
 * @returns A tuple with [data, error]
 */
export async function tryAsync<T>(
  promise: Promise<T>
): Promise<[T | null, Error | null]> {
  try {
    const data = await promise;
    return [data, null];
  } catch (error) {
    return [null, error instanceof Error ? error : new Error(String(error))];
  }
}

/**
 * Shows a user-friendly error toast based on error type
 * @param error The error object
 * @param fallbackMessage Optional fallback message
 */
export function showErrorToast(
  error: Error | StructuredError | unknown,
  fallbackMessage = "Something went wrong. Please try again."
): void {
  let message = fallbackMessage;
  
  if (error instanceof Error) {
    // Use error message but make sure it's user-friendly
    message = error.message.includes('TypeError') ? 
      "We're having trouble connecting to our servers." : 
      error.message;
  } else if (
    typeof error === 'object' && 
    error !== null && 
    'message' in error && 
    typeof error.message === 'string'
  ) {
    message = error.message;
  }
  
  // Show the toast
  toast({
    title: "Error",
    description: message,
    variant: "destructive",
  });
}

/**
 * Higher-order function that wraps another function with error handling
 * @param fn The function to wrap with error handling
 * @returns The wrapped function
 */
export function withErrorHandling<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  errorHandler?: (error: Error) => void
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  return async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    try {
      return await fn(...args);
    } catch (error) {
      // Log the error
      const errorObj = error instanceof Error ? error : new Error(String(error));
      console.error(`Error in ${fn.name || 'anonymous function'}:`, errorObj);
      
      // Custom error handler if provided
      if (errorHandler) {
        errorHandler(errorObj);
      } else {
        // Default error handling
        showErrorToast(errorObj);
      }
      
      // Re-throw for caller to handle if needed
      throw errorObj;
    }
  };
}
