"use client";

import Image from "next/image";
import { useState } from "react";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/cn";

interface ProductGalleryProps {
  product: Product;
  className?: string;
}

export function ProductGallery({ product, className }: ProductGalleryProps) {
  const images = product.images.filter(Boolean);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSrc = images[activeIndex] ?? images[0];

  if (!activeSrc) return null;

  return (
    <div className={cn("w-full", className)}>
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[var(--maison-warm-white)]">
        <Image
          key={activeSrc}
          src={activeSrc}
          alt={product.name}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          quality={92}
          className="object-cover object-center transition-opacity duration-700 ease-[var(--ease-maison)]"
        />
      </div>

      {images.length > 1 && (
        <ul
          className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-5 md:gap-4"
          role="list"
          aria-label="Product views"
        >
          {images.map((src, index) => (
            <li key={`${product.id}-${src}-${index}`}>
              <button
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`View image ${index + 1}`}
                aria-current={index === activeIndex ? "true" : undefined}
                className={cn(
                  "group relative aspect-[3/4] w-full overflow-hidden bg-[var(--maison-warm-white)] transition-opacity duration-500 ease-[var(--ease-maison)]",
                  index === activeIndex
                    ? "opacity-100"
                    : "opacity-55 hover:opacity-80",
                )}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="120px"
                  quality={85}
                  className="object-cover object-center"
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
