
/**
 * Error logging utilities
 */

/**
 * Safely logs errors to console with sensitive data protection
 * @param error The error object to log
 * @param context Additional context to include
 */
export function logError(
  error: Error | unknown,
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
