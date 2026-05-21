"use client";

import Link from "next/link";
import { CinematicHeroVideo } from "@/components/media/CinematicHeroVideo";
import { useTranslations } from "@/hooks/useTranslations";

export function HeroSection() {
  const { t, routes, messages } = useTranslations();

  return (
    <section
      className="hero-campaign-section relative min-h-[100dvh] min-h-[100svh] overflow-hidden bg-[var(--maison-warm-white)]"
      aria-label={`${messages.meta.siteName} campaign`}
    >
      <CinematicHeroVideo />

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[38%] bg-gradient-to-t from-[rgba(42,40,36,0.48)] via-[rgba(42,40,36,0.18)] to-transparent"
        aria-hidden
      />

      <div className="relative z-10 flex min-h-[100dvh] min-h-[100svh] flex-col items-center justify-end pb-[max(4.5rem,calc(3rem+env(safe-area-inset-bottom,0px)))] md:pb-[5.5rem] lg:pb-28">
        <div className="hero-reveal pointer-events-auto w-full px-6 md:px-12 lg:px-16">
          <div className="mx-auto flex w-full max-w-[1440px] flex-col items-center text-center max-md:gap-3 md:gap-9 lg:gap-10">
            <h1 className="hero-campaign-label m-0 w-full text-center">
              {t("home.heroLabel")}
            </h1>

            <nav
              aria-label="Campaign"
              className="flex w-full max-w-full flex-col items-center justify-center gap-3 max-md:flex max-md:flex-col max-md:items-center max-md:justify-center max-md:text-center md:grid md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:items-center md:gap-0"
            >
              <Link
                href={routes.shop}
                className="hero-campaign-link flex w-full max-w-full items-center justify-center whitespace-nowrap text-center max-md:pe-0 max-md:ps-0 md:inline-flex md:w-auto md:justify-self-end md:pe-6 md:text-right"
              >
                {t("home.shopNow")}
              </Link>
              <span
                className="hidden h-[var(--maison-chrome-size)] w-px shrink-0 self-center bg-[var(--hero-text-champagne)] opacity-[0.42] md:block"
                aria-hidden
              />
              <Link
                href={routes.collections}
                className="hero-campaign-link flex w-full max-w-full items-center justify-center whitespace-nowrap text-center max-md:pe-0 max-md:ps-0 md:inline-flex md:w-auto md:justify-self-start md:ps-6 md:text-left"
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
