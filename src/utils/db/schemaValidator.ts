
import { supabase } from '@/integrations/supabase/client';

// Type definitions for schema information
interface ColumnInfo {
  name: string;
  type: string;
  isNullable: boolean;
}

interface TableSchema {
  columns: ColumnInfo[];
  lastUpdated: number;
}

// Cache expiration time (30 minutes)
const CACHE_EXPIRATION = 30 * 60 * 1000;

// In-memory schema cache
const schemaCache: Record<string, TableSchema> = {};

/**
 * Fetches the schema for a given table directly from the database
 */
export async function fetchTableSchema(tableName: string): Promise<ColumnInfo[]> {
  try {
    console.log(`Fetching schema for table: ${tableName}`);
    
    // Query the PostgreSQL information_schema to get column details
    // Using a raw query instead of RPC since 'get_table_columns' is not recognized in type definitions
    const { data, error } = await supabase.rpc('get_table_columns', { 
      table_name: tableName 
    } as any);

    if (error) {
      console.error('Error fetching table schema:', error);
      
      // Fallback to a direct query if RPC is not available
      const { data: fallbackData, error: fallbackError } = await supabase
        .from('information_schema.columns' as any)
        .select('column_name, data_type, is_nullable')
        .eq('table_name', tableName)
        .eq('table_schema', 'public');
      
      if (fallbackError) {
        console.error('Fallback schema query also failed:', fallbackError);
        return [];
      }
      
      return ((fallbackData as any[]) || []).map(col => ({
        name: col.column_name,
        type: col.data_type,
        isNullable: col.is_nullable === 'YES'
      }));
    }

    // Transform the data to our ColumnInfo format
    return ((data as any[]) || []).map(col => ({
      name: col.column_name,
      type: col.data_type,
      isNullable: col.is_nullable === 'YES'
    }));
  } catch (err) {
    console.error('Error in fetchTableSchema:', err);
    return [];
  }
}

/**
 * Gets the schema for a table, using cache if available and not expired
 */
export async function getTableSchema(tableName: string): Promise<ColumnInfo[]> {
  // Check cache first
  const cachedSchema = schemaCache[tableName];
  const now = Date.now();
  
  if (cachedSchema && (now - cachedSchema.lastUpdated < CACHE_EXPIRATION)) {
    console.log(`Using cached schema for table: ${tableName}`);
    return cachedSchema.columns;
  }
  
  // Fetch fresh schema
  const columns = await fetchTableSchema(tableName);
  
  // Update cache
  schemaCache[tableName] = {
    columns,
    lastUpdated: now
  };
  
  return columns;
}

/**
 * Validates if a column exists in a table
 */
export async function validateColumn(tableName: string, columnName: string): Promise<boolean> {
  const schema = await getTableSchema(tableName);
  return schema.some(col => col.name === columnName);
}

/**
 * Validates multiple columns against a table schema
 */
export async function validateColumns(tableName: string, columnNames: string[]): Promise<{
  valid: boolean;
  invalidColumns: string[];
}> {
  const schema = await getTableSchema(tableName);
  const schemaColumnNames = schema.map(col => col.name);
  
  const invalidColumns = columnNames.filter(col => !schemaColumnNames.includes(col));
  
  return {
    valid: invalidColumns.length === 0,
    invalidColumns
  };
}

/**
 * Clears the schema cache for a specific table or all tables
 */
export function clearSchemaCache(tableName?: string): void {
  if (tableName) {
    delete schemaCache[tableName];
    console.log(`Cleared schema cache for table: ${tableName}`);
  } else {
    Object.keys(schemaCache).forEach(key => delete schemaCache[key]);
    console.log('Cleared entire schema cache');
  }
}

/**
 * Get all available columns for a table
 */
export async function getAvailableColumns(tableName: string): Promise<string[]> {
  const schema = await getTableSchema(tableName);
  return schema.map(col => col.name);
}

// Create a stored procedure to get table columns if it doesn't exist
export async function setupSchemaValidator(): Promise<void> {
  try {
    // Use as any to bypass TypeScript's RPC validation
    const { error } = await supabase.rpc('get_table_columns', { 
      table_name: 'measurements' 
    } as any);
    
    // If the function doesn't exist, we'll get a specific error
    if (error && error.message.includes('function get_table_columns() does not exist')) {
      console.log('Creating get_table_columns function...');
      
      // We'll need to ask the user to create this function through proper SQL migration
      console.warn('Schema validator requires the get_table_columns database function. Please run the SQL migration.');
    }
  } catch (err) {
    console.error('Error setting up schema validator:', err);
  }
}

// Initialize the validator
setupSchemaValidator().catch(console.error);
