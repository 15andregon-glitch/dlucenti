"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import {
  createCampaignAction,
  deleteCampaignAction,
  reorderCampaignsAction,
  toggleCampaignActiveAction,
  uploadCampaignImageAction,
} from "@/lib/admin/actions/campaigns";
import { AdminPanel } from "@/components/admin/ui/AdminPanel";
import { AdminUpload } from "@/components/admin/ui/AdminUpload";
import { AdminSortableList } from "@/components/admin/ui/AdminSortableList";
import { AdminButton } from "@/components/admin/ui/AdminButton";
import { AdminCheckbox } from "@/components/admin/ui/AdminCheckbox";
import type { CampaignRow } from "@/types/database";

interface CampaignsManagerProps {
  campaigns: CampaignRow[];
}

export function CampaignsManager({ campaigns }: CampaignsManagerProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const sorted = [...campaigns].sort((a, b) => a.position - b.position);

  return (
    <div className="space-y-10">
      <AdminPanel title="Add campaign frame">
        <form
          className="flex max-w-md flex-col gap-6"
          action={(fd) => {
            startTransition(async () => {
              const result = await createCampaignAction(fd);
              if (!result.ok) alert(result.error);
              else router.refresh();
            });
          }}
        >
          <label className="admin-label">
            Image file
            <input
              type="file"
              name="file"
              accept="image/*"
              required
              className="mt-2 block w-full text-[0.8125rem] text-[var(--maison-charcoal)]"
            />
          </label>
          <AdminCheckbox name="active" label="Active" defaultChecked />
          <AdminButton type="submit" variant="solid" disabled={pending}>
            Add frame
          </AdminButton>
        </form>
      </AdminPanel>

      <AdminPanel title="Campaign gallery">
        <p className="mb-6 text-[0.8125rem] text-[var(--maison-gray)]">
          Drag to reorder. Deactivate to hide a frame from the live gallery.
        </p>

        {sorted.length > 0 ? (
          <>
            <AdminSortableList
              items={sorted.map((c) => ({
                id: c.id,
                label: `Position ${c.position + 1}`,
                meta: c.active ? "Active" : "Inactive",
                preview: (
                  <div className="relative h-14 w-20 shrink-0 overflow-hidden bg-[var(--maison-champagne)]">
                    <Image
                      src={c.image_url}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                ),
              }))}
              onReorder={async (ids) => {
                const ordered = ids.map((id, position) => ({ id, position }));
                const result = await reorderCampaignsAction(ordered);
                if (result.ok) router.refresh();
                return result;
              }}
            />

            <ul className="mt-10 space-y-6">
              {sorted.map((c) => (
                <li
                  key={c.id}
                  className="flex flex-wrap items-center justify-between gap-4 border-t border-[var(--maison-hairline)] pt-6"
                >
                  <AdminButton
                    type="button"
                    onClick={() => {
                      startTransition(async () => {
                        await toggleCampaignActiveAction(c.id, !c.active);
                        router.refresh();
                      });
                    }}
                  >
                    {c.active ? "Deactivate" : "Activate"}
                  </AdminButton>
                  <div className="flex flex-wrap gap-3">
                    <AdminUpload
                      label="Replace image"
                      onUpload={async (fd) => {
                        const result = await uploadCampaignImageAction(c.id, fd);
                        if (result.ok) router.refresh();
                        return result;
                      }}
                    />
                    <AdminButton
                      type="button"
                      variant="danger"
                      disabled={pending}
                      onClick={() => {
                        if (!confirm("Delete this frame?")) return;
                        startTransition(async () => {
                          const result = await deleteCampaignAction(c.id);
                          if (!result.ok) alert(result.error);
                          else router.refresh();
                        });
                      }}
                    >
                      Delete
                    </AdminButton>
                  </div>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="text-[0.8125rem] text-[var(--maison-mist)]">No campaign frames yet.</p>
        )}
      </AdminPanel>
    </div>
  );
}
