
import { Measurement } from '@/types/measurement';

export const formatMeasurement = (measurement: Measurement): Measurement => {
  // Format all measurement values for display
  return {
    ...measurement,
    width: typeof measurement.width === 'number' ? measurement.width.toFixed(2) : measurement.width,
    height: typeof measurement.height === 'number' ? measurement.height.toFixed(2) : measurement.height,
    area: typeof measurement.area === 'number' ? `${measurement.area.toFixed(2)} ft²` : measurement.area,
    quantity: measurement.quantity || 1,
    status: measurement.status ? measurement.status.charAt(0).toUpperCase() + measurement.status.slice(1) : 'Pending',
    installationDate: measurement.installationDate || '',
    film_required: measurement.film_required !== false
  };
};
