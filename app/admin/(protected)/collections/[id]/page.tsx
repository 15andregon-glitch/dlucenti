import { notFound } from "next/navigation";
import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { CollectionEditor } from "@/components/admin/collections/CollectionEditor";
import { CollectionMediaManager } from "@/components/admin/collections/CollectionMediaManager";
import { CollectionBlocksEditor } from "@/components/admin/collections/CollectionBlocksEditor";
import { CollectionCampaignVideoUpload } from "@/components/admin/collections/CollectionCampaignVideoUpload";
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
      <AdminShell
        title="New collection"
        description="Editorial campaign — hero, story, gallery, and products."
      >
        <CollectionEditor />
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
      <CollectionEditor collection={collection} />
      <CollectionCoverUpload
        collectionId={collection.id}
        coverImage={collection.cover_image}
      />
      <CollectionCampaignVideoUpload
        collectionId={collection.id}
        campaignVideoUrl={collection.campaign_video_url}
      />
      <CollectionMediaManager
        collectionId={collection.id}
        media={collection.collection_media}
      />
      <CollectionBlocksEditor
        collectionId={collection.id}
        blocks={collection.collection_blocks}
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
