
/**
 * Default settings for the application
 */

import { AppSettings, UserPreferences } from './types';

export const DEFAULT_APP_SETTINGS: AppSettings = {
  theme: 'system',
  sidebar: {
    expanded: true,
    position: 'left',
  },
  notifications: {
    enabled: true,
    sound: true,
    desktop: true,
    email: false,
  },
  display: {
    compactMode: false,
    tableRows: 10,
    dateFormat: 'MMM dd, yyyy',
    timezone: 'America/New_York',
  },
  measurements: {
    defaultUnit: 'inches',
    showCalculatedArea: true,
    roundTo: 2,
  }
};

export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  language: 'en-US',
  startPage: 'dashboard',
  recentProjects: [],
  savedFilters: {},
};
