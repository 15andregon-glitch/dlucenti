"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import {
  deleteProductImageAction,
  reorderProductImagesAction,
  uploadProductImageAction,
} from "@/lib/admin/actions/products";
import { AdminPanel } from "@/components/admin/ui/AdminPanel";
import { AdminUpload } from "@/components/admin/ui/AdminUpload";
import { AdminSortableList } from "@/components/admin/ui/AdminSortableList";
import { AdminButton } from "@/components/admin/ui/AdminButton";
import type { ProductImageRow } from "@/types/database";

interface ProductImagesEditorProps {
  productId: string;
  images: ProductImageRow[];
}

export function ProductImagesEditor({ productId, images }: ProductImagesEditorProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const sorted = [...images].sort((a, b) => a.position - b.position);

  const handleReorder = async (orderedIds: string[]) => {
    const ordered = orderedIds.map((id, position) => ({ id, position }));
    const result = await reorderProductImagesAction(productId, ordered);
    if (result.ok) router.refresh();
    return result;
  };

  const handleDelete = (imageId: string) => {
    if (!confirm("Remove this image?")) return;
    startTransition(async () => {
      const result = await deleteProductImageAction(productId, imageId);
      if (!result.ok) alert(result.error);
      else router.refresh();
    });
  };

  return (
    <AdminPanel title="Images" className="mt-10">
      <AdminUpload
        label="Upload image"
        onUpload={(fd) => uploadProductImageAction(productId, fd)}
      />

      {sorted.length > 0 && (
        <div className="mt-8">
          <p className="mb-4 text-[0.75rem] tracking-[0.08em] text-[var(--maison-mist)] uppercase">
            Drag to reorder
          </p>
          <AdminSortableList
            items={sorted.map((img) => ({
              id: img.id,
              label: img.alt ?? `Image ${img.position + 1}`,
              meta: img.image_url,
              preview: (
                <div className="relative h-14 w-10 shrink-0 overflow-hidden bg-[var(--maison-champagne)]">
                  <Image
                    src={img.image_url}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </div>
              ),
            }))}
            onReorder={handleReorder}
          />
          <ul className="mt-4 space-y-2">
            {sorted.map((img) => (
              <li key={img.id} className="flex justify-end">
                <AdminButton
                  type="button"
                  variant="danger"
                  disabled={pending}
                  onClick={() => handleDelete(img.id)}
                >
                  Remove
                </AdminButton>
              </li>
            ))}
          </ul>
        </div>
      )}
    </AdminPanel>
  );
}
