import { cn } from "@/lib/cn";

interface AdminFieldProps {
  label: string;
  htmlFor?: string;
  children: React.ReactNode;
  className?: string;
  hint?: string;
}

export function AdminField({
  label,
  htmlFor,
  children,
  className,
  hint,
}: AdminFieldProps) {
  return (
    <div className={cn("admin-field", className)}>
      <label htmlFor={htmlFor} className="admin-label">
        {label}
      </label>
      {children}
      {hint && (
        <p className="text-[0.75rem] leading-relaxed text-[var(--maison-mist)]">
          {hint}
        </p>
      )}
    </div>
  );
}
