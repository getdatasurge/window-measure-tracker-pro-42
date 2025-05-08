
/**
 * Hook for interacting with measurement subscriptions
 */

// This file now re-exports the hook from the measurements directory
// to maintain backward compatibility with existing code
import { useMeasurementSubscription as useSubscription, SubscriptionState } from '../features/measurements/hooks';

export { SubscriptionState };
export const useMeasurementSubscription = useSubscription;
