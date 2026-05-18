import { DashboardShell } from "@/dashboard/components/DashboardShell";
import { getCollections } from "@/services/collections";

export default async function DashboardCampaignsPage() {
  const collections = await getCollections();

  return (
    <DashboardShell title="Campaigns" description="Seasonal collections & editorial">
      <ul className="space-y-4">
        {collections.map((c) => (
          <li
            key={c.id}
            className="rounded-lg border border-neutral-200 bg-white px-5 py-4"
          >
            <p className="text-xs uppercase tracking-wider text-neutral-400">
              {c.season}
            </p>
            <p className="mt-1 text-lg font-light">{c.name}</p>
          </li>
        ))}
      </ul>
    </DashboardShell>
  );
}
