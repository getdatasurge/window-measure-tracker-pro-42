
/**
 * Valid directions for measurements
 */
export type Direction = 'N' | 'NE' | 'E' | 'SE' | 'S' | 'SW' | 'W' | 'NW' | 'N/A';

/**
 * Default direction to use when none is specified
 */
export const DEFAULT_DIRECTION: Direction = 'N/A';

/**
 * Options for direction selection
 */
export const DIRECTION_OPTIONS = [
  { value: 'N', label: 'North' },
  { value: 'NE', label: 'North East' },
  { value: 'E', label: 'East' },
  { value: 'SE', label: 'South East' },
  { value: 'S', label: 'South' },
  { value: 'SW', label: 'South West' },
  { value: 'W', label: 'West' },
  { value: 'NW', label: 'North West' },
  { value: 'N/A', label: 'Not Applicable' }
];
