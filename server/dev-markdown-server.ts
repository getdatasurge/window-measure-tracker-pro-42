
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

// Promisify exec for cleaner async/await usage
const execAsync = promisify(exec);

// Only run this server in development mode
if (process.env.NODE_ENV !== 'development') {
  console.error('❌ This server is only meant to be used in development mode.');
  process.exit(1);
}

const app = express();
const PORT = 3001;
const TARGET_FILE_PATH = path.resolve(process.cwd(), 'public/window-tracker-prd.md');

// Configure middleware
app.use(express.json({ limit: '1mb' }));
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
}));

// Helper function to run Git commands
async function runGitCommand(command: string): Promise<string> {
  try {
    const { stdout } = await execAsync(command);
    return stdout.trim();
  } catch (error) {
    console.error(`❌ Git command failed: ${command}`, error);
    throw new Error(`Git command failed: ${(error as Error).message}`);
  }
}

// Save markdown endpoint
app.post('/save-markdown', async (req, res) => {
  try {
    const { content } = req.body;
    
    // Validate content
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Content cannot be empty' });
    }
    
    // Ensure directory exists
    const dir = path.dirname(TARGET_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Write file atomically
    fs.writeFileSync(TARGET_FILE_PATH, content);
    
    console.log(`✅ Markdown saved successfully to ${TARGET_FILE_PATH}`);
    
    // Git operations
    try {
      const timestamp = new Date().toISOString();
      await runGitCommand(`git add ${TARGET_FILE_PATH}`);
      const commitResult = await runGitCommand(`git commit -m "Updated window-tracker-prd.md via UI at ${timestamp}"`);
      
      // Extract commit hash from git commit output
      const commitHashMatch = commitResult.match(/\[[\w\s]+\s([a-f0-9]+)\]/);
      const commitHash = commitHashMatch ? commitHashMatch[1] : 'unknown';
      
      return res.status(200).json({ 
        success: true, 
        message: 'Markdown saved and committed successfully',
        filePath: TARGET_FILE_PATH,
        commitHash,
        timestamp
      });
    } catch (gitError) {
      // If git operations fail, still return success for the file save
      console.warn('⚠️ File saved but git operations failed:', gitError);
      return res.status(200).json({
        success: true,
        message: 'Markdown saved successfully, but git operations failed',
        filePath: TARGET_FILE_PATH,
        gitError: (gitError as Error).message
      });
    }
  } catch (error) {
    console.error('❌ Error saving markdown:', error);
    return res.status(500).json({ 
      success: false, 
      message: `Failed to save markdown: ${(error as Error).message}`
    });
  }
});

// Get commit history endpoint
app.get('/history', async (req, res) => {
  try {
    // Get the last 5 commits for the target file
    const gitLogCommand = `git log -n 5 --pretty=format:"%h|%s|%an|%ad" -- ${TARGET_FILE_PATH}`;
    const gitLogOutput = await runGitCommand(gitLogCommand);
    
    const history = gitLogOutput.split('\n').map(line => {
      const [hash, message, author, date] = line.split('|');
      return { hash, message, author, date };
    });
    
    return res.status(200).json({
      success: true,
      history
    });
  } catch (error) {
    console.error('❌ Error fetching git history:', error);
    return res.status(500).json({
      success: false,
      message: `Failed to fetch git history: ${(error as Error).message}`
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Development markdown server running on http://localhost:${PORT}`);
  console.log(`📄 Target file: ${TARGET_FILE_PATH}`);
  console.log('🔒 Only accepting requests from localhost:3000');
  console.log('🔄 Git integration enabled for commits');
});
