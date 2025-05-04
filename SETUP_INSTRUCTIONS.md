
# Setup Instructions

To fix the "vite not found" error and improve the developer experience, follow these steps:

## 1. Apply the Package Updates

```bash
# Make scripts executable
node scripts/make-scripts-executable.js

# Update package.json to include predev script
node scripts/update-package-scripts.js
```

## 2. Install Dependencies

If you haven't already:

```bash
yarn install
```

## 3. Start Development Server

Now you can start the development server without encountering the "vite not found" error:

```bash
yarn dev
```

The predev script will automatically check if dependencies are installed before running the dev server, and will install them if needed.

## 4. Pre-Commit & CI Integration

This project includes automated validation for the knowledgebase:

- **Pre-Commit Hook**: Every commit triggers `yarn debug:kb` to prevent commits with malformed markdown or stale JSON.
- **CI Workflow**: GitHub Actions automatically runs checks on push or PR to main branch.
- **Script Aliases**: Use `yarn run kb:ci` for CI-friendly knowledgebase validation.

After installation, set up the pre-commit hooks by running:

```sh
node scripts/setup-husky.js
```

## What's Changed?

- Added clearer instructions in README.md about dependency installation
- Added automatic dependency checking before running development server
- Created helper scripts to ensure smooth developer experience
- Enhanced documentation and error messages for better debugging
- Added pre-commit hooks and CI integration for knowledgebase validation
