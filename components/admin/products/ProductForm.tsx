"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { ADMIN_ROUTES } from "@/lib/admin/routes";
import {
  createProductAction,
  updateProductAction,
} from "@/lib/admin/actions/products";
import { AdminField } from "@/components/admin/ui/AdminField";
import { AdminInput } from "@/components/admin/ui/AdminInput";
import { AdminTextarea } from "@/components/admin/ui/AdminTextarea";
import { AdminSelect } from "@/components/admin/ui/AdminSelect";
import { AdminCheckbox } from "@/components/admin/ui/AdminCheckbox";
import { AdminButton } from "@/components/admin/ui/AdminButton";
import type { ProductCategory } from "@/types/database/schema";
import type { CollectionRow, ProductRow } from "@/types/database";

const CATEGORIES: ProductCategory[] = [
  "rings",
  "necklaces",
  "earrings",
  "bracelets",
  "objects",
];

interface ProductFormProps {
  product?: ProductRow;
  collections: CollectionRow[];
}

export function ProductForm({ product, collections }: ProductFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const isNew = !product;

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const result = isNew
        ? await createProductAction(formData)
        : await updateProductAction(product!.id, formData);

      if (!result.ok) {
        alert(result.error);
        return;
      }

      if (isNew && "id" in result) {
        router.push(ADMIN_ROUTES.product(result.id as string));
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
          defaultValue={product?.name}
        />
      </AdminField>

      <AdminField label="Slug" htmlFor="slug">
        <AdminInput id="slug" name="slug" required defaultValue={product?.slug} />
      </AdminField>

      <AdminField label="Description" htmlFor="description">
        <AdminTextarea
          id="description"
          name="description"
          defaultValue={product?.description}
        />
      </AdminField>

      <div className="grid gap-8 sm:grid-cols-2">
        <AdminField label="Price (EUR)" htmlFor="price">
          <AdminInput
            id="price"
            name="price"
            type="number"
            min={0}
            step="0.01"
            required
            defaultValue={product?.price}
          />
        </AdminField>
        <AdminField label="Stock" htmlFor="stock">
          <AdminInput
            id="stock"
            name="stock"
            type="number"
            min={0}
            defaultValue={product?.stock ?? 0}
          />
        </AdminField>
      </div>

      <AdminField label="Category" htmlFor="category">
        <AdminSelect
          id="category"
          name="category"
          defaultValue={product?.category ?? "rings"}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </AdminSelect>
      </AdminField>

      <AdminField label="Collection" htmlFor="collection_id">
        <AdminSelect
          id="collection_id"
          name="collection_id"
          defaultValue={product?.collection_id ?? ""}
        >
          <option value="">None</option>
          {collections.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </AdminSelect>
      </AdminField>

      <div className="flex flex-wrap gap-6">
        <AdminCheckbox name="featured" label="Featured" defaultChecked={product?.featured} />
        <AdminCheckbox name="new_in" label="New In" defaultChecked={product?.new_in} />
        <AdminCheckbox name="active" label="Active" defaultChecked={product?.active ?? true} />
      </div>

      <AdminButton
        type="submit"
        variant="solid"
        disabled={pending}
        className="w-fit"
      >
        {pending ? "Saving…" : isNew ? "Create product" : "Save changes"}
      </AdminButton>
    </form>
  );
}
