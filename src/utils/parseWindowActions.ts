
import { Direction, DIRECTION_OPTIONS } from '@/constants/direction';

/**
 * Safely parse a direction string to ensure it's a valid Direction type
 * @param directionString The string to parse
 * @returns A valid Direction or default 'N/A'
 */
export function parseDirection(directionString: string | undefined): Direction {
  if (!directionString || !DIRECTION_OPTIONS.includes(directionString as Direction)) {
    return 'N/A';
  }
  return directionString as Direction;
}

/**
 * Safely parse an input source string
 * @param source The input source string
 * @returns The parsed input source or undefined
 */
export function parseInputSource(source: string | undefined): string | undefined {
  return source;
}
