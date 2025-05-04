
# 📓 Prompt Logging & Debugging Tools

This document explains the prompt logging system, debugging tools, and development safeguards implemented in our knowledgebase system.

## 📓 Prompt Logging

### Server Middleware

The `server/promptLogger.ts` middleware handles prompt/response logging:

- **Purpose**: Captures AI interactions to improve context quality
- **Storage**: Writes chronological entries to `logs/prompt-response-log.md` 
- **Format**: Structured markdown with timestamp, prompt, response, and context sections
- **API Endpoint**: `POST /log-prompt-response` accepts logging requests

```typescript
// Example log entry format
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

### Frontend Viewer Components

The `PromptHistoryViewer.tsx` component renders the logged history:

- **Multiple Views**: Available in dialog, sheet, or inline variants
- **Collapsible**: Accordion-style display for easy browsing
- **Date Grouping**: Organizes entries by date for better organization
- **Search**: Quickly find relevant prompt/response pairs

Integration is as simple as:

```tsx
// In your component
import PromptHistoryViewer from '@/components/prompt-history';

// Then use in various forms:
<PromptHistoryViewer variant="dialog" />
<PromptHistoryViewer variant="sheet" />
<PromptHistoryViewer variant="inline" maxHeight="500px" />
```

## 🔍 Debugging Tools

### CLI Validation Tool

The `scripts/debug-knowledgebase.ts` script provides comprehensive validation:

- **Markdown Verification**: Checks source files for syntax errors
- **JSON Freshness**: Ensures build artifacts are in sync with source
- **Log File Validation**: Verifies log formatting and permissions
- **CI Integration**: Runs in GitHub Actions for continuous validation

Run validation checks with:

```bash
# Development validation
yarn debug:kb

# CI-friendly validation (no colors, exit codes)
yarn kb:ci
```

### Debug Dashboard UI

The `src/pages/__debug.tsx` page provides a visual debugging interface:

- **Raw Markdown View**: See the source markdown content
- **Parsed JSON**: Examine the structured data after parsing
- **Tree View**: Navigate the action hierarchy interactively
- **Context Injection**: Test how actions feed into AI prompts
- **Log History**: Browse the complete prompt/response history

Access at: `http://localhost:3000/__debug` (dev mode only)

## 🔐 Development Safeguards

### Local Pre-commit Hooks

Husky pre-commit hooks protect against common issues:

- **Automatic Validation**: Runs `yarn debug:kb` before allowing commits
- **Error Prevention**: Blocks commits with malformed markdown
- **Sync Enforcement**: Ensures JSON is up-to-date with source files

Setup with:

```bash
node scripts/setup-husky.js
```

### CI/CD Integration

GitHub Actions workflow in `.github/workflows/knowledgebase-check.yml`:

- **Trigger**: Runs on PRs and pushes to main branch
- **Validation**: Executes full knowledgebase debug suite
- **Protection**: Prevents merging code with parsing or sync issues

## 📂 Directory Structure

```
/src/lib/parseWindowActions.ts        → Markdown parser  
/src/hooks/useLiveFileSync.ts         → Dev-only live sync  
/scripts/generate-actions-json.ts     → Build-time sync  
/scripts/debug-knowledgebase.ts       → Validation tooling
/server/promptLogger.ts               → Logs prompt/response  
/src/pages/__debug.tsx                → UI debug dashboard
/src/components/prompt-history/       → History viewer components
/logs/prompt-response-log.md          → AI interaction log file
```

## Integration

To leverage these tools in your workflow:

1. **During Development**: 
   - Use the debug dashboard (`/__debug`) to verify parsing
   - Review prompt history to improve AI interactions

2. **Before Committing**:
   - Run `yarn debug:kb` to check for issues
   - Fix any validation errors before pushing

3. **In Production**:
   - CI workflow will catch any issues automatically
   - Generated JSON will be used for optimal performance
