import { PageContainer } from "@/components/layout/PageContainer";
import { Section } from "@/sections/shared/Section";
import { Reveal } from "@/components/ui/Reveal";

export function EditorialCampaignSection() {
  return (
    <Section
      id="campaign"
      tone="warm"
      className="border-t border-[var(--maison-hairline)]"
    >
      <PageContainer className="max-w-none !px-0">
        <div className="grid lg:grid-cols-2">
          <Reveal className="flex flex-col justify-center px-[var(--section-px)] py-10 md:py-12 lg:py-0">
            <p className="text-maison-label">Campaign</p>
            <h2 className="mt-3 text-maison-headline md:mt-4">
              Lumière —{" "}
              <span className="text-maison-italic-soft">a study</span> in light
            </h2>
            <p className="mt-4 max-w-md text-maison-body-sm md:mt-6">
              Shot at dawn in Provence. Warm ivory, champagne gold, and quiet
              editorial restraint.
            </p>
          </Reveal>

          <div className="relative min-h-[50vh] bg-[var(--maison-champagne)] lg:min-h-[65vh]">
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--maison-warm-white)]/50 via-transparent to-[var(--maison-beige)]/40" />
            <span className="absolute inset-0 flex items-center justify-center text-maison-label">
              SS26 Campaign
            </span>
          </div>
        </div>
      </PageContainer>
    </Section>
  );
}
