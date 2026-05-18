import { PageHero } from "@/components/layout/PageHero";
import { PageContainer } from "@/components/layout/PageContainer";
import { SITE } from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("Contact");

export default function ContactPage() {
  return (
    <>
      <PageHero
        label="Contact"
        title="By appointment"
        description="Private viewings, bespoke commissions, and maison inquiries."
      />
      <PageContainer className="pb-[var(--section-py)]">
        <div className="grid gap-14 md:grid-cols-2">
          <div>
            <p className="text-maison-label">Ateliers</p>
            <p className="mt-3 text-maison-title text-lg">
              Paris · New York · Tokyo
            </p>
            <p className="mt-6 text-maison-body-sm">{SITE.heritage}</p>
          </div>
          <form className="space-y-5" action="#">
            <div>
              <label className="text-maison-label" htmlFor="name">
                Name
              </label>
              <input
                id="name"
                name="name"
                className="mt-1.5 w-full border border-[var(--maison-hairline)] bg-[var(--maison-warm-white)] px-4 py-2.5 font-sans text-[13px] text-[var(--maison-charcoal)] focus:border-[var(--maison-gold)] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-maison-label" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="mt-1.5 w-full border border-[var(--maison-hairline)] bg-[var(--maison-warm-white)] px-4 py-2.5 font-sans text-[13px] text-[var(--maison-charcoal)] focus:border-[var(--maison-gold)] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-maison-label" htmlFor="message">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                className="mt-1.5 w-full resize-none border border-[var(--maison-hairline)] bg-[var(--maison-warm-white)] px-4 py-2.5 font-sans text-[13px] text-[var(--maison-charcoal)] focus:border-[var(--maison-gold)] focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="border border-[var(--maison-hairline-strong)] px-7 py-2.5 font-sans text-[13px] text-[var(--maison-charcoal)] transition-colors hover:border-[var(--maison-gold)]"
            >
              Send inquiry
            </button>
          </form>
        </div>
      </PageContainer>
    </>
  );
}
