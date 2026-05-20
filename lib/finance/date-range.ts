export type FinanceQuickRange =
  | "today"
  | "7d"
  | "30d"
  | "90d"
  | "ytd"
  | "all";

export type FinanceGranularity =
  | "daily"
  | "weekly"
  | "monthly"
  | "quarterly"
  | "semester"
  | "yearly";

export interface FinanceDateRange {
  from: string;
  to: string;
  label: string;
  quickRange: FinanceQuickRange | "custom";
  granularity: FinanceGranularity;
}

function toIsoDate(d: Date): string {
  return d.toISOString().split("T")[0]!;
}

export function resolveFinanceDateRange(searchParams: {
  range?: string | null;
  from?: string | null;
  to?: string | null;
  granularity?: string | null;
}): FinanceDateRange {
  const now = new Date();
  const today = toIsoDate(now);
  const granularity = parseGranularity(searchParams.granularity);
  const range = (searchParams.range ?? "30d") as FinanceQuickRange | "custom";

  if (range === "custom" && searchParams.from && searchParams.to) {
    return {
      from: searchParams.from,
      to: searchParams.to,
      label: `${searchParams.from} — ${searchParams.to}`,
      quickRange: "custom",
      granularity,
    };
  }

  const start = new Date(now);
  switch (range) {
    case "today":
      return {
        from: today,
        to: today,
        label: "Today",
        quickRange: "today",
        granularity: "daily",
      };
    case "7d":
      start.setDate(start.getDate() - 6);
      return {
        from: toIsoDate(start),
        to: today,
        label: "Last 7 days",
        quickRange: "7d",
        granularity,
      };
    case "90d":
      start.setDate(start.getDate() - 89);
      return {
        from: toIsoDate(start),
        to: today,
        label: "Last 90 days",
        quickRange: "90d",
        granularity,
      };
    case "ytd":
      return {
        from: `${now.getFullYear()}-01-01`,
        to: today,
        label: "Year to date",
        quickRange: "ytd",
        granularity: "monthly",
      };
    case "all":
      return {
        from: "2000-01-01",
        to: today,
        label: "All time",
        quickRange: "all",
        granularity: "yearly",
      };
    case "30d":
    default:
      start.setDate(start.getDate() - 29);
      return {
        from: toIsoDate(start),
        to: today,
        label: "Last 30 days",
        quickRange: range === "30d" ? "30d" : "30d",
        granularity,
      };
  }
}

function parseGranularity(value: string | null | undefined): FinanceGranularity {
  const allowed: FinanceGranularity[] = [
    "daily",
    "weekly",
    "monthly",
    "quarterly",
    "semester",
    "yearly",
  ];
  if (value && allowed.includes(value as FinanceGranularity)) {
    return value as FinanceGranularity;
  }
  return "monthly";
}
