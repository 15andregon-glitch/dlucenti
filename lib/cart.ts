/** Format price for cart and checkout surfaces */
export function formatPrice(amount: number, currency = "EUR"): string {
  return `${amount.toLocaleString("fr-FR", { maximumFractionDigits: 0 })} ${currency}`;
}
