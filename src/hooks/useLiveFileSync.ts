
import { useState, useEffect } from 'react';
import { parseWindowActions, WindowAction, readMarkdownFile } from '../lib/parseWindowActions';

// Time in ms to wait before re-parsing after a file change
const DEBOUNCE_TIME = 500;

/**
 * Hook to synchronize markdown file changes with parsed JSON
 * Only active in development mode
 * 
 * @param filePath Path to the markdown file to watch
 * @returns Parsed window actions and loading state
 */
export function useLiveFileSync(filePath: string): {
  actions: WindowAction[];
  loading: boolean;
  error: string | null;
} {
  const [actions, setActions] = useState<WindowAction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<number>(Date.now());

  useEffect(() => {
    // Only enable file sync in development mode
    const isDevelopment = process.env.NODE_ENV === 'development';
    if (!isDevelopment) {
      setLoading(false);
      return;
    }

    let timeoutId: number | null = null;

    const loadFile = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const content = await readMarkdownFile(filePath);
        const parsedActions = parseWindowActions(content);
        
        setActions(parsedActions);
      } catch (err) {
        setError(`Failed to parse markdown: ${(err as Error).message}`);
        console.error('Error in useLiveFileSync:', err);
      } finally {
        setLoading(false);
      }
    };

    // Initial load
    loadFile();

    // Set up file watcher (simulated in browser environment)
    // In a real environment with Node.js, you'd use fs.watch or chokidar
    const watchInterval = setInterval(() => {
      setLastUpdate(Date.now());
    }, 5000); // Check for updates every 5 seconds

    // Debounced reload when lastUpdate changes
    const watchEffect = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      timeoutId = window.setTimeout(() => {
        loadFile();
      }, DEBOUNCE_TIME);
    };

    // Watch for updates
    const watchController = new AbortController();
    const signal = watchController.signal;
    
    window.addEventListener('storage', watchEffect, { signal });
    
    // Effect runs when lastUpdate changes
    if (lastUpdate) {
      watchEffect();
    }

    // Cleanup function
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      clearInterval(watchInterval);
      watchController.abort();
    };
  }, [filePath, lastUpdate]);

  return { actions, loading, error };
}

/**
 * For real server-side file watching in a Node.js environment,
 * you would implement something like this:
 */
/*
import * as fs from 'fs';
import * as path from 'path';

export function watchMarkdownFile(
  filePath: string, 
  callback: (content: string) => void
): () => void {
  const absolutePath = path.resolve(process.cwd(), filePath);
  
  // Initial read
  try {
    const content = fs.readFileSync(absolutePath, 'utf-8');
    callback(content);
  } catch (error) {
    console.error('Error reading file:', error);
  }
  
  // Set up watcher
  const watcher = fs.watch(absolutePath, (eventType) => {
    if (eventType === 'change') {
      try {
        const content = fs.readFileSync(absolutePath, 'utf-8');
        callback(content);
      } catch (error) {
        console.error('Error reading file after change:', error);
      }
    }
  });
  
  // Return cleanup function
  return () => {
    watcher.close();
  };
}
*/
