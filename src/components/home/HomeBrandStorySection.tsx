"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useLocale, type Locale } from "@/components/providers/LocaleProvider";
import { useScrubAudio } from "@/hooks/useScrubAudio";

const SCRUB_POSTER_SRC = "/images/home/brand-story-scrub-poster.webp";

const brandStoryCopy: Record<
  Locale,
  {
    firstTitle: [string, string, string];
    firstDescription: string;
    secondTitle: [string, string];
    secondDescription: string;
    thirdTitle: [string, string];
    thirdDescription: string;
  }
> = {
  pt: {
    firstTitle: ["O Fogo", "Jamais", "Se Apaga."],
    firstDescription:
      "A paixão que inflama o estádio. Uma força visceral que precede a razão.",
    secondTitle: ["Do Alto da Glória", "Para o Mundo."],
    secondDescription:
      "Mais do que um clube esportivo, uma verdadeira instituição delineada pelo peso da tradição.",
    thirdTitle: ["Isto é", "Coritiba."],
    thirdDescription:
      "Ousadia técnica, vanguarda estética e uma devoção imaterial eternizada em cada tecido.",
  },
  en: {
    firstTitle: ["The Fire", "Never", "Fades."],
    firstDescription:
      "The passion that ignites the stadium. A visceral force that comes before reason.",
    secondTitle: ["From Alto da Glória", "To the World."],
    secondDescription:
      "More than a football club, a true institution shaped by the weight of tradition.",
    thirdTitle: ["This is", "Coritiba."],
    thirdDescription:
      "Technical boldness, aesthetic edge and an immaterial devotion embedded in every fabric.",
  },
  es: {
    firstTitle: ["El Fuego", "Jamás", "Se Apaga."],
    firstDescription:
      "La pasión que enciende el estadio. Una fuerza visceral que precede a la razón.",
    secondTitle: ["Desde Alto da Glória", "Para el Mundo."],
    secondDescription:
      "Más que un club deportivo, una verdadera institución definida por el peso de la tradición.",
    thirdTitle: ["Esto es", "Coritiba."],
    thirdDescription:
      "Atrevimiento técnico, vanguardia estética y una devoción inmaterial eternizada en cada tejido.",
  },
};

function getScrubVideoSource() {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return "/media/video/brand-story-scrub.mp4";
  }

  const memory =
    (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;
  const wideScreen = window.matchMedia("(min-width: 1440px)").matches;
  const precisePointer = window.matchMedia("(pointer: fine)").matches;
  const enoughCpu = navigator.hardwareConcurrency >= 10;

  if (wideScreen && precisePointer && enoughCpu && memory >= 8) {
    return "/media/video/brand-story-scrub-hq.mp4";
  }

  return "/media/video/brand-story-scrub.mp4";
}

