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
      announcements: {
        Row: {
          body: string
          created_at: string
          demo_key: string | null
          id: string
          published_at: string | null
          title: string
        }
        Insert: {
          body?: string
          created_at?: string
          demo_key?: string | null
          id?: string
          published_at?: string | null
          title: string
        }
        Update: {
          body?: string
          created_at?: string
          demo_key?: string | null
          id?: string
          published_at?: string | null
          title?: string
        }
        Relationships: []
      }
      conversations: {
        Row: {
          created_at: string
          customer_id: string | null
          demo_key: string | null
          id: string
          project_id: string | null
          seller_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_id?: string | null
          demo_key?: string | null
          id?: string
          project_id?: string | null
          seller_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_id?: string | null
          demo_key?: string | null
          id?: string
          project_id?: string | null
          seller_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_owned_items: {
        Row: {
          brand: string
          category: string
          color: string
          condition: string
          created_at: string
          customer_id: string
          demo_key: string | null
          id: string
          item_number: string
          name: string
          notes: string
          photos: Json
          project_id: string
          quantity: number
          received_at: string | null
          size: string
          status: string
          tracking_company: string
          tracking_number: string
          updated_at: string
        }
        Insert: {
          brand?: string
          category: string
          color?: string
          condition?: string
          created_at?: string
          customer_id: string
          demo_key?: string | null
          id?: string
          item_number: string
          name: string
          notes?: string
          photos?: Json
          project_id: string
          quantity?: number
          received_at?: string | null
          size?: string
          status: string
          tracking_company?: string
          tracking_number?: string
          updated_at?: string
        }
        Update: {
          brand?: string
          category?: string
          color?: string
          condition?: string
          created_at?: string
          customer_id?: string
          demo_key?: string | null
          id?: string
          item_number?: string
          name?: string
          notes?: string
          photos?: Json
          project_id?: string
          quantity?: number
          received_at?: string | null
          size?: string
          status?: string
          tracking_company?: string
          tracking_number?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_owned_items_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
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
      messages: {
        Row: {
          body: string
          content_type: string
          conversation_id: string
          created_at: string
          demo_key: string | null
          id: string
          image_path: string | null
          image_url: string | null
          is_read: boolean
          read_at: string | null
          sender_id: string | null
          sender_role: string
        }
        Insert: {
          body?: string
          content_type?: string
          conversation_id: string
          created_at?: string
          demo_key?: string | null
          id?: string
          image_path?: string | null
          image_url?: string | null
          is_read?: boolean
          read_at?: string | null
          sender_id?: string | null
          sender_role: string
        }
        Update: {
          body?: string
          content_type?: string
          conversation_id?: string
          created_at?: string
          demo_key?: string | null
          id?: string
          image_path?: string | null
          image_url?: string | null
          is_read?: boolean
          read_at?: string | null
          sender_id?: string | null
          sender_role?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string
          created_at: string
          demo_key: string | null
          entity_id: string | null
          entity_type: string | null
          id: string
          is_read: boolean
          link_path: string | null
          read_at: string | null
          title: string
          type: string
          user_id: string | null
        }
        Insert: {
          body?: string
          created_at?: string
          demo_key?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          is_read?: boolean
          link_path?: string | null
          read_at?: string | null
          title: string
          type: string
          user_id?: string | null
        }
        Update: {
          body?: string
          created_at?: string
          demo_key?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          is_read?: boolean
          link_path?: string | null
          read_at?: string | null
          title?: string
          type?: string
          user_id?: string | null
        }
        Relationships: []
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
      profiles: {
        Row: {
          avatar: string | null
          created_at: string
          demo_key: string | null
          id: string
          language: string
          nickname: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          avatar?: string | null
          created_at?: string
          demo_key?: string | null
          id: string
          language?: string
          nickname?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          avatar?: string | null
          created_at?: string
          demo_key?: string | null
          id?: string
          language?: string
          nickname?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
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
      timeline_events: {
        Row: {
          actor_id: string | null
          actor_name: string
          actor_type: string
          created_at: string
          demo_key: string | null
          description: string
          event_type: string
          id: string
          metadata: Json
          occurred_at: string | null
          project_id: string
          status: string
          title: string
        }
        Insert: {
          actor_id?: string | null
          actor_name?: string
          actor_type?: string
          created_at?: string
          demo_key?: string | null
          description?: string
          event_type: string
          id?: string
          metadata?: Json
          occurred_at?: string | null
          project_id: string
          status?: string
          title: string
        }
        Update: {
          actor_id?: string | null
          actor_name?: string
          actor_type?: string
          created_at?: string
          demo_key?: string | null
          description?: string
          event_type?: string
          id?: string
          metadata?: Json
          occurred_at?: string | null
          project_id?: string
          status?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "timeline_events_project_id_fkey"
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
      current_profile_role: {
        Args: never
        Returns: Database["public"]["Enums"]["user_role"]
      }
      is_admin: { Args: never; Returns: boolean }
      is_project_participant: {
        Args: { p_project_id: string }
        Returns: boolean
      }
      is_project_participant_from_path: {
        Args: { object_name: string }
        Returns: boolean
      }
      is_storage_object_owner: {
        Args: { object_name: string }
        Returns: boolean
      }
      storage_object_owner: { Args: { object_name: string }; Returns: string }
    }
    Enums: {
      user_role: "CUSTOMER" | "SELLER" | "ADMIN"
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
    Enums: {
      user_role: ["CUSTOMER", "SELLER", "ADMIN"],
    },
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

/** Customer owned item table aliases for app code */
export type CustomerOwnedItemRow = Tables<"customer_owned_items">;
export type CustomerOwnedItemInsert = TablesInsert<"customer_owned_items">;
export type CustomerOwnedItemUpdate = TablesUpdate<"customer_owned_items">;

/** Timeline event table aliases for app code */
export type TimelineEventRow = Tables<"timeline_events">;
export type TimelineEventInsert = TablesInsert<"timeline_events">;
export type TimelineEventUpdate = TablesUpdate<"timeline_events">;

/** Profile table aliases for app code */
export type ProfileRow = Tables<"profiles">;
export type ProfileInsert = TablesInsert<"profiles">;
export type ProfileUpdate = TablesUpdate<"profiles">;
export type UserRoleEnum = Enums<"user_role">;

/** Chat table aliases for app code */
export type ConversationRow = Tables<"conversations">;
export type ConversationInsert = TablesInsert<"conversations">;
export type ConversationUpdate = TablesUpdate<"conversations">;
export type MessageRow = Tables<"messages">;
export type MessageInsert = TablesInsert<"messages">;
export type MessageUpdate = TablesUpdate<"messages">;

/** Notification table aliases for app code */
export type NotificationRow = Tables<"notifications">;
export type NotificationInsert = TablesInsert<"notifications">;
export type NotificationUpdate = TablesUpdate<"notifications">;

/** Announcement table aliases for app code */
export type AnnouncementRow = Tables<"announcements">;
export type AnnouncementInsert = TablesInsert<"announcements">;
export type AnnouncementUpdate = TablesUpdate<"announcements">;
