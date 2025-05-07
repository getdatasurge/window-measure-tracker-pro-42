
# Knowledge Build Document

This document serves as an auto-maintained knowledge base for our project, tracking architectural decisions, integrations, and changes over time.

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **UI Components**: ShadCN UI
- **State Management**: React Context API, React Query
- **Database**: Supabase PostgreSQL
- **Real-time**: Supabase Realtime
- **Error Handling**: Multi-level error boundaries, structured error logging
- **API Integration**: Type-safe request utilities with retry logic

## API Integrations

- **Supabase** - Database, authentication, and real-time subscriptions
  - Endpoints: Projects, Measurements
  - Authentication: JWT tokens
  - Real-time subscriptions for data updates

## Functions & Utilities

- **useMeasurementSubscription**: Hook for subscribing to real-time measurement updates
  - Fallback to polling when real-time is unavailable
  - Automatic reconnection logic
  - Error state management
- **useProjectList**: Hook for fetching projects
- **formatMeasurement**: Utility for consistent measurement formatting
- **apiRequest**: Core utility for API requests with retry logic and type safety
- **ErrorBoundary**: Hierarchical error boundary component with custom fallbacks
- **withErrorBoundary**: HOC for wrapping components with error boundaries
- **logError**: Structured error logging with sensitive data protection
- **tryAsync**: Type-safe async error handling utility
- **withErrorHandling**: Function wrapper for automatic error handling

## Deployment & Environment

- **Environment Variables**:
  - SUPABASE_URL
  - SUPABASE_ANON_KEY
  - SUPABASE_SERVICE_ROLE_KEY
  - SUPABASE_DB_URL

## Plugins & Tools

- **React Toastify**: Toast notifications
- **Lucide React**: Icon library
- **TanStack Query**: Data fetching and caching

## Deprecated

*No deprecated features yet*

## History

### 2025-05-07
- Fixed circular dependency issue in project type definitions
- Improved error handling in real-time subscriptions
- Added fallback polling mechanism for real-time connection failures
- Standardized measurement data format with proper type conversions

### 2025-05-08
- Added structured API request foundation with retry logic
- Implemented hierarchical error boundary system
- Created knowledge base auto-documentation system
- Added structured error logging with privacy protection

