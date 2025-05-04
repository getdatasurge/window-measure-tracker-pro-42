/**
 * CLI tool to verify the knowledgebase integration
 * Run with: npx tsx scripts/debug-knowledgebase.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { parseWindowActions } from '../src/lib/parseWindowActions';
import chalk from 'chalk';

// File paths
const MD_SOURCE_PATH = path.resolve(process.cwd(), 'public/window-tracker-prd.md');
const JSON_PATH = path.resolve(process.cwd(), 'public/data/window-actions.json');
const LOG_PATH = path.resolve(process.cwd(), 'logs/prompt-response-log.md');
const LOGS_DIR = path.resolve(process.cwd(), 'logs');

// Log formatting
const success = (msg: string) => chalk.green(`✓ ${msg}`);
const warning = (msg: string) => chalk.yellow(`⚠ ${msg}`);
const error = (msg: string) => chalk.red(`✗ ${msg}`);
const info = (msg: string) => chalk.blue(`ℹ ${msg}`);

// Keep track of errors
let hasErrors = false;

console.log(chalk.bold('\n🔍 Knowledgebase Debug Tool\n'));

// SECTION 1: Parse test
function runParseTest() {
  console.log(chalk.bold('1. Markdown Parse Test'));
  
  try {
    if (!fs.existsSync(MD_SOURCE_PATH)) {
      console.log(error(`Source file not found: ${MD_SOURCE_PATH}`));
      hasErrors = true;
      return;
    }
    
    const markdownContent = fs.readFileSync(MD_SOURCE_PATH, 'utf-8');
    
    if (!markdownContent.trim()) {
      console.log(warning(`Source file is empty: ${MD_SOURCE_PATH}`));
      hasErrors = true;
      return;
    }
    
    // Parse markdown content
    const actions = parseWindowActions(markdownContent);
    
    // Count categories (unique types)
    const categories = new Set(actions.map(action => action.type));
    
    // Count malformed entries by detecting errors in the parsed data
    const malformedEntries = actions.filter(action => action.type === 'error');
    
    if (malformedEntries.length > 0) {
      console.log(warning(`Parsed with ${malformedEntries.length} malformed entries`));
      malformedEntries.forEach(entry => {
        console.log(`  - ${entry.label}`);
      });
    } else {
      console.log(success(`Markdown parsed: ${actions.length} entries (${categories.size} categories)`));
    }
    
    // Additional stats
    console.log(info(`Categories: ${Array.from(categories).join(', ')}`));
    
  } catch (err) {
    console.log(error(`Parse test failed: ${(err as Error).message}`));
    console.error(err);
    hasErrors = true;
  }
  
  console.log(''); // Empty line for spacing
}

// SECTION 2: Sync test
function runSyncTest() {
  console.log(chalk.bold('2. JSON Sync Test'));
  
  try {
    if (!fs.existsSync(JSON_PATH)) {
      console.log(error(`JSON file not found: ${JSON_PATH}`));
      hasErrors = true;
      return;
    }
    
    if (!fs.existsSync(MD_SOURCE_PATH)) {
      console.log(error(`Source file not found: ${MD_SOURCE_PATH}`));
      hasErrors = true;
      return;
    }
    
    const mdStats = fs.statSync(MD_SOURCE_PATH);
    const jsonStats = fs.statSync(JSON_PATH);
    
    // Compare modification times
    const mdMtime = mdStats.mtimeMs;
    const jsonMtime = jsonStats.mtimeMs;
    
    // If JSON is older than markdown, it's stale
    if (jsonMtime < mdMtime) {
      const timeDiff = (mdMtime - jsonMtime) / 1000; // seconds
      console.log(warning(`JSON sync: stale by ${timeDiff.toFixed(1)} seconds`));
      console.log(info(`Run 'npm run build:kb' to update JSON`));
      hasErrors = true;
    } else {
      console.log(success('JSON sync: up to date ✅'));
    }
    
    // Additional info
    console.log(info(`Markdown updated: ${mdStats.mtime.toISOString()}`));
    console.log(info(`JSON generated: ${jsonStats.mtime.toISOString()}`));
    
  } catch (err) {
    console.log(error(`Sync test failed: ${(err as Error).message}`));
    console.error(err);
    hasErrors = true;
  }
  
  console.log(''); // Empty line for spacing
}

// SECTION 3: Logging test
function runLoggingTest() {
  console.log(chalk.bold('3. Logging Test'));
  
  try {
    // Check if logs directory exists
    if (!fs.existsSync(LOGS_DIR)) {
      console.log(warning(`Logs directory doesn't exist. Creating: ${LOGS_DIR}`));
      fs.mkdirSync(LOGS_DIR, { recursive: true });
    }
    
    // Check if log file exists
    const logExists = fs.existsSync(LOG_PATH);
    
    if (!logExists) {
      console.log(warning(`Log file doesn't exist: ${LOG_PATH}`));
      console.log(info('Creating empty log file...'));
      
      // Create empty log file with header
      const header = '# Prompt Response Log\n\nThis file contains recorded prompts and responses.\n\n';
      fs.writeFileSync(LOG_PATH, header);
      console.log(success('Created empty log file'));
    } else {
      console.log(success('Log file exists'));
      
      // Test write permissions by appending to the log file (and then rolling back)
      try {
        const originalContent = fs.readFileSync(LOG_PATH, 'utf-8');
        const testContent = '\n<!-- Debug toolkit write test -->\n';
        fs.appendFileSync(LOG_PATH, testContent);
        // Restore original content
        fs.writeFileSync(LOG_PATH, originalContent);
        console.log(success('Log file is writable ✍️'));
        
        // Validate log entries formatting
        validateLogEntries(originalContent);
        
      } catch (writeErr) {
        console.log(error(`Log file not writable: ${(writeErr as Error).message}`));
        hasErrors = true;
      }
    }
  } catch (err) {
    console.log(error(`Logging test failed: ${(err as Error).message}`));
    console.error(err);
    hasErrors = true;
  }
  
  console.log(''); // Empty line for spacing
}

// Helper function to validate log entries
function validateLogEntries(logContent: string) {
  // Look for markdown headings that indicate prompt entries
  const promptHeadingRegex = /^## 🧠 Prompt - (.+)$/gm;
  const matches = [...logContent.matchAll(promptHeadingRegex)];
  
  if (matches.length === 0) {
    console.log(warning('No prompt entries found in log file'));
    return;
  }
  
  // Validate the last 5 entries (or fewer if there aren't 5)
  const lastEntries = matches.slice(-Math.min(5, matches.length));
  
  let validEntries = 0;
  let invalidEntries = 0;
  
  for (const match of lastEntries) {
    const timestampStr = match[1];
    const entryPos = match.index;
    
    if (entryPos === undefined) continue;
    
    // Get a section of the log content after this heading
    const nextEntryPos = logContent.indexOf('## 🧠 Prompt -', entryPos + 1);
    const entryEnd = nextEntryPos !== -1 ? nextEntryPos : undefined;
    const entryContent = logContent.substring(entryPos, entryEnd).trim();
    
    // Check for required components
    const hasPromptSection = entryContent.includes('```');
    const hasResponseSection = entryContent.includes('### 🪄 Response');
    
    if (hasPromptSection && hasResponseSection) {
      validEntries++;
    } else {
      invalidEntries++;
    }
  }
  
  console.log(info(`Examined last ${lastEntries.length} log entries`));
  
  if (invalidEntries > 0) {
    console.log(warning(`Found ${invalidEntries} malformed entries in log file`));
    hasErrors = true;
  } else {
    console.log(success(`All ${validEntries} log entries properly formatted`));
  }
}

// Run all tests
runParseTest();
runSyncTest();
runLoggingTest();

// Final summary
console.log(chalk.bold('\n📋 Summary'));

if (hasErrors) {
  console.log(error('Knowledgebase debug completed with errors'));
  process.exit(1);
} else {
  console.log(success('All knowledgebase tests passed! ✨'));
  process.exit(0);
}
