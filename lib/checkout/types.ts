export interface CheckoutCartLineInput {
  productId: string;
  quantity: number;
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
}

export interface ValidatedCheckoutCart {
  lines: ValidatedCheckoutLine[];
  subtotal: number;
  currency: string;
}
