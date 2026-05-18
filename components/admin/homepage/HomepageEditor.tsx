"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  setHomepageNewInAction,
  updateHomepageSettingsAction,
  uploadHeroVideoAction,
} from "@/lib/admin/actions/homepage";
import { AdminPanel } from "@/components/admin/ui/AdminPanel";
import { AdminField } from "@/components/admin/ui/AdminField";
import { AdminInput } from "@/components/admin/ui/AdminInput";
import { AdminSelect } from "@/components/admin/ui/AdminSelect";
import { AdminButton } from "@/components/admin/ui/AdminButton";
import { AdminUpload } from "@/components/admin/ui/AdminUpload";
import { AdminSortableList } from "@/components/admin/ui/AdminSortableList";
import type { CollectionRow, HomepageSettingsRow, ProductRow } from "@/types/database";

interface HomepageEditorProps {
  settings: HomepageSettingsRow | null;
  collections: CollectionRow[];
  newInProductIds: string[];
  allProducts: Pick<ProductRow, "id" | "name" | "slug">[];
}

export function HomepageEditor({
  settings,
  collections,
  newInProductIds,
  allProducts,
}: HomepageEditorProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const newInItems = newInProductIds
    .map((id) => allProducts.find((p) => p.id === id))
    .filter(Boolean) as Pick<ProductRow, "id" | "name" | "slug">[];

  return (
    <div className="space-y-10">
      <AdminPanel title="Hero video">
        <p className="mb-4 text-[0.8125rem] text-[var(--maison-gray)]">
          Current: {settings?.hero_video_url ?? "Not set"}
        </p>
        <AdminUpload
          label="Upload hero video"
          accept="video/mp4,video/webm"
          onUpload={async (fd) => {
            const result = await uploadHeroVideoAction(fd);
            if (result.ok) router.refresh();
            return result;
          }}
        />
        <form
          className="mt-8 grid max-w-xl gap-6"
          action={(fd) => {
            startTransition(async () => {
              const result = await updateHomepageSettingsAction(fd);
              if (!result.ok) alert(result.error);
              else router.refresh();
            });
          }}
        >
          <AdminField label="Hero video URL" htmlFor="hero_video_url">
            <AdminInput
              id="hero_video_url"
              name="hero_video_url"
              defaultValue={settings?.hero_video_url ?? ""}
            />
          </AdminField>
          <AdminField label="Featured collection" htmlFor="featured_collection_id">
            <AdminSelect
              id="featured_collection_id"
              name="featured_collection_id"
              defaultValue={settings?.featured_collection_id ?? ""}
            >
              <option value="">None</option>
              {collections.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </AdminSelect>
          </AdminField>
          <AdminButton type="submit" variant="solid" disabled={pending}>
            Save homepage settings
          </AdminButton>
        </form>
      </AdminPanel>

      <AdminPanel title="New In — homepage row">
        <p className="mb-6 text-[0.8125rem] text-[var(--maison-gray)]">
          Drag to set display order. Add products from the list below.
        </p>
        {newInItems.length > 0 && (
          <AdminSortableList
            items={newInItems.map((p) => ({
              id: p.id,
              label: p.name,
              meta: p.slug,
            }))}
            onReorder={async (ids) => setHomepageNewInAction(ids)}
          />
        )}
        <div className="mt-8 border-t border-[var(--maison-hairline)] pt-8">
          <p className="admin-label mb-4">Add product to New In</p>
          <ul className="space-y-2">
            {allProducts
              .filter((p) => !newInProductIds.includes(p.id))
              .map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-4">
                  <span className="text-[0.8125rem]">{p.name}</span>
                  <AdminButton
                    type="button"
                    onClick={() => {
                      startTransition(async () => {
                        const result = await setHomepageNewInAction([
                          ...newInProductIds,
                          p.id,
                        ]);
                        if (!result.ok) alert(result.error);
                        else router.refresh();
                      });
                    }}
                  >
                    Add
                  </AdminButton>
                </li>
              ))}
          </ul>
        </div>
      </AdminPanel>
    </div>
  );
}
