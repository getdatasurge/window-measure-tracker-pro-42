
#!/usr/bin/env node

/**
 * make-scripts-executable.js
 * 
 * This script makes sure our utility scripts are executable
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const scripts = [
  'scripts/check-dependencies.js',
  'scripts/update-package-scripts.js'
];

scripts.forEach(script => {
  const scriptPath = path.join(process.cwd(), script);
  
  if (fs.existsSync(scriptPath)) {
    try {
      // On Unix systems, make the script executable
      if (process.platform !== 'win32') {
        execSync(`chmod +x "${scriptPath}"`);
        console.log(`✅ Made ${script} executable`);
      }
    } catch (error) {
      console.error(`❌ Failed to make ${script} executable:`, error);
    }
  } else {
    console.error(`❌ Script ${script} does not exist`);
  }
});

console.log('✅ Finished checking script permissions');
