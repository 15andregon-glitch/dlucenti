import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminButton } from "@/components/admin/ui/AdminButton";
import { CollectionsOrderList } from "@/components/admin/collections/CollectionsOrderList";
import { ADMIN_ROUTES } from "@/lib/admin/routes";
import { listCollectionsAdmin } from "@/services/supabase/admin-read";

export default async function AdminCollectionsPage() {
  const collections = await listCollectionsAdmin();

  return (
    <AdminShell
      title="Collections"
      description="Editorial campaigns — hero, story, gallery, scroll order, and publishing."
      actions={
        <Link href={ADMIN_ROUTES.collectionNew}>
          <AdminButton variant="solid">New collection</AdminButton>
        </Link>
      }
    >
      <CollectionsOrderList collections={collections} />
    </AdminShell>
  );
}
