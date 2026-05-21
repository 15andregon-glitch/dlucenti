import { cn } from "@/lib/cn";

interface CollectionArchiveCaptionProps {
  name: string;
  subtitle?: string;
  className?: string;
}

/** Shared archive caption — Maison serif, understated. */
export function CollectionArchiveCaption({
  name,
  subtitle,
  className,
}: CollectionArchiveCaptionProps) {
  return (
    <div className={cn("pt-5 text-center md:pt-6", className)}>
      <p className="font-editorial text-maison-title text-[1.125rem] leading-[1.25] transition-colors duration-500 ease-[var(--ease-maison)] group-hover:text-[var(--maison-gold)] md:text-[1.1875rem]">
        {name}
      </p>
      {subtitle ? (
        <p className="mt-2 font-sans text-[0.75rem] leading-relaxed tracking-[0.02em] text-[var(--maison-mist)]">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
