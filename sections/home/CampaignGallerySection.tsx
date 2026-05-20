import { CampaignGalleryImage } from "@/components/campaign/CampaignGalleryImage";
import { Reveal } from "@/components/ui/Reveal";
import { CAMPAIGN_GALLERY } from "@/lib/data/campaign-gallery";

export function CampaignGallerySection() {
  const g = CAMPAIGN_GALLERY;

  return (
    <section
      id="campaign"
      aria-label="Editorial campaign gallery"
      className="border-t border-[var(--maison-hairline)] bg-[var(--maison-ivory)] pt-[clamp(2.5rem,7vw,5rem)] md:pt-[clamp(3rem,9vw,6rem)]"
    >
      {/* Full-width cinematic opener */}
      <Reveal>
        <CampaignGalleryImage
          src={g.fullBleed.src}
          alt={g.fullBleed.alt}
          priority
          sizes="100vw"
          className="aspect-[4/5] w-full sm:aspect-[3/2] md:min-h-[58vh] md:aspect-auto md:h-[62vh]"
        />
      </Reveal>

      <div className="mx-auto w-full max-w-[1440px] px-[var(--section-px)] py-8 md:py-12 lg:py-14">
        {/* Asymmetric pair — portrait + landscape */}
        <div className="grid grid-cols-12 gap-4 md:gap-6 lg:gap-8">
          <Reveal className="col-span-12 md:col-span-5">
            <CampaignGalleryImage
              src={g.portraitLeft.src}
              alt={g.portraitLeft.alt}
              sizes="(max-width: 768px) 100vw, 42vw"
              className="aspect-[3/4] w-full"
            />
          </Reveal>
          <Reveal className="col-span-12 md:col-span-7" delay={0.08}>
            <CampaignGalleryImage
              src={g.landscapeRight.src}
              alt={g.landscapeRight.alt}
              sizes="(max-width: 768px) 100vw, 58vw"
              className="aspect-[4/3] w-full md:aspect-[16/11] md:h-full md:min-h-[28rem]"
            />
          </Reveal>
        </div>

        {/* Offset rhythm — small accent + tall feature */}
        <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 lg:mt-8 lg:gap-8">
          <Reveal className="col-span-6 md:col-span-4 md:col-start-2">
            <CampaignGalleryImage
              src={g.accentPortrait.src}
              alt={g.accentPortrait.alt}
              sizes="(max-width: 768px) 50vw, 28vw"
              className="aspect-[4/5] w-full"
            />
          </Reveal>
          <Reveal className="col-span-6 md:col-span-6 md:col-start-6" delay={0.06}>
            <CampaignGalleryImage
              src={g.tallFeature.src}
              alt={g.tallFeature.alt}
              sizes="(max-width: 768px) 50vw, 44vw"
              className="aspect-[3/4] w-full md:aspect-[4/5] md:min-h-[32rem]"
            />
          </Reveal>
        </div>

        {/* Closing wide — inset editorial frame */}
        <Reveal className="mt-4 md:mt-6 lg:mt-8">
          <CampaignGalleryImage
            src={g.closingWide.src}
            alt={g.closingWide.alt}
            sizes="(max-width: 768px) 100vw, 90vw"
            className="aspect-[3/2] w-full md:aspect-[2/1] lg:aspect-[21/9]"
          />
        </Reveal>
      </div>
    </section>
  );
}
