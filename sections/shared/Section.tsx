import { cn } from "@/lib/cn";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  tone?: "ivory" | "beige" | "warm";
}

const tones = {
  ivory: "bg-[var(--maison-ivory)] text-[var(--maison-charcoal)]",
  beige: "bg-[var(--maison-beige)] text-[var(--maison-charcoal)]",
  warm: "bg-[var(--maison-warm-white)] text-[var(--maison-charcoal)]",
};

export function Section({
  children,
  className,
  id,
  tone = "ivory",
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn("py-[var(--section-py)]", tones[tone], className)}
    >
      {children}
    </section>
  );
}
