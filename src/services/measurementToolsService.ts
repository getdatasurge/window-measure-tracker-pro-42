
import { supabase } from '@/integrations/supabase/client';

// Define types for the measurement tools API responses
export interface GlassOption {
  id: string;
  name: string;
  thickness: string;
  description: string;
  price_per_sqft: number;
  is_available: boolean;
}

export interface FrameType {
  id: string;
  name: string;
  material: string;
  description: string;
  price_per_foot: number;
  is_available: boolean;
}

export interface ToolSet {
  id: string;
  name: string;
  tools: string[];
  required_for: string[];
  availability: 'in-stock' | 'on-order' | 'unavailable';
}

export interface LaborEstimate {
  window_type: string;
  complexity: 'simple' | 'medium' | 'complex';
  estimated_hours: number;
  requires_special_tools: boolean;
  recommended_team_size: number;
}

// Service configuration
interface ServiceConfig {
  cacheTimeout: number; // milliseconds
  maxRetries: number;
  baseDelay: number; // milliseconds for exponential backoff
  throttleDelay: number; // milliseconds between requests
}

/**
 * Service for accessing measurement tools and related data
 */
class MeasurementToolsService {
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private lastRequestTime: number = 0;
  private pendingRequests: Map<string, Promise<any>> = new Map();
  
  private config: ServiceConfig = {
    cacheTimeout: 1000 * 60 * 15, // 15 minutes
    maxRetries: 3,
    baseDelay: 1000, // 1 second
    throttleDelay: 1000 // 1 second
  };
  
  constructor(config?: Partial<ServiceConfig>) {
    if (config) {
      this.config = { ...this.config, ...config };
    }
  }
  
  /**
   * Get glass options available for installation
   */
  async getGlassOptions(): Promise<GlassOption[]> {
    return this.fetchWithCache<GlassOption[]>('glass-options', async () => {
      // In a real app, this would call an actual API
      // For now, we're returning mock data
      return this.mockGlassOptions();
    });
  }
  
  /**
   * Get available frame types
   */
  async getFrameTypes(): Promise<FrameType[]> {
    return this.fetchWithCache<FrameType[]>('frame-types', async () => {
      // Mock data for now
      return this.mockFrameTypes();
    });
  }
  
  /**
   * Get tool sets needed for different installation types
   */
  async getToolSets(): Promise<ToolSet[]> {
    return this.fetchWithCache<ToolSet[]>('tool-sets', async () => {
      // Mock data for now
      return this.mockToolSets();
    });
  }
  
  /**
   * Get labor estimates for different window types and complexities
   */
  async getLaborEstimates(windowType?: string): Promise<LaborEstimate[]> {
    const cacheKey = windowType ? `labor-estimates-${windowType}` : 'labor-estimates-all';
    
    return this.fetchWithCache<LaborEstimate[]>(cacheKey, async () => {
      // Mock data for now
      const allEstimates = this.mockLaborEstimates();
      
      // Filter by window type if provided
      if (windowType) {
        return allEstimates.filter(e => e.window_type === windowType);
      }
      
      return allEstimates;
    });
  }
  
