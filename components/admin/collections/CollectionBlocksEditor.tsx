"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import {
  createCollectionBlockAction,
  deleteCollectionBlockAction,
} from "@/lib/admin/actions/collections";
import { AdminPanel } from "@/components/admin/ui/AdminPanel";
import { AdminButton } from "@/components/admin/ui/AdminButton";
import { AdminInput } from "@/components/admin/ui/AdminInput";
import { AdminTextarea } from "@/components/admin/ui/AdminTextarea";
import type { CollectionBlockRow } from "@/types/database";

interface CollectionBlocksEditorProps {
  collectionId: string;
  blocks: CollectionBlockRow[];
}

export function CollectionBlocksEditor({
  collectionId,
  blocks,
}: CollectionBlocksEditorProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const sorted = [...blocks].sort((a, b) => a.position - b.position);

  return (
    <AdminPanel title="Editorial blocks" className="mt-10">
      <p className="mb-6 text-[0.8125rem] text-[var(--maison-gray)]">
        Modular story sections — quotes, cinematic images, and narrative blocks appear between
        the hero and product reveal.
      </p>

      <ul className="space-y-6">
        {sorted.map((block) => (
          <li
            key={block.id}
            className="flex items-start justify-between gap-4 border border-[var(--maison-hairline)] p-4"
          >
            <div>
              <p className="admin-label">{block.block_type}</p>
              <pre className="mt-2 max-w-lg overflow-x-auto font-sans text-[0.75rem] text-[var(--maison-gray)]">
                {JSON.stringify(block.content, null, 2)}
              </pre>
            </div>
            <AdminButton
              type="button"
              variant="danger"
              onClick={() => {
                startTransition(async () => {
                  const r = await deleteCollectionBlockAction(block.id, collectionId);
                  if (!r.ok) alert(r.error);
                  else router.refresh();
                });
              }}
            >
              Delete
            </AdminButton>
          </li>
        ))}
      </ul>

      <div className="mt-10 grid gap-8 border-t border-[var(--maison-hairline)] pt-8 md:grid-cols-2">
        <AddQuoteBlock collectionId={collectionId} pending={pending} onDone={() => router.refresh()} />
        <AddCinematicBlock collectionId={collectionId} pending={pending} onDone={() => router.refresh()} />
      </div>
    </AdminPanel>
  );
}

function AddQuoteBlock({
  collectionId,
  pending,
  onDone,
}: {
  collectionId: string;
  pending: boolean;
  onDone: () => void;
}) {
  return (
    <form
      className="space-y-3"
      action={(fd) => {
        void (async () => {
          const r = await createCollectionBlockAction(collectionId, "quote", {
            text: String(fd.get("text") ?? ""),
            attribution: String(fd.get("attribution") ?? ""),
          });
          if (!r.ok) alert(r.error);
          else onDone();
        })();
      }}
    >
      <p className="admin-label">Add quote</p>
      <AdminTextarea name="text" placeholder="Quote text" required rows={3} />
      <AdminInput name="attribution" placeholder="Attribution" />
      <AdminButton type="submit" disabled={pending}>
        Add quote
      </AdminButton>
    </form>
  );
}

function AddCinematicBlock({
  collectionId,
  pending,
  onDone,
}: {
  collectionId: string;
  pending: boolean;
  onDone: () => void;
}) {
  return (
    <form
      className="space-y-3"
      action={(fd) => {
        void (async () => {
          const r = await createCollectionBlockAction(collectionId, "cinematic_image", {
            imageUrl: String(fd.get("imageUrl") ?? ""),
            caption: String(fd.get("caption") ?? ""),
            layout: String(fd.get("layout") ?? "full"),
          });
          if (!r.ok) alert(r.error);
          else onDone();
        })();
      }}
    >
      <p className="admin-label">Add cinematic image</p>
      <AdminInput name="imageUrl" placeholder="Image URL" required />
      <AdminInput name="caption" placeholder="Caption" />
      <select
        name="layout"
        className="w-full border border-[var(--maison-hairline)] bg-[var(--maison-warm-white)] px-3 py-2 font-sans text-[0.8125rem]"
      >
        <option value="full">Full width</option>
        <option value="portrait-left">Portrait left</option>
        <option value="portrait-right">Portrait right</option>
      </select>
      <AdminButton type="submit" disabled={pending}>
        Add image block
      </AdminButton>
    </form>
  );
}
