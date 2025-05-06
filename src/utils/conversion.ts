
/**
 * Convert a fraction string (like '1/2' or '3 1/4') to decimal
 */
export const fractionToDecimal = (value: string): number => {
  // Handle empty values
  if (!value || value === '') return 0;

  // If it's already a number, just return it
  if (!isNaN(Number(value))) return Number(value);

  // Check for mixed number format (e.g., "3 1/2")
  const mixedMatch = value.match(/^(\d+)\s+(\d+)\/(\d+)$/);
  if (mixedMatch) {
    const whole = parseInt(mixedMatch[1], 10);
    const numerator = parseInt(mixedMatch[2], 10);
    const denominator = parseInt(mixedMatch[3], 10);
    return whole + (numerator / denominator);
  }

  // Check for simple fraction format (e.g., "1/2")
  const fractionMatch = value.match(/^(\d+)\/(\d+)$/);
  if (fractionMatch) {
    const numerator = parseInt(fractionMatch[1], 10);
    const denominator = parseInt(fractionMatch[2], 10);
    return numerator / denominator;
  }

  // If no patterns match, try to parse as number
  const parsed = parseFloat(value);
  return isNaN(parsed) ? 0 : parsed;
};
