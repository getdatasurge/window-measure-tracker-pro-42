
/**
 * React hooks for settings management
 */

import { useState, useCallback, useEffect } from 'react';
import { AppSettings, UserPreferences } from './types';
import { fetchSettings, updateSettings, fetchPreferences, updatePreferences } from './api';

/**
 * Hook for managing application settings
 */
export function useSettings() {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Fetch settings
  const getSettings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchSettings();
      setSettings(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch settings'));
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Update settings
  const saveSettings = useCallback(async (newSettings: Partial<AppSettings>) => {
    try {
      const updatedSettings = await updateSettings(newSettings);
      setSettings(updatedSettings);
      return updatedSettings;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update settings'));
      throw err;
    }
  }, []);
  
  // Load initial settings
  useEffect(() => {
    getSettings();
  }, [getSettings]);
  
  return { settings, loading, error, saveSettings, refreshSettings: getSettings };
}

/**
 * Hook for managing user preferences
 */
export function usePreferences() {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Fetch preferences
  const getPreferences = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchPreferences();
      setPreferences(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch preferences'));
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Update preferences
  const savePreferences = useCallback(async (newPreferences: Partial<UserPreferences>) => {
    try {
      const updatedPreferences = await updatePreferences(newPreferences);
      setPreferences(updatedPreferences);
      return updatedPreferences;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update preferences'));
      throw err;
    }
  }, []);
  
  // Update recent projects
  const addRecentProject = useCallback(async (projectId: string, projectName: string) => {
    if (!preferences) return;
    
    // Create entry for recent projects list
    const projectEntry = { id: projectId, name: projectName };
    
    // Remove duplicates and add to front of array
    const existingProjects = preferences.recentProjects.filter(id => id !== projectId);
    const updatedRecentProjects = [projectId, ...existingProjects].slice(0, 5); // Keep only 5 most recent
    
    // Update preferences
    await savePreferences({ recentProjects: updatedRecentProjects });
    
    // Also store name mapping in localStorage
    try {
      const recentProjectsMap = JSON.parse(localStorage.getItem('recentProjectsMap') || '{}');
      localStorage.setItem('recentProjectsMap', JSON.stringify({
        ...recentProjectsMap,
        [projectId]: projectName
      }));
    } catch (e) {
      console.error('Error updating recent projects map:', e);
    }
  }, [preferences, savePreferences]);
  
  // Load initial preferences
  useEffect(() => {
    getPreferences();
  }, [getPreferences]);
  
  return { 
    preferences, 
    loading, 
    error, 
    savePreferences, 
    refreshPreferences: getPreferences,
    addRecentProject
  };
}
