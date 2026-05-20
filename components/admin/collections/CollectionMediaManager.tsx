"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import {
  deleteCollectionMediaAction,
  uploadCollectionMediaAction,
} from "@/lib/admin/actions/collections";
import { AdminPanel } from "@/components/admin/ui/AdminPanel";
import { AdminField } from "@/components/admin/ui/AdminField";
import { AdminButton } from "@/components/admin/ui/AdminButton";
import type { CollectionMediaKind } from "@/types/database/schema";
import type { CollectionMediaRow } from "@/types/database";

const MEDIA_SLOTS: { kind: CollectionMediaKind; label: string; multiple?: boolean }[] = [
  { kind: "hero_desktop", label: "Hero — desktop" },
  { kind: "hero_mobile", label: "Hero — mobile" },
  { kind: "editorial_cover", label: "Editorial cover" },
  { kind: "thumbnail", label: "Thumbnail" },
  { kind: "editorial_gallery", label: "Editorial gallery", multiple: true },
  { kind: "atmosphere", label: "Atmosphere", multiple: true },
  { kind: "og_image", label: "OG image" },
];

interface CollectionMediaManagerProps {
  collectionId: string;
  media: CollectionMediaRow[];
}

export function CollectionMediaManager({
  collectionId,
  media,
}: CollectionMediaManagerProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <AdminPanel title="Editorial media" className="mt-10">
      <p className="mb-8 text-[0.8125rem] text-[var(--maison-gray)]">
        Upload hero, gallery, and atmosphere imagery. Reorder gallery items by removing and
        re-uploading in desired order.
      </p>
      <div className="space-y-10">
        {MEDIA_SLOTS.map((slot) => {
          const items = media.filter((m) => m.kind === slot.kind);
          return (
            <div key={slot.kind} className="border-t border-[var(--maison-hairline)] pt-8">
              <p className="admin-label mb-4">{slot.label}</p>
              {items.length > 0 && (
                <ul className="mb-4 grid gap-4 sm:grid-cols-2">
                  {items.map((item) => (
                    <li key={item.id} className="flex gap-4">
                      <div className="relative h-24 w-20 shrink-0 overflow-hidden bg-[var(--maison-champagne)]">
                        <Image
                          src={item.image_url}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[0.75rem] text-[var(--maison-mist)]">
                          {item.image_url}
                        </p>
                        <AdminButton
                          type="button"
                          className="mt-2"
                          variant="danger"
                          onClick={() => {
                            startTransition(async () => {
                              const r = await deleteCollectionMediaAction(
                                item.id,
                                collectionId,
                              );
                              if (!r.ok) alert(r.error);
                              else router.refresh();
                            });
                          }}
                        >
                          Remove
                        </AdminButton>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              {!slot.multiple && items.length > 0 ? null : (
                <form
                  className="flex max-w-md flex-col gap-3"
                  action={(fd) => {
                    startTransition(async () => {
                      const r = await uploadCollectionMediaAction(
                        collectionId,
                        slot.kind,
                        fd,
                      );
                      if (!r.ok) alert(r.error);
                      else router.refresh();
                    });
                  }}
                >
                  <AdminField label="Image file">
                    <input
                      type="file"
                      name="file"
                      accept="image/*"
                      required
                      className="mt-1 block w-full text-[0.8125rem]"
                    />
                  </AdminField>
                  <AdminButton type="submit" disabled={pending}>
                    Upload
                  </AdminButton>
                </form>
              )}
              {slot.multiple && items.length > 0 && (
                <form
                  className="mt-4 flex max-w-md flex-col gap-3"
                  action={(fd) => {
                    startTransition(async () => {
                      const r = await uploadCollectionMediaAction(
                        collectionId,
                        slot.kind,
                        fd,
                      );
                      if (!r.ok) alert(r.error);
                      else router.refresh();
                    });
                  }}
                >
                  <AdminField label="Add another image">
                    <input
                      type="file"
                      name="file"
                      accept="image/*"
                      required
                      className="mt-1 block w-full text-[0.8125rem]"
                    />
                  </AdminField>
                  <AdminButton type="submit" disabled={pending}>
                    Add to gallery
                  </AdminButton>
                </form>
              )}
            </div>
          );
        })}
      </div>
    </AdminPanel>
  );
}
