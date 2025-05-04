
#!/usr/bin/env node

/**
 * update-package-scripts.js
 * 
 * This script adds predev script to package.json
 * to check for dependencies before running dev server.
 */

const fs = require('fs');
const path = require('path');

const packageJsonPath = path.resolve(process.cwd(), 'package.json');

try {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  // Add the predev script if it doesn't exist
  if (!packageJson.scripts['predev']) {
    packageJson.scripts['predev'] = 'node scripts/check-dependencies.js';
    console.log('✅ Successfully added predev script to package.json');
  } else {
    console.log('ℹ️ predev script already exists in package.json');
  }
  
  // Write the updated package.json
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log('✅ Successfully updated package.json');
} catch (error) {
  console.error('❌ Failed to update package.json:', error);
}
