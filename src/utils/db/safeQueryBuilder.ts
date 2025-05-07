
import { supabase } from '@/integrations/supabase/client';
import { validateColumns, getAvailableColumns } from './schemaValidator';

/**
 * Options for safe query operations
 */
interface SafeQueryOptions {
  // Should validation errors be thrown or just logged?
  throwOnInvalid?: boolean;
  // Should we attempt to continue with valid columns if some are invalid?
  continueWithValidColumns?: boolean;
}

/**
 * A wrapper around Supabase query builder that validates columns before use
 */
export class SafeQueryBuilder {
  private tableName: string;
  private options: SafeQueryOptions;

  constructor(tableName: string, options: SafeQueryOptions = {}) {
    this.tableName = tableName;
    this.options = {
      throwOnInvalid: true,
      continueWithValidColumns: false,
      ...options
    };
  }

  /**
   * Safely select columns after validating them against the schema
   */
  async select(columns: string | string[]): Promise<any> {
    const columnArray = typeof columns === 'string' 
      ? columns === '*' ? [] : columns.split(',').map(c => c.trim())
      : columns;
    
    // If selecting all columns, no validation needed
    if (columns === '*' || columnArray.length === 0) {
      // Use type assertion to handle dynamic table names
      return supabase.from(this.tableName as any);
    }

    // Validate the requested columns
    const validation = await validateColumns(this.tableName, columnArray);
    
    if (!validation.valid) {
      const message = `Invalid columns for table '${this.tableName}': ${validation.invalidColumns.join(', ')}`;
      console.error(message);
      
      if (this.options.throwOnInvalid) {
        throw new Error(message);
      }
      
      if (this.options.continueWithValidColumns) {
        const validColumns = columnArray.filter(col => !validation.invalidColumns.includes(col));
        console.warn(`Continuing with valid columns only: ${validColumns.join(', ')}`);
        // Use type assertion to handle dynamic table names
        return supabase.from(this.tableName as any).select(validColumns.join(','));
      }
    }
    
    // Use type assertion to handle dynamic table names
    return supabase.from(this.tableName as any).select(columns);
  }

  /**
   * Safely insert data after validating fields against the schema
   */
  async insert(data: Record<string, any> | Record<string, any>[]): Promise<any> {
    const dataArray = Array.isArray(data) ? data : [data];
    
    if (dataArray.length === 0) {
      return { data: null, error: new Error('No data to insert') };
    }

    // Get all column names from the data
    const columnsToCheck = new Set<string>();
    dataArray.forEach(item => {
      Object.keys(item).forEach(key => columnsToCheck.add(key));
    });

    // Validate columns
    const validation = await validateColumns(this.tableName, Array.from(columnsToCheck));
    
    if (!validation.valid) {
      const message = `Cannot insert with invalid columns in table '${this.tableName}': ${validation.invalidColumns.join(', ')}`;
      console.error(message);
      
      if (this.options.throwOnInvalid) {
        throw new Error(message);
      }
      
      if (this.options.continueWithValidColumns) {
        // Remove invalid columns from the data
        const sanitizedData = dataArray.map(item => {
          const newItem = { ...item };
          validation.invalidColumns.forEach(col => delete newItem[col]);
          return newItem;
        });
        
        console.warn(`Inserting with only valid columns, removed: ${validation.invalidColumns.join(', ')}`);
        // Use type assertion to handle dynamic table names
        return supabase.from(this.tableName as any).insert(sanitizedData);
      }
      
      return { data: null, error: new Error(message) };
    }

    // Use type assertion to handle dynamic table names
    return supabase.from(this.tableName as any).insert(data);
  }

  /**
   * Safely update data after validating fields against the schema
   */
  async update(data: Record<string, any>): Promise<any> {
    // Validate columns
    const columnsToCheck = Object.keys(data);
    const validation = await validateColumns(this.tableName, columnsToCheck);
    
    if (!validation.valid) {
      const message = `Cannot update with invalid columns in table '${this.tableName}': ${validation.invalidColumns.join(', ')}`;
      console.error(message);
      
      if (this.options.throwOnInvalid) {
        throw new Error(message);
      }
      
      if (this.options.continueWithValidColumns) {
        // Remove invalid columns from the data
        const sanitizedData = { ...data };
        validation.invalidColumns.forEach(col => delete sanitizedData[col]);
        
        console.warn(`Updating with only valid columns, removed: ${validation.invalidColumns.join(', ')}`);
        // Use type assertion to handle dynamic table names
        return supabase.from(this.tableName as any).update(sanitizedData);
      }
      
      return { data: null, error: new Error(message) };
    }
    
    // Use type assertion to handle dynamic table names
    return supabase.from(this.tableName as any).update(data);
  }

  /**
   * Get a query builder for the table after checking for column existence
   */
  async queryBuilder(): Promise<any> {
    // Use type assertion to handle dynamic table names
    return supabase.from(this.tableName as any);
  }

  /**
   * Get all available columns for this table
   */
  async getColumns(): Promise<string[]> {
    return await getAvailableColumns(this.tableName);
  }
}

/**
 * Create a safe query builder for a table
 */
export function safeFrom(tableName: string, options?: SafeQueryOptions): SafeQueryBuilder {
  return new SafeQueryBuilder(tableName, options);
}
