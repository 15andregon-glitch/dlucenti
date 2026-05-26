export interface CheckoutCartLineInput {
  productId: string;
  quantity: number;
  variantId?: string;
}

export interface ValidatedCheckoutLine {
  productId: string;
  slug: string;
  name: string;
  quantity: number;
  unitPrice: number;
  unitCost: number;
  currency: string;
  imageUrl: string | null;
  variantId?: string;
  variantType?: string;
  variantLabel?: string;
  variantSku?: string | null;
}

export interface ValidatedCheckoutCart {
  lines: ValidatedCheckoutLine[];
  subtotal: number;
  currency: string;
}
