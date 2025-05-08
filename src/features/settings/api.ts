
/**
 * Settings API functions
 * 
 * These functions handle settings data operations, with local storage as the primary storage.
 */

import { AppSettings, UserPreferences } from './types';
import { getDefaultSettings } from './defaultSettings';
import * as offlineStore from '../../services/cache/offlineStore';

const SETTINGS_ID = 'app_settings';
const PREFERENCES_ID = 'user_preferences';

/**
 * Fetch application settings
 * Always available offline from local storage
 */
export async function fetchSettings(): Promise<AppSettings> {
  console.log('Fetching settings');
  
  try {
    // First try to get from IndexedDB
    const settings = await offlineStore.getEntity<AppSettings>('settings', SETTINGS_ID);
    
    if (settings) {
      console.log('Using cached settings');
      return settings;
    }
    
    // If not in IndexedDB, try localStorage (for backwards compatibility)
    const localSettings = localStorage.getItem('app_settings');
    if (localSettings) {
      try {
        const parsed = JSON.parse(localSettings) as AppSettings;
        
        // Store in IndexedDB for future use
        await offlineStore.storeEntity('settings', SETTINGS_ID, parsed);
        
        return parsed;
      } catch (e) {
        console.error('Error parsing settings from localStorage:', e);
      }
    }
    
    // If no settings found, use defaults
    const defaultSettings = getDefaultSettings();
    await offlineStore.storeEntity('settings', SETTINGS_ID, defaultSettings);
    
    return defaultSettings;
  } catch (error) {
    console.error('Error fetching settings:', error);
    return getDefaultSettings();
  }
}

/**
 * Update application settings
 * Works offline by storing in local storage
 */
export async function updateSettings(settings: Partial<AppSettings>): Promise<AppSettings> {
  console.log('Updating settings:', settings);
  
  try {
    // Get current settings
    const currentSettings = await fetchSettings();
    
    // Merge with new settings
    const updatedSettings: AppSettings = {
      ...currentSettings,
      ...settings
    };
    
    // Store in IndexedDB
    await offlineStore.storeEntity('settings', SETTINGS_ID, updatedSettings);
    
    // Also update localStorage for backwards compatibility
    localStorage.setItem('app_settings', JSON.stringify(updatedSettings));
    
    return updatedSettings;
  } catch (error) {
    console.error('Error updating settings:', error);
    throw error;
  }
}

/**
 * Fetch user preferences
 */
export async function fetchPreferences(): Promise<UserPreferences> {
  console.log('Fetching user preferences');
  
  try {
    // First try to get from IndexedDB
    const preferences = await offlineStore.getEntity<UserPreferences>('settings', PREFERENCES_ID);
    
    if (preferences) {
      return preferences;
    }
    
    // If not in IndexedDB, try localStorage
    const localPreferences = localStorage.getItem('user_preferences');
    if (localPreferences) {
      try {
        const parsed = JSON.parse(localPreferences) as UserPreferences;
        
        // Store in IndexedDB for future use
        await offlineStore.storeEntity('settings', PREFERENCES_ID, parsed);
        
        return parsed;
      } catch (e) {
        console.error('Error parsing preferences from localStorage:', e);
      }
    }
    
    // Default preferences
    const defaultPreferences: UserPreferences = {
      language: 'en',
      startPage: 'dashboard',
      recentProjects: [],
      savedFilters: {}
    };
    
    await offlineStore.storeEntity('settings', PREFERENCES_ID, defaultPreferences);
    
    return defaultPreferences;
  } catch (error) {
    console.error('Error fetching user preferences:', error);
    
    // Return default preferences
    return {
      language: 'en',
      startPage: 'dashboard',
      recentProjects: [],
      savedFilters: {}
    };
  }
}

/**
 * Update user preferences
 */
export async function updatePreferences(preferences: Partial<UserPreferences>): Promise<UserPreferences> {
  console.log('Updating user preferences:', preferences);
  
  try {
    // Get current preferences
    const currentPreferences = await fetchPreferences();
    
    // Merge with new preferences
    const updatedPreferences: UserPreferences = {
      ...currentPreferences,
      ...preferences
    };
    
    // Store in IndexedDB
    await offlineStore.storeEntity('settings', PREFERENCES_ID, updatedPreferences);
    
    // Also update localStorage for backwards compatibility
    localStorage.setItem('user_preferences', JSON.stringify(updatedPreferences));
    
    return updatedPreferences;
  } catch (error) {
    console.error('Error updating user preferences:', error);
    throw error;
  }
}
