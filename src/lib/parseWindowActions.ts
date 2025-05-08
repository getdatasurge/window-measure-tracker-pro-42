/**
 * Parses a markdown file containing window actions into structured JSON
 */

export interface WindowAction {
  id: string;
  type: string;
  label: string;
  timestamp: string;
  featureArea?: string; // Added featureArea field
  metadata?: Record<string, any>;
}

/**
 * Parse markdown content into structured window actions
 * @param markdownContent The raw markdown content to parse
 * @returns Array of parsed window actions
 */
export function parseWindowActions(markdownContent: string | null): WindowAction[] {
  if (!markdownContent) {
    console.warn('No markdown content provided to parseWindowActions');
    return [];
  }
  
  const actions: WindowAction[] = [];
  let currentType: string = "unknown";
  
  // Split content into lines and process each line
  const splitContent = typeof markdownContent === 'string' ? markdownContent.split('\n') : [];
  
  splitContent.forEach((line, index) => {
    // Check if line is a heading (category/type marker)
    if (line.startsWith('# ') || line.startsWith('## ') || line.startsWith('### ')) {
      currentType = line.replace(/^[#\s]+/, '').trim();
      return;
    }
    
    // Check if line is a bullet point (action item)
    if (line.startsWith('- ') || line.startsWith('* ')) {
      try {
        const actionText = line.substring(2).trim();
        
        // Extract timestamp if it exists (format: [YYYY-MM-DD HH:mm:ss])
        const timestampMatch = actionText.match(/\[([\d-]+\s[\d:]+)\]/);
        const timestamp = timestampMatch ? timestampMatch[1] : '';
        
        // Extract label - everything before the timestamp or the whole text if no timestamp
        let label = timestampMatch 
          ? actionText.substring(0, timestampMatch.index).trim() 
          : actionText;
          
        // Clean up label if it ends with a colon (potentially has metadata)
        const metadataStart = label.indexOf(':');
        let metadata = {};
        
        if (metadataStart > 0) {
          // Try to parse metadata as key-value pairs
          const metadataText = actionText.substring(metadataStart + 1).trim();
          try {
            metadata = parseMetadata(metadataText);
            // Adjust label to exclude the metadata part
            label = label.substring(0, metadataStart).trim();
          } catch (e) {
            // If metadata parsing fails, keep the original label
          }
        }
        
        // Generate a unique ID
        const id = `action-${currentType}-${index}`;
        
        actions.push({
          id,
          type: currentType,
          label,
          timestamp: timestamp || 'Unknown',
          metadata
        });
      } catch (error) {
        console.error(`Error parsing line: "${line}"`, error);
        // Add a fallback action for malformed entries
        actions.push({
          id: `error-${index}`,
          type: 'error',
          label: `Failed to parse: ${line}`,
          timestamp: 'Unknown',
          metadata: { error: (error as Error).message }
        });
      }
    }
  });
  
  return actions;
}

/**
 * Parse metadata text into key-value pairs
 * @param text Metadata text in format "key1=value1, key2=value2"
 */
function parseMetadata(text: string): Record<string, any> {
  if (!text) return {};
  
  const metadata: Record<string, any> = {};
  
  // Split by commas, but not commas within quotes
  const pairs = text.match(/(?:[^,"]|"(?:\\.|[^"])*")+/g) || [];
  
  pairs.forEach(pair => {
    const [key, value] = pair.split('=').map(s => s.trim());
    if (key && value !== undefined) {
      // Handle quoted values
      if (value.startsWith('"') && value.endsWith('"')) {
        metadata[key] = value.slice(1, -1);
      } 
      // Handle numeric values
      else if (!isNaN(Number(value))) {
        metadata[key] = Number(value);
      }
      // Handle boolean values
      else if (value.toLowerCase() === 'true') {
        metadata[key] = true;
      }
      else if (value.toLowerCase() === 'false') {
        metadata[key] = false;
      }
      // Default to string
      else {
        metadata[key] = value;
      }
    }
  });
  
  return metadata;
}

/**
 * Group window actions by type
 * @param actions Array of window actions
 * @returns Object with types as keys and arrays of actions as values
 */
export function groupActionsByType(actions: WindowAction[]): Record<string, WindowAction[]> {
  return actions.reduce((groups, action) => {
    const type = action.type || 'unknown';
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push(action);
    return groups;
  }, {} as Record<string, WindowAction[]>);
}

// Mock function to read markdown file content (for client-side usage)
export async function readMarkdownFile(filePath: string): Promise<string> {
  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`Failed to fetch markdown file: ${response.status}`);
    }
    return response.text();
  } catch (error) {
    console.error('Error reading markdown file:', error);
    return '';
  }
}

/**
 * Enriches window actions with additional metadata like feature areas
 * @param actions Array of window actions
 * @returns Enriched window actions
 */
export function enrichActions(actions: WindowAction[]): WindowAction[] {
  // This function will be used to apply transformations like feature area assignment
  // The actual implementation is in assignFeatureArea.ts to keep this file clean
  return actions;
}
