"use client";

import Link from "next/link";
import { cn } from "@/lib/cn";

type ButtonVariant = "ghost" | "outline" | "solid";

interface ButtonBaseProps {
  children: React.ReactNode;
  className?: string;
  variant?: ButtonVariant;
}

const variants: Record<ButtonVariant, string> = {
  ghost:
    "text-[var(--maison-gray)] border-transparent hover:text-[var(--maison-charcoal)] hover:border-[var(--maison-hairline)]",
  outline:
    "text-[var(--maison-charcoal)] border-[var(--maison-hairline-strong)] hover:border-[var(--maison-gold)]",
  solid:
    "text-[var(--maison-warm-white)] bg-[var(--maison-charcoal)] border-[var(--maison-charcoal)] hover:bg-[var(--maison-gray)] hover:border-[var(--maison-gray)]",
};

const base =
  "inline-flex items-center justify-center gap-2.5 border px-7 py-2.5 font-sans text-[13px] font-normal tracking-normal transition-all duration-500 ease-[var(--ease-maison)]";

interface ButtonProps extends ButtonBaseProps {
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
}

export function Button({
  children,
  className,
  variant = "outline",
  href,
  onClick,
  type = "button",
}: ButtonProps) {
  const classes = cn(base, variants[variant], className);

  if (href) {
    return (
      <Link href={href} className={classes} onClick={onClick}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
