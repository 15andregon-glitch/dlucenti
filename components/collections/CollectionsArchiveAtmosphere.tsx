import Image from "next/image";
import { ASSETS } from "@/lib/assets";

/**
 * Full-canvas atmospheric artwork — Next/Image for sharp scaling (not CSS background).
 */
export function CollectionsArchiveAtmosphere() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-[var(--maison-ivory)]"
    >
      <Image
        src={ASSETS.images.collectionsBackground}
        alt=""
        fill
        priority
        unoptimized
        sizes="100vw"
        className="object-cover object-left-top opacity-[0.92] md:opacity-[0.96]"
      />
    </div>
  );
}
