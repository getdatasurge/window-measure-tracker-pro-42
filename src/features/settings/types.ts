
/**
 * Settings types definition
 */

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  sidebar: {
    expanded: boolean;
    position: 'left' | 'right';
  };
  notifications: {
    enabled: boolean;
    sound: boolean;
    desktop: boolean;
    email: boolean;
  };
  display: {
    compactMode: boolean;
    tableRows: number;
    dateFormat: string;
    timezone: string;
  };
  defaultProject?: string;
  measurements: {
    defaultUnit: 'inches' | 'feet' | 'cm' | 'mm';
    showCalculatedArea: boolean;
    roundTo: number;
  };
}

export interface UserPreferences {
  language: string;
  startPage: string;
  recentProjects: string[];
  savedFilters: Record<string, any>;
}
