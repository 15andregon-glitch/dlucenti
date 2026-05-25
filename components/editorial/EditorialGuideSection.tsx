import { cn } from "@/lib/cn";

interface EditorialGuideSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function EditorialGuideSection({
  title,
  children,
  className,
}: EditorialGuideSectionProps) {
  return (
    <section
      className={cn(
        "editorial-guide-section border-t border-[var(--maison-hairline)] pt-9 first:border-t-0 first:pt-0 md:pt-11",
        className,
      )}
    >
      <h2 className="font-editorial text-[length:clamp(1.25rem,3vw,1.5rem)] font-normal leading-[1.15] tracking-[-0.02em] text-[var(--maison-charcoal)]">
        {title}
      </h2>
      <div className="mt-4 max-w-xl space-y-4 font-sans text-[0.875rem] leading-[1.75] text-[var(--maison-gray)] md:mt-5">
        {children}
      </div>
    </section>
  );
}
