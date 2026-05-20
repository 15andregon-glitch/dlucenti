/** Unit economics for luxury retail product financials */

export interface ProductEconomicsInput {
  sellingPrice: number;
  productCost: number;
  packagingCost: number;
  pouchCost: number;
  shippingCost: number;
  importCost: number;
  paymentFeePercent: number;
  vatRate: number;
  targetMarginPercent?: number | null;
}

export interface ProductEconomicsResult {
  totalCost: number;
  grossProfit: number;
  grossMarginPercent: number;
  markup: number;
  paymentFees: number;
  vatAmount: number;
  estimatedNetProfit: number;
}

export type ProductFinanceWarningSeverity = "info" | "warning" | "critical";

export interface ProductFinanceWarning {
  id: string;
  severity: ProductFinanceWarningSeverity;
  title: string;
  message: string;
}

const LUXURY_MARGIN_HEALTHY = 55;
const LUXURY_MARGIN_LOW = 40;

export function computeProductEconomics(
  input: ProductEconomicsInput,
): ProductEconomicsResult {
  const sellingPrice = Math.max(0, input.sellingPrice);
  const totalCost =
    Math.max(0, input.productCost) +
    Math.max(0, input.packagingCost) +
    Math.max(0, input.pouchCost) +
    Math.max(0, input.shippingCost) +
    Math.max(0, input.importCost);

  const grossProfit = sellingPrice - totalCost;
  const grossMarginPercent =
    sellingPrice > 0 ? (grossProfit / sellingPrice) * 100 : 0;
  const markup = totalCost > 0 ? sellingPrice / totalCost : 0;
  const paymentFees = sellingPrice * (Math.max(0, input.paymentFeePercent) / 100);
  const vatAmount = sellingPrice * (Math.max(0, input.vatRate) / 100);
  const estimatedNetProfit = grossProfit - paymentFees - vatAmount;

  return {
    totalCost,
    grossProfit,
    grossMarginPercent,
    markup,
    paymentFees,
    vatAmount,
    estimatedNetProfit,
  };
}

export function getProductFinanceWarnings(
  input: ProductEconomicsInput,
  economics: ProductEconomicsResult,
  options?: {
    stock?: number;
    minimumStock?: number;
    targetMarginPercent?: number | null;
    daysSinceLastSale?: number | null;
  },
): ProductFinanceWarning[] {
  const warnings: ProductFinanceWarning[] = [];
  const { sellingPrice } = input;

  if (sellingPrice > 0 && economics.grossProfit < 0) {
    warnings.push({
      id: "negative-profit",
      severity: "critical",
      title: "Negative profit",
      message: "Selling price is below total unit cost.",
    });
  } else if (economics.grossMarginPercent < LUXURY_MARGIN_LOW && sellingPrice > 0) {
    warnings.push({
      id: "very-low-margin",
      severity: "critical",
      title: "Very low margin",
      message: `Gross margin is ${economics.grossMarginPercent.toFixed(1)}% — below ${LUXURY_MARGIN_LOW}%.`,
    });
  } else if (economics.grossMarginPercent < LUXURY_MARGIN_HEALTHY && sellingPrice > 0) {
    warnings.push({
      id: "low-margin",
      severity: "warning",
      title: "Low margin",
      message: `Gross margin is ${economics.grossMarginPercent.toFixed(1)}%. Premium brands typically target 55%+ — pricing may not align with luxury positioning.`,
    });
  }

  if (options?.targetMarginPercent != null && sellingPrice > 0) {
    if (economics.grossMarginPercent < options.targetMarginPercent) {
      warnings.push({
        id: "below-target",
        severity: "info",
        title: "Below target margin",
        message: `Current margin is below your ${options.targetMarginPercent}% target.`,
      });
    }
  }

  const stock = options?.stock ?? 0;
  const min = options?.minimumStock ?? 0;
  if (min > 0 && stock <= min) {
    warnings.push({
      id: "low-stock",
      severity: "warning",
      title: "Low stock",
      message: `Stock (${stock}) is at or below minimum level (${min}).`,
    });
  }

  if (options?.daysSinceLastSale != null && options.daysSinceLastSale >= 90) {
    warnings.push({
      id: "inactive-inventory",
      severity: "info",
      title: "Inactive inventory",
      message: "No sales recorded in the last 90+ days.",
    });
  }

  return warnings;
}

export function validateProductForPublish(input: ProductEconomicsInput): string | null {
  if (input.sellingPrice <= 0) return "Selling price is required to publish.";
  if (input.productCost <= 0) return "Product cost is required to publish.";
  const economics = computeProductEconomics(input);
  if (economics.grossProfit < 0) {
    return "Cannot publish: selling price is below total unit cost.";
  }
  return null;
}
