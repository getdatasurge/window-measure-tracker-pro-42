
/**
 * Direction options for measurements
 */

export type Direction = 'N' | 'S' | 'E' | 'W' | 'NE' | 'NW' | 'SE' | 'SW' | 'N/A';

export const DIRECTIONS: Direction[] = ['N', 'S', 'E', 'W', 'NE', 'NW', 'SE', 'SW', 'N/A'];

// Default direction to use when none is specified
export const DEFAULT_DIRECTION: Direction = 'N/A';

// Direction options for dropdown menus
export const DIRECTION_OPTIONS: Direction[] = DIRECTIONS;

export const getDirectionLabel = (direction: Direction): string => {
  switch (direction) {
    case 'N': return 'North';
    case 'S': return 'South';
    case 'E': return 'East';
    case 'W': return 'West';
    case 'NE': return 'Northeast';
    case 'NW': return 'Northwest';
    case 'SE': return 'Southeast';
    case 'SW': return 'Southwest';
    case 'N/A': return 'Not Applicable';
    default: return 'Unknown';
  }
};
