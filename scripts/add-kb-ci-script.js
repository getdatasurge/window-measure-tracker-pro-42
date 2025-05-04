
// This script adds the kb:ci script to package.json
const fs = require('fs');
const path = require('path');

const packageJsonPath = path.resolve(process.cwd(), 'package.json');

try {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  // Add the kb:ci script if it doesn't exist
  if (!packageJson.scripts['kb:ci']) {
    packageJson.scripts['kb:ci'] = 'npm run debug:kb && echo "✅ Knowledgebase passed"';
    packageJson.scripts['debug:kb'] = 'tsx scripts/debug-knowledgebase.ts';
    console.log('✅ Successfully added kb:ci script to package.json');
  } else {
    console.log('ℹ️ kb:ci script already exists in package.json');
  }
  
  // Write the updated package.json
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log('✅ Successfully updated package.json');
} catch (error) {
  console.error('❌ Failed to update package.json:', error);
}
