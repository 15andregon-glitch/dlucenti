import Image from "next/image";
import { cn } from "@/lib/cn";

interface CampaignGalleryImageProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

export function CampaignGalleryImage({
  src,
  alt,
  className,
  sizes = "100vw",
  priority = false,
}: CampaignGalleryImageProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden bg-[var(--maison-warm-white)]",
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        quality={90}
        className="object-cover object-center transition-[transform,opacity] duration-[1100ms] ease-[var(--ease-maison)] group-hover:scale-[1.015] group-hover:opacity-[0.97] motion-reduce:transition-none motion-reduce:group-hover:scale-100 motion-reduce:group-hover:opacity-100"
      />
    </div>
  );
}
