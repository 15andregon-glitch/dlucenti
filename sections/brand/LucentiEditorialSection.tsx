import { Reveal } from "@/components/ui/Reveal";
import { BRAND_EDITORIAL_VIDEO } from "@/lib/data/brand-editorial";
import { getTranslations } from "@/lib/i18n/translations";
import type { Locale } from "@/lib/i18n/locale";
import { cn } from "@/lib/cn";

interface LucentiEditorialSectionProps {
  locale: Locale;
  className?: string;
}

export async function LucentiEditorialSection({
  locale,
  className,
}: LucentiEditorialSectionProps) {
  const { t } = await getTranslations(locale);

  return (
    <section
      id="lucenti"
      aria-label={t("pages.about.label")}
      className={cn(
        "maison-editorial-section bg-[var(--maison-warm-white)] text-[var(--maison-charcoal)]",
        className,
      )}
    >
      <div
        className={cn(
          "grid min-h-[100svh] grid-cols-1 lg:grid-cols-[minmax(0,11fr)_minmax(0,13fr)] lg:items-stretch",
          "lg:min-h-[min(100svh,58rem)] xl:min-h-[min(100svh,64rem)]",
        )}
      >
        {/* Cinematic atmosphere — first on mobile, right on desktop */}
        <div
          className={cn(
            "relative order-1 min-h-[48vh] sm:min-h-[54vh]",
            "lg:order-2 lg:min-h-0 lg:h-auto",
          )}
        >
          <img
            src={BRAND_EDITORIAL_VIDEO.posterSrc}
            alt=""
            decoding="async"
            fetchPriority="high"
            className="absolute inset-0 h-full w-full min-h-[inherit] object-cover object-center"
            aria-hidden
          />
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="absolute inset-0 h-full w-full min-h-[inherit] object-cover object-center lg:inset-0"
            style={{ filter: "brightness(0.92) contrast(0.96)" }}
            aria-hidden
          >
            <source src={BRAND_EDITORIAL_VIDEO.src} type="video/mp4" />
          </video>
        </div>

        {/* Editorial narrative — vertically centered, generous rhythm */}
        <div
          className={cn(
            "order-2 flex flex-col justify-center",
            "px-[var(--section-px)] py-10 sm:py-14",
            "lg:order-1 lg:py-20 xl:py-24",
            "lg:pl-[max(var(--section-px),calc((100vw_-_var(--container-max))_/_2_+_var(--section-px)))]",
            "lg:pr-12 xl:pr-16",
            "pt-[calc(var(--header-height-mobile)+1.5rem)] lg:pt-20",
          )}
        >
          <div className="mx-auto w-full lg:mx-0">
            <Reveal>
              <figure className="m-0 max-w-[18.5rem] sm:max-w-[19.5rem] lg:max-w-[17.25rem] xl:max-w-[18rem]">
                <blockquote className="m-0 border-0 p-0">
                  <h1 className="m-0 text-maison-display text-[length:clamp(1.875rem,3.6vw,3.125rem)] font-normal !leading-[0.94] text-pretty [hyphens:none]">
                    {t("pages.about.quote")}
                  </h1>
                </blockquote>
                <figcaption className="mt-5 text-maison-body-sm leading-[1.5] tracking-[0.01em] text-[var(--maison-mist)] sm:mt-8">
                  {t("pages.about.quoteAttribution")}
                </figcaption>
              </figure>
            </Reveal>

            <Reveal delay={0.08}>
              <p className="mt-7 max-w-[20rem] text-maison-body-sm leading-[1.7] text-[var(--maison-gray)] sm:mt-10 sm:max-w-none">
                {t("pages.about.description")}
              </p>
            </Reveal>

            <Reveal delay={0.14}>
              <p className="mt-8 text-maison-body-sm leading-[1.75] text-[var(--maison-gray)] md:mt-10">
                {t("pages.about.body")}
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
