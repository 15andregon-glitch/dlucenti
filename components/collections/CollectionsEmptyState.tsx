import { PageContainer } from "@/components/layout/PageContainer";

interface CollectionsEmptyStateProps {
  title: string;
  description: string;
}

export function CollectionsEmptyState({ title, description }: CollectionsEmptyStateProps) {
  return (
    <PageContainer className="relative z-10 flex min-h-[70vh] flex-col items-center justify-center py-24 text-center">
      <p className="text-maison-label">Collections</p>
      <h1 className="mt-4 max-w-lg text-maison-headline text-2xl md:text-3xl">{title}</h1>
      <p className="mt-6 max-w-md text-maison-body-sm text-[var(--maison-gray)]">{description}</p>
    </PageContainer>
  );
}
