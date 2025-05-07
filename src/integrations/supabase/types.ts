export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      activities: {
        Row: {
          action_type: string
          change_request_id: string | null
          comment_id: string | null
          description: string
          entry_id: string | null
          id: string
          measurement_id: string | null
          metadata: Json | null
          performed_at: string | null
          performed_by: string
          project_id: string | null
        }
        Insert: {
          action_type: string
          change_request_id?: string | null
          comment_id?: string | null
          description: string
          entry_id?: string | null
          id?: string
          measurement_id?: string | null
          metadata?: Json | null
          performed_at?: string | null
          performed_by: string
          project_id?: string | null
        }
        Update: {
          action_type?: string
          change_request_id?: string | null
          comment_id?: string | null
          description?: string
          entry_id?: string | null
          id?: string
          measurement_id?: string | null
          metadata?: Json | null
          performed_at?: string | null
          performed_by?: string
          project_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activities_change_request_id_fkey"
            columns: ["change_request_id"]
            isOneToOne: false
            referencedRelation: "change_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activities_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activities_entry_id_fkey"
            columns: ["entry_id"]
            isOneToOne: false
            referencedRelation: "measurement_history"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activities_measurement_id_fkey"
            columns: ["measurement_id"]
            isOneToOne: false
            referencedRelation: "measurements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activities_performed_by_fkey"
            columns: ["performed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activities_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      change_requests: {
        Row: {
          assigned_to: string | null
          change_type: string
          created_at: string | null
          current_values: Json
          id: string
          measurement_id: string
          priority: string | null
          project_id: string
          reason: string
          requested_by: string
          requested_values: Json
          resolution_notes: string | null
          resolved_at: string | null
          resolved_by: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          change_type: string
          created_at?: string | null
          current_values: Json
          id?: string
          measurement_id: string
          priority?: string | null
          project_id: string
          reason: string
          requested_by: string
          requested_values: Json
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          change_type?: string
          created_at?: string | null
          current_values?: Json
          id?: string
          measurement_id?: string
          priority?: string | null
          project_id?: string
          reason?: string
          requested_by?: string
          requested_values?: Json
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "change_requests_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "change_requests_measurement_id_fkey"
            columns: ["measurement_id"]
            isOneToOne: false
            referencedRelation: "measurements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "change_requests_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "change_requests_requested_by_fkey"
            columns: ["requested_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "change_requests_resolved_by_fkey"
            columns: ["resolved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          author_id: string
          change_request_id: string | null
          content: string
          created_at: string | null
          id: string
          is_deleted: boolean | null
          is_edited: boolean | null
          measurement_id: string | null
          parent_id: string | null
          project_id: string | null
          updated_at: string | null
        }
        Insert: {
          author_id: string
          change_request_id?: string | null
          content: string
          created_at?: string | null
          id?: string
          is_deleted?: boolean | null
          is_edited?: boolean | null
          measurement_id?: string | null
          parent_id?: string | null
          project_id?: string | null
          updated_at?: string | null
        }
        Update: {
          author_id?: string
          change_request_id?: string | null
          content?: string
          created_at?: string | null
          id?: string
          is_deleted?: boolean | null
          is_edited?: boolean | null
          measurement_id?: string | null
          parent_id?: string | null
          project_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comments_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_change_request_id_fkey"
            columns: ["change_request_id"]
            isOneToOne: false
            referencedRelation: "change_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_measurement_id_fkey"
            columns: ["measurement_id"]
            isOneToOne: false
            referencedRelation: "measurements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      entries: {
        Row: {
          created_at: string | null
          created_by: string
          film_required: boolean | null
          floor: string | null
          height: number
          id: string
          notes: string | null
          project_id: string
          quantity: number
          room: string
          status: string
          updated_at: string | null
          width: number
        }
        Insert: {
          created_at?: string | null
          created_by: string
          film_required?: boolean | null
          floor?: string | null
          height: number
          id?: string
          notes?: string | null
          project_id: string
          quantity?: number
          room: string
          status?: string
          updated_at?: string | null
          width: number
        }
        Update: {
          created_at?: string | null
          created_by?: string
          film_required?: boolean | null
          floor?: string | null
          height?: number
          id?: string
          notes?: string | null
          project_id?: string
          quantity?: number
          room?: string
          status?: string
          updated_at?: string | null
          width?: number
        }
        Relationships: [
          {
            foreignKeyName: "entries_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      entry_history: {
        Row: {
          action_type: string
          data_snapshot: Json
          entry_id: string
          id: string
          timestamp: string | null
          updated_by: string
        }
        Insert: {
          action_type: string
          data_snapshot: Json
          entry_id: string
          id?: string
          timestamp?: string | null
          updated_by: string
        }
        Update: {
          action_type?: string
          data_snapshot?: Json
          entry_id?: string
          id?: string
          timestamp?: string | null
          updated_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "entry_history_entry_id_fkey"
            columns: ["entry_id"]
            isOneToOne: false
            referencedRelation: "entries"
            referencedColumns: ["id"]
          },
        ]
      }
      measurement_history: {
        Row: {
          change_reason: string | null
          change_request_id: string | null
          changed_at: string | null
          changed_by: string
          field_name: string
          id: string
          measurement_id: string
          new_value: string | null
          old_value: string | null
        }
        Insert: {
          change_reason?: string | null
          change_request_id?: string | null
          changed_at?: string | null
          changed_by: string
          field_name: string
          id?: string
          measurement_id: string
          new_value?: string | null
          old_value?: string | null
        }
        Update: {
          change_reason?: string | null
          change_request_id?: string | null
          changed_at?: string | null
          changed_by?: string
          field_name?: string
          id?: string
          measurement_id?: string
          new_value?: string | null
          old_value?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "measurement_history_change_request_id_fkey"
            columns: ["change_request_id"]
            isOneToOne: false
            referencedRelation: "change_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "measurement_history_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "measurement_history_measurement_id_fkey"
            columns: ["measurement_id"]
            isOneToOne: false
            referencedRelation: "measurements"
            referencedColumns: ["id"]
          },
        ]
      }
      measurement_installation_team: {
        Row: {
          measurement_id: string
          profile_id: string
        }
        Insert: {
          measurement_id: string
          profile_id: string
        }
        Update: {
          measurement_id?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "measurement_installation_team_measurement_id_fkey"
            columns: ["measurement_id"]
            isOneToOne: false
            referencedRelation: "measurements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "measurement_installation_team_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      measurements: {
        Row: {
          actual_labor_hours: number | null
          area: number | null
          created_at: string | null
          deleted: boolean | null
          depth: number | null
          direction: string | null
          estimated_labor_hours: number | null
          external_reference_number: string | null
          film_required: boolean | null
          frame_type: string | null
          glass_thickness: string | null
          height: number | null
          id: string
          input_source: string | null
          installation_date: string | null
          location: string
          measurement_date: string | null
          notes: string | null
          photos: string[] | null
          project_id: string
          quantity: number | null
          recorded_by: string | null
          requires_special_tools: boolean | null
          status: string | null
          updated_at: string | null
          updated_by: string | null
          width: number | null
          window_type: string | null
        }
        Insert: {
          actual_labor_hours?: number | null
          area?: number | null
          created_at?: string | null
          deleted?: boolean | null
          depth?: number | null
          direction?: string | null
          estimated_labor_hours?: number | null
          external_reference_number?: string | null
          film_required?: boolean | null
          frame_type?: string | null
          glass_thickness?: string | null
          height?: number | null
          id?: string
          input_source?: string | null
          installation_date?: string | null
          location: string
          measurement_date?: string | null
          notes?: string | null
          photos?: string[] | null
          project_id: string
          quantity?: number | null
          recorded_by?: string | null
          requires_special_tools?: boolean | null
          status?: string | null
          updated_at?: string | null
          updated_by?: string | null
          width?: number | null
          window_type?: string | null
        }
        Update: {
          actual_labor_hours?: number | null
          area?: number | null
          created_at?: string | null
          deleted?: boolean | null
          depth?: number | null
          direction?: string | null
          estimated_labor_hours?: number | null
          external_reference_number?: string | null
          film_required?: boolean | null
          frame_type?: string | null
          glass_thickness?: string | null
          height?: number | null
          id?: string
          input_source?: string | null
          installation_date?: string | null
          location?: string
          measurement_date?: string | null
          notes?: string | null
          photos?: string[] | null
          project_id?: string
          quantity?: number | null
          recorded_by?: string | null
          requires_special_tools?: boolean | null
          status?: string | null
          updated_at?: string | null
          updated_by?: string | null
          width?: number | null
          window_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "measurements_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "measurements_recorded_by_fkey"
            columns: ["recorded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "measurements_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_read: boolean | null
          link: string | null
          read_at: string | null
          related_id: string | null
          related_type: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          link?: string | null
          read_at?: string | null
          related_id?: string | null
          related_type?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          link?: string | null
          read_at?: string | null
          related_id?: string | null
          related_type?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          phone_number: string | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          phone_number?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          phone_number?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      project_assignments: {
        Row: {
          assigned_at: string | null
          id: string
          project_id: string
          role: string | null
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          id?: string
          project_id: string
          role?: string | null
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          id?: string
          project_id?: string
          role?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_assignments_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          client_name: string | null
          created_at: string | null
          created_by: string | null
          deadline: string | null
          description: string | null
          Eemail: string | null
          id: string
          is_active: boolean | null
          location: string | null
          name: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          client_name?: string | null
          created_at?: string | null
          created_by?: string | null
          deadline?: string | null
          description?: string | null
          Eemail?: string | null
          id?: string
          is_active?: boolean | null
          location?: string | null
          name: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          client_name?: string | null
          created_at?: string | null
          created_by?: string | null
          deadline?: string | null
          description?: string | null
          Eemail?: string | null
          id?: string
          is_active?: boolean | null
          location?: string | null
          name?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_project_member: {
        Args: { project_id: string }
        Returns: boolean
      }
      is_project_member_safe: {
        Args: { project_id: string; user_id?: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
