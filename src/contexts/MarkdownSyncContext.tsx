
import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { parseWindowActions, WindowAction } from '@/lib/parseWindowActions';

interface MarkdownState {
  content: string;
  parsedActions: WindowAction[];
  isLoading: boolean;
  error: string | null;
}

type MarkdownAction =
  | { type: 'SET_CONTENT'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'PARSE_CONTENT' };

const initialState: MarkdownState = {
  content: '',
  parsedActions: [],
  isLoading: false,
  error: null,
};

const markdownReducer = (state: MarkdownState, action: MarkdownAction): MarkdownState => {
  switch (action.type) {
    case 'SET_CONTENT':
      return {
        ...state,
        content: action.payload,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };
    case 'PARSE_CONTENT':
      try {
        const parsedActions = parseWindowActions(state.content);
        return {
          ...state,
          parsedActions,
          error: null,
        };
      } catch (error) {
        return {
          ...state,
          parsedActions: [],
          error: `Failed to parse markdown: ${(error as Error).message}`,
        };
      }
    default:
      return state;
  }
};

interface MarkdownSyncContextType {
  state: MarkdownState;
  setContent: (content: string) => void;
  parseContent: () => void;
  loadContent: () => Promise<void>;
  saveContent: () => Promise<void>;
}

const MarkdownSyncContext = createContext<MarkdownSyncContextType | undefined>(undefined);

export const useMarkdownSync = (): MarkdownSyncContextType => {
  const context = useContext(MarkdownSyncContext);
  if (context === undefined) {
    throw new Error('useMarkdownSync must be used within a MarkdownSyncProvider');
  }
  return context;
};

interface MarkdownSyncProviderProps {
  children: ReactNode;
  initialContent?: string;
}

export const MarkdownSyncProvider: React.FC<MarkdownSyncProviderProps> = ({ 
  children, 
  initialContent 
}) => {
  const [state, dispatch] = useReducer(markdownReducer, initialState);
  
  // Initialize with provided content if available
  useEffect(() => {
    if (initialContent) {
      dispatch({ type: 'SET_CONTENT', payload: initialContent });
      dispatch({ type: 'PARSE_CONTENT' });
    }
  }, [initialContent]);
  
  const setContent = (content: string) => {
    dispatch({ type: 'SET_CONTENT', payload: content });
    // Debounce parsing to avoid excessive re-renders during typing
    const timerId = setTimeout(() => {
      dispatch({ type: 'PARSE_CONTENT' });
    }, 300);
    
    return () => clearTimeout(timerId);
  };
  
  const parseContent = () => {
    dispatch({ type: 'PARSE_CONTENT' });
  };
  
  const loadContent = async (): Promise<void> => {
    if (process.env.NODE_ENV !== 'development') {
      return;
    }
    
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    
    try {
      const response = await fetch('/window-tracker-prd.md');
      if (!response.ok) {
        throw new Error(`Failed to load markdown: ${response.status}`);
      }
      
      const content = await response.text();
      dispatch({ type: 'SET_CONTENT', payload: content });
      dispatch({ type: 'PARSE_CONTENT' });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: `Error loading markdown: ${(error as Error).message}` });
      console.error('Error loading markdown:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };
  
  const saveContent = async (): Promise<void> => {
    if (process.env.NODE_ENV !== 'development' || !state.content.trim()) {
      return;
    }
    
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    
    try {
      const response = await fetch('http://localhost:3001/save-markdown', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: state.content }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to save markdown: ${response.status}`);
      }
      
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message || 'Unknown error occurred');
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: `Error saving markdown: ${(error as Error).message}` });
      console.error('Error saving markdown:', error);
      throw error; // Re-throw to allow component to handle the error
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };
  
  return (
    <MarkdownSyncContext.Provider
      value={{
        state,
        setContent,
        parseContent,
        loadContent,
        saveContent,
      }}
    >
      {children}
    </MarkdownSyncContext.Provider>
  );
};
