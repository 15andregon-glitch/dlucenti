import Link from "next/link";
import { SITE } from "@/lib/constants";
import { ADMIN_NAV, ADMIN_ROUTES } from "@/lib/admin/routes";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/cn";
import { AdminSidebarFooter } from "@/components/admin/AdminSidebarFooter";

interface AdminShellProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export function AdminShell({
  children,
  title,
  description,
  actions,
}: AdminShellProps) {
  return (
    <div className="admin-shell flex min-h-screen">
      <aside className="flex w-[15rem] shrink-0 flex-col border-r border-[var(--maison-hairline)] bg-[var(--maison-warm-white)] px-6 py-10">
        <Link
          href={ADMIN_ROUTES.home}
          className="font-sans font-extralight text-[1.125rem] tracking-tight text-[var(--maison-charcoal)]"
        >
          {SITE.name}
        </Link>
        <p className="mt-1 text-[0.6875rem] tracking-[0.12em] text-[var(--maison-mist)] uppercase">
          CMS
        </p>
        <nav className="mt-10 flex flex-col gap-1" aria-label="Admin">
          {ADMIN_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "px-2 py-2 font-sans text-[0.8125rem] text-[var(--maison-gray)]",
                "transition-colors duration-500 ease-[var(--ease-maison)]",
                "hover:text-[var(--maison-charcoal)]",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="pt-10">
          <Link
            href={ROUTES.home}
            className="text-[0.75rem] text-[var(--maison-mist)] transition-opacity duration-500 hover:text-[var(--maison-charcoal)]"
          >
            ← View storefront
          </Link>
        </div>
        <AdminSidebarFooter />
      </aside>

      <main className="min-w-0 flex-1 overflow-auto px-6 py-10 md:px-12 md:py-12">
        <header className="mb-10 flex flex-wrap items-end justify-between gap-4 border-b border-[var(--maison-hairline)] pb-8">
          <div>
            <h1 className="font-sans font-extralight text-[1.75rem] font-normal tracking-tight text-[var(--maison-charcoal)]">
              {title}
            </h1>
            {description && (
              <p className="mt-2 max-w-xl text-[0.875rem] leading-relaxed text-[var(--maison-gray)]">
                {description}
              </p>
            )}
          </div>
          {actions && (
            <div className="flex shrink-0 items-center gap-3">{actions}</div>
          )}
        </header>
        {children}
      </main>
    </div>
  );
}
