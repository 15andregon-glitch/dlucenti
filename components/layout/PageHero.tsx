import { PageContainer } from "./PageContainer";
import { SectionLabel } from "@/components/ui/SectionLabel";

interface PageHeroProps {
  label?: string;
  title: React.ReactNode;
  description?: string;
}

export function PageHero({ label, title, description }: PageHeroProps) {
  return (
    <div className="border-b border-[var(--maison-hairline)] bg-[var(--maison-warm-white)] pt-[calc(var(--header-height-mobile)+1.25rem)] pb-12 md:pt-36 md:pb-24">
      <PageContainer>
        {label ? <SectionLabel className="mb-4">{label}</SectionLabel> : null}
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
