
/**
 * Hook for interacting with measurement subscriptions
 */

// This file now re-exports the hook from the measurements directory
// to maintain backward compatibility with existing code
import { useMeasurementSubscription as useSubscription } from '../features/measurements/hooks';
import type { SubscriptionState } from '../features/measurements/hooks';

export type { SubscriptionState };
export const useMeasurementSubscription = useSubscription;
