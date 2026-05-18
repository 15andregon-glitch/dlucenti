import { cn } from "@/lib/cn";

interface AdminPanelProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export function AdminPanel({ children, className, title }: AdminPanelProps) {
  return (
    <section className={cn("admin-panel", className)}>
      {title && (
        <h2 className="mb-6 font-serif text-[1.125rem] font-normal text-[var(--maison-charcoal)]">
          {title}
        </h2>
      )}
      {children}
    </section>
  );
}
