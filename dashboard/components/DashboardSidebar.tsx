"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DASHBOARD_NAV } from "@/dashboard/lib/navigation";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/cn";

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-neutral-200 bg-white px-4 py-8">
      <Link
        href={ROUTES.home}
        className="mb-10 px-3 font-display text-sm font-light uppercase tracking-[0.3em] text-neutral-900"
      >
        Maison
      </Link>
      <nav className="flex flex-col gap-1">
        {DASHBOARD_NAV.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded px-3 py-2 text-sm tracking-wide transition-colors",
                active
                  ? "bg-neutral-100 text-neutral-900"
                  : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-800",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
