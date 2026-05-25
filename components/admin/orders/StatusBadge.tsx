import { cn } from "@/lib/cn";

export function StatusBadge({
  label,
  tone = "neutral",
}: {
  label: string;
  tone?: "neutral" | "success" | "warning" | "muted";
}) {
  return (
    <span
      className={cn(
        "inline-block font-sans text-[0.6875rem] tracking-[0.06em] uppercase",
        tone === "success" && "text-[var(--maison-charcoal)]",
        tone === "warning" && "text-[var(--maison-gold)]",
        tone === "muted" && "text-[var(--maison-mist)]",
        tone === "neutral" && "text-[var(--maison-gray)]",
      )}
    >
      {label}
    </span>
  );
}
