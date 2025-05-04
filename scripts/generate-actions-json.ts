
/**
 * Build script to generate window actions JSON file from markdown
 * Run with: npx tsx scripts/generate-actions-json.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { parseWindowActions, WindowAction } from '../src/lib/parseWindowActions';
import { assignFeatureArea } from '../src/utils/assignFeatureArea';

const SOURCE_FILE = 'public/window-tracker-prd.md';
const OUTPUT_FILE = 'public/data/window-actions.json';

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
      process.exit(1);
    }
    
    // Read the file
    const markdownContent = fs.readFileSync(sourcePath, 'utf-8');
    console.log(`✅ Successfully read source file (${markdownContent.length} bytes)`);
    
    // Parse the content
    console.log('🔄 Parsing markdown content...');
    const actions: WindowAction[] = parseWindowActions(markdownContent);
    console.log(`✅ Successfully parsed ${actions.length} actions`);
    
    // Enrich actions with feature areas
    console.log('🔄 Enriching actions with feature areas...');
    const enrichedActions = actions.map(action => ({
      ...action,
      featureArea: assignFeatureArea(action)
    }));
    
    // Ensure output directory exists
    const outputPath = path.resolve(process.cwd(), OUTPUT_FILE);
    ensureDirectoryExists(outputPath);
    
    // Write the JSON file
    console.log(`💾 Writing output to: ${outputPath}`);
    fs.writeFileSync(outputPath, JSON.stringify(enrichedActions, null, 2));
    console.log(`✅ Successfully wrote ${enrichedActions.length} actions to ${outputPath}`);
    
    console.log('🎉 Action generation completed successfully!');
  } catch (error) {
    console.error('❌ Failed to generate actions JSON:', error);
    console.error(`   Error details: ${(error as Error).message}`);
    console.error(`   Stack trace: ${(error as Error).stack}`);
    process.exit(1);
  }
}

// Execute the script
generateActionsJson();
