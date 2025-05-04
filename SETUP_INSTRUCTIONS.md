
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

## What's Changed?

- Added clearer instructions in README.md about dependency installation
- Added automatic dependency checking before running development server
- Created helper scripts to ensure smooth developer experience
- Enhanced documentation and error messages for better debugging