  /**
   * Fetch with in-memory caching, throttling, and retry logic
   */
  private async fetchWithCache<T>(key: string, fetchFn: () => Promise<T>): Promise<T> {
    // Check cache first
    const cached = this.cache.get(key);
    const now = Date.now();
    
    if (cached && (now - cached.timestamp < this.config.cacheTimeout)) {
      console.log(`Using cached data for ${key}`);
      return cached.data as T;
    }
    
    // Check if we already have a pending request for this key
    if (this.pendingRequests.has(key)) {
      console.log(`Using pending request for ${key}`);
      return this.pendingRequests.get(key) as Promise<T>;
    }
    
    // Throttle requests
    const timeSinceLastRequest = now - this.lastRequestTime;
    if (timeSinceLastRequest < this.config.throttleDelay) {
      const delay = this.config.throttleDelay - timeSinceLastRequest;
      console.log(`Throttling request for ${key} by ${delay}ms`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
    
    // Create the actual request with retries
    const fetchWithRetry = async (): Promise<T> => {
      let attempt = 0;
      
      while (attempt < this.config.maxRetries) {
        try {
          this.lastRequestTime = Date.now();
          const data = await fetchFn();
          
          // Cache the successful result
          this.cache.set(key, { data, timestamp: Date.now() });
          
          // Remove from pending requests
          this.pendingRequests.delete(key);
          
          return data;
        } catch (error) {
          attempt++;
          
          if (attempt >= this.config.maxRetries) {
            // Remove from pending requests on final failure
            this.pendingRequests.delete(key);
            throw error;
          }
          
          // Exponential backoff
          const backoffTime = this.config.baseDelay * Math.pow(2, attempt - 1);
          console.warn(`Request for ${key} failed, retrying in ${backoffTime}ms (attempt ${attempt}/${this.config.maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, backoffTime));
        }
      }
      
      throw new Error(`Failed to fetch ${key} after ${this.config.maxRetries} attempts`);
    };
    
    // Store the promise in pending requests
    const promise = fetchWithRetry();
    this.pendingRequests.set(key, promise);
    
    return promise;
  }
  
  /**
   * Clear the entire cache or a specific key
   */
  clearCache(key?: string): void {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }
  
  // Mock data methods for development
  private mockGlassOptions(): GlassOption[] {
    return [
      {
        id: '1',
        name: 'Standard Clear',
        thickness: '3mm',
        description: 'Basic clear glass for interior windows',
        price_per_sqft: 6.5,
        is_available: true
      },
      {
        id: '2',
        name: 'Tempered Clear',
        thickness: '6mm',
        description: 'Safety glass that breaks into small pieces',
        price_per_sqft: 12.75,
        is_available: true
      },
      {
        id: '3',
        name: 'Low-E Double Glaze',
        thickness: '24mm',
        description: 'Energy efficient double glazed unit with low-e coating',
        price_per_sqft: 22.5,
        is_available: true
      },
      {
        id: '4',
        name: 'Laminated Security',
        thickness: '8mm',
        description: 'Shatter-resistant laminated glass for security',
        price_per_sqft: 18.25,
        is_available: true
      },
      {
        id: '5',
        name: 'Acoustic Insulated',
        thickness: '10mm',
        description: 'Sound reducing glass for noise control',
        price_per_sqft: 26.0,
        is_available: false
      }
    ];
  }
  
  private mockFrameTypes(): FrameType[] {
    return [
      {
        id: '1',
        name: 'Aluminum Standard',
        material: 'Aluminum',
        description: 'Basic aluminum framing for windows',
        price_per_foot: 8.25,
        is_available: true
      },
      {
        id: '2',
        name: 'Vinyl Residential',
        material: 'Vinyl',
        description: 'Energy efficient vinyl frames for residential use',
        price_per_foot: 12.0,
        is_available: true
      },
      {
        id: '3',
        name: 'Wood Traditional',
        material: 'Wood',
        description: 'Classic wood frames for traditional homes',
        price_per_foot: 18.5,
        is_available: true
      },
      {
        id: '4',
        name: 'Fiberglass Premium',
        material: 'Fiberglass',
        description: 'Durable fiberglass frames with excellent insulation',
        price_per_foot: 24.75,
        is_available: true
      },
      {
        id: '5',
        name: 'Steel Commercial',
        material: 'Steel',
        description: 'Heavy-duty steel frames for commercial applications',
        price_per_foot: 32.0,
        is_available: false
      }
    ];
  }
  
  private mockToolSets(): ToolSet[] {
    return [
      {
        id: '1',
        name: 'Basic Installation Kit',
        tools: ['Tape measure', 'Level', 'Screwdriver set', 'Caulking gun'],
        required_for: ['Standard windows', 'Small residential'],
        availability: 'in-stock'
      },
      {
        id: '2',
        name: 'Commercial Installation Kit',
        tools: ['Heavy duty drill', 'Commercial caulking', 'Industrial fasteners', 'Safety equipment'],
        required_for: ['Commercial windows', 'Store fronts', 'Office buildings'],
        availability: 'in-stock'
      },
      {
        id: '3',
        name: 'Specialty Glass Kit',
        tools: ['Glass suction cups', 'Specialty cutters', 'Protective gear', 'Precision measuring tools'],
        required_for: ['Custom shapes', 'Large panes', 'High-value installations'],
        availability: 'on-order'
      },
      {
        id: '4',
        name: 'High-Rise Installation Kit',
        tools: ['Scaffolding connectors', 'Wind restraints', 'Fall protection', 'Specialized lifts'],
        required_for: ['High-rise buildings', 'Difficult access locations'],
        availability: 'unavailable'
      }
    ];
  }
  
  private mockLaborEstimates(): LaborEstimate[] {
    return [
      {
        window_type: 'Standard Single-Hung',
        complexity: 'simple',
        estimated_hours: 1.5,
        requires_special_tools: false,
        recommended_team_size: 1
      },
      {
        window_type: 'Standard Single-Hung',
        complexity: 'medium',
        estimated_hours: 2.5,
        requires_special_tools: false,
        recommended_team_size: 2
      },
      {
        window_type: 'Double-Hung Replacement',
        complexity: 'medium',
        estimated_hours: 2.0,
        requires_special_tools: false,
        recommended_team_size: 1
      },
      {
        window_type: 'Picture Window',
        complexity: 'medium',
        estimated_hours: 3.0,
        requires_special_tools: true,
        recommended_team_size: 2
      },
      {
        window_type: 'Bay Window',
        complexity: 'complex',
        estimated_hours: 5.0,
        requires_special_tools: true,
        recommended_team_size: 3
      },
      {
        window_type: 'Garden Window',
        complexity: 'complex',
        estimated_hours: 4.5,
        requires_special_tools: true,
        recommended_team_size: 2
      },
      {
        window_type: 'Custom Shape',
        complexity: 'complex',
        estimated_hours: 6.0,
        requires_special_tools: true,
        recommended_team_size: 3
      }
    ];
  }
}

// Create and export a singleton instance
export const measurementToolsService = new MeasurementToolsService();

// Export a hook for easily using the service in components
export const useMeasurementTools = () => {
  return measurementToolsService;
};
