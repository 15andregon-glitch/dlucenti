import { AdminShell } from "@/components/admin/AdminShell";
import { FinanceSubnav } from "@/components/admin/finance/FinanceSubnav";

export const dynamic = "force-dynamic";

export default function FinanceLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminShell
      title="Finance"
      description="Income statement, operational costs, and business intelligence."
    >
      <FinanceSubnav />
      {children}
    </AdminShell>
  );
}
