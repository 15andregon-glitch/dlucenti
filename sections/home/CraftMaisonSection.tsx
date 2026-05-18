import { PageContainer } from "@/components/layout/PageContainer";
import { Section } from "@/sections/shared/Section";
import { Reveal } from "@/components/ui/Reveal";
import { SITE } from "@/lib/constants";

const CRAFT_POINTS = [
  {
    title: "The Atelier",
    body: "Each piece is composed by hand in our Paris workshop — sixty hours of refinement per creation.",
  },
  {
    title: "Materials",
    body: "Ethically sourced gold and stones, selected with the precision of haute couture.",
  },
  {
    title: "Heritage",
    body: `${SITE.heritage} — a lineage of light passed through generations of artisans.`,
  },
] as const;

export function CraftMaisonSection() {
  return (
    <Section
      id="craft"
      tone="ivory"
      className="border-t border-[var(--maison-hairline)]"
    >
      <PageContainer>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-20">
          <Reveal className="lg:col-span-5">
            <p className="text-maison-label">Savoir-faire</p>
            <h2 className="mt-4 text-maison-headline">
              Composed by <span className="text-maison-italic-soft">hand</span>
            </h2>
          </Reveal>

          <div className="space-y-10 lg:col-span-7">
            {CRAFT_POINTS.map((point) => (
              <Reveal key={point.title}>
                <div className="border-t border-[var(--maison-hairline)] pt-7">
                  <h3 className="text-maison-title text-lg">{point.title}</h3>
                  <p className="mt-3 text-maison-body-sm">{point.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </PageContainer>
    </Section>
  );
}
