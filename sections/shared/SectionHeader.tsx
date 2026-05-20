import { EditorialHeading } from "@/components/ui/EditorialHeading";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { cn } from "@/lib/cn";

interface SectionHeaderProps {
  label?: string;
  title: React.ReactNode;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeader({
  label,
  title,
  description,
  align = "left",
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
      <EditorialHeading as="h2" align={align}>
        {title}
      </EditorialHeading>
      {description && (
        <p className="mt-6 text-maison-body text-sm">{description}</p>
      )}
    </div>
  );
}
