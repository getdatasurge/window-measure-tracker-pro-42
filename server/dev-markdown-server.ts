
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

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
  methods: ['POST'],
}));

// Save markdown endpoint
app.post('/save-markdown', (req, res) => {
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
    return res.status(200).json({ 
      success: true, 
      message: 'Markdown saved successfully',
      filePath: TARGET_FILE_PATH
    });
  } catch (error) {
    console.error('❌ Error saving markdown:', error);
    return res.status(500).json({ 
      success: false, 
      message: `Failed to save markdown: ${(error as Error).message}`
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Development markdown server running on http://localhost:${PORT}`);
  console.log(`📄 Target file: ${TARGET_FILE_PATH}`);
  console.log('🔒 Only accepting requests from localhost:3000');
});
