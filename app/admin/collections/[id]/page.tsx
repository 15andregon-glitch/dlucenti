import { notFound } from "next/navigation";
import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { CollectionForm } from "@/components/admin/collections/CollectionForm";
import { CollectionCoverUpload } from "@/components/admin/collections/CollectionCoverUpload";
import { DeleteCollectionButton } from "@/components/admin/collections/DeleteCollectionButton";
import { ADMIN_ROUTES } from "@/lib/admin/routes";
import { getCollectionAdmin } from "@/services/supabase/admin-read";

interface AdminCollectionPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminCollectionPage({
  params,
}: AdminCollectionPageProps) {
  const { id } = await params;
  const isNew = id === "new";

  if (isNew) {
    return (
      <AdminShell title="New collection" description="Create a seasonal edit.">
        <CollectionForm />
      </AdminShell>
    );
  }

  const collection = await getCollectionAdmin(id);
  if (!collection) notFound();

  return (
    <AdminShell
      title={collection.name}
      description={collection.slug}
      actions={<DeleteCollectionButton collectionId={collection.id} />}
    >
      <CollectionForm collection={collection} />
      <CollectionCoverUpload
        collectionId={collection.id}
        coverImage={collection.cover_image}
      />
      <p className="mt-10">
        <Link
          href={ADMIN_ROUTES.collections}
          className="text-[0.8125rem] text-[var(--maison-mist)] hover:text-[var(--maison-charcoal)]"
        >
          ← All collections
        </Link>
      </p>
    </AdminShell>
  );
}
