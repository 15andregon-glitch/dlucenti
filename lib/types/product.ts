export type ProductCategory =
  | "rings"
  | "necklaces"
  | "earrings"
  | "bracelets"
  | "objects";

export interface Product {
  id: string;
  slug: string;
  name: string;
  subtitle?: string;
  description: string;
  price: number;
  currency: string;
  category: ProductCategory;
  collectionSlug?: string;
  images: string[];
  materials?: string;
  featured?: boolean;
  isNew?: boolean;
}
