"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { guardAdminAction } from "@/lib/admin/guard-action";
import { actionError } from "@/lib/admin/utils";
import { ADMIN_ROUTES } from "@/lib/admin/routes";
import { computeIncomeStatement } from "@/services/finance/finance-read";
import { syncOrdersToFinance } from "@/services/finance/order-sync";

function revalidateFinance() {
  [
    ADMIN_ROUTES.finance,
    ADMIN_ROUTES.financeDr,
    ADMIN_ROUTES.financeCosts,
    ADMIN_ROUTES.financeRevenue,
    ADMIN_ROUTES.financeAnalytics,
  ].forEach((p) => revalidatePath(p));
}

export async function createReportingPeriodAction(formData: FormData) {
  const denied = await guardAdminAction();
  if (denied) return denied;

  const year = Number(formData.get("year"));
  const month = Number(formData.get("month"));
  if (!year || !month) return actionError("Year and month required");

  const starts = new Date(year, month - 1, 1);
  const ends = new Date(year, month, 0);
  const label = starts.toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });

  const client = createSupabaseAdminClient();
  const { data, error } = await client
    .from("reporting_periods")
    .insert({
      year,
      month,
      period_type: "month",
      label,
      starts_at: starts.toISOString().split("T")[0],
      ends_at: ends.toISOString().split("T")[0],
    })
    .select()
    .single();

  if (error) return actionError(error.message);
  revalidateFinance();
  return { ok: true as const, id: data.id };
}

export async function createFinancialEntryAction(formData: FormData) {
  const denied = await guardAdminAction();
  if (denied) return denied;

  const periodId = String(formData.get("period_id") ?? "");
  const categoryId = String(formData.get("category_id") ?? "");
  const amount = Number(formData.get("amount"));
  const entryDate = String(formData.get("entry_date") ?? "");
  const description = String(formData.get("description") ?? "").trim() || null;

  if (!periodId || !categoryId || !amount) {
    return actionError("Period, category, and amount are required");
  }

  const client = createSupabaseAdminClient();
  const { error } = await client.from("financial_entries").insert({
    period_id: periodId,
    category_id: categoryId,
    amount,
    source: "manual",
    description,
    entry_date: entryDate || new Date().toISOString().split("T")[0],
  });

  if (error) return actionError(error.message);
  await computeIncomeStatement(periodId, true);
  revalidateFinance();
  return { ok: true as const };
}

export async function deleteFinancialEntryAction(id: string, periodId: string) {
  const denied = await guardAdminAction();
  if (denied) return denied;

  const client = createSupabaseAdminClient();
  const { error } = await client.from("financial_entries").delete().eq("id", id);
  if (error) return actionError(error.message);
  await computeIncomeStatement(periodId, true);
  revalidateFinance();
  return { ok: true as const };
}

export async function recomputeDRAction(periodId: string) {
  const denied = await guardAdminAction();
  if (denied) return denied;

  try {
    await computeIncomeStatement(periodId, true);
    revalidateFinance();
    return { ok: true as const };
  } catch (e) {
    return actionError(e instanceof Error ? e.message : "Failed to compute DR");
  }
}

export async function syncOrdersAction(periodId: string) {
  const denied = await guardAdminAction();
  if (denied) return denied;

  try {
    const count = await syncOrdersToFinance(periodId);
    await computeIncomeStatement(periodId, true);
    revalidateFinance();
    return { ok: true as const, count };
  } catch (e) {
    return actionError(e instanceof Error ? e.message : "Sync failed");
  }
}
