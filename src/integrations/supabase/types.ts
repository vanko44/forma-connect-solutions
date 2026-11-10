export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.17"
  }
  public: {
    Tables: {
      mission_orders: {
        Row: {
          amount: number
          client_site: string
          created_at: string
          due_date: string | null
          end_date: string
          id: string
          instructions: string
          location: string
          order_number: string
          paid_amount: number
          partner_email: string
          partner_id: string | null
          partner_name: string
          partner_phone: string
          pole: string
          start_date: string
          status: string
          supervisor: string
          title: string
        }
        Insert: {
          amount?: number
          client_site: string
          created_at?: string
          due_date?: string | null
          end_date: string
          id?: string
          instructions?: string
          location?: string
          order_number?: string
          paid_amount?: number
          partner_email?: string
          partner_id?: string | null
          partner_name: string
          partner_phone?: string
          pole: string
          start_date: string
          status?: string
          supervisor?: string
          title: string
        }
        Update: {
          amount?: number
          client_site?: string
          created_at?: string
          due_date?: string | null
          end_date?: string
          id?: string
          instructions?: string
          location?: string
          order_number?: string
          paid_amount?: number
          partner_email?: string
          partner_id?: string | null
          partner_name?: string
          partner_phone?: string
          pole?: string
          start_date?: string
          status?: string
          supervisor?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "mission_orders_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partner_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_applications: {
        Row: {
          business_name: string
          created_at: string
          details: string
          documents: string | null
          email: string
          id: string
          manager_name: string
          phone: string
          status: string
          trade: string
        }
        Insert: {
          business_name: string
          created_at?: string
          details: string
          documents?: string | null
          email: string
          id?: string
          manager_name: string
          phone: string
          status?: string
          trade: string
        }
        Update: {
          business_name?: string
          created_at?: string
          details?: string
          documents?: string | null
          email?: string
          id?: string
          manager_name?: string
          phone?: string
          status?: string
          trade?: string
        }
        Relationships: []
      }
      portal_audit: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          id: string
          record_id: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          id?: string
          record_id?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          id?: string
          record_id?: string | null
        }
        Relationships: []
      }
      portal_documents: {
        Row: {
          created_at: string
          id: string
          name: string
          record_id: string
          storage_path: string
          uploaded_by: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          record_id: string
          storage_path: string
          uploaded_by?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          record_id?: string
          storage_path?: string
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "portal_documents_record_id_fkey"
            columns: ["record_id"]
            isOneToOne: false
            referencedRelation: "portal_records"
            referencedColumns: ["id"]
          },
        ]
      }
      portal_records: {
        Row: {
          amount: number
          attributes: Json
          created_at: string
          created_by: string
          due_date: string | null
          end_date: string | null
          id: string
          kind: string
          owner_id: string | null
          parent_id: string | null
          provider_id: string | null
          reference: string
          start_date: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          amount?: number
          attributes?: Json
          created_at?: string
          created_by?: string
          due_date?: string | null
          end_date?: string | null
          id?: string
          kind: string
          owner_id?: string | null
          parent_id?: string | null
          provider_id?: string | null
          reference?: string
          start_date?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          amount?: number
          attributes?: Json
          created_at?: string
          created_by?: string
          due_date?: string | null
          end_date?: string | null
          id?: string
          kind?: string
          owner_id?: string | null
          parent_id?: string | null
          provider_id?: string | null
          reference?: string
          start_date?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "portal_records_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "portal_records_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "portal_records"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "portal_records_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      portal_roles: {
        Row: {
          id: string
          role: string
          user_id: string
        }
        Insert: {
          id?: string
          role: string
          user_id: string
        }
        Update: {
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "portal_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string
          company: string
          created_at: string
          display_name: string
          id: string
          phone: string
        }
        Insert: {
          avatar_url?: string
          company?: string
          created_at?: string
          display_name?: string
          id: string
          phone?: string
        }
        Update: {
          avatar_url?: string
          company?: string
          created_at?: string
          display_name?: string
          id?: string
          phone?: string
        }
        Relationships: []
      }
      quote_requests: {
        Row: {
          amount: string | null
          approved_at: string | null
          created_at: string
          desired_date: string | null
          email: string | null
          id: string
          name: string
          needs: string
          offer: Json | null
          organization: string | null
          phone: string
          place: string
          pole: string
          status: string
          user_id: string | null
        }
        Insert: {
          amount?: string | null
          approved_at?: string | null
          created_at?: string
          desired_date?: string | null
          email?: string | null
          id?: string
          name: string
          needs: string
          offer?: Json | null
          organization?: string | null
          phone: string
          place: string
          pole: string
          status?: string
          user_id?: string | null
        }
        Update: {
          amount?: string | null
          approved_at?: string | null
          created_at?: string
          desired_date?: string | null
          email?: string | null
          id?: string
          name?: string
          needs?: string
          offer?: Json | null
          organization?: string | null
          phone?: string
          place?: string
          pole?: string
          status?: string
          user_id?: string | null
        }
        Relationships: []
      }
      security_operations: {
        Row: {
          action_taken: string
          agent_name: string
          created_at: string
          details: string
          entry_type: string
          id: string
          occurred_at: string
          severity: string
          shift_type: string | null
          site_id: string
          summary: string
          supervisor: string
        }
        Insert: {
          action_taken?: string
          agent_name: string
          created_at?: string
          details?: string
          entry_type: string
          id?: string
          occurred_at?: string
          severity?: string
          shift_type?: string | null
          site_id: string
          summary: string
          supervisor?: string
        }
        Update: {
          action_taken?: string
          agent_name?: string
          created_at?: string
          details?: string
          entry_type?: string
          id?: string
          occurred_at?: string
          severity?: string
          shift_type?: string | null
          site_id?: string
          summary?: string
          supervisor?: string
        }
        Relationships: [
          {
            foreignKeyName: "security_operations_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "security_sites"
            referencedColumns: ["id"]
          },
        ]
      }
      security_sites: {
        Row: {
          created_at: string
          day_posts: number
          id: string
          instructions: string
          last_report: string | null
          location: string
          night_posts: number
          site: string
          status: string
          supervisor: string | null
        }
        Insert: {
          created_at?: string
          day_posts?: number
          id?: string
          instructions?: string
          last_report?: string | null
          location: string
          night_posts?: number
          site: string
          status?: string
          supervisor?: string | null
        }
        Update: {
          created_at?: string
          day_posts?: number
          id?: string
          instructions?: string
          last_report?: string | null
          location?: string
          night_posts?: number
          site?: string
          status?: string
          supervisor?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      portal_quotes: {
        Row: {
          amount: string | null
          approved_at: string | null
          created_at: string | null
          desired_date: string | null
          email: string | null
          id: string | null
          name: string | null
          needs: string | null
          offer: Json | null
          organization: string | null
          phone: string | null
          place: string | null
          pole: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          amount?: never
          approved_at?: never
          created_at?: string | null
          desired_date?: string | null
          email?: string | null
          id?: string | null
          name?: string | null
          needs?: string | null
          offer?: never
          organization?: string | null
          phone?: string | null
          place?: string | null
          pole?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: never
          approved_at?: never
          created_at?: string | null
          desired_date?: string | null
          email?: string | null
          id?: string | null
          name?: string | null
          needs?: string | null
          offer?: never
          organization?: string | null
          phone?: string | null
          place?: string | null
          pole?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      claim_direction_admin: { Args: never; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      portal_can: { Args: { permission: string }; Returns: boolean }
      portal_record_staff: { Args: { k: string }; Returns: boolean }
      portal_report_allowed: { Args: { mission: string }; Returns: boolean }
      provider_mission_action: {
        Args: { action: string; mission_id: string }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
