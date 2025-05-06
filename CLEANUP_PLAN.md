
# Codebase Cleanup Plan

This document outlines files and components that can be safely removed or refactored as part of our code cleanup initiative.

## Phase 1: Deprecated and Redundant Files

The following files can be safely removed:

- [x] ~~`src/lib/appwrite.ts`~~ - Replaced by Supabase integration

## Phase 2: Auth Context Consolidation

The following files have been consolidated into `src/contexts/auth/AuthProvider.tsx`:

- [x] `src/contexts/auth/AuthContext.tsx`
- [x] `src/contexts/session-profile/SessionProfileContext.tsx` 
- [x] `src/contexts/user/UserContext.tsx`
- [x] `src/contexts/user/UserProvider.tsx`
- [x] `src/contexts/auth/useAuthProvider.ts`
- [x] `src/contexts/session-profile/useSessionProfileProvider.ts`

**Note:** Backward compatibility modules have been added to ensure existing code continues to work as we gradually migrate all imports:
- [x] `src/contexts/UserContext.tsx` - Added backward compatibility
- [x] `src/contexts/session-profile/index.ts` - Added backward compatibility

## Phase 3: Component and Helper Consolidation

- [x] Consolidated dashboard metric components
- [x] Consolidated activity feed implementations by removing duplicate `TeamActivity.tsx`

## Phase 4: Type Definitions Cleanup

- [x] Consolidated similar interfaces in central type files
- [x] Created dedicated type modules by domain (activity, user, etc.)
- [x] Moved prompt-history types to central activity.ts
- [x] Removed unused type definitions after project-wide analysis

## Phase 5: Legacy Imports Cleanup

- [x] Removed all remaining references to old contexts
- [x] Updated import statements project-wide
- [x] Removed unused files from the index exports

## Conclusion

All cleanup phases have been completed successfully. The codebase now has:

1. A consolidated authentication context system
2. Streamlined component organization
3. Centralized type definitions
4. Cleaner import statements
5. Improved code reusability

This cleanup has improved code maintainability and reduced redundancy throughout the project.
