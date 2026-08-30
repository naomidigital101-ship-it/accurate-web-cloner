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
      _bak_png_to_webp_20260826: {
        Row: {
          c: string | null
          id: string | null
          t: string | null
          v: string | null
        }
        Insert: {
          c?: string | null
          id?: string | null
          t?: string | null
          v?: string | null
        }
        Update: {
          c?: string | null
          id?: string | null
          t?: string | null
          v?: string | null
        }
        Relationships: []
      }
      admin_allowlist: {
        Row: {
          created_at: string
          email: string
          note: string | null
          role: Database["public"]["Enums"]["app_role"]
        }
        Insert: {
          created_at?: string
          email: string
          note?: string | null
          role?: Database["public"]["Enums"]["app_role"]
        }
        Update: {
          created_at?: string
          email?: string
          note?: string | null
          role?: Database["public"]["Enums"]["app_role"]
        }
        Relationships: []
      }
      certificates: {
        Row: {
          created_at: string
          description: string | null
          file_url: string | null
          id: string
          issuer: string | null
          sort_order: number
          status: string
          thumb_url: string | null
          title: string
          updated_at: string
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          file_url?: string | null
          id?: string
          issuer?: string | null
          sort_order?: number
          status?: string
          thumb_url?: string | null
          title: string
          updated_at?: string
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          file_url?: string | null
          id?: string
          issuer?: string | null
          sort_order?: number
          status?: string
          thumb_url?: string | null
          title?: string
          updated_at?: string
          valid_from?: string | null
          valid_until?: string | null
        }
        Relationships: []
      }
      faqs: {
        Row: {
          answer: string
          created_at: string
          id: string
          lang: string
          question: string
          sort_order: number
          status: string
          updated_at: string
        }
        Insert: {
          answer: string
          created_at?: string
          id?: string
          lang?: string
          question: string
          sort_order?: number
          status?: string
          updated_at?: string
        }
        Update: {
          answer?: string
          created_at?: string
          id?: string
          lang?: string
          question?: string
          sort_order?: number
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      gallery_images: {
        Row: {
          alt: string | null
          created_at: string
          id: string
          sort_order: number
          status: string
          updated_at: string
          url: string
        }
        Insert: {
          alt?: string | null
          created_at?: string
          id?: string
          sort_order?: number
          status?: string
          updated_at?: string
          url: string
        }
        Update: {
          alt?: string | null
          created_at?: string
          id?: string
          sort_order?: number
          status?: string
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          address: string | null
          city: string | null
          condition: string | null
          created_at: string
          dedication: string | null
          delivery: string | null
          email: string | null
          first_name: string | null
          form_page: string | null
          full_name: string | null
          hand: string | null
          id: string
          kind: string
          lang: string
          last_name: string | null
          legacy_id: string | null
          notes: string | null
          phone: string | null
          phone_key: string | null
          referer: string | null
          referer_url: string | null
          source: string
          status: string
          supplied_at: string | null
          target: string | null
          updated_at: string
          user_agent: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          condition?: string | null
          created_at?: string
          dedication?: string | null
          delivery?: string | null
          email?: string | null
          first_name?: string | null
          form_page?: string | null
          full_name?: string | null
          hand?: string | null
          id?: string
          kind: string
          lang?: string
          last_name?: string | null
          legacy_id?: string | null
          notes?: string | null
          phone?: string | null
          phone_key?: string | null
          referer?: string | null
          referer_url?: string | null
          source?: string
          status?: string
          supplied_at?: string | null
          target?: string | null
          updated_at?: string
          user_agent?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          condition?: string | null
          created_at?: string
          dedication?: string | null
          delivery?: string | null
          email?: string | null
          first_name?: string | null
          form_page?: string | null
          full_name?: string | null
          hand?: string | null
          id?: string
          kind?: string
          lang?: string
          last_name?: string | null
          legacy_id?: string | null
          notes?: string | null
          phone?: string | null
          phone_key?: string | null
          referer?: string | null
          referer_url?: string | null
          source?: string
          status?: string
          supplied_at?: string | null
          target?: string | null
          updated_at?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      mail_log: {
        Row: {
          created_at: string
          detail: string | null
          id: string
          recipient: string | null
          stage: string
          status: string
        }
        Insert: {
          created_at?: string
          detail?: string | null
          id?: string
          recipient?: string | null
          stage: string
          status: string
        }
        Update: {
          created_at?: string
          detail?: string | null
          id?: string
          recipient?: string | null
          stage?: string
          status?: string
        }
        Relationships: []
      }
      media: {
        Row: {
          alt: string | null
          created_at: string
          description: string | null
          file_name: string | null
          folder: string
          height: number | null
          id: string
          is_public: boolean
          mime_type: string | null
          size_bytes: number | null
          sort_order: number
          title: string | null
          updated_at: string
          url: string
          width: number | null
        }
        Insert: {
          alt?: string | null
          created_at?: string
          description?: string | null
          file_name?: string | null
          folder?: string
          height?: number | null
          id?: string
          is_public?: boolean
          mime_type?: string | null
          size_bytes?: number | null
          sort_order?: number
          title?: string | null
          updated_at?: string
          url: string
          width?: number | null
        }
        Update: {
          alt?: string | null
          created_at?: string
          description?: string | null
          file_name?: string | null
          folder?: string
          height?: number | null
          id?: string
          is_public?: boolean
          mime_type?: string | null
          size_bytes?: number | null
          sort_order?: number
          title?: string | null
          updated_at?: string
          url?: string
          width?: number | null
        }
        Relationships: []
      }
      press_items: {
        Row: {
          created_at: string
          featured: boolean
          href: string | null
          id: string
          lang: string
          logo_text: string | null
          logo_url: string | null
          published_label: string | null
          sort_order: number
          source: string
          status: string
          title: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          featured?: boolean
          href?: string | null
          id?: string
          lang?: string
          logo_text?: string | null
          logo_url?: string | null
          published_label?: string | null
          sort_order?: number
          source: string
          status?: string
          title?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          featured?: boolean
          href?: string | null
          id?: string
          lang?: string
          logo_text?: string | null
          logo_url?: string | null
          published_label?: string | null
          sort_order?: number
          source?: string
          status?: string
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      rabbi_letters: {
        Row: {
          created_at: string
          id: string
          lang: string
          letter_url: string | null
          name: string
          portrait_url: string | null
          role: string | null
          sort_order: number
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          lang?: string
          letter_url?: string | null
          name: string
          portrait_url?: string | null
          role?: string | null
          sort_order?: number
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          lang?: string
          letter_url?: string | null
          name?: string
          portrait_url?: string | null
          role?: string | null
          sort_order?: number
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          back_text: string | null
          back_title: string | null
          card_height: number
          created_at: string
          href: string | null
          id: string
          img: string | null
          lang: string
          more_label: string | null
          sort_order: number
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          back_text?: string | null
          back_title?: string | null
          card_height?: number
          created_at?: string
          href?: string | null
          id?: string
          img?: string | null
          lang?: string
          more_label?: string | null
          sort_order?: number
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          back_text?: string | null
          back_title?: string | null
          card_height?: number
          created_at?: string
          href?: string | null
          id?: string
          img?: string | null
          lang?: string
          more_label?: string | null
          sort_order?: number
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          group_name: string
          input_type: string
          key: string
          label: string
          sort_order: number
          updated_at: string
          value: string | null
        }
        Insert: {
          group_name?: string
          input_type?: string
          key: string
          label: string
          sort_order?: number
          updated_at?: string
          value?: string | null
        }
        Update: {
          group_name?: string
          input_type?: string
          key?: string
          label?: string
          sort_order?: number
          updated_at?: string
          value?: string | null
        }
        Relationships: []
      }
      stories: {
        Row: {
          author: string | null
          city: string | null
          created_at: string
          extra_img: string | null
          id: string
          img: string | null
          lang: string
          legacy_path: string | null
          meta_description: string | null
          meta_title: string | null
          noindex: boolean
          og_image_url: string | null
          paragraphs: string[]
          slug: string
          sort_order: number
          status: string
          subtitle: string | null
          title: string
          updated_at: string
        }
        Insert: {
          author?: string | null
          city?: string | null
          created_at?: string
          extra_img?: string | null
          id?: string
          img?: string | null
          lang?: string
          legacy_path?: string | null
          meta_description?: string | null
          meta_title?: string | null
          noindex?: boolean
          og_image_url?: string | null
          paragraphs?: string[]
          slug: string
          sort_order?: number
          status?: string
          subtitle?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          author?: string | null
          city?: string | null
          created_at?: string
          extra_img?: string | null
          id?: string
          img?: string | null
          lang?: string
          legacy_path?: string | null
          meta_description?: string | null
          meta_title?: string | null
          noindex?: boolean
          og_image_url?: string | null
          paragraphs?: string[]
          slug?: string
          sort_order?: number
          status?: string
          subtitle?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      thank_you_letters: {
        Row: {
          created_at: string
          id: string
          img: string
          lang: string
          sort_order: number
          status: string
          sub: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          img: string
          lang?: string
          sort_order?: number
          status?: string
          sub?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          img?: string
          lang?: string
          sort_order?: number
          status?: string
          sub?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      timeline_events: {
        Row: {
          category: string
          created_at: string
          event_date: string
          id: string
          note: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          event_date: string
          id?: string
          note?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          event_date?: string
          id?: string
          note?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      leads_admin: {
        Row: {
          address: string | null
          city: string | null
          condition: string | null
          created_at: string | null
          dedication: string | null
          delivery: string | null
          email: string | null
          first_name: string | null
          form_page: string | null
          full_name: string | null
          hand: string | null
          id: string | null
          kind: string | null
          lang: string | null
          last_name: string | null
          legacy_id: string | null
          notes: string | null
          phone: string | null
          phone_key: string | null
          referer: string | null
          referer_url: string | null
          repeat_count: number | null
          source: string | null
          status: string | null
          supplied_at: string | null
          target: string | null
          updated_at: string | null
          user_agent: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_staff: { Args: never; Returns: boolean }
      lead_stats: { Args: { p_months?: number }; Returns: Json }
    }
    Enums: {
      app_role: "admin" | "editor"
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
  public: {
    Enums: {
      app_role: ["admin", "editor"],
    },
  },
} as const
