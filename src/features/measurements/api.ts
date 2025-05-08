/**
 * Measurement API functions
 * 
 * These functions handle measurement data operations with offline support.
 */

import { v4 as uuidv4 } from 'uuid';
import { Measurement } from './types';
import * as offlineStore from '../../services/cache/offlineStore';
import * as syncQueue from '../../services/sync/syncQueue';
import { getOnlineStatus } from '../../services/network/networkStatus';
import { MeasurementStatus } from '@/types/measurement';

/**
 * Fetch measurements for a project
 */
export async function fetchMeasurements(projectId?: string): Promise<Measurement[]> {
  console.log(`Fetching measurements${projectId ? ` for project ${projectId}` : ''}`);
  
  try {
    // Try to get from local cache first
    const cachedMeasurements = await offlineStore.getAllEntities<Measurement>('measurements');
    
    // Filter by projectId if specified
    const filteredMeasurements = projectId 
      ? cachedMeasurements.filter(m => m.projectId === projectId) 
      : cachedMeasurements;
    
    if (filteredMeasurements.length > 0) {
      console.log('Using cached measurements:', filteredMeasurements.length);
      return filteredMeasurements;
    }
    
    // Generate demo measurements for public mode
    const demoMeasurements: Measurement[] = [
      {
        id: 'demo-1',
        projectId: projectId || 'public-project',
        projectName: 'Demo Project',
        location: 'Living Room Window',
        width: '36',
        height: '48',
        area: '12',
        quantity: 1,
        recordedBy: 'demo-user',
        direction: 'N',
        notes: 'Demo measurement',
        status: 'Pending',
        updatedAt: new Date().toISOString(),
        updatedBy: 'Demo User',
        measurementDate: new Date().toISOString()
      },
      {
        id: 'demo-2',
        projectId: projectId || 'public-project',
        projectName: 'Demo Project',
        location: 'Kitchen Window',
        width: '24',
        height: '36',
        area: '6',
        quantity: 2,
        recordedBy: 'demo-user',
        direction: 'S',
        notes: 'Special film required',
        film_required: true,
        status: 'Pending',
        updatedAt: new Date(Date.now() - 86400000).toISOString(),
        updatedBy: 'Demo User',
        measurementDate: new Date(Date.now() - 86400000).toISOString()
      }
    ];
    
    // Cache the demo measurements
    for (const measurement of demoMeasurements) {
      await offlineStore.storeEntity('measurements', measurement.id, measurement);
    }
    
    return demoMeasurements;
  } catch (error) {
    console.error('Error fetching measurements:', error);
    
    // Return empty array on error
    return [];
  }
}

/**
 * Create a new measurement
 */
export async function createMeasurement(measurement: Omit<Measurement, 'id'>): Promise<Measurement> {
  const isOnline = getOnlineStatus();
  console.log(`Creating measurement (${isOnline ? 'online' : 'offline'} mode):`, measurement);
  
  try {
    // Generate new measurement with ID
    const newMeasurement: Measurement = {
      ...measurement,
      id: `measurement-${uuidv4()}`,
      updatedAt: new Date().toISOString(),
      measurementDate: measurement.measurementDate || new Date().toISOString()
    };
    
    // Store locally
    await offlineStore.storeEntity('measurements', newMeasurement.id, newMeasurement);
    
    // Add to sync queue if offline
    if (!isOnline) {
      await syncQueue.addToSyncQueue('measurement', 'create', newMeasurement.id, newMeasurement);
    }
    
    return newMeasurement;
  } catch (error) {
    console.error('Error creating measurement:', error);
    throw error;
  }
}

/**
 * Update an existing measurement
 */
export async function updateMeasurement(id: string, data: Partial<Measurement>): Promise<Measurement> {
  const isOnline = getOnlineStatus();
  console.log(`Updating measurement ${id} (${isOnline ? 'online' : 'offline'} mode):`, data);
  
  try {
    // Get current measurement
    const existingMeasurement = await offlineStore.getEntity<Measurement>('measurements', id);
    
    if (!existingMeasurement) {
      throw new Error(`Measurement with ID ${id} not found`);
    }
    
    // Create updated measurement
    const updatedMeasurement: Measurement = {
      ...existingMeasurement,
      ...data,
      updatedAt: new Date().toISOString()
    };
    
    // Update locally
    await offlineStore.storeEntity('measurements', id, updatedMeasurement);
    
    // Add to sync queue if offline
    if (!isOnline) {
      await syncQueue.addToSyncQueue('measurement', 'update', id, updatedMeasurement);
    }
    
    return updatedMeasurement;
  } catch (error) {
    console.error(`Error updating measurement ${id}:`, error);
    throw error;
  }
}

/**
 * Delete a measurement
 */
export async function deleteMeasurement(id: string): Promise<boolean> {
  const isOnline = getOnlineStatus();
  console.log(`Deleting measurement ${id} (${isOnline ? 'online' : 'offline'} mode)`);
  
  try {
    // Remove locally
    await offlineStore.removeEntity('measurements', id);
    
    // Add to sync queue if offline
    if (!isOnline) {
      await syncQueue.addToSyncQueue('measurement', 'delete', id);
    }
    
    return true;
  } catch (error) {
    console.error(`Error deleting measurement ${id}:`, error);
    throw error;
  }
}
