
/**
 * Hook for interacting with measurement subscriptions
 */

// This file now re-exports the hook from the measurements directory
// to maintain backward compatibility with existing code
import { useMeasurementSubscription as useSubscription } from './measurements/useMeasurementSubscription';
import type { MeasurementSubscriptionOptions, SubscriptionState } from './measurements/types/subscriptionTypes';

export type { SubscriptionState, MeasurementSubscriptionOptions };
export const useMeasurementSubscription = useSubscription;
