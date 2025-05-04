
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

try {
  console.log('🔧 Setting up Husky pre-commit hooks...');
  
  // Create .husky directory if it doesn't exist
  const huskyDir = path.resolve(process.cwd(), '.husky');
  if (!fs.existsSync(huskyDir)) {
    fs.mkdirSync(huskyDir, { recursive: true });
    console.log('📁 Created .husky directory');
  }
  
  // Initialize Husky
  execSync('npx husky install', { stdio: 'inherit' });
  console.log('✅ Initialized Husky');
  
  // Create pre-commit hook
  const preCommitPath = path.join(huskyDir, 'pre-commit');
  const preCommitContent = `#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

echo "🔍 Running knowledgebase checks..."
npm run debug:kb || (echo "❌ Knowledgebase checks failed. Please fix the issues before committing." && exit 1)
`;

  fs.writeFileSync(preCommitPath, preCommitContent);
  fs.chmodSync(preCommitPath, 0o755); // Make the script executable
  console.log('✅ Created pre-commit hook');
  
  // Update package.json to add postinstall script
  const packageJsonPath = path.resolve(process.cwd(), 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  if (!packageJson.scripts['postinstall']) {
    packageJson.scripts['postinstall'] = 'husky install';
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log('✅ Added postinstall script to package.json');
  }
  
  console.log('🎉 Husky setup complete!');
} catch (error) {
  console.error('❌ Error setting up Husky:', error);
  process.exit(1);
}
