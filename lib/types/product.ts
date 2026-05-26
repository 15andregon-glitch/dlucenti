export type ProductCategory =
  | "rings"
  | "necklaces"
  | "earrings"
  | "bracelets"
  | "objects";

export type ProductTargetGender = "women" | "men" | "unisex";

export interface ProductVariant {
  id: string;
  label: string;
  sku: string | null;
  stock: number;
  isActive: boolean;
  sortOrder: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  subtitle?: string;
  description: string;
  price: number;
  currency: string;
  category: ProductCategory;
  targetGender: ProductTargetGender;
  collectionSlug?: string;
  images: string[];
  materials?: string;
  /** CMS "Mostrar na homepage" — homepage row only, not shop visibility */
  featured?: boolean;
  /** CMS "Mostrar etiqueta Novidade" — visual badge only */
  isNew?: boolean;
  /** Units on hand — for rings, sum of active variant stock (synced from CMS). */
  stock: number;
  /** Ring sizes — present when category is rings and sizes are configured. */
  variants?: ProductVariant[];
}
