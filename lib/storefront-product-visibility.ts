/** CMS storefront visibility — inventory/stock never affects these flags. */

export function isMissingColumnError(error: { code?: string; message?: string } | null) {
  if (!error) return false;
  return (
    error.code === "42703" ||
    /hidden_from_frontend|archived|does not exist/i.test(error.message ?? "")
  );
}
