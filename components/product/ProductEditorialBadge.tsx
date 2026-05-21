import { cn } from "@/lib/cn";

/** Editorial overlay badge — same placement as New In on product imagery */
const BADGE_CLASS =
  "pointer-events-none absolute right-4 top-4 z-[1] font-sans text-[0.6875rem] font-normal tracking-[var(--tracking-label)] drop-shadow-[0_1px_14px_rgba(42,40,36,0.12)]";

interface ProductEditorialBadgeProps {
  label: string;
  variant?: "new" | "soldOut";
  className?: string;
}

export function ProductEditorialBadge({
  label,
  variant = "new",
  className,
}: ProductEditorialBadgeProps) {
  return (
    <span
      className={cn(
        BADGE_CLASS,
        variant === "new"
          ? "text-[var(--hero-text-champagne)]"
          : "text-[var(--maison-mist)]",
        className,
      )}
    >
      {label}
    </span>
  );
}
