"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ADMIN_ROUTES, FINANCE_NAV } from "@/lib/admin/routes";
import { cn } from "@/lib/cn";

export function FinanceSubnav() {
  const pathname = usePathname();

  return (
    <nav
      className="mb-10 flex flex-wrap gap-x-6 gap-y-2 border-b border-[var(--maison-hairline)] pb-6"
      aria-label="Finance"
    >
      {FINANCE_NAV.map((item) => {
        const active =
          pathname === item.href ||
          (item.href === ADMIN_ROUTES.finance
            ? pathname === ADMIN_ROUTES.finance
            : pathname.startsWith(item.href));
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "font-sans text-[0.8125rem] transition-opacity duration-500",
              active
                ? "text-[var(--maison-charcoal)]"
                : "text-[var(--maison-mist)] hover:text-[var(--maison-charcoal)]",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
