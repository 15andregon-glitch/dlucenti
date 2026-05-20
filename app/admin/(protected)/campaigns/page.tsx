import { AdminShell } from "@/components/admin/AdminShell";
import { CampaignsManager } from "@/components/admin/campaigns/CampaignsManager";
import { listCampaignsAdmin } from "@/services/supabase/admin-read";

export default async function AdminCampaignsPage() {
  const campaigns = await listCampaignsAdmin();

  return (
    <AdminShell
      title="Campaigns"
      description="Editorial gallery frames for the homepage."
    >
      <CampaignsManager campaigns={campaigns} />
    </AdminShell>
  );
}
