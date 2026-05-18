import { cn } from "@/lib/cn";

type AdminSelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export function AdminSelect({ className, children, ...props }: AdminSelectProps) {
  return (
    <select className={cn("admin-select", className)} {...props}>
      {children}
    </select>
  );
}
