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

export type AdminRole = "owner" | "editor" | "viewer";

export interface Database {
  public: {
    Tables: {
      collections: {
        Row: {
          id: string;
          created_at: string;
          name: string;
          slug: string;
          description: string;
          cover_image: string;
          featured: boolean;
        };
        Insert: {
          id?: string;
          created_at?: string;
          name: string;
          slug: string;
          description?: string;
          cover_image?: string;
          featured?: boolean;
        };
        Update: {
          id?: string;
          created_at?: string;
          name?: string;
          slug?: string;
          description?: string;
          cover_image?: string;
          featured?: boolean;
        };
        Relationships: [];
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
          stock: number;
          featured: boolean;
          new_in: boolean;
          collection_id: string | null;
          active: boolean;
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
          stock?: number;
          featured?: boolean;
          new_in?: boolean;
          collection_id?: string | null;
          active?: boolean;
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
          stock?: number;
          featured?: boolean;
          new_in?: boolean;
          collection_id?: string | null;
          active?: boolean;
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
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      product_category: ProductCategory;
      admin_role: AdminRole;
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
