import Link from "next/link";
import { cn } from "@/lib/cn";

interface EditorialGuideAsideProps {
  text: string;
  linkLabel: string;
  linkHref: string;
  contactLabel?: string;
  contactHref?: string;
  email?: string;
  className?: string;
}

export function EditorialGuideAside({
  text,
  linkLabel,
  linkHref,
  contactLabel,
  contactHref,
  email,
  className,
}: EditorialGuideAsideProps) {
  return (
    <aside
      className={cn(
        "editorial-guide-aside mt-12 border-t border-[var(--maison-hairline)] pt-9 md:mt-14 md:pt-11",
        className,
      )}
    >
      <p className="max-w-xl font-sans text-[0.875rem] leading-[1.75] text-[var(--maison-gray)]">
        {text}{" "}
        <Link
          href={linkHref}
          className="text-[var(--maison-charcoal)] underline-offset-4 transition-opacity duration-500 ease-[var(--ease-maison)] hover:opacity-60"
        >
          {linkLabel}
        </Link>
        .
      </p>
      {contactHref && contactLabel ? (
        <p className="mt-4 font-sans text-[0.875rem] leading-[1.75] text-[var(--maison-gray)]">
          <Link
            href={contactHref}
            className="text-maison-link text-[var(--maison-charcoal)]"
          >
            {contactLabel}
          </Link>
          {email ? (
            <>
              {" "}
              ·{" "}
              <a
                href={`mailto:${email}`}
                className="text-maison-link text-[var(--maison-charcoal)]"
              >
                {email}
              </a>
            </>
          ) : null}
        </p>
      ) : null}
    </aside>
  );
}
