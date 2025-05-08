
/**
 * Default application settings
 */

import { AppSettings } from './types';

export function getDefaultSettings(): AppSettings {
  return {
    theme: 'dark',
    sidebar: {
      expanded: true,
      position: 'left',
    },
    notifications: {
      enabled: true,
      sound: false,
      desktop: true,
      email: false,
    },
    display: {
      compactMode: false,
      tableRows: 10,
      dateFormat: 'MM/dd/yyyy',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
    measurements: {
      defaultUnit: 'inches',
      showCalculatedArea: true,
      roundTo: 2,
    },
  };
}
