"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { usePerformanceMode } from "@/hooks/usePerformanceMode";
import type { EditorialVideoMedia } from "@/lib/types/editorial-media";

interface EditorialCinematicVideoProps {
  media: EditorialVideoMedia;
  className?: string;
  toneClassName?: string;
}

export function EditorialCinematicVideo({
  media,
  className,
  toneClassName,
}: EditorialCinematicVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const { lightMotion } = usePerformanceMode();

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container || videoFailed) return;

    const play = () => video.play().catch(() => {});

    const onLoaded = () => {
      setVideoReady(true);
      play();
    };

    const onError = () => setVideoFailed(true);

    if (video.readyState >= 2) onLoaded();
    else video.addEventListener("loadeddata", onLoaded, { once: true });

    video.addEventListener("error", onError, { once: true });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) play();
        else video.pause();
      },
      { threshold: 0.12, rootMargin: "80px 0px" },
    );
    observer.observe(container);

    return () => {
      video.removeEventListener("loadeddata", onLoaded);
      video.removeEventListener("error", onError);
      observer.disconnect();
    };
  }, [videoFailed, media.src]);

  return (
    <div
      ref={containerRef}
      className={cn("relative h-full min-h-[inherit] w-full overflow-hidden", className)}
    >
      <img
        src={media.posterSrc}
        alt={media.posterAlt ?? ""}
        decoding="async"
        fetchPriority="low"
        className="absolute inset-0 h-full w-full object-cover object-center"
        aria-hidden
      />

      {!videoFailed && (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload={lightMotion ? "metadata" : "auto"}
          className={cn(
            "absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-[1100ms] ease-[var(--ease-cinematic)]",
            videoReady ? "opacity-[0.94]" : "opacity-0",
          )}
          aria-hidden
        >
          <source src={media.src} type={media.mimeType ?? "video/mp4"} />
        </video>
      )}

      <div
        className={cn(
          "pointer-events-none absolute inset-0 bg-gradient-to-l from-[var(--maison-warm-white)]/25 via-transparent to-[rgba(42,40,36,0.12)]",
          toneClassName,
        )}
        aria-hidden
      />
    </div>
  );
}
