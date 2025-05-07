import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface DimensionsFieldsProps {
  register: any;
  errors: any;
  watch?: any;
  setValue?: any;
}

const DimensionsFields: React.FC<DimensionsFieldsProps> = ({ 
  register, 
  errors,
  watch,
  setValue
}) => {
  const [widthFractions] = useState(['1/8', '1/4', '3/8', '1/2', '5/8', '3/4', '7/8']);
  const [heightFractions] = useState(['1/8', '1/4', '3/8', '1/2', '5/8', '3/4', '7/8']);
  
  // Calculate and display area if width and height inputs are available
  const width = watch ? watch('width') : '';
  const height = watch ? watch('height') : '';
  const quantity = watch ? watch('quantity') || 1 : 1;
  
  const [area, setArea] = useState<string | null>(null);
  
  useEffect(() => {
    if (width && height) {
      try {
        // Parse the width and height values
        const parseValue = (val: string): number => {
          // Handle fractions like "1/2" or mixed numbers like "36 1/2"
          if (val.includes('/')) {
            const parts = val.split(' ');
            if (parts.length === 1) {
              // Simple fraction like "1/2"
              const fracParts = parts[0].split('/');
              return parseFloat(fracParts[0]) / parseFloat(fracParts[1]);
            } else {
              // Mixed number like "36 1/2"
              const whole = parseFloat(parts[0]);
              const fracParts = parts[1].split('/');
              return whole + (parseFloat(fracParts[0]) / parseFloat(fracParts[1]));
            }
          } else {
            return parseFloat(val);
          }
        };
        
        let widthVal = parseFloat(width);
        if (isNaN(widthVal)) {
          widthVal = parseValue(width);
        }
        
        let heightVal = parseFloat(height);
        if (isNaN(heightVal)) {
          heightVal = parseValue(height);
        }
        
        if (!isNaN(widthVal) && !isNaN(heightVal)) {
          // Calculate area in square inches, then convert to square feet
          const areaInSqFeet = (widthVal * heightVal * quantity) / 144;
          setArea(`${areaInSqFeet.toFixed(2)} ft²`);
          
          // If setValue is available, update the form value
          if (setValue) {
            setValue('area', areaInSqFeet.toFixed(2));
          }
        } else {
          setArea(null);
        }
      } catch (error) {
        console.error('Error calculating area:', error);
        setArea(null);
      }
    } else {
      setArea(null);
    }
  }, [width, height, quantity, setValue]);

  const appendFraction = (field: string, fraction: string) => {
    if (!setValue) return;
    
    const currentValue = watch(field) || '';
    let newValue = '';
    
    // If the current value already has a whole number
    if (currentValue && /^\d+$/.test(currentValue)) {
      newValue = `${currentValue} ${fraction}`;
    } else if (currentValue && /^\d+ \d+\/\d+$/.test(currentValue)) {
      // If it already has a fraction, replace it
      newValue = currentValue.split(' ')[0] + ` ${fraction}`;
    } else {
      // Otherwise just use the fraction
      newValue = fraction;
    }
    
    setValue(field, newValue);
    
    // Store last used fraction in localStorage
    if (field === 'width') {
      localStorage.setItem('lastWidthFraction', fraction);
    } else if (field === 'height') {
      localStorage.setItem('lastHeightFraction', fraction);
    }
    
    // Update UI to highlight the selected fraction
    document.querySelectorAll(`[data-${field}-fraction]`).forEach(el => {
      (el as HTMLElement).classList.remove('bg-zinc-700');
    });
    
    document.querySelectorAll(`[data-${field}-fraction="${fraction}"]`).forEach(el => {
      (el as HTMLElement).classList.add('bg-zinc-700');
    });
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="width" className="text-sm font-medium">
            Width (inches) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="width"
            placeholder="e.g. 36 or 36 1/2"
            className={`${errors.width ? 'border-red-500' : ''}`}
            {...register('width', {
              required: 'Width is required'
            })}
            aria-invalid={errors.width ? 'true' : 'false'}
            aria-describedby="width-error"
          />
          {errors.width && (
            <p id="width-error" className="text-xs text-red-500 mt-1">{errors.width.message}</p>
          )}
          
          {setValue && watch && (
            <div className="flex flex-wrap gap-1 mt-1">
              {widthFractions.map((fraction) => (
                <Button
                  key={`width-${fraction}`}
                  type="button"
                  size="sm"
                  variant="outline"
                  className="h-6 text-xs px-1"
                  onClick={() => appendFraction('width', fraction)}
                  data-width-fraction={fraction}
                  aria-label={`Add ${fraction} inch to width`}
                >
                  {fraction}
                </Button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="height" className="text-sm font-medium">
            Height (inches) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="height"
            placeholder="e.g. 48 or 48 3/4"
            className={`${errors.height ? 'border-red-500' : ''}`}
            {...register('height', {
              required: 'Height is required'
            })}
            aria-invalid={errors.height ? 'true' : 'false'}
            aria-describedby="height-error"
          />
          {errors.height && (
            <p id="height-error" className="text-xs text-red-500 mt-1">{errors.height.message}</p>
          )}
          
          {setValue && watch && (
            <div className="flex flex-wrap gap-1 mt-1">
              {heightFractions.map((fraction) => (
                <Button
                  key={`height-${fraction}`}
                  type="button"
                  size="sm"
                  variant="outline"
                  className="h-6 text-xs px-1"
                  onClick={() => appendFraction('height', fraction)}
                  data-height-fraction={fraction}
                  aria-label={`Add ${fraction} inch to height`}
                >
                  {fraction}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="quantity" className="text-sm font-medium">Quantity</Label>
          <Input
            id="quantity"
            type="number"
            min="1"
            defaultValue="1"
            {...register('quantity', {
              valueAsNumber: true,
              min: { value: 1, message: 'Quantity must be at least 1' }
            })}
          />
          {errors.quantity && (
            <p className="text-xs text-red-500 mt-1">{errors.quantity.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="area" className="text-sm font-medium">Area (calculated)</Label>
          <Input
            id="area"
            value={area || ''}
            readOnly
            className="bg-zinc-800"
            aria-label="Calculated area"
          />
          <p className="text-xs text-zinc-400">Automatically calculated</p>
        </div>
      </div>
    </>
  );
};

export default DimensionsFields;
