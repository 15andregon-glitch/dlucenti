"use client";

import { useRouter } from "next/navigation";
import { uploadCollectionCampaignVideoAction } from "@/lib/admin/actions/collections";
import { AdminPanel } from "@/components/admin/ui/AdminPanel";
import { AdminUpload } from "@/components/admin/ui/AdminUpload";

export function CollectionCampaignVideoUpload({
  collectionId,
  campaignVideoUrl,
}: {
  collectionId: string;
  campaignVideoUrl: string | null;
}) {
  const router = useRouter();

  return (
    <AdminPanel title="Campaign video" className="mt-10">
      <p className="mb-6 font-sans text-[0.8125rem] leading-relaxed text-[var(--maison-gray)]">
        Fullscreen editorial video for the collections landing and navigation previews.
        Muted autoplay on the storefront. MP4 or WebM recommended.
      </p>
      {campaignVideoUrl ? (
        <video
          src={campaignVideoUrl}
          muted
          playsInline
          controls
          className="mb-6 max-h-48 w-full max-w-md object-cover"
        />
      ) : (
        <p className="mb-6 font-sans text-[0.8125rem] text-[var(--maison-mist)]">
          No campaign video uploaded yet.
        </p>
      )}
      <AdminUpload
        label="Upload campaign video"
        accept="video/mp4,video/webm"
        onUpload={async (fd) => {
          const result = await uploadCollectionCampaignVideoAction(collectionId, fd);
          if (result.ok) router.refresh();
          return result;
        }}
      />
    </AdminPanel>
  );
}
