import { Database } from './supabase'

export type Measurement = Database['public']['Tables']['measurements']['Row']
export type MeasurementInsert = Database['public']['Tables']['measurements']['Insert']
export type MeasurementUpdate = Database['public']['Tables']['measurements']['Update']

// Optional helper type for partial use (e.g. form editing)
export type MeasurementFormData = Partial<MeasurementInsert> & {
  recorded_by?: string // Often manually set in client
}

// Enums (manually defined for now, as your DB has no declared enums)
export type Direction = 'north' | 'south' | 'east' | 'west' // ← adjust based on actual usage
export type InputSource = 'manual' | 'automated' | 'imported' // ← add variants if needed

// You may cast direction/input_source like this:
export function parseDirection(value: string | null): Direction | undefined {
  if (value === 'north' || value === 'south' || value === 'east' || value === 'west') {
    return value
  }
  return undefined
}

export function parseInputSource(value: string | null): InputSource | undefined {
  if (value === 'manual' || value === 'automated' || value === 'imported') {
    return value
  }
  return undefined
}
