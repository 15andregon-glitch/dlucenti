"use client";

import { usePathname, useRouter } from "next/navigation";
import { LOCALE_COOKIE, LOCALE_LABELS, type Locale } from "@/lib/i18n/locale";
import { replaceLocaleInPath } from "@/lib/i18n/paths";
import { cn } from "@/lib/cn";

interface LanguageSwitcherProps {
  locale: Locale;
  className?: string;
  /** Navbar only — short codes (ENG / PT) */
  variant?: "default" | "nav";
}

const LOCALES: Locale[] = ["en", "pt"];

const NAV_LOCALE_LABELS: Record<Locale, string> = {
  en: "ENG",
  pt: "PT",
};

export function LanguageSwitcher({
  locale,
  className,
  variant = "default",
}: LanguageSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (next: Locale) => {
    if (next === locale) return;
    document.cookie = `${LOCALE_COOKIE}=${next};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`;
    const href = replaceLocaleInPath(pathname, next);
    router.push(href);
  };

  return (
    <div
      role="group"
      aria-label="Language"
      className={cn("flex items-center gap-3", className)}
    >
      {LOCALES.map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => switchLocale(code)}
          className={cn(
            "font-sans text-[0.6875rem] tracking-[0.1em] uppercase transition-opacity duration-500",
            code === locale
              ? "text-[var(--maison-charcoal)]"
              : "text-[var(--maison-mist)] hover:text-[var(--maison-charcoal)]",
          )}
          aria-current={code === locale ? "true" : undefined}
          aria-label={LOCALE_LABELS[code]}
        >
          {variant === "nav" ? NAV_LOCALE_LABELS[code] : LOCALE_LABELS[code]}
        </button>
      ))}
    </div>
  );
}
