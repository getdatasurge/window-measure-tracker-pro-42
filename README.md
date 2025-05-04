
# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/501f21b0-8079-4b5b-a945-15a0ac516389

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/501f21b0-8079-4b5b-a945-15a0ac516389) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

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

To run the development server with live syncing:

```sh
npm run dev
```

### Development Markdown Server

To enable saving markdown files during development:

```sh
# Start the markdown server (in a separate terminal)
npm run dev:markdown-server

# Then start the normal dev server
npm run dev
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

To use the real-time editor:
1. Navigate to the "Actions" page
2. Select the "Edit Markdown" tab
3. Make changes to the markdown file
4. Click "Save & Commit" to persist changes and create a Git record

### Building for Production

Before deploying, generate the static JSON file from your markdown using:

```sh
# Generate actions JSON from markdown file
npm run generate-actions-json
# or
npx tsx scripts/generate-actions-json.ts
```

This will parse `public/window-tracker-prd.md` and output to `public/data/window-actions.json`.

### Production Deployment

When deploying to production:

1. Run the build script to generate the actions JSON:
```sh
npm run generate-actions-json
```

2. Build the application:
```sh
npm run build
```

3. Deploy to your preferred hosting platform:

**Vercel:**
```sh
vercel deploy
```

**Netlify:**
```sh
netlify deploy
```

In production, the app will load actions directly from the pre-generated JSON file.

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/501f21b0-8079-4b5b-a945-15a0ac516389) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
