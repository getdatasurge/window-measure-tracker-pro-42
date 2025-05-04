
# Knowledge Base System Architecture

## 🏗️ System Architecture

This document details the technical architecture of our window actions tracking and knowledgebase system, explaining how data flows from raw markdown logs to interactive UI elements and AI context injection.

### 📥 Ingestion

The system begins with raw user action data stored in markdown format:

- **Source Files**:
  - Primary: `public/window-tracker-prd.md` - The main markdown file containing categorized user actions
  - Development: Local edits via markdown editor UI
  - Production: Pre-generated JSON from build process

- **Parsing Pipeline**:
  1. `parseWindowActions.ts` processes the markdown into structured `WindowAction` objects
  2. Actions are categorized by type, enriched with metadata, and assigned feature areas
  3. The parser handles malformed entries gracefully with error annotations

- **Update Mechanisms**:
  - **Development Mode**: `useLiveFileSync` hook watches for file changes and triggers UI updates
  - **Production Build**: `generate-actions-json.ts` CLI tool pre-processes the markdown into static JSON

```typescript
// Simplified example from parseWindowActions.ts
export function parseWindowActions(markdownContent: string): WindowAction[] {
  const actions: WindowAction[] = [];
  let currentType: string = "unknown";
  
  markdownContent.split('\n').forEach((line, index) => {
    // Parse headings as action types
    if (line.startsWith('#')) {
      currentType = line.replace(/^[#\s]+/, '').trim();
      return;
    }
    
    // Parse bullet points as actions
    if (line.startsWith('- ') || line.startsWith('* ')) {
      // Extract timestamp, label, metadata...
      actions.push({
        id: `action-${currentType}-${index}`,
        type: currentType,
        label: /* ... */,
        timestamp: /* ... */,
        metadata: /* ... */
      });
    }
  });
  
  return actions;
}
```

### 📊 Rendering

The action data is presented through a multi-layered UI system:

- **Core Components**:
  - `ActionPanel`: Container for displaying grouped actions
  - `ActionCard`: Individual action display with metadata
  - `ActionSearchPanel`: Search interface with semantic filtering

- **Data Flow**:
  1. Actions are fetched from markdown (dev) or JSON (prod)
  2. Actions are grouped by type using `groupActionsByType`
  3. UI components render these groups with expandable details

- **Search Capabilities**:
  - Text-based search using token-based similarity scoring
  - Feature area filtering
  - Action type filtering
  - Relevance scoring with highlighted matches

```typescript
// Example search capability from searchActions.ts
export function searchActions(
  actions: WindowAction[], 
  query: string, 
  options: SearchOptions = {}
): SearchResult[] {
  // Tokenize query
  const queryTokens = tokenize(query);
  
  // Calculate scores for each action
  return actions
    .filter(action => /* apply filters */)
    .map(action => ({
      action,
      matchScore: calculateCosineSimilarity(queryTokens, actionTokens),
      contextSnippet: generateContextSnippet(action, queryTokens)
    }))
    .filter(result => result.matchScore >= options.minScore)
    .sort((a, b) => b.matchScore - a.matchScore);
}
```

### 🔄 Sync to Lovable

The system intelligently prepares knowledge for injection into AI conversations:

- **Context Generation**:
  - Actions are processed to extract relevant context based on conversation topic
  - Recent and relevant actions are prioritized
  - Feature areas help determine which actions to include

- **Feature Area Assignment**:
  - `assignFeatureArea.ts` analyzes action content to categorize by feature
  - This enables more targeted context injection

- **Context Injection**:
  - When users interact with Lovable, relevant actions are automatically included
  - The context is formatted for optimal AI comprehension
  - The system avoids overwhelming the AI with too much information

### 📓 Prompt & Response Logging

The system maintains a comprehensive log of AI interactions:

- **Logging Pipeline**:
  - `promptLogger.ts` middleware captures prompts and responses
  - Entries are written to `logs/prompt-response-log.md` and daily files
  - Each entry includes timestamp, prompt, response, and injected knowledge context

- **Log Format**:
  ```markdown
  ## 🧠 Prompt - 2023-05-01T14:30:00.000Z
  ```
  How do I navigate to settings?
  ```

  ### 🪄 Response
  ```
  You can navigate to settings by clicking the gear icon in the top-right corner of any page.
  ```

  ### 📚 Knowledge Context
  ```
  Navigation Actions: User opened settings menu [2023-05-01 14:33:22]
  ```
  ```

- **Viewing Interface**:
  - `PromptHistoryViewer.tsx` provides a searchable interface for logs
  - Available in dialog, sheet, or inline variants
  - Groups entries by date for easy navigation

### 🔍 Debugging

The system includes comprehensive debugging tools:

- **CLI Debug Tool**:
  - `debug-knowledgebase.ts` performs validation checks:
    1. Markdown parsing integrity
    2. JSON freshness compared to source
    3. Log file health and permissions
    4. Entry format validation

- **Debug UI**:
  - Available at `/__debug` route during development
  - Shows raw markdown alongside parsed JSON
  - Provides test interface for context injection
  - Displays real-time parsing results

- **Data Exploration**:
  - Tree and JSON views for examining parsed data
  - Simulated context injection for testing
  - Live file monitoring with automatic updates

### 🔐 Dev Safeguards

Multiple layers ensure knowledgebase integrity:

- **Pre-commit Validation**:
  - Husky pre-commit hook runs `debug:kb`
  - Prevents commits with malformed markdown
  - Ensures JSON is in sync with the source

- **CI Integration**:
  - GitHub Actions workflow runs on PRs and pushes to main
  - Validates entire knowledgebase integrity
  - Ensures no breaking changes reach production

- **Markdown Server**:
  - Provides safe interface for modifying markdown
  - Creates Git commits for each save
  - Tracks history of all changes

## System Interfaces

The system exposes several key interfaces:

1. **Data Display**: `/actions` route with the main action viewer
2. **Debug UI**: `/__debug` route with developer tools
3. **Markdown Server API**: 
   - `POST /save-markdown` - Update the markdown file
   - `GET /history` - Get commit history
   - `POST /log-prompt-response` - Log a prompt

## Production Deployment

For production deployment:

1. Generate the actions JSON:
   ```sh
   npm run generate-actions-json
   ```

2. Build the application:
   ```sh
   npm run build
   ```

3. Deploy to your hosting platform

The production version uses the pre-generated JSON for performance and reliability.
