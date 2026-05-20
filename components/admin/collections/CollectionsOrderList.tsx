"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { reorderCollectionsAction } from "@/lib/admin/actions/collections";
import { AdminSortableList } from "@/components/admin/ui/AdminSortableList";
import { ADMIN_ROUTES } from "@/lib/admin/routes";
import type { CollectionRow } from "@/types/database";

interface CollectionsOrderListProps {
  collections: CollectionRow[];
}

export function CollectionsOrderList({ collections }: CollectionsOrderListProps) {
  const router = useRouter();
  const sorted = [...collections].sort(
    (a, b) => (a.display_order ?? 0) - (b.display_order ?? 0),
  );

  return (
    <div className="mt-10">
      <p className="admin-label mb-4">Display order</p>
      <p className="mb-6 text-[0.8125rem] text-[var(--maison-gray)]">
        Drag to set scroll order on the collections landing page.
      </p>
      <AdminSortableList
        items={sorted.map((c) => ({
          id: c.id,
          label: c.name,
          meta: [
            c.publication_status ?? "draft",
            c.hidden_from_frontend ? "hidden" : "visible",
          ]
            .filter(Boolean)
            .join(" · "),
        }))}
        onReorder={async (ids) => {
          const ordered = ids.map((id, display_order) => ({ id, display_order }));
          const result = await reorderCollectionsAction(ordered);
          if (result.ok) router.refresh();
          return result;
        }}
      />
      <ul className="mt-8 space-y-2 border-t border-[var(--maison-hairline)] pt-6">
        {sorted.map((c) => (
          <li key={c.id}>
            <Link
              href={ADMIN_ROUTES.collection(c.id)}
              className="text-[0.8125rem] text-[var(--maison-charcoal)] hover:opacity-70"
            >
              Edit {c.name} →
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
