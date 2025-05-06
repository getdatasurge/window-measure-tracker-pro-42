
# Project Structure

This project follows a clean, modular folder structure to ensure maintainability and scalability.

## Directory Structure

- **/components**: UI components organized by domain
  - **/ui**: Reusable UI components (buttons, inputs, etc.)
  - **/dashboard**: Dashboard-specific components
  - **/projects**: Project-specific components
  - **/measurements**: Measurement-specific components
  - **/forms**: Form components
  - **/activity**: Activity and logging-related components

- **/features**: Business logic organized by domain
  - **/projects**: Project-related business logic
  - **/auth**: Authentication logic
  - **/activity**: Activity tracking and prompt history logic
  - **/settings**: Settings management

- **/hooks**: Custom React hooks

- **/lib**: Utility libraries and client integrations
  - Supabase client
  - Helper functions

- **/pages**: Top-level page components

- **/types**: TypeScript type definitions

- **/utils**: Utility functions

- **/contexts**: React context providers

- **/services**: External service integrations

## Import Conventions

The project uses path aliases to simplify imports:

```typescript
// Import components
import { Button } from "@/components/ui";
import { ProjectTable } from "@/components/projects";

// Import features
import { useProjectData } from "@/features/projects";

// Import types
import { Project } from "@/types/project";
```

## Adding New Features

When adding a new feature:

1. Add business logic to `/features/{domain}`
2. Add UI components to `/components/{domain}`
3. Add types to `/types`
4. Export from appropriate index.ts files
