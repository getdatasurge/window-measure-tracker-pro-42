
import React, { useState, useEffect } from 'react';
import { parseWindowActions } from '@/lib/parseWindowActions';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import ActionPanel from '@/components/ActionPanel';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Save, History } from 'lucide-react';

interface MarkdownEditorProps {
  initialContent?: string;
  onContentChange?: (content: string) => void;
}

interface GitCommit {
  hash: string;
  message: string;
  author: string;
  date: string;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ 
  initialContent = '', 
  onContentChange 
}) => {
  const [markdownContent, setMarkdownContent] = useState<string>(initialContent);
  const [parsedActions, setParsedActions] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
  const [commitHistory, setCommitHistory] = useState<GitCommit[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  
  // Parse markdown content whenever it changes
  useEffect(() => {
    try {
      const actions = parseWindowActions(markdownContent);
      setParsedActions(actions);
    } catch (error) {
      console.error('Error parsing markdown:', error);
    }
  }, [markdownContent]);
  
  // Fetch initial markdown content if not provided
  useEffect(() => {
    if (!initialContent) {
      fetchMarkdownContent();
    }
  }, [initialContent]);
  
  const fetchMarkdownContent = async () => {
    try {
      const response = await fetch('/window-tracker-prd.md');
      if (response.ok) {
        const content = await response.text();
        setMarkdownContent(content);
        if (onContentChange) onContentChange(content);
      } else {
        toast({
          title: 'Error',
          description: `Failed to load markdown: ${response.status}`,
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error fetching markdown:', error);
      toast({
        title: 'Error',
        description: `Failed to load markdown: ${(error as Error).message}`,
        variant: 'destructive'
      });
    }
  };
  
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setMarkdownContent(newContent);
    if (onContentChange) onContentChange(newContent);
  };
  
  const handleSaveClick = () => {
    if (!markdownContent.trim()) {
      toast({
        title: 'Cannot save',
        description: 'Markdown content cannot be empty',
        variant: 'destructive'
      });
      return;
    }
    setShowConfirmDialog(true);
  };
  
  const saveAndCommit = async () => {
    if (!markdownContent.trim()) return;
    
    setIsSaving(true);
    try {
      const response = await fetch('http://localhost:3001/save-markdown', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: markdownContent }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast({
          title: 'Saved and committed',
          description: result.commitHash ? `Commit: ${result.commitHash.substring(0, 7)}` : 'File saved successfully',
        });
        setShowConfirmDialog(false);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Error saving markdown:', error);
      toast({
        title: 'Failed to save',
        description: `Error: ${(error as Error).message}`,
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const fetchHistory = async () => {
    try {
      const response = await fetch('http://localhost:3001/history');
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.history) {
          setCommitHistory(data.history);
          setIsHistoryOpen(true);
        } else {
          throw new Error(data.message || 'Failed to fetch history');
        }
      } else {
        throw new Error(`HTTP Error: ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching history:', error);
      toast({
        title: 'Failed to fetch history',
        description: `Error: ${(error as Error).message}`,
        variant: 'destructive'
      });
    }
  };
  
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-4 border-b">
        <h2 className="text-lg font-medium">Markdown Editor</h2>
        <p className="text-sm text-gray-500">
          Edit window-tracker-prd.md and see changes in real-time
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
        {/* Markdown editor */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Edit markdown content:
          </label>
          <Textarea
            value={markdownContent}
            onChange={handleContentChange}
            className="w-full bg-gray-100 font-mono min-h-[400px] resize-y"
            placeholder="# Action Category
- Action description [YYYY-MM-DD HH:mm:ss]"
          />
        </div>
        
        {/* Live preview */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preview:
          </label>
          <div className="border rounded-md overflow-hidden bg-gray-50">
            <ActionPanel 
              actions={parsedActions} 
              maxHeight="400px" 
            />
          </div>
        </div>
      </div>
      
      {/* Footer controls */}
      <div className="p-4 border-t bg-gray-50 flex justify-between">
        <div>
          <Button
            type="button"
            onClick={fetchHistory}
            className="flex items-center gap-2"
            variant="outline"
          >
            <History className="h-4 w-4" />
            View History
          </Button>
        </div>
        
        <Button
          onClick={handleSaveClick}
          disabled={isSaving || !markdownContent.trim()}
          className="flex items-center gap-2"
          variant="default"
        >
          <Save className="h-4 w-4" />
          {isSaving ? 'Saving...' : 'Save & Commit'}
        </Button>
      </div>
      
      {/* Confirm save dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Commit Changes</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-700">
              Are you sure you want to save changes and create a new Git commit?
            </p>
            <p className="text-xs text-amber-600 mt-2">
              This will overwrite the current file and create a new commit in your Git history.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={saveAndCommit}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Confirm & Commit'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* History dialog */}
      <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Commit History</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {commitHistory.length > 0 ? (
              <ul className="divide-y">
                {commitHistory.map((commit) => (
                  <li key={commit.hash} className="py-2">
                    <div className="flex items-start">
                      <div className="bg-gray-200 rounded px-2 py-1 text-xs font-mono mr-2">
                        {commit.hash.substring(0, 7)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{commit.message}</p>
                        <p className="text-xs text-gray-500">
                          {commit.author} - {commit.date}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No commit history found.</p>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsHistoryOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MarkdownEditor;
