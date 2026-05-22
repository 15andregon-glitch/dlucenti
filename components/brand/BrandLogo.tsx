import Link from "next/link";
import { cn } from "@/lib/cn";

interface BrandLogoProps {
  href?: string;
  className?: string;
  variant?: "nav" | "footer";
  priority?: boolean;
  onClick?: () => void;
}

const SIZE = {
  nav: "h-[0.9375rem] max-w-[11.25rem] md:h-[1.125rem] md:max-w-[13.75rem]",
  footer: "h-[1.1875rem] max-w-[14.25rem] md:h-[1.25rem] md:max-w-[15.5rem]",
} as const;

function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 320 28"
      fill="none"
      className={cn("brand-logo-svg block w-auto shrink-0", className)}
      aria-hidden
    >
      <text
        x="0"
        y="22"
        fill="currentColor"
        fontFamily="var(--font-geist-sans), Inter, 'Helvetica Neue', system-ui, sans-serif"
        fontSize="20"
        fontWeight="200"
        letterSpacing="0.42em"
      >
        D&apos;LUCENTI
      </text>
    </svg>
  );
}

export function BrandLogo({
  href,
  className,
  variant = "nav",
  onClick,
}: BrandLogoProps) {
  const mark = <LogoMark className={SIZE[variant]} />;

  if (!href) {
    return (
      <span
        className={cn(
          "inline-flex items-center text-[var(--navbar-brand-color,currentColor)]",
          className,
        )}
      >
        {mark}
      </span>
    );
  }

  const linkClass =
    variant === "nav"
      ? "navbar-brand-link inline-flex items-center py-0 text-[var(--navbar-brand-color)] md:py-1"
      : "inline-flex items-center py-1";

  return (
    <Link
      href={href}
      onClick={onClick}
      aria-label="D'LUCENTI"
      className={cn(linkClass, className)}
    >
      {mark}
    </Link>
  );
}
