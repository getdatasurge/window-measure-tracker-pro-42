
/**
 * This script installs all knowledgebase safeguards:
 * 1. Adds kb:ci script to package.json
 * 2. Sets up Husky pre-commit hooks
 * 3. Ensures .github/workflows directory exists
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Installing knowledgebase safeguards...\n');

// Run the scripts in sequence
try {
  // Add kb:ci script to package.json
  console.log('📦 Setting up kb:ci script...');
  execSync('node scripts/add-kb-ci-script.js', { stdio: 'inherit' });
  console.log();
  
  // Set up Husky
  console.log('🦮 Setting up Husky pre-commit hooks...');
  execSync('node scripts/setup-husky.js', { stdio: 'inherit' });
  console.log();
  
  // Ensure GitHub workflows directory exists
  const workflowsDir = path.resolve(process.cwd(), '.github/workflows');
  if (!fs.existsSync(workflowsDir)) {
    fs.mkdirSync(workflowsDir, { recursive: true });
    console.log('📁 Created .github/workflows directory');
  }
  
  console.log('\n✅ All knowledgebase safeguards installed successfully!');
  console.log('\nℹ️  Run the following command to verify the setup:');
  console.log('npm run kb:ci');
} catch (error) {
  console.error('\n❌ Error installing safeguards:', error);
  process.exit(1);
}
