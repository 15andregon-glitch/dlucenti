"use client";

import { PageContainer } from "@/components/layout/PageContainer";
import { Section } from "@/sections/shared/Section";
import { Reveal } from "@/components/ui/Reveal";

export function NewsletterSection() {
  return (
    <Section
      id="newsletter"
      tone="warm"
      className="border-t border-[var(--maison-hairline)]"
    >
      <PageContainer>
        <Reveal className="mx-auto max-w-lg text-center">
          <p className="text-maison-label">The List</p>
          <h2 className="mt-4 text-maison-headline text-[length:var(--type-h2)]">
            Private invitations
          </h2>
          <p className="mt-4 text-maison-body-sm">
            First access to collections, atelier events, and editorial releases.
          </p>
          <form
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-2"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="Email address"
              aria-label="Email address"
              className="flex-1 border border-[var(--maison-hairline)] bg-[var(--maison-warm-white)] px-4 py-2.5 font-sans text-[13px] text-[var(--maison-charcoal)] placeholder:text-[var(--maison-mist)] focus:border-[var(--maison-gold)] focus:outline-none transition-colors duration-300"
            />
            <button
              type="submit"
              className="border border-[var(--maison-hairline-strong)] bg-transparent px-7 py-2.5 font-sans text-[13px] text-[var(--maison-charcoal)] transition-colors duration-300 hover:border-[var(--maison-gold)]"
            >
              Subscribe
            </button>
          </form>
        </Reveal>
      </PageContainer>
    </Section>
  );
}
