"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { uploadCollectionCoverAction } from "@/lib/admin/actions/collections";
import { AdminPanel } from "@/components/admin/ui/AdminPanel";
import { AdminUpload } from "@/components/admin/ui/AdminUpload";

export function CollectionCoverUpload({
  collectionId,
  coverImage,
}: {
  collectionId: string;
  coverImage: string;
}) {
  const router = useRouter();

  return (
    <AdminPanel title="Cover image" className="mt-10">
      {coverImage && (
        <div className="relative mb-6 aspect-[4/5] max-w-[12rem] overflow-hidden bg-[var(--maison-champagne)]">
          <Image src={coverImage} alt="" fill className="object-cover" sizes="192px" />
        </div>
      )}
      <AdminUpload
        label="Upload cover"
        onUpload={async (fd) => {
          const result = await uploadCollectionCoverAction(collectionId, fd);
          if (result.ok) router.refresh();
          return result;
        }}
      />
    </AdminPanel>
  );
}
