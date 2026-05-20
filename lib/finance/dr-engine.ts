import type {
  FinancialCategory,
  FinancialCategoryGroup,
  FinancialEntry,
  IncomeStatement,
  IncomeStatementMetrics,
  DRLineItem,
  ReportingPeriod,
} from "@/types/finance";

function sumByGroup(
  entries: FinancialEntry[],
  categories: Map<string, FinancialCategory>,
  group: FinancialCategoryGroup,
): number {
  return entries.reduce((sum, e) => {
    const cat = categories.get(e.category_id);
    if (cat?.group_type === group) return sum + Number(e.amount);
    return sum;
  }, 0);
}

function sumByCodes(
  entries: FinancialEntry[],
  categories: Map<string, FinancialCategory>,
  codes: string[],
): number {
  const codeSet = new Set(codes);
  return entries.reduce((sum, e) => {
    const cat = categories.get(e.category_id);
    if (cat && codeSet.has(cat.code)) return sum + Number(e.amount);
    return sum;
  }, 0);
}

function pct(part: number, whole: number): number {
  if (whole === 0) return 0;
  return (part / whole) * 100;
}

function growth(current: number, previous: number): number | null {
  if (previous === 0) return current > 0 ? 100 : null;
  return ((current - previous) / previous) * 100;
}

export function buildIncomeStatement(
  period: ReportingPeriod,
  entries: FinancialEntry[],
  categories: FinancialCategory[],
  previousRevenue?: number,
): IncomeStatement {
  const catMap = new Map(categories.map((c) => [c.id, c]));
  const enriched: FinancialEntry[] = entries.map((e) => ({
    ...e,
    category: catMap.get(e.category_id),
  }));

  const revenue = sumByGroup(enriched, catMap, "revenue");
  const variableCosts = sumByGroup(enriched, catMap, "variable_cost");
  const fixedCosts = sumByGroup(enriched, catMap, "fixed_cost");
  const depreciation = sumByGroup(enriched, catMap, "depreciation");
  const financialExpenses = sumByGroup(enriched, catMap, "financial");
  const extraordinaryIncome = sumByCodes(enriched, catMap, ["extraordinary_income"]);
  const extraordinaryExpenses = sumByCodes(enriched, catMap, [
    "extraordinary_expenses",
  ]);

  const grossMargin = revenue - variableCosts;
  const ebitda = grossMargin - fixedCosts;
  const ebit = ebitda - depreciation;
  const financialResult = -financialExpenses;
  const extraordinaryNet = extraordinaryIncome - extraordinaryExpenses;
  const netIncome = ebit + financialResult + extraordinaryNet;

  const metrics: IncomeStatementMetrics = {
    totalRevenue: revenue,
    totalVariableCosts: variableCosts,
    grossMargin,
    grossMarginPct: pct(grossMargin, revenue),
    totalFixedCosts: fixedCosts,
    ebitda,
    ebitdaMarginPct: pct(ebitda, revenue),
    totalDepreciation: depreciation,
    ebit,
    financialResult,
    extraordinaryNet,
    netIncome,
    netMarginPct: pct(netIncome, revenue),
    revenueGrowthPct:
      previousRevenue !== undefined ? growth(revenue, previousRevenue) : null,
  };

  const lines = buildDRLines(enriched, catMap, metrics);

  return {
    period,
    lines,
    metrics,
    computedAt: new Date().toISOString(),
  };
}

function buildDRLines(
  entries: FinancialEntry[],
  catMap: Map<string, FinancialCategory>,
  m: IncomeStatementMetrics,
): DRLineItem[] {
  const lines: DRLineItem[] = [];

  const addGroup = (
    header: string,
    group: FinancialCategoryGroup,
    opts?: { negative?: boolean },
  ) => {
    lines.push({ code: `header_${group}`, label: header, amount: 0, level: 0, isHeader: true });
    const cats = [...catMap.values()]
      .filter((c) => c.group_type === group)
      .sort((a, b) => a.sort_order - b.sort_order);

    for (const cat of cats) {
      const amount = entries
        .filter((e) => e.category_id === cat.id)
        .reduce((s, e) => s + Number(e.amount), 0);
      if (amount === 0 && group !== "revenue") continue;
      const display = opts?.negative ? -amount : amount;
      lines.push({
        code: cat.code,
        label: cat.name_pt || cat.name,
        amount: group === "revenue" ? amount : display,
        level: 1,
        indent: true,
      });
    }
  };

  addGroup("Receitas", "revenue");
  lines.push({
    code: "subtotal_revenue",
    label: "Total receitas",
    amount: m.totalRevenue,
    level: 0,
    isSubtotal: true,
  });

  addGroup("Custos variáveis", "variable_cost", { negative: true });
  lines.push({
    code: "gross_margin",
    label: "Margem bruta",
    amount: m.grossMargin,
    level: 0,
    isSubtotal: true,
  });

  addGroup("Custos fixos", "fixed_cost", { negative: true });
  lines.push({
    code: "ebitda",
    label: "EBITDA",
    amount: m.ebitda,
    level: 0,
    isSubtotal: true,
  });

  addGroup("Depreciações e amortizações", "depreciation", { negative: true });
  lines.push({
    code: "ebit",
    label: "EBIT",
    amount: m.ebit,
    level: 0,
    isSubtotal: true,
  });

  addGroup("Resultado financeiro", "financial", { negative: true });
  addGroup("Itens extraordinários", "extraordinary");

  lines.push({
    code: "net_income",
    label: "Resultado líquido",
    amount: m.netIncome,
    level: 0,
    isSubtotal: true,
  });

  return lines;
}

export function aggregateEntriesByCategory(
  entries: FinancialEntry[],
  categories: FinancialCategory[],
): { category: FinancialCategory; amount: number }[] {
  const catMap = new Map(categories.map((c) => [c.id, c]));
  const totals = new Map<string, number>();

  for (const e of entries) {
    totals.set(e.category_id, (totals.get(e.category_id) ?? 0) + Number(e.amount));
  }

  return categories
    .map((category) => ({
      category,
      amount: totals.get(category.id) ?? 0,
    }))
    .filter((x) => x.amount > 0)
    .sort((a, b) => a.category.sort_order - b.category.sort_order);
}
