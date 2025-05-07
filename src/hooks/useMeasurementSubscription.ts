
// This file now re-exports the hook from the measurements directory
// to maintain backward compatibility with existing code
import { useMeasurementSubscription as useSubscription } from './measurements/useMeasurementSubscription';

export const useMeasurementSubscription = useSubscription;
