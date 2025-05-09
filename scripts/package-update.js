
// This script adds a new script to package.json
// It's a workaround since we can't directly modify package.json
// You'll need to run this script manually after implementation

const fs = require('fs');
const path = require('path');

const packageJsonPath = path.resolve(process.cwd(), 'package.json');

try {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  // Add the dev:markdown-server script if it doesn't exist
  if (!packageJson.scripts['dev:markdown-server']) {
    packageJson.scripts['dev:markdown-server'] = 'tsx server/dev-markdown-server.ts';
    console.log('✅ Successfully added dev:markdown-server script to package.json');
  } else {
    console.log('ℹ️ dev:markdown-server script already exists in package.json');
  }
  
  // Add dependency if needed
  if (!packageJson.dependencies['child_process'] && !packageJson.devDependencies['child_process']) {
    console.log('ℹ️ child_process is a built-in Node.js module, no need to add as dependency');
  }
  
  // Write the updated package.json
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    
  console.log('✅ Successfully updated package.json');
} catch (error) {
  console.error('❌ Failed to update package.json:', error);
}
