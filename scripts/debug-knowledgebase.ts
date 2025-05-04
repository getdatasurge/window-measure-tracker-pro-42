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

// Types
interface TestResult {
  success: boolean;
  message: string;
  details?: string[];
}

// Log formatting helpers
const formatters = {
  success: (msg: string) => chalk.green(`✓ ${msg}`),
  warning: (msg: string) => chalk.yellow(`⚠ ${msg}`),
  error: (msg: string) => chalk.red(`✗ ${msg}`),
  info: (msg: string) => chalk.blue(`ℹ ${msg}`)
};

// Keep track of errors
let hasErrors = false;

/**
 * Runs all knowledge base tests and reports results
 */
function runTests() {
  console.log(chalk.bold('\n🔍 Knowledgebase Debug Tool\n'));

  // Run each test suite
  runParseTest();
  runSyncTest();
  runLoggingTest();

  // Final summary
  console.log(chalk.bold('\n📋 Summary'));

  if (hasErrors) {
    console.log(formatters.error('Knowledgebase debug completed with errors'));
    process.exit(1);
  } else {
    console.log(formatters.success('All knowledgebase tests passed! ✨'));
    process.exit(0);
  }
}

/**
 * Tests the markdown parsing functionality
 */
function runParseTest() {
  console.log(chalk.bold('1. Markdown Parse Test'));
  
  try {
    // Check if source file exists
    if (!fileExists(MD_SOURCE_PATH)) {
      logTestResult({
        success: false,
        message: `Source file not found: ${MD_SOURCE_PATH}`
      });
      return;
    }
    
    const markdownContent = fs.readFileSync(MD_SOURCE_PATH, 'utf-8');
    
    if (!markdownContent.trim()) {
      logTestResult({
        success: false,
        message: `Source file is empty: ${MD_SOURCE_PATH}`
      });
      return;
    }
    
    // Parse markdown content
    const actions = parseWindowActions(markdownContent);
    
    // Count categories (unique types)
    const categories = new Set(actions.map(action => action.type));
    
    // Count malformed entries by detecting errors in the parsed data
    const malformedEntries = actions.filter(action => action.type === 'error');
    
    if (malformedEntries.length > 0) {
      logTestResult({
        success: false,
        message: `Parsed with ${malformedEntries.length} malformed entries`,
        details: malformedEntries.map(entry => `  - ${entry.label}`)
      });
    } else {
      logTestResult({
        success: true,
        message: `Markdown parsed: ${actions.length} entries (${categories.size} categories)`
      });
    }
    
    // Additional stats
    console.log(formatters.info(`Categories: ${Array.from(categories).join(', ')}`));
    
  } catch (err) {
    logTestResult({
      success: false,
      message: `Parse test failed: ${(err as Error).message}`
    });
    console.error(err);
  }
  
  console.log(''); // Empty line for spacing
}

/**
 * Tests if the JSON file is in sync with the markdown source
 */
function runSyncTest() {
  console.log(chalk.bold('2. JSON Sync Test'));
  
  try {
    // Check if files exist
    if (!fileExists(JSON_PATH)) {
      logTestResult({
        success: false,
        message: `JSON file not found: ${JSON_PATH}`
      });
      return;
    }
    
    if (!fileExists(MD_SOURCE_PATH)) {
      logTestResult({
        success: false,
        message: `Source file not found: ${MD_SOURCE_PATH}`
      });
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
      logTestResult({
        success: false,
        message: `JSON sync: stale by ${timeDiff.toFixed(1)} seconds`,
        details: [`Run 'npm run build:kb' to update JSON`]
      });
    } else {
      logTestResult({
        success: true,
        message: 'JSON sync: up to date ✅'
      });
    }
    
    // Additional info
    console.log(formatters.info(`Markdown updated: ${mdStats.mtime.toISOString()}`));
    console.log(formatters.info(`JSON generated: ${jsonStats.mtime.toISOString()}`));
    
  } catch (err) {
    logTestResult({
      success: false,
      message: `Sync test failed: ${(err as Error).message}`
    });
    console.error(err);
  }
  
  console.log(''); // Empty line for spacing
}

/**
 * Tests log file existence and validation
 */
function runLoggingTest() {
  console.log(chalk.bold('3. Logging Test'));
  
  try {
    // Check if logs directory exists
    if (!fs.existsSync(LOGS_DIR)) {
      console.log(formatters.warning(`Logs directory doesn't exist. Creating: ${LOGS_DIR}`));
      fs.mkdirSync(LOGS_DIR, { recursive: true });
    }
    
    // Check if log file exists
    const logExists = fileExists(LOG_PATH);
    
    if (!logExists) {
      console.log(formatters.warning(`Log file doesn't exist: ${LOG_PATH}`));
      console.log(formatters.info('Creating empty log file...'));
      
      // Create empty log file with header
      const header = '# Prompt Response Log\n\nThis file contains recorded prompts and responses.\n\n';
      fs.writeFileSync(LOG_PATH, header);
      logTestResult({
        success: true,
        message: 'Created empty log file'
      });
    } else {
      logTestResult({
        success: true,
        message: 'Log file exists'
      });
      
      // Test write permissions by appending to the log file (and then rolling back)
      try {
        const originalContent = fs.readFileSync(LOG_PATH, 'utf-8');
        const testContent = '\n<!-- Debug toolkit write test -->\n';
        fs.appendFileSync(LOG_PATH, testContent);
        // Restore original content
        fs.writeFileSync(LOG_PATH, originalContent);
        logTestResult({
          success: true,
          message: 'Log file is writable ✍️'
        });
        
        // Validate log entries formatting
        validateLogEntries(originalContent);
        
      } catch (writeErr) {
        logTestResult({
          success: false,
          message: `Log file not writable: ${(writeErr as Error).message}`
        });
      }
    }
  } catch (err) {
    logTestResult({
      success: false,
      message: `Logging test failed: ${(err as Error).message}`
    });
    console.error(err);
  }
  
  console.log(''); // Empty line for spacing
}

/**
 * Helper function to validate log entries
 */
function validateLogEntries(logContent: string) {
  // Look for markdown headings that indicate prompt entries
  const promptHeadingRegex = /^## 🧠 Prompt - (.+)$/gm;
  const matches = [...logContent.matchAll(promptHeadingRegex)];
  
  if (matches.length === 0) {
    console.log(formatters.warning('No prompt entries found in log file'));
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
  
  console.log(formatters.info(`Examined last ${lastEntries.length} log entries`));
  
  if (invalidEntries > 0) {
    logTestResult({
      success: false,
      message: `Found ${invalidEntries} malformed entries in log file`
    });
  } else {
    logTestResult({
      success: true,
      message: `All ${validEntries} log entries properly formatted`
    });
  }
}

/**
 * Helper function to check if a file exists
 */
function fileExists(filePath: string): boolean {
  return fs.existsSync(filePath);
}

/**
 * Helper function to log test results in a consistent format
 */
function logTestResult(result: TestResult) {
  if (result.success) {
    console.log(formatters.success(result.message));
  } else {
    console.log(formatters.error(result.message));
    hasErrors = true;
    
    if (result.details && result.details.length > 0) {
      result.details.forEach(detail => console.log(formatters.info(detail)));
    }
  }
}

// Run all tests
runTests();
