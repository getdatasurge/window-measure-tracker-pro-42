
import express from 'express';
import fs from 'fs';
import path from 'path';
import { format } from 'date-fns';

const router = express.Router();
const LOGS_DIR = path.resolve(process.cwd(), 'logs');

// Ensure logs directory exists
if (!fs.existsSync(LOGS_DIR)) {
  fs.mkdirSync(LOGS_DIR, { recursive: true });
}

interface PromptLogEntry {
  prompt: string;
  response: string;
  timestamp: string;
  contextSummary?: string;
}

// Format the log entry as markdown
function formatLogEntry(entry: PromptLogEntry): string {
  const { prompt, response, timestamp, contextSummary } = entry;
  
  // Format timestamp for display
  const displayTime = new Date(timestamp).toISOString();
  
  let markdown = `\n## 🧠 Prompt - ${displayTime}\n\`\`\`\n${prompt.trim()}\n\`\`\`\n\n`;
  markdown += `### 🪄 Response\n\`\`\`\n${response.trim()}\n\`\`\`\n\n`;
  
  if (contextSummary && contextSummary.trim()) {
    markdown += `### 📚 Knowledge Context\n\`\`\`\n${contextSummary.trim()}\n\`\`\`\n\n`;
  }
  
  markdown += `---\n`;
  
  return markdown;
}

// Log to daily file or to a single file
function writeToLog(content: string, useDaily: boolean = false): string {
  try {
    const now = new Date();
    const fileName = useDaily 
      ? `${format(now, 'yyyy-MM-dd')}.md`
      : 'prompt-response-log.md';
    
    const logPath = path.join(LOGS_DIR, fileName);
    
    // Append to file (or create if doesn't exist)
    fs.appendFileSync(logPath, content);
    
    return logPath;
  } catch (error) {
    console.error('Error writing to log file:', error);
    throw new Error(`Failed to write to log: ${(error as Error).message}`);
  }
}

// Endpoint to log prompts and responses
router.post('/log-prompt-response', (req, res) => {
  try {
    const { prompt, response, timestamp, contextSummary } = req.body as PromptLogEntry;
    
    // Validate required fields
    if (!prompt || !response) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields: prompt and response are required' 
      });
    }
    
    // Format entry as markdown
    const logEntry = formatLogEntry({
      prompt,
      response,
      timestamp: timestamp || new Date().toISOString(),
      contextSummary
    });
    
    // Write to both formats - single file and daily files
    const singleLogPath = writeToLog(logEntry, false);
    const dailyLogPath = writeToLog(logEntry, true);
    
    return res.status(200).json({
      success: true,
      message: 'Prompt and response logged successfully',
      paths: {
        singleLog: singleLogPath,
        dailyLog: dailyLogPath
      }
    });
  } catch (error) {
    console.error('Error logging prompt:', error);
    return res.status(500).json({
      success: false,
      message: `Failed to log prompt: ${(error as Error).message}`
    });
  }
});

export default router;
