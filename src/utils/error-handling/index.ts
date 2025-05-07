
/**
 * Core error handling utilities for the application
 */

import { toast } from '@/components/ui/use-toast';
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
 * Safely logs errors to console with sensitive data protection
 * @param error The error object to log
 * @param context Additional context to include
 */
export function logError(
  error: Error | StructuredError | unknown,
  context: Record<string, any> = {}
): void {
  const timestamp = new Date().toISOString();
  
  // Create a safe copy of context that doesn't contain sensitive information
  const safeContext = { ...context };
  
  // Remove sensitive fields if they exist
  const sensitiveFields = ['password', 'token', 'apiKey', 'secret', 'authorization'];
  sensitiveFields.forEach(field => {
    if (field in safeContext) {
      safeContext[field] = '[REDACTED]';
    }
  });

  // Handle different error types
  if (error instanceof Error) {
    console.error({
      timestamp,
      message: error.message,
      name: error.name,
      stack: error.stack,
      context: safeContext
    });
  } else if (typeof error === 'object' && error !== null) {
    console.error({
      timestamp,
      error: JSON.parse(JSON.stringify(error)), // Clone to avoid console reference issues
      context: safeContext
    });
  } else {
    console.error({
      timestamp,
      error,
      context: safeContext
    });
  }
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
      logError(error, { functionName: fn.name, arguments: args });
      
      // Custom error handler if provided
      if (errorHandler && error instanceof Error) {
        errorHandler(error);
      } else {
        // Default error handling
        showErrorToast(error);
      }
      
      // Re-throw for caller to handle if needed
      throw error;
    }
  };
}
