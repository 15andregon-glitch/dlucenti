export type ProductCategory =
  | "rings"
  | "necklaces"
  | "earrings"
  | "bracelets"
  | "objects";

export type ProductTargetGender = "women" | "men" | "unisex";

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
  featured?: boolean;
  isNew?: boolean;
  /** Units on hand — visibility is CMS-only; stock controls purchasability. */
  stock: number;
}
