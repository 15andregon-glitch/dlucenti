import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { hasSupabaseServiceRole } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  computeProductEconomics,
  type ProductEconomicsInput,
} from "@/lib/finance/product-economics";
import {
  isSeedFinancialEntry,
  type BusinessModeSnapshot,
} from "@/lib/finance/business-mode";
import type { ProductRow } from "@/types/database";

async function client() {
  if (hasSupabaseServiceRole()) return createSupabaseAdminClient();
  return createSupabaseServerClient();
}

export async function getBusinessModeSnapshot(): Promise<BusinessModeSnapshot> {
  try {
    const supabase = await client();

    const { count: orderCount, data: orderTotals } = await supabase
      .from("orders")
      .select("total")
      .in("status", ["paid", "shipped", "completed"]);

    const paidRevenue = (orderTotals ?? []).reduce(
      (sum, o) => sum + Number(o.total ?? 0),
      0,
    );
    const orders = orderCount ?? 0;

    const { data: entries } = await supabase
      .from("financial_entries")
      .select("description, amount, financial_categories!inner (group_type)")
      .limit(500);

    let hasRealFinancialEntries = false;
    let hasSeed = false;
    let hasNonSeed = false;

    for (const e of entries ?? []) {
      if (isSeedFinancialEntry(e.description)) {
        hasSeed = true;
      } else {
        hasNonSeed = true;
        const group = (e.financial_categories as { group_type?: string })?.group_type;
        if (group === "revenue" && Number(e.amount) > 0) {
          hasRealFinancialEntries = true;
        }
      }
    }

    const hasRealSales = orders > 0 || paidRevenue > 0 || hasRealFinancialEntries;
    const mode = hasRealSales ? "active" : "pre_launch";

    return {
      mode,
      orderCount: orders,
      paidRevenue,
      hasRealFinancialEntries,
      hasSeedEntriesOnly: hasSeed && !hasNonSeed && orders === 0,
    };
  } catch {
    return {
      mode: "pre_launch",
      orderCount: 0,
      paidRevenue: 0,
      hasRealFinancialEntries: false,
      hasSeedEntriesOnly: false,
    };
  }
}

export interface PreLaunchOperationalMetrics {
  totalProducts: number;
  totalStockUnits: number;
  inventoryValue: number;
  inventoryCost: number;
  potentialGrossProfit: number;
  averageMarginPercent: number;
  estimatedPotentialRevenue: number;
}

function economicsFromRow(row: ProductRow): ProductEconomicsInput {
  return {
    sellingPrice: Number(row.price),
    productCost: Number(row.product_cost ?? 0),
    packagingCost: Number(row.packaging_cost ?? 0),
    pouchCost: Number(row.pouch_cost ?? 0),
    shippingCost: Number(row.shipping_cost ?? 0),
    importCost: Number(row.import_cost ?? 0),
    paymentFeePercent: Number(row.payment_fee_percent ?? 2.9),
    vatRate: Number(row.vat_rate ?? 23),
    targetMarginPercent: row.target_margin_percent,
  };
}

export async function getPreLaunchOperationalMetrics(): Promise<PreLaunchOperationalMetrics> {
  try {
    const supabase = await client();
    const { data: products } = await supabase.from("products").select("*");

    const rows = (products ?? []) as ProductRow[];
    let totalStockUnits = 0;
    let inventoryValue = 0;
    let inventoryCost = 0;
    let marginSum = 0;
    let marginCount = 0;

    for (const row of rows) {
      const stock = Number(row.stock ?? 0);
      const input = economicsFromRow(row);
      const storedTotalCost = Number(row.total_cost ?? 0);
      const economics = computeProductEconomics(input);
      const unitCost = storedTotalCost > 0 ? storedTotalCost : economics.totalCost;
      const selling = Number(row.price);

      totalStockUnits += stock;
      inventoryValue += selling * stock;
      inventoryCost += unitCost * stock;

      if (selling > 0) {
        marginSum += economics.grossMarginPercent;
        marginCount += 1;
      }
    }

    return {
      totalProducts: rows.length,
      totalStockUnits,
      inventoryValue,
      inventoryCost,
      potentialGrossProfit: inventoryValue - inventoryCost,
      averageMarginPercent: marginCount > 0 ? marginSum / marginCount : 0,
      estimatedPotentialRevenue: inventoryValue,
    };
  } catch {
    return {
      totalProducts: 0,
      totalStockUnits: 0,
      inventoryValue: 0,
      inventoryCost: 0,
      potentialGrossProfit: 0,
      averageMarginPercent: 0,
      estimatedPotentialRevenue: 0,
    };
  }
}
