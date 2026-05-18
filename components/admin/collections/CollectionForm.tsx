"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { ADMIN_ROUTES } from "@/lib/admin/routes";
import {
  createCollectionAction,
  updateCollectionAction,
} from "@/lib/admin/actions/collections";
import { AdminField } from "@/components/admin/ui/AdminField";
import { AdminInput } from "@/components/admin/ui/AdminInput";
import { AdminTextarea } from "@/components/admin/ui/AdminTextarea";
import { AdminCheckbox } from "@/components/admin/ui/AdminCheckbox";
import { AdminButton } from "@/components/admin/ui/AdminButton";
import type { CollectionRow } from "@/types/database";

interface CollectionFormProps {
  collection?: CollectionRow;
}

export function CollectionForm({ collection }: CollectionFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const isNew = !collection;

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const result = isNew
        ? await createCollectionAction(formData)
        : await updateCollectionAction(collection!.id, formData);

      if (!result.ok) {
        alert(result.error);
        return;
      }

      if (isNew && "id" in result) {
        router.push(ADMIN_ROUTES.collection(result.id as string));
      } else {
        router.refresh();
      }
    });
  };

  return (
    <form action={handleSubmit} className="grid max-w-2xl gap-8">
      <AdminField label="Name" htmlFor="name">
        <AdminInput
          id="name"
          name="name"
          required
          defaultValue={collection?.name}
        />
      </AdminField>
      <AdminField label="Slug" htmlFor="slug">
        <AdminInput
          id="slug"
          name="slug"
          required
          defaultValue={collection?.slug}
        />
      </AdminField>
      <AdminField label="Description" htmlFor="description">
        <AdminTextarea
          id="description"
          name="description"
          defaultValue={collection?.description}
        />
      </AdminField>
      <AdminField label="Cover image URL" htmlFor="cover_image">
        <AdminInput
          id="cover_image"
          name="cover_image"
          defaultValue={collection?.cover_image}
        />
      </AdminField>
      <AdminCheckbox
        name="featured"
        label="Featured"
        defaultChecked={collection?.featured}
      />
      <AdminButton type="submit" variant="solid" disabled={pending} className="w-fit">
        {pending ? "Saving…" : isNew ? "Create collection" : "Save changes"}
      </AdminButton>
    </form>
  );
}
