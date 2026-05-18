import { cn } from "@/lib/cn";

interface EditorialHeadingProps {
  as?: "h1" | "h2" | "h3";
  children: React.ReactNode;
  subtitle?: string;
  className?: string;
  align?: "left" | "center";
  size?: "default" | "large";
}

export function EditorialHeading({
  as: Tag = "h2",
  children,
  subtitle,
  className,
  align = "left",
  size = "default",
}: EditorialHeadingProps) {
  return (
    <header className={cn(align === "center" && "text-center", className)}>
      {subtitle && <p className="mb-3 text-maison-label">{subtitle}</p>}
      <Tag
        className={cn(
          size === "large" ? "text-maison-display" : "text-maison-headline",
        )}
      >
        {children}
      </Tag>
    </header>
  );
}
