import { AdminShell } from "@/components/admin/AdminShell";
import { HomepageEditor } from "@/components/admin/homepage/HomepageEditor";
import {
  getHomepageSettingsAdmin,
  listCollectionsAdmin,
  listHomepageNewInAdmin,
  listProductsForSelectAdmin,
} from "@/services/supabase/admin-read";

export default async function AdminHomepagePage() {
  const [settings, collections, newInRows, allProducts] = await Promise.all([
    getHomepageSettingsAdmin(),
    listCollectionsAdmin(),
    listHomepageNewInAdmin(),
    listProductsForSelectAdmin(),
  ]);

  const newInProductIds = newInRows.map((r) => r.product_id);

  return (
    <AdminShell
      title="Homepage"
      description="Hero, featured collection, and New In curation."
    >
      <HomepageEditor
        settings={settings}
        collections={collections}
        newInProductIds={newInProductIds}
        allProducts={allProducts}
      />
    </AdminShell>
  );
}
