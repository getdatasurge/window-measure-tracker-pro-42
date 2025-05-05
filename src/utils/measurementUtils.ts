
/**
 * Helper function to convert fractional string measurements to decimal
 * Handles formats like "2 1/2" converting to 2.5
 */
export const fractionToDecimal = (input: string): number => {
  // Remove any extra spaces and trim
  const trimmedInput = input.trim();
  
  // Check if input is already a number
  if (!isNaN(Number(trimmedInput))) {
    return Number(trimmedInput);
  }
  
  // Handle inputs like "2 1/2"
  const wholeFractionRegex = /^(\d+)\s+(\d+)\/(\d+)$/;
  const wholeFractionMatch = trimmedInput.match(wholeFractionRegex);
  if (wholeFractionMatch) {
    const whole = parseInt(wholeFractionMatch[1], 10);
    const numerator = parseInt(wholeFractionMatch[2], 10);
    const denominator = parseInt(wholeFractionMatch[3], 10);
    if (denominator === 0) return whole; // Prevent division by zero
    return whole + (numerator / denominator);
  }
  
  // Handle inputs like "1/2"
  const fractionRegex = /^(\d+)\/(\d+)$/;
  const fractionMatch = trimmedInput.match(fractionRegex);
  if (fractionMatch) {
    const numerator = parseInt(fractionMatch[1], 10);
    const denominator = parseInt(fractionMatch[2], 10);
    if (denominator === 0) return 0; // Prevent division by zero
    return numerator / denominator;
  }
  
  // If no patterns match, just try to convert directly
  return Number(trimmedInput) || 0;
};

/**
 * Helper function to generate a new measurement record with default values
 */
export const generateNewMeasurement = (defaultValues: Partial<any> = {}): any => {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    projectId: '',
    projectName: '',
    location: '',
    width: '',
    height: '',
    depth: '',
    area: '',
    quantity: 1,
    status: 'pending',
    film_required: true,
    requires_special_tools: false,
    notes: '',
    createdAt: now,
    updatedAt: now,
    updatedBy: 'current-user', // This would typically be populated from context
    window_type: '',
    glass_type: '',
    ...defaultValues
  };
};
