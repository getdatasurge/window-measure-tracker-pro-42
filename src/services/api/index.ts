
/**
 * API Integration Foundation
 * Provides type-safe interfaces and utilities for making API requests
 */

// Standard API response interface
export interface ApiResponse<T> {
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: any;
  };
  status: number;
}

// API request options
export interface RequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean | undefined>;
  timeout?: number;
  retries?: number;
  cache?: RequestCache;
}

/**
 * Handles API requests with error handling, retry logic, and type safety
 * @param url The API endpoint URL
 * @param method HTTP method
 * @param body Request body (for POST, PUT, PATCH)
 * @param options Additional request options
 * @returns Typed API response
 */
export async function apiRequest<T>(
  url: string,
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  body?: any,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const { headers = {}, params, timeout = 30000, retries = 3 } = options;

  // Add query parameters if provided
  if (params) {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, String(value));
      }
    });
    url = `${url}?${queryParams.toString()}`;
  }

  // Default headers
  const requestHeaders = {
    'Content-Type': 'application/json',
    ...headers,
  };

  // Request options
  const requestOptions: RequestInit = {
    method,
    headers: requestHeaders,
    credentials: 'include',
    cache: options.cache || 'default',
  };

  // Add body for non-GET requests
  if (body && method !== 'GET') {
    requestOptions.body = JSON.stringify(body);
  }

  // Setup AbortController for timeout
  const controller = new AbortController();
  requestOptions.signal = controller.signal;
  
  // Set timeout
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  // Implement retry logic with exponential backoff
  let attempt = 0;
  let response: Response | null = null;

  while (attempt < retries) {
    try {
      response = await fetch(url, requestOptions);
      break; // If successful, exit the loop
    } catch (err) {
      attempt++;
      
      // If this was the last attempt, or it's not a network error, throw
      if (attempt >= retries || !(err instanceof Error) || err.name !== 'TypeError') {
        clearTimeout(timeoutId);
        throw err;
      }
      
      // Exponential backoff
      const backoffTime = Math.pow(2, attempt) * 1000 + Math.random() * 1000;
      console.warn(`API request failed, retrying in ${backoffTime}ms (attempt ${attempt}/${retries})`);
      await new Promise(resolve => setTimeout(resolve, backoffTime));
    }
  }

  clearTimeout(timeoutId);

  // If all retries failed
  if (!response) {
    return {
      error: {
        message: 'Network request failed after multiple attempts',
        code: 'NETWORK_ERROR'
      },
      status: 0
    };
  }

  // Process response
  try {
    const isJson = response.headers.get('content-type')?.includes('application/json');
    const data = isJson ? await response.json() : await response.text();
    
    if (response.ok) {
      return {
        data: data as T,
        status: response.status
      };
    } else {
      return {
        error: {
          message: isJson && data?.message ? data.message : `Request failed with status ${response.status}`,
          code: isJson && data?.code ? data.code : String(response.status),
          details: data
        },
        status: response.status
      };
    }
  } catch (err) {
    return {
      error: {
        message: 'Failed to parse response',
        code: 'PARSE_ERROR',
        details: err instanceof Error ? err.message : String(err)
      },
      status: response.status
    };
  }
}

// Convenience methods
export const get = <T>(url: string, options?: RequestOptions): Promise<ApiResponse<T>> => {
  return apiRequest<T>(url, 'GET', undefined, options);
};

export const post = <T>(url: string, body?: any, options?: RequestOptions): Promise<ApiResponse<T>> => {
  return apiRequest<T>(url, 'POST', body, options);
};

export const put = <T>(url: string, body?: any, options?: RequestOptions): Promise<ApiResponse<T>> => {
  return apiRequest<T>(url, 'PUT', body, options);
};

export const patch = <T>(url: string, body?: any, options?: RequestOptions): Promise<ApiResponse<T>> => {
  return apiRequest<T>(url, 'PATCH', body, options);
};

export const del = <T>(url: string, options?: RequestOptions): Promise<ApiResponse<T>> => {
  return apiRequest<T>(url, 'DELETE', undefined, options);
};
