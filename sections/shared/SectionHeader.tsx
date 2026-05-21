import { EditorialHeading } from "@/components/ui/EditorialHeading";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { cn } from "@/lib/cn";

interface SectionHeaderProps {
  label?: string;
  title: React.ReactNode;
  description?: string;
  align?: "left" | "center";
  /** `large` — display scale (e.g. homepage “Coleções”) */
  size?: "default" | "large";
  className?: string;
}

export function SectionHeader({
  label,
  title,
  description,
  align = "left",
  size = "default",
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "mb-16 max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {label ? <SectionLabel className="mb-6">{label}</SectionLabel> : null}
      <EditorialHeading as="h2" align={align} size={size}>
        {title}
      </EditorialHeading>
      {description && (
        <p className="mt-6 text-maison-body text-sm">{description}</p>
      )}
    </div>
  );
}
