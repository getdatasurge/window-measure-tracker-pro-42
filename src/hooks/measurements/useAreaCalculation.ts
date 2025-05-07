
import { useState, useCallback } from 'react';

export function useAreaCalculation() {
  // State to hold the calculated area
  const [calculatedArea, setCalculatedArea] = useState<string>('');
  
  // Calculate area based on dimensions
  const calculateArea = useCallback((width: string, height: string, quantity: number = 1) => {
    if (!width || !height) {
      setCalculatedArea('');
      return;
    }
    
    // Parse numeric values
    const parseNumericValue = (value: string): number | null => {
      if (!value) return null;
      const numericStr = value.replace(/[^0-9.\/]/g, '');
      // Handle fractions like "36 1/2"
      if (numericStr.includes('/')) {
        const parts = numericStr.split('/');
        if (parts.length === 2) {
          return parseFloat(parts[0]) / parseFloat(parts[1]);
        }
        
        // Handle mixed numbers like "36 1/2"
        const spaceParts = numericStr.split(' ');
        if (spaceParts.length === 2) {
          const whole = parseFloat(spaceParts[0]);
          const fractionParts = spaceParts[1].split('/');
          if (fractionParts.length === 2) {
            return whole + (parseFloat(fractionParts[0]) / parseFloat(fractionParts[1]));
          }
        }
      }
      
      const parsed = parseFloat(numericStr);
      return isNaN(parsed) ? null : parsed;
    };
    
    const widthValue = parseNumericValue(width);
    const heightValue = parseNumericValue(height);
    
    if (widthValue && heightValue) {
      // Calculate area in square feet (converting from inches)
      const areaSqFt = (widthValue * heightValue * quantity) / 144;
      const formattedArea = `${areaSqFt.toFixed(2)} ft²`;
      
      // Update the calculated area state
      setCalculatedArea(formattedArea);
      
      return formattedArea;
    } else {
      setCalculatedArea('');
      return '';
    }
  }, []);
  
  return {
    calculatedArea,
    calculateArea
  };
}
