import { PageHero } from "@/components/layout/PageHero";
import { PageContainer } from "@/components/layout/PageContainer";
import { CraftMaisonSection } from "@/sections/home/CraftMaisonSection";
import { SITE } from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("About");

export default function AboutPage() {
  return (
    <>
      <PageHero
        label="The Maison"
        title={
          <>
            A legacy of{" "}
            <span className="italic text-[var(--maison-gray)]">light</span>
          </>
        }
        description={SITE.description}
      />
      <CraftMaisonSection />
      <PageContainer className="pb-[var(--section-py)]">
        <p className="max-w-2xl text-maison-body text-base leading-relaxed">
          Founded in Paris, Maison Aurélie composes jewelry with the same
          discipline as haute couture — every line intentional, every surface
          refined. Our atelier welcomes private appointments for bespoke
          commissions and collection viewings.
        </p>
      </PageContainer>
    </>
  );
}