export function HomeBrandStorySection() {
  const { locale } = useLocale();
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const text1Ref = useRef<HTMLDivElement>(null);
  const text2Ref = useRef<HTMLDivElement>(null);
  const text3Ref = useRef<HTMLDivElement>(null);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const [scrubReady, setScrubReady] = useState(false);
  const [videoSrc] = useState(getScrubVideoSource);
  const copy = brandStoryCopy[locale];

  useScrubAudio(sectionRef);

  useLayoutEffect(() => {
    if (!scrubReady) return;

    const section = sectionRef.current;
    const stage = stageRef.current;
    const video = videoRef.current;
    const text1 = text1Ref.current;
    const text2 = text2Ref.current;
    const text3 = text3Ref.current;

    if (!section || !stage || !video || !text1 || !text2 || !text3) return;

    const ctx = gsap.context(() => {
      const duration = Math.max((video.duration || 15) - 0.001, 0.001);
      const sectionHeightVh = Math.max(220, Math.round(duration * 18));
      section.style.minHeight = `${sectionHeightVh}vh`;

      gsap.set(video, { currentTime: 0, opacity: 0.9 });
      gsap.set([text1, text2, text3], { opacity: 0, y: 40 });

      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      timeline
        .fromTo(
          video,
          { currentTime: 0 },
          { currentTime: duration, duration: 1.1 },
          0,
        )
        .fromTo(
          text1,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.15 },
          0.05,
        )
        .to(text1, { opacity: 0, y: -40, duration: 0.15 }, 0.25)
        .fromTo(
          text2,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.15 },
          0.4,
        )
        .to(text2, { opacity: 0, y: -40, duration: 0.15 }, 0.6)
        .fromTo(
          text3,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.15 },
          0.75,
        )
        .to(text3, { opacity: 0, y: -40, duration: 0.15 }, 0.95);

      gsap.fromTo(
        stage,
        { scale: 1.02 },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom bottom",
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      );

      requestAnimationFrame(() => {
        window.__lenis?.resize?.();
        ScrollTrigger.refresh();
      });
    }, sectionRef);

    return () => {
      ctx.revert();
      section.style.minHeight = "220vh";
    };
  }, [scrubReady]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setShouldLoadVideo(true);
          observer.disconnect();
        }
      },
      { threshold: 0.01, rootMargin: "220% 0px" },
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldLoadVideo) return;

    let cancelled = false;
    let hasMarkedReady = false;
    let readyFrame: number | undefined;

    const markReady = () => {
      if (
        cancelled ||
        hasMarkedReady ||
        video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA
      ) {
        return;
      }

      hasMarkedReady = true;
      video.pause();
      video.currentTime = 0;

      readyFrame = window.requestAnimationFrame(() => {
        if (!cancelled) {
          setScrubReady(true);
        }
      });
    };

    video.addEventListener("loadeddata", markReady, { once: true });
    video.addEventListener("canplay", markReady, { once: true });
    video.preload = "auto";
    video.src = videoSrc;
    video.load();

    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      markReady();
    }

    return () => {
      cancelled = true;
      if (readyFrame) {
        window.cancelAnimationFrame(readyFrame);
      }

      video.removeEventListener("loadeddata", markReady);
      video.removeEventListener("canplay", markReady);
    };
  }, [shouldLoadVideo, videoSrc]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-clip bg-black"
      style={{ minHeight: "220vh" }}
    >
      <div ref={stageRef} className="sticky top-0 h-screen w-full">
        <div
          aria-hidden="true"
          className={[
            "absolute inset-0 transition-opacity duration-700 ease-out",
            scrubReady ? "opacity-0" : "opacity-100",
          ].join(" ")}
        >
          <Image
            src={SCRUB_POSTER_SRC}
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/55" />
        </div>

        <video
          ref={videoRef}
          preload="none"
          muted
          playsInline
          disablePictureInPicture
          poster={SCRUB_POSTER_SRC}
          className={[
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out",
            scrubReady ? "opacity-[0.9]" : "opacity-0",
          ].join(" ")}
          style={{
            pointerEvents: "none",
            transform: "translateZ(0)",
            willChange: "transform",
            contain: "layout paint size",
          }}
        />

        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.6) 100%)",
          }}
        />

        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          <div
            ref={text1Ref}
            className="absolute max-w-4xl px-6 text-center"
            style={{ opacity: 0 }}
          >
            <h2 className="mb-4 font-heading text-4xl font-black uppercase leading-none tracking-tighter text-white drop-shadow-2xl md:text-7xl">
               {copy.firstTitle[0]}{" "}
               <span className="text-[var(--color-primary)] opacity-90 drop-shadow-2xl">
                 {copy.firstTitle[1]}
               </span>
               <br />
               {copy.firstTitle[2]}
            </h2>
            <p className="mx-auto max-w-xl text-white/80 drop-shadow-lg md:text-xl md:font-semibold">
              {copy.firstDescription}
            </p>
          </div>

          <div
            ref={text2Ref}
            className="absolute max-w-4xl px-6 text-center"
            style={{ opacity: 0 }}
          >
            <h2 className="mb-4 font-heading text-4xl font-black uppercase leading-none tracking-tighter text-white drop-shadow-2xl md:text-7xl">
               {copy.secondTitle[0]} <br />
               <span className="text-[var(--color-primary)] opacity-90 drop-shadow-2xl">
                 {copy.secondTitle[1]}
               </span>
            </h2>
            <p className="mx-auto max-w-xl text-white/80 drop-shadow-lg md:text-xl md:font-semibold">
              {copy.secondDescription}
            </p>
          </div>

          <div
            ref={text3Ref}
            className="absolute max-w-4xl px-6 text-center"
            style={{ opacity: 0 }}
          >
            <h2 className="mb-4 font-heading text-4xl font-black uppercase leading-none tracking-tighter text-[var(--color-primary)] opacity-90 drop-shadow-2xl md:text-7xl">
               {copy.thirdTitle[0]} <br />
               <span className="text-white drop-shadow-2xl">{copy.thirdTitle[1]}</span>
            </h2>
            <p className="mx-auto max-w-xl text-white/80 drop-shadow-lg md:text-xl md:font-semibold">
              {copy.thirdDescription}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

