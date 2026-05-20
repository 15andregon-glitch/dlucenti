import { notFound } from "next/navigation";
import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { ProductForm } from "@/components/admin/products/ProductForm";
import { ProductImagesEditor } from "@/components/admin/products/ProductImagesEditor";
import { DeleteProductButton } from "@/components/admin/products/DeleteProductButton";
import { ADMIN_ROUTES } from "@/lib/admin/routes";
import {
  getProductAdmin,
  listCollectionsAdmin,
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

  return (
    <AdminShell
      title={product.name}
      description={product.slug}
      actions={<DeleteProductButton productId={product.id} />}
    >
      <ProductForm product={product} collections={collections} />
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
