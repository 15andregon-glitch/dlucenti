export type BusinessMode = "pre_launch" | "active";

export interface BusinessModeSnapshot {
  mode: BusinessMode;
  orderCount: number;
  paidRevenue: number;
  hasRealFinancialEntries: boolean;
  hasSeedEntriesOnly: boolean;
}

/** True when description is from finance-seed.sql demo data */
export function isSeedFinancialEntry(description: string | null | undefined): boolean {
  return Boolean(description?.startsWith("seed:"));
}
