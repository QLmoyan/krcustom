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
    PostgrestVersion: "14.15"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      design_proof_versions: {
        Row: {
          created_at: string
          demo_key: string | null
          id: string
          image_url: string
          notes: string
          proof_id: string
          thumbnail_url: string
          version_no: number
        }
        Insert: {
          created_at?: string
          demo_key?: string | null
          id?: string
          image_url?: string
          notes?: string
          proof_id: string
          thumbnail_url?: string
          version_no: number
        }
        Update: {
          created_at?: string
          demo_key?: string | null
          id?: string
          image_url?: string
          notes?: string
          proof_id?: string
          thumbnail_url?: string
          version_no?: number
        }
        Relationships: [
          {
            foreignKeyName: "design_proof_versions_proof_id_fkey"
            columns: ["proof_id"]
            isOneToOne: false
            referencedRelation: "design_proofs"
            referencedColumns: ["id"]
          },
        ]
      }
      design_proofs: {
        Row: {
          approved_at: string | null
          created_at: string
          current_version: number
          customer_comment: string
          demo_key: string | null
          id: string
          project_id: string
          rejected_at: string | null
          seller_comment: string
          status: string
          updated_at: string
        }
        Insert: {
          approved_at?: string | null
          created_at?: string
          current_version?: number
          customer_comment?: string
          demo_key?: string | null
          id?: string
          project_id: string
          rejected_at?: string | null
          seller_comment?: string
          status: string
          updated_at?: string
        }
        Update: {
          approved_at?: string | null
          created_at?: string
          current_version?: number
          customer_comment?: string
          demo_key?: string | null
          id?: string
          project_id?: string
          rejected_at?: string | null
          seller_comment?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "design_proofs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string
          demo_key: string | null
          id: string
          item_name: string
          order_id: string
          quantity: number
          total_price: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          demo_key?: string | null
          id?: string
          item_name: string
          order_id: string
          quantity?: number
          total_price?: number
          unit_price?: number
        }
        Update: {
          created_at?: string
          demo_key?: string | null
          id?: string
          item_name?: string
          order_id?: string
          quantity?: number
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          currency: string
          customer_id: string
          demo_key: string | null
          discount: number
          id: string
          order_number: string
          payment_status: string
          production_status: string
          project_id: string
          quote_id: string | null
          seller_id: string
          shipping_fee: number
          shipping_status: string
          status: string
          subtotal: number
          tax: number
          total: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          currency?: string
          customer_id: string
          demo_key?: string | null
          discount?: number
          id?: string
          order_number: string
          payment_status?: string
          production_status?: string
          project_id: string
          quote_id?: string | null
          seller_id: string
          shipping_fee?: number
          shipping_status?: string
          status: string
          subtotal?: number
          tax?: number
          total?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          currency?: string
          customer_id?: string
          demo_key?: string | null
          discount?: number
          id?: string
          order_number?: string
          payment_status?: string
          production_status?: string
          project_id?: string
          quote_id?: string | null
          seller_id?: string
          shipping_fee?: number
          shipping_status?: string
          status?: string
          subtotal?: number
          tax?: number
          total?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_records: {
        Row: {
          amount: number
          created_at: string
          demo_key: string | null
          id: string
          method: string
          order_id: string
          paid_at: string | null
          status: string
          transaction_no: string
          updated_at: string
        }
        Insert: {
          amount?: number
          created_at?: string
          demo_key?: string | null
          id?: string
          method: string
          order_id: string
          paid_at?: string | null
          status: string
          transaction_no?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          demo_key?: string | null
          id?: string
          method?: string
          order_id?: string
          paid_at?: string | null
          status?: string
          transaction_no?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_records_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          created_at: string
          customer_id: string
          demo_key: string | null
          description: string | null
          id: string
          project_number: string
          seller_id: string
          service_id: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_id: string
          demo_key?: string | null
          description?: string | null
          id?: string
          project_number: string
          seller_id: string
          service_id: string
          status: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_id?: string
          demo_key?: string | null
          description?: string | null
          id?: string
          project_number?: string
          seller_id?: string
          service_id?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      quote_items: {
        Row: {
          amount: number
          created_at: string
          demo_key: string | null
          description: string
          editable: boolean
          id: string
          name: string
          quantity: number
          quote_id: string
          sort_order: number
          unit_price: number
        }
        Insert: {
          amount?: number
          created_at?: string
          demo_key?: string | null
          description?: string
          editable?: boolean
          id?: string
          name: string
          quantity?: number
          quote_id: string
          sort_order?: number
          unit_price?: number
        }
        Update: {
          amount?: number
          created_at?: string
          demo_key?: string | null
          description?: string
          editable?: boolean
          id?: string
          name?: string
          quantity?: number
          quote_id?: string
          sort_order?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "quote_items_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      quote_revisions: {
        Row: {
          actor: string
          created_at: string
          demo_key: string | null
          id: string
          occurred_at: string
          quote_id: string
          summary: string
          version: number
        }
        Insert: {
          actor?: string
          created_at?: string
          demo_key?: string | null
          id?: string
          occurred_at?: string
          quote_id: string
          summary: string
          version: number
        }
        Update: {
          actor?: string
          created_at?: string
          demo_key?: string | null
          id?: string
          occurred_at?: string
          quote_id?: string
          summary?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "quote_revisions_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      quotes: {
        Row: {
          approved_at: string | null
          approved_by: string
          created_at: string
          created_by: string
          currency: string
          customer_confirmed: boolean
          demo_key: string | null
          discount: number
          expires_at: string | null
          extra_fee: number
          id: string
          note: string
          project_id: string
          sent_at: string | null
          shipping_fee: number
          status: string
          subtotal: number
          tax: number
          total: number
          updated_at: string
          version: number
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string
          created_at?: string
          created_by?: string
          currency?: string
          customer_confirmed?: boolean
          demo_key?: string | null
          discount?: number
          expires_at?: string | null
          extra_fee?: number
          id?: string
          note?: string
          project_id: string
          sent_at?: string | null
          shipping_fee?: number
          status: string
          subtotal?: number
          tax?: number
          total?: number
          updated_at?: string
          version: number
        }
        Update: {
          approved_at?: string | null
          approved_by?: string
          created_at?: string
          created_by?: string
          currency?: string
          customer_confirmed?: boolean
          demo_key?: string | null
          discount?: number
          expires_at?: string | null
          extra_fee?: number
          id?: string
          note?: string
          project_id?: string
          sent_at?: string | null
          shipping_fee?: number
          status?: string
          subtotal?: number
          tax?: number
          total?: number
          updated_at?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "quotes_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const

/** Project table aliases for app code */
export type ProjectRow = Tables<"projects">;
export type ProjectInsert = TablesInsert<"projects">;
export type ProjectUpdate = TablesUpdate<"projects">;

/** Quote table aliases for app code */
export type QuoteRow = Tables<"quotes">;
export type QuoteInsert = TablesInsert<"quotes">;
export type QuoteUpdate = TablesUpdate<"quotes">;
export type QuoteItemRow = Tables<"quote_items">;
export type QuoteItemInsert = TablesInsert<"quote_items">;
export type QuoteItemUpdate = TablesUpdate<"quote_items">;
export type QuoteRevisionRow = Tables<"quote_revisions">;
export type QuoteRevisionInsert = TablesInsert<"quote_revisions">;
export type QuoteRevisionUpdate = TablesUpdate<"quote_revisions">;

/** Design proof table aliases for app code */
export type DesignProofRow = Tables<"design_proofs">;
export type DesignProofInsert = TablesInsert<"design_proofs">;
export type DesignProofUpdate = TablesUpdate<"design_proofs">;
export type DesignProofVersionRow = Tables<"design_proof_versions">;
export type DesignProofVersionInsert = TablesInsert<"design_proof_versions">;
export type DesignProofVersionUpdate = TablesUpdate<"design_proof_versions">;

/** Order table aliases for app code */
export type OrderRow = Tables<"orders">;
export type OrderInsert = TablesInsert<"orders">;
export type OrderUpdate = TablesUpdate<"orders">;
export type OrderItemRow = Tables<"order_items">;
export type OrderItemInsert = TablesInsert<"order_items">;
export type OrderItemUpdate = TablesUpdate<"order_items">;
export type PaymentRecordRow = Tables<"payment_records">;
export type PaymentRecordInsert = TablesInsert<"payment_records">;
export type PaymentRecordUpdate = TablesUpdate<"payment_records">;
