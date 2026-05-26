import { notFound } from "next/navigation";
import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { ProductForm } from "@/components/admin/products/ProductForm";
import { ProductImagesEditor } from "@/components/admin/products/ProductImagesEditor";
import { DeleteProductButton } from "@/components/admin/products/DeleteProductButton";
import { ADMIN_ROUTES } from "@/lib/admin/routes";
import { RingSizesEditor } from "@/components/admin/products/RingSizesEditor";
import {
  getProductAdmin,
  listCollectionsAdmin,
  listRingSizesAdmin,
} from "@/services/supabase/admin-read";

interface AdminProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminProductPage({ params }: AdminProductPageProps) {
  const { id } = await params;
  const isNew = id === "new";

  const collections = await listCollectionsAdmin();

  if (isNew) {
    return (
      <AdminShell
        title="New product"
        description="Catalog, pricing, inventory, and unit economics."
      >
        <ProductForm collections={collections} />
      </AdminShell>
    );
  }

  const product = await getProductAdmin(id);
  if (!product) notFound();

  const images = product.product_images ?? [];
  const ringSizes =
    product.category === "rings"
      ? await listRingSizesAdmin(product.id)
      : [];

  return (
    <AdminShell
      title={product.name}
      description={product.slug}
      actions={<DeleteProductButton productId={product.id} />}
    >
      <ProductForm product={product} collections={collections} />
      {product.category === "rings" ? (
        <div className="mt-8">
          <RingSizesEditor
            productId={product.id}
            initialSizes={ringSizes.map((row) => ({
              id: row.id,
              label: row.label,
              sku: row.sku ?? "",
              stockQuantity: Number(row.stock_quantity ?? 0),
              isActive: row.is_active,
              sortOrder: row.sort_order,
            }))}
          />
        </div>
      ) : null}
      <ProductImagesEditor productId={product.id} images={images} />
      <p className="mt-10">
        <Link
          href={ADMIN_ROUTES.products}
          className="text-[0.8125rem] text-[var(--maison-mist)] hover:text-[var(--maison-charcoal)]"
        >
          ← All products
        </Link>
      </p>
    </AdminShell>
  );
}
