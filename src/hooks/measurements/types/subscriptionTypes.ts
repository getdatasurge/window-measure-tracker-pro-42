
export interface MeasurementSubscriptionOptions {
  projectId?: string;
  status?: string;
  startDate?: Date;
  endDate?: Date;
  onInsert?: (measurement: any) => void;
  onUpdate?: (measurement: any) => void;
  onDelete?: (id: string) => void;
}

export interface SubscriptionState {
  lastError: Error | null;
  isConnected: boolean;
  isPolling: boolean;
  lastSyncTime: Date | null;
}
