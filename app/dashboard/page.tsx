import { DashboardShell } from "@/dashboard/components/DashboardShell";

export default function DashboardPage() {
  return (
    <DashboardShell
      title="Overview"
      description="Maison Aurélie commerce & campaign management"
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Products", value: "12" },
          { label: "Orders", value: "48" },
          { label: "Campaigns", value: "3" },
          { label: "Revenue", value: "€124k" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-neutral-200 bg-white p-6"
          >
            <p className="text-xs uppercase tracking-wider text-neutral-400">
              {stat.label}
            </p>
            <p className="mt-2 text-2xl font-light text-neutral-900">
              {stat.value}
            </p>
          </div>
        ))}
      </div>
    </DashboardShell>
  );
}
