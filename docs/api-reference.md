
# API Reference

This document outlines the external APIs integrated into our application, including endpoints, parameters, and response formats.

## Core API Utilities

Our application uses a standardized API request system that provides:

- Type-safe request and response handling
- Automatic retry with exponential backoff for transient errors
- Timeout handling
- Consistent error format

### Request Format

```typescript
interface RequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean | undefined>;
  timeout?: number;
  retries?: number;
  cache?: RequestCache;
}

// Example usage
const result = await apiRequest<UserData>(
  '/api/users/123',
  'GET',
  undefined,
  { 
    headers: { 'X-Custom-Header': 'value' },
    timeout: 5000
  }
);
```

### Response Format

All API responses follow this structure:

```typescript
interface ApiResponse<T> {
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: any;
  };
  status: number;
}
```

## Supabase Integration

### Endpoints

| Endpoint | Description | Parameters |
|----------|-------------|------------|
| `/projects` | Fetch all projects | `?is_active=true` (optional) |
| `/projects/:id` | Fetch a single project | - |
| `/measurements` | Fetch all measurements | Multiple filter options available |
| `/measurements/:id` | Fetch a single measurement | - |

### Authentication

Supabase uses JWT tokens for authentication that are managed through the Supabase client.

### Real-time Subscriptions

The following tables support real-time updates:

- `measurements`
- `projects`

## Error Codes

| Code | Description | Handling Strategy |
|------|-------------|------------------|
| `NETWORK_ERROR` | Connection issues | Auto-retry with exponential backoff |
| `UNAUTHORIZED` | Authentication expired | Redirect to login |
| `FORBIDDEN` | Permission denied | Show access denied message |
| `NOT_FOUND` | Resource not found | Show not found UI |
| `RATE_LIMITED` | Too many requests | Implement retry with increasing delay |
| `SERVER_ERROR` | Internal server error | Show generic error with retry option |
