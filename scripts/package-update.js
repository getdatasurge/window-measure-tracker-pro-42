
// This script adds a new script to package.json
// It's a workaround since we can't directly modify package.json
// You'll need to run this script manually after implementation

const fs = require('fs');
const path = require('path');

const packageJsonPath = path.resolve(process.cwd(), 'package.json');

try {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  // Add the generate-actions-json script if it doesn't exist
  if (!packageJson.scripts['generate-actions-json']) {
    packageJson.scripts['generate-actions-json'] = 'tsx scripts/generate-actions-json.ts';
    
    // Write the updated package.json
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    
    console.log('✅ Successfully added generate-actions-json script to package.json');
  } else {
    console.log('ℹ️ generate-actions-json script already exists in package.json');
  }
} catch (error) {
  console.error('❌ Failed to update package.json:', error);
}
