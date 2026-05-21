/** @deprecated Import from @/lib/product-editorial-visibility */
export {
  filterStorefrontProducts,
  isStorefrontProductVisible,
  type ProductVisibilityRow as StorefrontProductRow,
} from "@/lib/product-editorial-visibility";

export function isMissingColumnError(
  error: { code?: string; message?: string } | null,
) {
  if (!error) return false;
  return (
    error.code === "42703" ||
    /hidden_from_frontend|archived|does not exist/i.test(error.message ?? "")
  );
}
