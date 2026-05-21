import Link from "next/link";
import { CinematicHeroVideo } from "@/components/media/CinematicHeroVideo";
import { getTranslations } from "@/lib/i18n/translations";
import type { Locale } from "@/lib/i18n/locale";

export async function HeroSection({ locale }: { locale: Locale }) {
  const { t, routes, messages } = await getTranslations(locale);

  return (
    <section
      className="hero-campaign-section relative overflow-hidden bg-[var(--maison-warm-white)]"
      aria-label={`${messages.meta.siteName} campaign`}
    >
      <CinematicHeroVideo />

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[38%] bg-gradient-to-t from-[rgba(42,40,36,0.48)] via-[rgba(42,40,36,0.18)] to-transparent"
        aria-hidden
      />

      <div className="hero-campaign-stage relative z-10 flex h-full flex-col items-center justify-end pb-[max(4.5rem,calc(3rem+env(safe-area-inset-bottom,0px)))] md:pb-[5.5rem] lg:pb-28">
        <div className="hero-campaign-chrome pointer-events-auto w-full px-6 md:px-12 lg:px-16">
          <div className="mx-auto flex w-full max-w-[1440px] flex-col items-center gap-3 text-center md:gap-9 lg:gap-10">
            <h1 className="hero-campaign-label m-0 w-full text-center">
              {t("home.heroLabel")}
            </h1>

            <nav aria-label="Campaign" className="hero-campaign-cta-nav">
              <Link
                href={routes.shop}
                className="hero-campaign-link hero-campaign-link--start whitespace-nowrap"
              >
                {t("home.shopNow")}
              </Link>
              <span
                className="hero-campaign-cta-divider shrink-0"
                aria-hidden
              />
              <Link
                href={routes.collections}
                className="hero-campaign-link hero-campaign-link--end whitespace-nowrap"
              >
                {t("home.viewCollection")}
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </section>
  );
}
