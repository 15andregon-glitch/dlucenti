/** Set STOREFRONT_PRODUCT_DEBUG=true to log catalog pipeline counts on the server. */

export function isStorefrontProductDebugEnabled(): boolean {
  return process.env.STOREFRONT_PRODUCT_DEBUG === "true";
}

export function logStorefrontProductPipeline(
  label: string,
  counts: {
    fromSupabase?: number;
    afterVisibility?: number;
    afterMap?: number;
    error?: string | null;
  },
): void {
  if (!isStorefrontProductDebugEnabled()) return;
  console.info("[storefront:products]", label, counts);
}
