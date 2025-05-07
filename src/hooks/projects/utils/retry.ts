
/**
 * Default configuration for retry operations
 */
export const RETRY_CONFIG = {
  ATTEMPTS: 3,
  BASE_DELAY: 1000,
}

/**
 * Helper function to implement retry logic with exponential backoff
 * @param operation Async function to retry
 * @param attempts Maximum number of retry attempts
 * @returns Result of the operation if successful
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  attempts: number = RETRY_CONFIG.ATTEMPTS
): Promise<T> {
  let lastError: Error | null = null;
  
  for (let i = 0; i < attempts; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.warn(`Attempt ${i + 1}/${attempts} failed:`, lastError.message);
      
      // Don't wait on the last attempt
      if (i < attempts - 1) {
        // Exponential backoff with jitter
        const delay = RETRY_CONFIG.BASE_DELAY * Math.pow(2, i) + Math.random() * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError || new Error('Operation failed after multiple attempts');
}
