
/**
 * Build script to generate window actions JSON file from markdown
 * Run with: npx tsx scripts/generate-actions-json.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { parseWindowActions, WindowAction } from '../src/lib/parseWindowActions';

const SOURCE_FILE = 'window-tracker-prd.md';
const OUTPUT_FILE = 'data/window-actions.json';

function ensureDirectoryExists(filePath: string): void {
  const dirname = path.dirname(filePath);
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true });
  }
}

function generateActionsJson(): void {
  try {
    console.log(`🔍 Reading source file: ${SOURCE_FILE}`);
    const sourcePath = path.resolve(process.cwd(), SOURCE_FILE);
    
    // Check if source file exists
    if (!fs.existsSync(sourcePath)) {
      console.error(`❌ Source file not found: ${sourcePath}`);
      console.log('Creating a sample file for demonstration...');
      
      // Create a sample file if it doesn't exist
      const sampleContent = `# Navigation Actions
- User clicked on dashboard link [2023-05-01 14:32:15]
- User opened settings menu [2023-05-01 14:33:22]
- User navigated to profile: section=personal

# Form Interactions
- User filled email field: value="user@example.com" [2023-05-01 14:35:01]
- User submitted registration form [2023-05-01 14:36:10]
- Form validation failed: errors=3

# System Events
- Application loaded [2023-05-01 14:30:00]
- Error occurred: type="api", code=404 [2023-05-01 14:37:45]
- Session timeout [2023-05-01 15:30:00]
`;
      fs.writeFileSync(sourcePath, sampleContent);
      console.log(`✅ Created sample source file: ${sourcePath}`);
    }
    
    // Read the file
    const markdownContent = fs.readFileSync(sourcePath, 'utf-8');
    console.log(`✅ Successfully read source file (${markdownContent.length} bytes)`);
    
    // Parse the content
    console.log('🔄 Parsing markdown content...');
    const actions: WindowAction[] = parseWindowActions(markdownContent);
    console.log(`✅ Successfully parsed ${actions.length} actions`);
    
    // Ensure output directory exists
    const outputPath = path.resolve(process.cwd(), OUTPUT_FILE);
    ensureDirectoryExists(outputPath);
    
    // Write the JSON file
    console.log(`💾 Writing output to: ${outputPath}`);
    fs.writeFileSync(outputPath, JSON.stringify(actions, null, 2));
    console.log(`✅ Successfully wrote ${actions.length} actions to ${outputPath}`);
    
    console.log('🎉 Action generation completed successfully!');
  } catch (error) {
    console.error('❌ Failed to generate actions JSON:', error);
    process.exit(1);
  }
}

// Execute the script
generateActionsJson();
