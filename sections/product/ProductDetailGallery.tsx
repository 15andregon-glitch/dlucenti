import Image from "next/image";
import type { Product } from "@/lib/types";
import { PageContainer } from "@/components/layout/PageContainer";

interface ProductDetailGalleryProps {
  product: Product;
}

export function ProductDetailGallery({ product }: ProductDetailGalleryProps) {
  const detailImages = product.images.slice(1).filter(Boolean);

  if (detailImages.length === 0) return null;

  return (
    <section
      aria-label="Detail views"
      className="border-t border-[var(--maison-hairline)] bg-[var(--maison-ivory)] py-[clamp(3.5rem,8vw,5.5rem)]"
    >
      <PageContainer>
        <div className="grid gap-4 md:grid-cols-2 md:gap-6 lg:gap-8">
          {detailImages.map((src, index) => (
            <div
              key={`${product.id}-detail-${index}`}
              className="relative aspect-[4/5] overflow-hidden bg-[var(--maison-warm-white)] md:aspect-[3/4]"
            >
              <Image
                src={src}
                alt={`${product.name} — detail ${index + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                quality={90}
                className="object-cover object-center"
              />
            </div>
          ))}
        </div>
      </PageContainer>
    </section>
  );
}
