import { NextResponse } from "next/server";
import { refreshCartProductPrices } from "@/services/cart/refresh-cart-prices";

export const runtime = "nodejs";

interface CartPricesBody {
  productIds?: string[];
  lines?: Array<{ productId: string; variantId?: string }>;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CartPricesBody;

    const lines =
      body.lines ??
      (body.productIds ?? []).map((productId) => ({ productId }));

    const products = await refreshCartProductPrices(lines);
    return NextResponse.json({ products });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to refresh prices";
    console.error("[cart/prices]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
