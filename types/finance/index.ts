export type FinancialCategoryGroup =
  | "revenue"
  | "variable_cost"
  | "fixed_cost"
  | "depreciation"
  | "financial"
  | "extraordinary";

export type FinancialEntrySource =
  | "manual"
  | "order"
  | "inventory"
  | "shipping"
  | "import";

export type ReportingPeriodType = "month" | "quarter" | "year";

export type OrderStatus =
  | "pending"
  | "paid"
  | "shipped"
  | "completed"
  | "cancelled";

export interface FinancialCategory {
  id: string;
  code: string;
  name: string;
  name_pt: string;
  group_type: FinancialCategoryGroup;
  sort_order: number;
  is_active: boolean;
  description: string | null;
}

export interface ReportingPeriod {
  id: string;
  created_at: string;
  year: number;
  month: number | null;
  quarter: number | null;
  period_type: ReportingPeriodType;
  label: string;
  starts_at: string;
  ends_at: string;
  is_closed: boolean;
}

export interface FinancialEntry {
  id: string;
  created_at: string;
  updated_at: string;
  period_id: string;
  category_id: string;
  amount: number;
  currency: string;
  source: FinancialEntrySource;
  source_ref: string | null;
  description: string | null;
  entry_date: string;
  category?: FinancialCategory;
}

export interface DRLineItem {
  code: string;
  label: string;
  amount: number;
  level: number;
  isSubtotal?: boolean;
  isHeader?: boolean;
  indent?: boolean;
}

export interface IncomeStatementMetrics {
  totalRevenue: number;
  totalVariableCosts: number;
  grossMargin: number;
  grossMarginPct: number;
  totalFixedCosts: number;
  ebitda: number;
  ebitdaMarginPct: number;
  totalDepreciation: number;
  ebit: number;
  financialResult: number;
  extraordinaryNet: number;
  netIncome: number;
  netMarginPct: number;
  revenueGrowthPct: number | null;
}

export interface IncomeStatement {
  period: ReportingPeriod;
  lines: DRLineItem[];
  metrics: IncomeStatementMetrics;
  computedAt: string;
}

export interface DRSnapshot {
  id: string;
  period_id: string;
  computed_at: string;
  snapshot: IncomeStatement;
}

export interface FinanceKPIs {
  revenue: number;
  ebitda: number;
  netIncome: number;
  grossMarginPct: number;
  ebitdaMarginPct: number;
  netMarginPct: number;
}

export interface TrendPoint {
  label: string;
  periodId: string;
  revenue: number;
  ebitda: number;
  netIncome: number;
  grossMarginPct: number;
}

export interface CostStructureItem {
  label: string;
  group: FinancialCategoryGroup;
  amount: number;
  pct: number;
}
