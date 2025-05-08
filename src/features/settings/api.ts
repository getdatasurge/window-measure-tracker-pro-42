
/**
 * Settings API functions
 * 
 * These functions handle settings operations, storing data in localStorage.
 * In public mode, settings are kept only for the current session.
 */

import { AppSettings, UserPreferences } from './types';
import { DEFAULT_APP_SETTINGS, DEFAULT_USER_PREFERENCES } from './defaultSettings';

// Storage keys
const SETTINGS_KEY = 'wintracker_app_settings';
const PREFERENCES_KEY = 'wintracker_user_preferences';

/**
 * Get application settings
 * In public mode, returns from localStorage or defaults
 */
export function getAppSettings(): AppSettings {
  try {
    const storedSettings = localStorage.getItem(SETTINGS_KEY);
    if (storedSettings) {
      return JSON.parse(storedSettings) as AppSettings;
    }
  } catch (err) {
    console.error('Error retrieving app settings:', err);
  }
  
  return DEFAULT_APP_SETTINGS;
}

/**
 * Save application settings
 * In public mode, saves to localStorage
 */
export function saveAppSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (err) {
    console.error('Error saving app settings:', err);
  }
}

/**
 * Update specific settings
 * In public mode, updates localStorage
 */
export function updateAppSettings(updates: Partial<AppSettings>): AppSettings {
  const currentSettings = getAppSettings();
  const updatedSettings = {
    ...currentSettings,
    ...updates,
  };
  
  saveAppSettings(updatedSettings);
  return updatedSettings;
}

/**
 * Get user preferences
 * In public mode, returns from localStorage or defaults
 */
export function getUserPreferences(): UserPreferences {
  try {
    const storedPreferences = localStorage.getItem(PREFERENCES_KEY);
    if (storedPreferences) {
      return JSON.parse(storedPreferences) as UserPreferences;
    }
  } catch (err) {
    console.error('Error retrieving user preferences:', err);
  }
  
  return DEFAULT_USER_PREFERENCES;
}

/**
 * Save user preferences
 * In public mode, saves to localStorage
 */
export function saveUserPreferences(preferences: UserPreferences): void {
  try {
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
  } catch (err) {
    console.error('Error saving user preferences:', err);
  }
}

/**
 * Update specific preferences
 * In public mode, updates localStorage
 */
export function updateUserPreferences(updates: Partial<UserPreferences>): UserPreferences {
  const currentPreferences = getUserPreferences();
  const updatedPreferences = {
    ...currentPreferences,
    ...updates,
  };
  
  saveUserPreferences(updatedPreferences);
  return updatedPreferences;
}

/**
 * Reset all settings to defaults
 * In public mode, clears localStorage
 */
export function resetAllSettings(): void {
  try {
    localStorage.removeItem(SETTINGS_KEY);
    localStorage.removeItem(PREFERENCES_KEY);
  } catch (err) {
    console.error('Error resetting settings:', err);
  }
}

/**
 * Add a project to recent projects list
 */
export function addRecentProject(projectId: string, projectName: string): void {
  const preferences = getUserPreferences();
  
  // Create a new array with the project at the beginning
  const recentProjects = [
    projectId,
    ...preferences.recentProjects.filter(id => id !== projectId)
  ].slice(0, 10); // Keep only the 10 most recent
  
  // Save the updated preferences
  saveUserPreferences({
    ...preferences,
    recentProjects
  });
  
  // Also save the project name for easy lookup
  try {
    localStorage.setItem(`project_${projectId}`, projectName);
  } catch (err) {
    console.error('Error saving project name:', err);
  }
}
