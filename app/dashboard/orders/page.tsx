import { DashboardShell } from "@/dashboard/components/DashboardShell";

export default function DashboardOrdersPage() {
  return (
    <DashboardShell title="Orders" description="Client orders and fulfillment">
      <p className="text-sm text-neutral-500">
        Order management integrates with your commerce backend here.
      </p>
    </DashboardShell>
  );
}
