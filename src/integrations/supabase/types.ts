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
    PostgrestVersion: "14.5"
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
      security_sites: {
        Row: {
          created_at: string
          day_posts: number
          id: string
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
      [_ in never]: never
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
