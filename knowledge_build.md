
# Knowledge Build Document

This document serves as an auto-maintained knowledge base for our project, tracking architectural decisions, integrations, and changes over time.

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **UI Components**: ShadCN UI
- **State Management**: React Context API, React Query
- **Database**: Supabase PostgreSQL
- **Real-time**: Supabase Realtime

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

