import {
  HeroSection,
  NewInSection,
  FeaturedCollectionsSection,
  CampaignGallerySection,
} from "@/sections";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <NewInSection />
      <FeaturedCollectionsSection />
      <CampaignGallerySection />
    </main>
  );
}
