import { AdminShell } from "@/components/admin/AdminShell";
import { FooterEditor } from "@/components/admin/footer/FooterEditor";
import {
  getFooterSettingsAdmin,
  listFooterSocialLinksAdmin,
} from "@/services/supabase/admin-read";

export default async function AdminFooterPage() {
  const [settings, socialLinks] = await Promise.all([
    getFooterSettingsAdmin(),
    listFooterSocialLinksAdmin(),
  ]);

  return (
    <AdminShell
      title="Footer"
      description="Contact, social links, slogans, and section titles for the storefront footer."
    >
      <FooterEditor settings={settings} socialLinks={socialLinks} />
    </AdminShell>
  );
}
