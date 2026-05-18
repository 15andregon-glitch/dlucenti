import Link from "next/link";
import { CinematicHeroVideo } from "@/components/media/CinematicHeroVideo";
import { ROUTES } from "@/lib/routes";
import { SITE } from "@/lib/constants";

export function HeroSection() {
  return (
    <section
      className="relative min-h-[100dvh] min-h-[100svh] overflow-hidden bg-[var(--maison-warm-white)]"
      aria-label={`${SITE.name} campaign`}
    >
      <CinematicHeroVideo />

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[38%] bg-gradient-to-t from-[rgba(42,40,36,0.48)] via-[rgba(42,40,36,0.18)] to-transparent"
        aria-hidden
      />

      <div className="relative z-10 flex min-h-[100dvh] min-h-[100svh] flex-col items-center justify-end pb-[4.5rem] md:pb-[5.5rem] lg:pb-28">
        <div className="hero-reveal pointer-events-auto w-full px-6 md:px-12 lg:px-16">
          <div className="mx-auto flex w-full max-w-[1440px] flex-col items-center gap-8 md:gap-9 lg:gap-10">
            <h1 className="hero-campaign-label m-0">New In</h1>

            <nav aria-label="Campaign" className="hero-campaign-cta w-full">
              <Link
                href={ROUTES.shop}
                className="hero-campaign-link hero-campaign-link--start"
              >
                Shop now
              </Link>
              <span className="hero-campaign-divider" aria-hidden />
              <Link
                href={ROUTES.collections}
                className="hero-campaign-link hero-campaign-link--end"
              >
                View collection
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </section>
  );
}
