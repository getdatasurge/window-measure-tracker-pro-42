
# 🧠 Dynamic Markdown Knowledgebase
![Visualization of the codebase](./diagram.svg)
This project transforms markdown logs of tracked user actions into a dynamic, scrollable React UI. It syncs directly with Lovable's Knowledge Base and logs prompt-response activity to help build smarter AI-driven apps.

## 🚀 Quick Start

```bash
# Step 1: Clone the repository
git clone https://github.com/your-org/your-project
cd your-project

# Step 2: Install dependencies (REQUIRED before running any other commands)
yarn install

# Step 3: Start the development server
yarn dev
```

### Important: Always Install Dependencies First

Before running any scripts, make sure you have installed the project dependencies:

```bash
yarn install
```

Without this step, commands like `yarn dev` will fail with errors like `/bin/sh: 1: vite: not found`.

### Running the Markdown Server

For local development with live markdown syncing, run:

```bash
# Start the markdown server (in a separate terminal)
yarn dev:markdown-server

# Then start the normal dev server (if not already running)
yarn dev
```

### Generating Production JSON

Before deploying to production, generate the actions JSON file:

```bash
yarn run generate-actions-json
# or the alias
yarn run build:kb
```

### Debug Tools

To verify knowledgebase integrity:

```bash
yarn run debug:kb
```

Visit `http://localhost:3000/__debug` while running the dev server to access the full debug UI with live file watchers, parsing previews, and test tools.

## ⚙️ Scripts

| Script | Description |
|--------|-------------|
| `yarn run debug:kb` | Validates knowledgebase integrity by checking markdown format, JSON sync status, and log file health |
| `yarn run generate-actions-json` | Builds the window actions JSON file from markdown source for production use |
| `yarn run build:kb` | Alias for `generate-actions-json` |
| `yarn run dev:markdown-server` | Runs a local server for saving markdown files with Git integration during development |
| `yarn run kb:ci` | CI-friendly wrapper for debug:kb that ensures proper exit codes for CI environments |

## 🧪 Pre-Commit & CI

This project includes automated validation for the knowledgebase:

- **Pre-commit Hook**: Prevents commits if the knowledgebase is malformed, out of sync, or logging files are unwritable.
- **CI Workflow**: Automatically validates the knowledgebase on GitHub for pushes and pull requests to main.
- **Script Aliases**: Use `yarn run kb:ci` to manually validate the knowledgebase.

After installation, set up the pre-commit hooks by running:

```sh
node scripts/setup-husky.js
```

This will ensure your knowledgebase stays reliable and properly synced.

## 🧠 Lovable Sync

The knowledgebase integration with Lovable works as follows:

1. User actions are recorded in `public/window-tracker-prd.md` in a structured format
2. The parser converts these entries into categorized actions with metadata
3. Relevant actions are injected into AI conversations as context when matching the topic

Example of a recorded action:
```markdown
# Navigation Actions
- User clicked on dashboard link [2023-05-01 14:32:15]
- User opened settings menu [2023-05-01 14:33:22]
```

What Lovable might inject as context:
```
User previously navigated to Dashboard (2023-05-01 14:32:15)
User has shown interest in Settings features (2023-05-01 14:33:22)
```

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Window Actions Viewer

This project includes a window actions viewer that parses markdown files containing user action records and displays them in a structured, interactive UI.

### Local Development with Live Syncing

During development mode:
1. The app will automatically watch for changes to the `public/window-tracker-prd.md` file.
2. When changes are detected, the UI will update in real-time without reloading the page.
3. You can also upload markdown files via the built-in uploader (development mode only).

### Development Markdown Server

To enable saving markdown files during development:

```sh
# Start the markdown server (in a separate terminal)
yarn run dev:markdown-server

# Then start the normal dev server
yarn run dev
```

This allows you to:
1. Upload markdown files via the UI
2. Save changes directly to disk
3. Test parsing and viewing functionality end-to-end
4. Automatically commit changes to Git for version tracking

The markdown server only runs in development mode and only accepts requests from localhost.

### Collaborative Features

The development server provides Git integration for tracking changes:
- Each save creates a Git commit with timestamp
- View recent commit history for the markdown file
- Changes are tracked for auditability and rollback

### Building for Production

Before deploying, generate the static JSON file from your markdown using:

```sh
# Generate actions JSON from markdown file
yarn run generate-actions-json
# or
yarn run build:kb
```

This will parse `public/window-tracker-prd.md` and output to `public/data/window-actions.json`.

In production, the app will load actions directly from the pre-generated JSON file.
