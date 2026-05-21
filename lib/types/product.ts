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
  /** CMS "Mostrar na homepage" — homepage row only, not shop visibility */
  featured?: boolean;
  /** CMS "Mostrar etiqueta Novidade" — visual badge only */
  isNew?: boolean;
  /** Units on hand — visibility is CMS-only; stock controls purchasability. */
  stock: number;
}
