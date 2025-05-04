
/**
 * Semantic search engine for window actions
 */

import { WindowAction } from "./parseWindowActions";
import { FeatureArea } from "@/utils/assignFeatureArea";

export interface SearchResult {
  action: WindowAction;
  matchScore: number;
  contextSnippet: string;
}

interface SearchOptions {
  featureArea?: FeatureArea;
  actionType?: string;
  minScore?: number;
  limit?: number;
}

/**
 * Simple tokenizer function 
 * @param text The text to tokenize
 * @returns Array of normalized tokens
 */
function tokenize(text: string): string[] {
  if (!text) return [];
  return text.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(token => token.length > 1);
}

/**
 * Calculate token frequency map
 * @param tokens Array of tokens
 * @returns Map of tokens to their frequencies
 */
function calculateTermFrequency(tokens: string[]): Map<string, number> {
  const frequencies = new Map<string, number>();
  
  tokens.forEach(token => {
    frequencies.set(token, (frequencies.get(token) || 0) + 1);
  });
  
  return frequencies;
}

/**
 * Calculate cosine similarity between query and action text
 * @param queryTokens Tokens in the query
 * @param actionTokens Tokens in the action
 * @returns Similarity score between 0-1
 */
function calculateCosineSimilarity(
  queryFreqs: Map<string, number>, 
  actionFreqs: Map<string, number>
): number {
  // Get all unique tokens
  const allTokens = new Set([...queryFreqs.keys(), ...actionFreqs.keys()]);
  
  // Calculate dot product
  let dotProduct = 0;
  let queryMagnitude = 0;
  let actionMagnitude = 0;
  
  allTokens.forEach(token => {
    const queryFreq = queryFreqs.get(token) || 0;
    const actionFreq = actionFreqs.get(token) || 0;
    
    dotProduct += queryFreq * actionFreq;
    queryMagnitude += queryFreq * queryFreq;
    actionMagnitude += actionFreq * actionFreq;
  });
  
  queryMagnitude = Math.sqrt(queryMagnitude);
  actionMagnitude = Math.sqrt(actionMagnitude);
  
  // Avoid division by zero
  if (queryMagnitude === 0 || actionMagnitude === 0) {
    return 0;
  }
  
  return dotProduct / (queryMagnitude * actionMagnitude);
}

/**
 * Generate a context snippet highlighting matched terms
 * @param action The window action
 * @param queryTokens The query tokens to highlight
 * @returns A formatted snippet with context
 */
function generateContextSnippet(action: WindowAction, queryTokens: string[]): string {
  let snippet = action.label;
  
  // Add type if relevant
  if (action.type && action.type !== 'unknown') {
    snippet += ` (${action.type})`;
  }
  
  // Add timestamp if available
  if (action.timestamp && action.timestamp !== 'Unknown') {
    snippet += ` at ${action.timestamp}`;
  }
  
  // Add page context if available
  if (action.metadata?.page) {
    snippet += ` on ${action.metadata.page}`;
  }
  
  return snippet;
}

/**
 * Search window actions using token-based similarity
 * @param actions List of window actions to search
 * @param query Search query string
 * @param options Search options for filtering and ranking
 * @returns Ranked search results
 */
export function searchActions(
  actions: WindowAction[], 
  query: string, 
  options: SearchOptions = {}
): SearchResult[] {
  const { 
    featureArea, 
    actionType, 
    minScore = 0.1, 
    limit = 20 
  } = options;
  
  // Tokenize query
  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) {
    return [];
  }
  
  const queryFreqs = calculateTermFrequency(queryTokens);
  
  // Calculate scores for each action
  const results: SearchResult[] = [];
  
  actions.forEach(action => {
    // Apply filters
    if (featureArea && action.featureArea !== featureArea) {
      return;
    }
    if (actionType && action.type !== actionType) {
      return;
    }
    
    // Combine all text fields for searching
    const actionText = [
      action.label,
      action.type,
      action.timestamp,
      action.metadata?.page,
      action.metadata?.value,
      action.metadata?.section
    ].filter(Boolean).join(' ');
    
    const actionTokens = tokenize(actionText);
    const actionFreqs = calculateTermFrequency(actionTokens);
    
    // Calculate similarity
    const matchScore = calculateCosineSimilarity(queryFreqs, actionFreqs);
    
    // Filter by minimum score
    if (matchScore >= minScore) {
      results.push({
        action,
        matchScore,
        contextSnippet: generateContextSnippet(action, queryTokens)
      });
    }
  });
  
  // Sort by score (highest first) and apply limit
  return results
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, limit);
}
