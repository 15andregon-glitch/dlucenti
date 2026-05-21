"use client";

import { useEffect, useRef, useState } from "react";
import { ASSETS } from "@/lib/assets";
import { cn } from "@/lib/cn";

interface CinematicHeroVideoProps {
  className?: string;
}

const objectPosition = "object-cover object-[center_42%]";

export function CinematicHeroVideo({ className }: CinematicHeroVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoFailed, setVideoFailed] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container || videoFailed) return;

    const play = () => video.play().catch(() => {});

    const onLoaded = () => play();
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
      <img
        src={ASSETS.images.hero}
        alt=""
        decoding="sync"
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
          preload="auto"
          className={cn("absolute inset-0 h-full w-full", objectPosition)}
          aria-hidden
        >
          <source src={ASSETS.videos.hero} type="video/mp4" />
        </video>
      )}
    </div>
  );
}
