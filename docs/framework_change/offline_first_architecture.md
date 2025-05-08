
# Offline-First Architecture Implementation - May 8, 2025

## Overview

This document outlines the implementation of a new offline-first architecture for the Window Tracker application. This architecture enables the application to function seamlessly whether online or offline, with automatic synchronization when connectivity is restored.

## Core Components

### 1. Offline Storage (IndexedDB)

Located in `src/services/cache/offlineStore.ts`

- Uses IndexedDB for persistent local storage
- Provides a simple API for CRUD operations on application data
- Supports storing different entity types (projects, measurements, settings, activity)
- Handles versioning and database migrations

Key functions:
- `getEntity<T>`: Retrieve a single entity by ID
- `getAllEntities<T>`: Get all entities of a specific type
- `storeEntity<T>`: Store a new entity or update an existing one
- `updateEntity<T>`: Partial update of an entity
- `removeEntity`: Delete an entity
- `clearEntities`: Remove all entities of a specific type

### 2. Synchronization Queue

Located in `src/services/sync/syncQueue.ts`

- Manages operations that need to be synchronized with the backend
- Tracks operation status (pending, processing, completed, failed)
- Persists queue between sessions using IndexedDB
- Handles retry logic for failed operations

Key functions:
- `addToSyncQueue<T>`: Add a new operation to the queue
- `processSyncQueue`: Process all pending operations
- `getOperationsByStatus`: Get operations with a specific status
- `updateOperationStatus`: Update an operation's status
- `getSyncQueueStats`: Get queue statistics
- `clearCompletedOperations`: Clean up completed operations

### 3. Network Status Detection

Located in `src/services/network/networkStatus.ts`

- Provides reliable detection of online/offline status
- Goes beyond the basic `navigator.onLine` by performing active checks
- Allows components to subscribe to network status changes
- Includes network quality assessment

Key functions:
- `getOnlineStatus`: Get current online status
- `subscribeToNetworkStatus`: Subscribe to status changes
- `checkNetworkQuality`: Actively test network connectivity
- `initNetworkListeners`: Set up event listeners

## React Hooks Integration

### 1. useOnlineStatus

Located in `src/hooks/useOnlineStatus.ts`

- Provides reactive online/offline status for components
- Tracks "wasOffline" state for showing reconnection notifications
- Handles automatic refreshes when coming back online

```typescript
const { isOnline, wasOffline, resetWasOffline } = useOnlineStatus();
```

### 2. useOfflineCache

Located in `src/hooks/useOfflineCache.ts`

- Provides a React interface to the offline storage
- Handles loading states and error handling
- Type-safe get/set operations

```typescript
const { 
  getItem, getAllItems, setItem, updateItem, removeItem, 
  isLoading, error 
} = useOfflineCache<Project>('projects');
```

### 3. useSyncQueue

Located in `src/hooks/useSyncQueue.ts`

- Provides a React interface to the sync queue
- Automatically processes the queue when coming online
- Tracks processing state and errors

```typescript
const { 
  addOperation, processQueue, getQueueStats,
  clearCompleted, isProcessing, error 
} = useSyncQueue();
```

## Feature Implementation

### Projects Feature

- Offline-first API in `src/features/projects/api.ts`
- React hooks in `src/features/projects/hooks.ts`
- Uses local cache for fast loading even offline
- Adds operations to sync queue when offline
- Auto-syncs when coming back online

### Settings Feature

- Local-first storage in `src/features/settings/api.ts`
- Settings always available even offline
- Fallback to localStorage for backwards compatibility

### Activity Feature

- Activity tracking that works offline in `src/features/activity/api.ts`
- Activities can be logged offline and synced later
- Provides utilities for formatting and displaying activities

## Usage Examples

### Working Offline with Projects

```typescript
const { projects, addProject, editProject, removeProject, isOnline } = useProjects();

// UI can indicate online/offline status
<Badge color={isOnline ? 'green' : 'yellow'}>
  {isOnline ? 'Online' : 'Offline Mode'}
</Badge>

// Creating a project works even offline
const handleCreate = async () => {
  const newProject = await addProject({
    name: "New Project",
    client: "Client Name",
    status: "active"
  });
  
  // Will be stored locally and synced when online
  console.log("Created new project:", newProject);
};
```

### Logging Activities Offline

```typescript
const { logActivity } = useActivityFeed();

// Log activity even when offline
await logActivity(
  "Added measurement", 
  "measurement", 
  projectId, 
  projectName,
  { width: "36", height: "48", location: "Living Room" }
);
```

## Next Steps

1. Implement offline support for remaining features (measurements, teams, etc.)
2. Add conflict resolution strategies for sync operations
3. Create UI components to show sync status and network status
4. Add comprehensive error handling for edge cases
5. Implement data version tracking to prevent overwriting newer data
