
// Export the allowed direction options as an array
export const DIRECTION_OPTIONS = [
  'North',
  'South', 
  'East', 
  'West',
  'Northeast',
  'Northwest',
  'Southeast',
  'Southwest',
  'N/A', // Including N/A as a valid option
] as const;

// Create a Direction type from the array values
// This ensures type safety when using direction values
export type Direction = typeof DIRECTION_OPTIONS[number];

// Export a default direction value to use when initializing forms
export const DEFAULT_DIRECTION: Direction = 'N/A';
