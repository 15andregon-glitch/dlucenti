import { PageContainer } from "./PageContainer";
import { SectionLabel } from "@/components/ui/SectionLabel";

interface PageHeroProps {
  label: string;
  title: React.ReactNode;
  description?: string;
}

export function PageHero({ label, title, description }: PageHeroProps) {
  return (
    <div className="border-b border-[var(--maison-hairline)] bg-[var(--maison-warm-white)] pt-28 pb-16 md:pt-36 md:pb-24">
      <PageContainer>
        <SectionLabel className="mb-4">{label}</SectionLabel>
        <h1 className="max-w-3xl text-maison-display">{title}</h1>
        {description && (
          <p className="mt-6 max-w-xl text-maison-body-sm md:mt-8">
            {description}
          </p>
        )}
      </PageContainer>
    </div>
  );
}
