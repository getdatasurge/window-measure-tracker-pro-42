
/**
 * Error logging utility for structured error logging
 */

export interface ErrorLogEntry {
  error: Error;
  context?: Record<string, any>;
  componentStack?: string;
  level?: 'component' | 'feature' | 'app';
  user?: {
    id?: string;
    role?: string;
  };
  source?: 'client' | 'api' | 'state' | 'render';
  metadata?: Record<string, any>;
}

/**
 * Logs errors with structured metadata
 * @param errorInfo Error information including context and metadata
 */
export function logError(errorInfo: ErrorLogEntry): void {
  // Build the structured error log
  const { error, context, componentStack, level, user, source, metadata } = errorInfo;

  const logEntry = {
    timestamp: new Date().toISOString(),
    errorMessage: error.message,
    errorName: error.name,
    errorStack: error.stack,
    componentStack,
    level: level || 'component',
    source: source || 'client',
    environment: process.env.NODE_ENV,
    url: typeof window !== 'undefined' ? window.location.href : undefined,
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
    // Include user info but remove sensitive data
    user: user ? {
      id: user.id,
      role: user.role
    } : undefined,
    // Include safe context data
    context: safelySerializeData(context),
    // Include any additional metadata
    metadata: safelySerializeData(metadata),
  };

  // Log to console during development
  if (process.env.NODE_ENV === 'development') {
    console.error('🚨 Application Error:', logEntry);
  }

  // In production, we would send this to an error monitoring service
  // But for now, we'll just log to console
  if (process.env.NODE_ENV === 'production') {
    // Simplified console error in production to avoid leaking sensitive data
    console.error(
      `Application Error: ${error.name} - ${error.message} [${level}]`
    );
    
    // Here we would integrate with an error reporting service
    // Example: Sentry, LogRocket, etc.
    // sendToErrorService(logEntry);
  }
}

/**
 * Safely serialize data for logging, removing potential circular references
 * and sensitive information
 */
function safelySerializeData(data: any): any {
  if (!data) return undefined;
  
  // List of keys that could contain sensitive information
  const sensitiveKeys = [
    'password', 'token', 'secret', 'credential', 'credit', 'card', 
    'ssn', 'auth', 'key', 'api_key', 'apikey', 'access_token',
    'refresh_token', 'private'
  ];

  try {
    // Deep clone to avoid modifying original data
    const clonedData = JSON.parse(JSON.stringify(data, (key, value) => {
      // Check if the key might contain sensitive data
      const lowerKey = key.toLowerCase();
      if (sensitiveKeys.some(sk => lowerKey.includes(sk))) {
        return '[REDACTED]';
      }
      return value;
    }));
    
    return clonedData;
  } catch (e) {
    // If serialization fails (e.g., circular references)
    return { serializationError: 'Failed to serialize data for logging' };
  }
}

/**
 * Creates a safe error handler for async functions
 * @param fn Async function to wrap
 * @param errorHandler Function to handle errors
 * @returns Wrapped function with error handling
 */
export function withErrorHandling<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  errorHandler?: (error: Error, ...args: Parameters<T>) => any
): (...funcArgs: Parameters<T>) => Promise<ReturnType<T> | undefined> {
  return async (...args: Parameters<T>): Promise<ReturnType<T> | undefined> => {
    try {
      return await fn(...args);
    } catch (error) {
      const typedError = error instanceof Error ? error : new Error(String(error));
      
      // Log the error
      logError({
        error: typedError,
        context: { functionName: fn.name, arguments: safelySerializeData(args) },
        source: 'client',
      });
      
      // Call custom error handler if provided
      if (errorHandler) {
        return errorHandler(typedError, ...args) as ReturnType<T>;
      }
      
      return undefined;
    }
  };
}

/**
 * Type-safe error handler for async API operations
 */
export function tryAsync<T>(
  promise: Promise<T>,
  options?: {
    context?: Record<string, any>;
    source?: 'api' | 'state';
    fallbackValue?: T;
  }
): Promise<[T | undefined, Error | null]> {
  return promise
    .then((data) => [data, null] as [T, null])
    .catch((error) => {
      const typedError = error instanceof Error ? error : new Error(String(error));
      
      logError({
        error: typedError,
        context: options?.context,
        source: options?.source || 'api',
      });
      
      return [options?.fallbackValue, typedError] as [undefined, Error];
    });
}
