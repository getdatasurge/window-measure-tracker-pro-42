
/**
 * Utility for assigning feature areas to window actions based on content analysis
 */

import { WindowAction } from "@/lib/parseWindowActions";

// Feature area definitions with detection patterns
export type FeatureArea = 'auth' | 'dashboard' | 'checkout' | 'settings' | 'reporting' | 'general';

interface FeatureAreaDetector {
  area: FeatureArea;
  patterns: RegExp[];
}

// Define patterns for each feature area
const featureDetectors: FeatureAreaDetector[] = [
  {
    area: 'auth',
    patterns: [
      /login/i, 
      /register/i, 
      /sign[- ]?in/i, 
      /sign[- ]?up/i, 
      /password/i, 
      /authentication/i,
      /session/i
    ]
  },
  {
    area: 'dashboard',
    patterns: [
      /dashboard/i, 
      /overview/i, 
      /project list/i, 
      /home/i, 
      /summary/i,
      /analytics/i
    ]
  },
  {
    area: 'checkout',
    patterns: [
      /checkout/i, 
      /payment/i, 
      /cart/i, 
      /purchase/i, 
      /stripe/i, 
      /billing/i,
      /order/i
    ]
  },
  {
    area: 'settings',
    patterns: [
      /settings/i, 
      /preferences/i, 
      /profile/i, 
      /account/i, 
      /config/i,
      /customize/i
    ]
  },
  {
    area: 'reporting',
    patterns: [
      /report/i, 
      /analytics/i, 
      /statistics/i, 
      /metrics/i, 
      /data/i, 
      /chart/i,
      /graph/i
    ]
  }
];

/**
 * Determines the feature area for a window action
 * 
 * @param action The window action to analyze
 * @returns The determined feature area or 'general' if no match
 */
export function assignFeatureArea(action: WindowAction): FeatureArea {
  const textToAnalyze = [
    action.label,
    action.type,
    action.metadata?.page,
    action.metadata?.section,
    action.metadata?.value
  ].filter(Boolean).join(' ').toLowerCase();
  
  // Check each feature area's patterns against the text
  for (const detector of featureDetectors) {
    for (const pattern of detector.patterns) {
      if (pattern.test(textToAnalyze)) {
        return detector.area;
      }
    }
  }
  
  // Default to 'general' if no patterns match
  return 'general';
}

/**
 * Group a list of window actions by their feature areas
 * 
 * @param actions List of window actions
 * @returns Object with feature areas as keys and arrays of actions as values
 */
export function groupActionsByFeatureArea(actions: WindowAction[]): Record<FeatureArea, WindowAction[]> {
  const result = {
    auth: [],
    dashboard: [],
    checkout: [],
    settings: [],
    reporting: [],
    general: []
  } as Record<FeatureArea, WindowAction[]>;
  
  actions.forEach(action => {
    const featureArea = assignFeatureArea(action);
    result[featureArea].push({
      ...action,
      featureArea
    });
  });
  
  return result;
}
