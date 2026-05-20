import { AdminPanel } from "@/components/admin/ui/AdminPanel";
import { PeriodCreateForm } from "@/components/admin/finance/PeriodCreateForm";

interface FinanceEmptyStateProps {
  error?: string | null;
}

export function FinanceEmptyState({ error }: FinanceEmptyStateProps) {
  if (error) {
    return (
      <AdminPanel title="Finance unavailable">
        <p className="text-[0.8125rem] text-[var(--maison-gray)]">{error}</p>
        <p className="mt-2 text-[0.75rem] text-[var(--maison-mist)]">
          Apply <code className="text-[var(--maison-charcoal)]">supabase/finance.sql</code> in the
          Supabase SQL editor, then refresh.
        </p>
      </AdminPanel>
    );
  }

  return (
    <AdminPanel title="Reporting period">
      <p className="mb-6 text-[0.8125rem] leading-relaxed text-[var(--maison-gray)]">
        Create a monthly period to begin tracking revenue, costs, and your income statement.
      </p>
      <PeriodCreateForm />
    </AdminPanel>
  );
}
