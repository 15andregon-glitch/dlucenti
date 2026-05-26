/**
 * Supabase Database types — keep in sync with supabase/schema.sql
 * Regenerate with: npx supabase gen types typescript --project-id <id> > types/database/schema.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type ProductCategory =
  | "rings"
  | "necklaces"
  | "earrings"
  | "bracelets"
  | "objects";

export type ProductTargetGender = "women" | "men" | "unisex";

export type AdminRole = "owner" | "editor" | "viewer";

export type ProductPublicationStatus = "draft" | "published";

export type CollectionPublicationStatus = "draft" | "published";
export type CollectionHeroAlignment = "left" | "center" | "right";
export type CollectionTextColor = "light" | "dark";
export type CollectionTitlePosition = "top" | "center" | "bottom";
export type CollectionMediaKind =
  | "hero_desktop"
  | "hero_mobile"
  | "editorial_cover"
  | "thumbnail"
  | "atmosphere"
  | "editorial_gallery"
  | "og_image";
export type CollectionBlockType =
  | "story"
  | "quote"
  | "cinematic_image"
  | "gallery"
  | "spacer";

export type FinancialCategoryGroup =
  | "revenue"
  | "variable_cost"
  | "fixed_cost"
  | "depreciation"
  | "financial"
  | "extraordinary";

export type FinancialEntrySource =
  | "manual"
  | "order"
  | "inventory"
  | "shipping"
  | "import";

export type ReportingPeriodType = "month" | "quarter" | "year";

export type OrderStatus = "pending" | "paid" | "shipped" | "completed" | "cancelled";
export type FulfillmentStatus = "unfulfilled" | "processing" | "shipped";

export interface Database {
  public: {
    Tables: {
      collections: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          name: string;
          slug: string;
          description: string;
          cover_image: string;
          featured: boolean;
          short_title: string;
          editorial_title: string;
          subtitle: string;
          launch_date: string | null;
          publication_status: CollectionPublicationStatus;
          campaign_video_url: string | null;
          story_body: string;
          inspiration_text: string;
          materials_text: string;
          campaign_mood: string;
          hero_alignment: CollectionHeroAlignment;
          text_color: CollectionTextColor;
          overlay_opacity: number;
          title_position: CollectionTitlePosition;
          enable_fullscreen_hero: boolean;
          enable_dark_mode_section: boolean;
          meta_title: string;
          meta_description: string;
          og_image: string;
          display_order: number;
          hidden_from_frontend: boolean;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          name: string;
          slug: string;
          description?: string;
          cover_image?: string;
          featured?: boolean;
          short_title?: string;
          editorial_title?: string;
          subtitle?: string;
          launch_date?: string | null;
          publication_status?: CollectionPublicationStatus;
          campaign_video_url?: string | null;
          story_body?: string;
          inspiration_text?: string;
          materials_text?: string;
          campaign_mood?: string;
          hero_alignment?: CollectionHeroAlignment;
          text_color?: CollectionTextColor;
          overlay_opacity?: number;
          title_position?: CollectionTitlePosition;
          enable_fullscreen_hero?: boolean;
          enable_dark_mode_section?: boolean;
          meta_title?: string;
          meta_description?: string;
          og_image?: string;
          display_order?: number;
          hidden_from_frontend?: boolean;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          name?: string;
          slug?: string;
          description?: string;
          cover_image?: string;
          featured?: boolean;
          short_title?: string;
          editorial_title?: string;
          subtitle?: string;
          launch_date?: string | null;
          publication_status?: CollectionPublicationStatus;
          campaign_video_url?: string | null;
          story_body?: string;
          inspiration_text?: string;
          materials_text?: string;
          campaign_mood?: string;
          hero_alignment?: CollectionHeroAlignment;
          text_color?: CollectionTextColor;
          overlay_opacity?: number;
          title_position?: CollectionTitlePosition;
          enable_fullscreen_hero?: boolean;
          enable_dark_mode_section?: boolean;
          meta_title?: string;
          meta_description?: string;
          og_image?: string;
          display_order?: number;
          hidden_from_frontend?: boolean;
        };
        Relationships: [];
      };
      collection_media: {
        Row: {
          id: string;
          collection_id: string;
          kind: CollectionMediaKind;
          image_url: string;
          alt: string | null;
          position: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          collection_id: string;
          kind: CollectionMediaKind;
          image_url: string;
          alt?: string | null;
          position?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          collection_id?: string;
          kind?: CollectionMediaKind;
          image_url?: string;
          alt?: string | null;
          position?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "collection_media_collection_id_fkey";
            columns: ["collection_id"];
            isOneToOne: false;
            referencedRelation: "collections";
            referencedColumns: ["id"];
          },
        ];
      };
      collection_blocks: {
        Row: {
          id: string;
          collection_id: string;
          block_type: CollectionBlockType;
          position: number;
          content: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          collection_id: string;
          block_type: CollectionBlockType;
          position: number;
          content?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          collection_id?: string;
          block_type?: CollectionBlockType;
          position?: number;
          content?: Json;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "collection_blocks_collection_id_fkey";
            columns: ["collection_id"];
            isOneToOne: false;
            referencedRelation: "collections";
            referencedColumns: ["id"];
          },
        ];
      };
      products: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          name: string;
          slug: string;
          description: string;
          price: number;
          category: ProductCategory;
          target_gender: ProductTargetGender;
          stock: number;
          featured: boolean;
          new_in: boolean;
          collection_id: string | null;
          active: boolean;
          publication_status: ProductPublicationStatus;
          hidden_from_frontend: boolean;
          archived: boolean;
          materials: string;
          dimensions: string;
          product_cost: number;
          packaging_cost: number;
          pouch_cost: number;
          shipping_cost: number;
          payment_fee_percent: number;
          import_cost: number;
          vat_rate: number;
          supplier_name: string;
          supplier_reference: string;
          target_margin_percent: number | null;
          sku: string | null;
          barcode: string | null;
          minimum_stock: number;
          reserved_stock: number;
          lead_time_days: number;
          warehouse_location: string;
          total_cost: number;
          gross_margin_percent: number;
          estimated_net_profit: number;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          name: string;
          slug: string;
          description?: string;
          price: number;
          category: ProductCategory;
          target_gender?: ProductTargetGender;
          stock?: number;
          featured?: boolean;
          new_in?: boolean;
          collection_id?: string | null;
          active?: boolean;
          publication_status?: ProductPublicationStatus;
          hidden_from_frontend?: boolean;
          archived?: boolean;
          materials?: string;
          dimensions?: string;
          product_cost?: number;
          packaging_cost?: number;
          pouch_cost?: number;
          shipping_cost?: number;
          payment_fee_percent?: number;
          import_cost?: number;
          vat_rate?: number;
          supplier_name?: string;
          supplier_reference?: string;
          target_margin_percent?: number | null;
          sku?: string | null;
          barcode?: string | null;
          minimum_stock?: number;
          reserved_stock?: number;
          lead_time_days?: number;
          warehouse_location?: string;
          total_cost?: number;
          gross_margin_percent?: number;
          estimated_net_profit?: number;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          name?: string;
          slug?: string;
          description?: string;
          price?: number;
          category?: ProductCategory;
          target_gender?: ProductTargetGender;
          stock?: number;
          featured?: boolean;
          new_in?: boolean;
          collection_id?: string | null;
          active?: boolean;
          publication_status?: ProductPublicationStatus;
          hidden_from_frontend?: boolean;
          archived?: boolean;
          materials?: string;
          dimensions?: string;
          product_cost?: number;
          packaging_cost?: number;
          pouch_cost?: number;
          shipping_cost?: number;
          payment_fee_percent?: number;
          import_cost?: number;
          vat_rate?: number;
          supplier_name?: string;
          supplier_reference?: string;
          target_margin_percent?: number | null;
          sku?: string | null;
          barcode?: string | null;
          minimum_stock?: number;
          reserved_stock?: number;
          lead_time_days?: number;
          warehouse_location?: string;
          total_cost?: number;
          gross_margin_percent?: number;
          estimated_net_profit?: number;
        };
        Relationships: [
          {
            foreignKeyName: "products_collection_id_fkey";
            columns: ["collection_id"];
            isOneToOne: false;
            referencedRelation: "collections";
            referencedColumns: ["id"];
          },
        ];
      };
      product_images: {
        Row: {
          id: string;
          product_id: string;
          image_url: string;
          alt: string | null;
          position: number;
        };
        Insert: {
          id?: string;
          product_id: string;
          image_url: string;
          alt?: string | null;
          position?: number;
        };
        Update: {
          id?: string;
          product_id?: string;
          image_url?: string;
          alt?: string | null;
          position?: number;
        };
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      homepage_settings: {
        Row: {
          id: string;
          hero_video_url: string | null;
          featured_collection_id: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          hero_video_url?: string | null;
          featured_collection_id?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          hero_video_url?: string | null;
          featured_collection_id?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "homepage_settings_featured_collection_id_fkey";
            columns: ["featured_collection_id"];
            isOneToOne: false;
            referencedRelation: "collections";
            referencedColumns: ["id"];
          },
        ];
      };
      homepage_new_in: {
        Row: {
          id: string;
          product_id: string;
          position: number;
        };
        Insert: {
          id?: string;
          product_id: string;
          position: number;
        };
        Update: {
          id?: string;
          product_id?: string;
          position?: number;
        };
        Relationships: [
          {
            foreignKeyName: "homepage_new_in_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: true;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      campaigns: {
        Row: {
          id: string;
          image_url: string;
          position: number;
          active: boolean;
        };
        Insert: {
          id?: string;
          image_url: string;
          position: number;
          active?: boolean;
        };
        Update: {
          id?: string;
          image_url?: string;
          position?: number;
          active?: boolean;
        };
        Relationships: [];
      };
      footer_settings: {
        Row: {
          id: string;
          contact_email: string;
          slogan_en: string;
          slogan_pt: string;
          location_en: string;
          location_pt: string;
          explore_title_en: string;
          explore_title_pt: string;
          maison_title_en: string;
          maison_title_pt: string;
          contacts_title_en: string;
          contacts_title_pt: string;
          socials_title_en: string;
          socials_title_pt: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          contact_email?: string;
          slogan_en: string;
          slogan_pt: string;
          location_en?: string;
          location_pt?: string;
          explore_title_en: string;
          explore_title_pt: string;
          maison_title_en: string;
          maison_title_pt: string;
          contacts_title_en: string;
          contacts_title_pt: string;
          socials_title_en: string;
          socials_title_pt: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          contact_email?: string;
          slogan_en?: string;
          slogan_pt?: string;
          location_en?: string;
          location_pt?: string;
          explore_title_en?: string;
          explore_title_pt?: string;
          maison_title_en?: string;
          maison_title_pt?: string;
          contacts_title_en?: string;
          contacts_title_pt?: string;
          socials_title_en?: string;
          socials_title_pt?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      footer_social_links: {
        Row: {
          id: string;
          label: string;
          url: string;
          position: number;
          active: boolean;
        };
        Insert: {
          id?: string;
          label: string;
          url: string;
          position: number;
          active?: boolean;
        };
        Update: {
          id?: string;
          label?: string;
          url?: string;
          position?: number;
          active?: boolean;
        };
        Relationships: [];
      };
      admins: {
        Row: {
          id: string;
          email: string;
          role: AdminRole;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          role?: AdminRole;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          role?: AdminRole;
          created_at?: string;
        };
        Relationships: [];
      };
      reporting_periods: {
        Row: {
          id: string;
          created_at: string;
          year: number;
          month: number | null;
          quarter: number | null;
          period_type: ReportingPeriodType;
          label: string;
          starts_at: string;
          ends_at: string;
          is_closed: boolean;
        };
        Insert: {
          id?: string;
          created_at?: string;
          year: number;
          month?: number | null;
          quarter?: number | null;
          period_type?: ReportingPeriodType;
          label: string;
          starts_at: string;
          ends_at: string;
          is_closed?: boolean;
        };
        Update: {
          id?: string;
          created_at?: string;
          year?: number;
          month?: number | null;
          quarter?: number | null;
          period_type?: ReportingPeriodType;
          label?: string;
          starts_at?: string;
          ends_at?: string;
          is_closed?: boolean;
        };
        Relationships: [];
      };
      financial_categories: {
        Row: {
          id: string;
          code: string;
          name: string;
          name_pt: string;
          group_type: FinancialCategoryGroup;
          sort_order: number;
          is_active: boolean;
          description: string | null;
        };
        Insert: {
          id?: string;
          code: string;
          name: string;
          name_pt?: string;
          group_type: FinancialCategoryGroup;
          sort_order?: number;
          is_active?: boolean;
          description?: string | null;
        };
        Update: {
          id?: string;
          code?: string;
          name?: string;
          name_pt?: string;
          group_type?: FinancialCategoryGroup;
          sort_order?: number;
          is_active?: boolean;
          description?: string | null;
        };
        Relationships: [];
      };
      financial_entries: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          period_id: string;
          category_id: string;
          amount: number;
          currency: string;
          source: FinancialEntrySource;
          source_ref: string | null;
          description: string | null;
          entry_date: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          period_id: string;
          category_id: string;
          amount: number;
          currency?: string;
          source?: FinancialEntrySource;
          source_ref?: string | null;
          description?: string | null;
          entry_date?: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          period_id?: string;
          category_id?: string;
          amount?: number;
          currency?: string;
          source?: FinancialEntrySource;
          source_ref?: string | null;
          description?: string | null;
          entry_date?: string;
        };
        Relationships: [
          {
            foreignKeyName: "financial_entries_period_id_fkey";
            columns: ["period_id"];
            isOneToOne: false;
            referencedRelation: "reporting_periods";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "financial_entries_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "financial_categories";
            referencedColumns: ["id"];
          },
        ];
      };
      dr_snapshots: {
        Row: {
          id: string;
          period_id: string;
          computed_at: string;
          snapshot: Json;
        };
        Insert: {
          id?: string;
          period_id: string;
          computed_at?: string;
          snapshot: Json;
        };
        Update: {
          id?: string;
          period_id?: string;
          computed_at?: string;
          snapshot?: Json;
        };
        Relationships: [
          {
            foreignKeyName: "dr_snapshots_period_id_fkey";
            columns: ["period_id"];
            isOneToOne: true;
            referencedRelation: "reporting_periods";
            referencedColumns: ["id"];
          },
        ];
      };
      orders: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          order_number: string;
          status: OrderStatus;
          subtotal: number;
          shipping_cost: number;
          tax: number;
          total: number;
          currency: string;
          period_id: string | null;
          synced_to_finance: boolean;
          stripe_session_id: string | null;
          stripe_payment_intent: string | null;
          customer_email: string | null;
          customer_name: string | null;
          fulfillment_status: FulfillmentStatus;
          shipping_address: string | null;
          shipping_country: string | null;
          locale: string;
          tracking_number: string | null;
          courier: string | null;
          tracking_url: string | null;
          packlink_service_id: string | null;
          label_url: string | null;
          shipping_service_name: string | null;
          customer_shipping_paid: number;
          real_shipping_cost: number;
          store_shipping_subsidy: number;
          free_shipping_applied: boolean;
          selected_free_shipping_service: string | null;
          selected_free_shipping_carrier: string | null;
          packaging_cost: number;
          total_operational_cost: number;
          estimated_profit: number;
          estimated_margin: number;
          delivery_type: string | null;
          pickup_point_id: string | null;
          pickup_point_name: string | null;
          pickup_point_address: string | null;
          shipped_at: string | null;
          shipping_email_sent_at: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          order_number: string;
          status?: OrderStatus;
          subtotal?: number;
          shipping_cost?: number;
          tax?: number;
          total?: number;
          currency?: string;
          period_id?: string | null;
          synced_to_finance?: boolean;
          stripe_session_id?: string | null;
          stripe_payment_intent?: string | null;
          customer_email?: string | null;
          customer_name?: string | null;
          fulfillment_status?: FulfillmentStatus;
          shipping_address?: string | null;
          shipping_country?: string | null;
          locale?: string;
          tracking_number?: string | null;
          courier?: string | null;
          tracking_url?: string | null;
          packlink_service_id?: string | null;
          label_url?: string | null;
          shipping_service_name?: string | null;
          customer_shipping_paid?: number;
          real_shipping_cost?: number;
          store_shipping_subsidy?: number;
          free_shipping_applied?: boolean;
          selected_free_shipping_service?: string | null;
          selected_free_shipping_carrier?: string | null;
          packaging_cost?: number;
          total_operational_cost?: number;
          estimated_profit?: number;
          estimated_margin?: number;
          delivery_type?: string | null;
          pickup_point_id?: string | null;
          pickup_point_name?: string | null;
          pickup_point_address?: string | null;
          shipped_at?: string | null;
          shipping_email_sent_at?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          order_number?: string;
          status?: OrderStatus;
          subtotal?: number;
          shipping_cost?: number;
          tax?: number;
          total?: number;
          currency?: string;
          period_id?: string | null;
          synced_to_finance?: boolean;
          stripe_session_id?: string | null;
          stripe_payment_intent?: string | null;
          customer_email?: string | null;
          customer_name?: string | null;
          fulfillment_status?: FulfillmentStatus;
          shipping_address?: string | null;
          shipping_country?: string | null;
          locale?: string;
          tracking_number?: string | null;
          courier?: string | null;
          tracking_url?: string | null;
          packlink_service_id?: string | null;
          label_url?: string | null;
          shipping_service_name?: string | null;
          customer_shipping_paid?: number;
          real_shipping_cost?: number;
          store_shipping_subsidy?: number;
          free_shipping_applied?: boolean;
          selected_free_shipping_service?: string | null;
          selected_free_shipping_carrier?: string | null;
          packaging_cost?: number;
          total_operational_cost?: number;
          estimated_profit?: number;
          estimated_margin?: number;
          delivery_type?: string | null;
          pickup_point_id?: string | null;
          pickup_point_name?: string | null;
          pickup_point_address?: string | null;
          shipped_at?: string | null;
          shipping_email_sent_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "orders_period_id_fkey";
            columns: ["period_id"];
            isOneToOne: false;
            referencedRelation: "reporting_periods";
            referencedColumns: ["id"];
          },
        ];
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string | null;
          product_name: string;
          quantity: number;
          unit_price: number;
          unit_cost: number;
          allocated_shipping_cost: number;
          allocated_total_cost: number;
          estimated_item_profit: number;
          estimated_item_margin: number;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id?: string | null;
          product_name: string;
          quantity: number;
          unit_price: number;
          unit_cost?: number;
          allocated_shipping_cost?: number;
          allocated_total_cost?: number;
          estimated_item_profit?: number;
          estimated_item_margin?: number;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string | null;
          product_name?: string;
          quantity?: number;
          unit_price?: number;
          unit_cost?: number;
          allocated_shipping_cost?: number;
          allocated_total_cost?: number;
          estimated_item_profit?: number;
          estimated_item_margin?: number;
        };
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "order_items_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: {
      decrement_product_stock: {
        Args: { p_product_id: string; p_quantity: number };
        Returns: number;
      };
    };
    Enums: {
      product_category: ProductCategory;
      product_target_gender: ProductTargetGender;
      admin_role: AdminRole;
      financial_category_group: FinancialCategoryGroup;
      financial_entry_source: FinancialEntrySource;
      reporting_period_type: ReportingPeriodType;
      order_status: OrderStatus;
      fulfillment_status: FulfillmentStatus;
    };
    CompositeTypes: Record<string, never>;
  };
}

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

export type TablesInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];

export type TablesUpdate<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];

export type Enums<T extends keyof Database["public"]["Enums"]> =
  Database["public"]["Enums"][T];
