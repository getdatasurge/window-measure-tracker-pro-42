
// This is a type definition file for Appwrite

declare namespace Appwrite {
  interface User {
    $id: string;
    name: string;
    email: string;
    registration: string;
    status: boolean;
    labels: string[];
    prefs: Record<string, any>;
  }

  interface Project {
    $id: string;
    name: string;
    description?: string;
    client?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
    location?: {
      address?: string;
      city?: string;
      state?: string;
      zipCode?: string;
    };
    team?: string[];
    createdAt: string;
    updatedAt: string;
    createdBy: string;
  }

  interface Measurement {
    $id: string;
    projectId: string;
    width: number;
    height: number;
    depth?: number;
    windowType?: string;
    location?: string;
    notes?: string;
    measurements?: Record<string, number>;
    status?: string;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
  }

  interface UserRole {
    $id: string;
    userId: string;
    role: 'admin' | 'manager' | 'installer' | 'user';
    permissions?: string[];
  }
}

export = Appwrite;
export as namespace Appwrite;
