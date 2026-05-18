"use client";

import { useEffect, useRef, useState } from "react";
import { ASSETS } from "@/lib/assets";
import { cn } from "@/lib/cn";
import { usePerformanceMode } from "@/hooks/usePerformanceMode";

interface CinematicHeroVideoProps {
  className?: string;
}

const objectPosition = "object-cover object-[center_42%]";

export function CinematicHeroVideo({ className }: CinematicHeroVideoProps) {
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
      { threshold: 0.05 },
    );
    observer.observe(container);

    return () => {
      video.removeEventListener("loadeddata", onLoaded);
      video.removeEventListener("error", onError);
      observer.disconnect();
    };
  }, [videoFailed]);

  return (
    <div
      ref={containerRef}
      className={cn("absolute inset-0 overflow-hidden", className)}
    >
      {/* Always-visible poster — existing campaign asset, no broken /campaigns paths */}
      <img
        src={ASSETS.images.hero}
        alt=""
        decoding="async"
        fetchPriority="high"
        className={cn("absolute inset-0 h-full w-full", objectPosition)}
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
            "absolute inset-0 h-full w-full transition-opacity duration-700 ease-out",
            objectPosition,
            videoReady ? "opacity-100" : "opacity-0",
          )}
          aria-hidden
        >
          <source src={ASSETS.videos.hero} type="video/mp4" />
        </video>
      )}
    </div>
  );
}
