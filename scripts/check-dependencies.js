
#!/usr/bin/env node

/**
 * check-dependencies.js
 * 
 * This script checks if node_modules directory exists and if not,
 * warns the user and suggests running yarn install.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const nodeModulesPath = path.join(process.cwd(), 'node_modules');
const viteExecutablePath = path.join(nodeModulesPath, '.bin', 'vite');

// Check if node_modules exists
if (!fs.existsSync(nodeModulesPath) || !fs.existsSync(viteExecutablePath)) {
  console.error('\x1b[31m%s\x1b[0m', '❌ Error: node_modules not found or vite not installed!');
  console.log('\x1b[33m%s\x1b[0m', '⚠️  You need to install dependencies first:');
  console.log('\x1b[36m%s\x1b[0m', '   yarn install');
  console.log('\nRunning yarn install for you...\n');
  
  try {
    // Run yarn install
    execSync('yarn install', { stdio: 'inherit' });
    console.log('\n\x1b[32m%s\x1b[0m', '✅ Dependencies installed successfully!');
    console.log('\x1b[32m%s\x1b[0m', '🚀 Continuing with the dev script...\n');
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', '❌ Failed to install dependencies.');
    console.error('\x1b[31m%s\x1b[0m', '   Please run yarn install manually and try again.');
    process.exit(1);
  }
} else {
  console.log('\x1b[32m%s\x1b[0m', '✅ Dependencies are already installed.');
}
