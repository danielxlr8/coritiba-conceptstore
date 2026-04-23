"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useLocale, type Locale } from "@/components/providers/LocaleProvider";
import { useHeroCtaAudio } from "@/hooks/useHeroCtaAudio";
import { useMediaPreferences } from "@/hooks/useMediaPreferences";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Reveal } from "@/components/motion/Reveal";
import { WaveText } from "@/components/shared/WaveText";
import { MagneticHover } from "@/components/shared/MagneticHover";
import { MagneticButton } from "@/components/shared/MagneticButton";
import { Package, ArrowRight, Wand2 } from "lucide-react";
import { useState } from "react";

const AiSizeGuideModal = dynamic(
  () =>
    import("@/components/fit-guide/AiSizeGuideModal").then(
      (mod) => mod.AiSizeGuideModal,
    ),
  { ssr: false },
);

gsap.registerPlugin(ScrollTrigger);

const localeFlags: Array<{ locale: Locale; flag: string; label: string }> = [
  { locale: "pt", flag: "\u{1F1E7}\u{1F1F7}", label: "Portugu\u00EAs" },
  { locale: "en", flag: "\u{1F1FA}\u{1F1F8}", label: "English" },
  { locale: "es", flag: "\u{1F1EA}\u{1F1F8}", label: "Espa\u00F1ol" },
];

const heroCopy: Record<
  Locale,
  {
    titleTop: string;
    titleBottom: string;
    description: string;
    primaryCta: string;
    sizeGuideCta: string;
    orderTrackingCta: string;
    scrollHint: string;
  }
> = {
  pt: {
    titleTop: "NOVA",
    titleBottom: "COLE\u00C7\u00C3O",
    description:
      "Assume o orgulho coxa-branca. Navegue pela nova linha de vestu\u00E1rio e hist\u00F3ria.",
    primaryCta: "Conhe\u00E7a a Nova Cole\u00E7\u00E3o",
    sizeGuideCta: "Descobrir Tamanho",
    orderTrackingCta: "J\u00E1 comprou? Acompanhe seu pedido",
    scrollHint: "Role para Descobrir",
  },
  en: {
    titleTop: "NEW",
    titleBottom: "COLLECTION",
    description:
      "Step into Coxa pride. Explore the new line of apparel and identity.",
    primaryCta: "Discover the New Collection",
    sizeGuideCta: "Find Your Size",
    orderTrackingCta: "Already ordered? Track your purchase",
    scrollHint: "Scroll to Discover",
  },
  es: {
    titleTop: "NUEVA",
    titleBottom: "COLECCI\u00D3N",
    description:
      "Asume el orgullo coxa-branca. Descubre la nueva l\u00EDnea de indumentaria e historia.",
    primaryCta: "Conoce la Nueva Colecci\u00F3n",
    sizeGuideCta: "Descubrir Talla",
    orderTrackingCta: "Ya compraste? Sigue tu pedido",
    scrollHint: "Desliza para Descubrir",
  },
};

export function HomeHeroSection() {
  const [isSizeModalOpen, setIsSizeModalOpen] = useState(false);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);
  const contentGroupRef = useRef<HTMLDivElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const backgroundVideoRef = useRef<HTMLVideoElement>(null);
  const { triggerWithDelay } = useHeroCtaAudio();
  const { shouldReduceMedia } = useMediaPreferences();
  const { locale, setLocale } = useLocale();
  const copy = heroCopy[locale];

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const contentGroup = contentGroupRef.current;
    const videoContainer = videoContainerRef.current;

    if (!section || !contentGroup) return;

    const ctx = gsap.context(() => {
      gsap.set(contentGroup, { clearProps: "transform,opacity" });
      if (videoContainer) {
        gsap.set(videoContainer, { clearProps: "transform" });
      }
      // 1. Animação de saída do texto ao rolar para baixo
      gsap.to(contentGroup, {
        y: 100,
        opacity: 0,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: 1.2,
        },
      });

      // 2. Parallax suave no container do YouTube
      if (videoContainer) {
        gsap.to(videoContainer, {
          yPercent: 10,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }
    }, sectionRef);

    const refreshId = requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });

    return () => {
      cancelAnimationFrame(refreshId);
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, [locale]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry) {
          setShouldLoadVideo(entry.isIntersecting);
        }
      },
      { threshold: 0.01 },
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = backgroundVideoRef.current;
    if (!video || !shouldLoadVideo || shouldReduceMedia) {
      backgroundVideoRef.current?.pause();
      return;
    }

    video.play().catch(() => {
      // O hero continua funcional mesmo se o navegador bloquear o autoplay.
    });
  }, [shouldLoadVideo, shouldReduceMedia]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen flex flex-col overflow-hidden bg-[#0A0A0A] text-white"
    >
      {/*  -� -� NATIVE VIDEO BACKGROUND  -� -� stays absolute, purely decorative */}
      <div
        ref={videoContainerRef}
        className="absolute inset-0 z-0 w-full h-full will-change-transform"
        style={{ transform: "scale(1.2)" }}
      >
        <Image
          src="/images/home/home-hero-uniforms.webp"
          alt=""
          fill
          priority
          aria-hidden="true"
          className="absolute inset-0 object-cover opacity-30"
          sizes="100vw"
        />
        <div className="absolute inset-0 w-full h-full pointer-events-none bg-black">
          <video
            ref={backgroundVideoRef}
            loop
            muted
            playsInline
            preload="metadata"
            className="absolute top-1/2 left-1/2 w-full h-full -translate-x-1/2 -translate-y-1/2 object-cover"
            style={{ border: "none" }}
            aria-hidden="true"
          >
            {shouldLoadVideo && !shouldReduceMedia && (
              <source
                src="/media/video/home-hero-background.mp4"
                type="video/mp4"
              />
            )}
          </video>
        </div>

        {/* Gradient overlay for text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-transparent z-10" />
        {/* Global dark tint */}
        <div className="absolute inset-0 bg-black/30 z-10" />
      </div>

      {/*  -� -� LAYOUT SHELL: flex-col fills the full viewport height  -� -� */}
      <div className="relative z-20 flex flex-col min-h-screen">
        {/* Top spacer  - pushes content below the navbar */}
        <div className="h-16 sm:h-20 shrink-0" aria-hidden="true" />

        <div className="pointer-events-none fixed top-28 right-5 z-[80] sm:top-32 sm:right-8">
          <div className="pointer-events-auto flex items-center gap-1 rounded-full border border-white/10 bg-black/55 p-2 shadow-[0_18px_50px_rgba(0,0,0,0.32)] backdrop-blur-xl">
            {localeFlags.map((item) => {
              const isActive = item.locale === locale;

              return (
                <button
                  key={item.locale}
                  type="button"
                  aria-label={item.label}
                  aria-pressed={isActive}
                  onClick={() => setLocale(item.locale)}
                  className={[
                    "flex h-10 w-10 items-center justify-center rounded-full text-lg transition-all duration-300",
                    isActive
                      ? "bg-[var(--color-primary)]/18 shadow-[0_0_0_1px_rgba(93,235,99,0.35)]"
                      : "bg-transparent opacity-70 hover:bg-white/8 hover:opacity-100",
                  ].join(" ")}
                >
                  <span aria-hidden="true">{item.flag}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/*  -� -� CENTRAL CONTENT  - grows to fill available space, centred  -� -� */}
        <div
          ref={contentGroupRef}
          className="flex-1 flex flex-col items-center justify-center text-center px-6 py-8 will-change-transform"
        >
          <Reveal
            key={`hero-title-${locale}`}
            type="fade"
            delay={0.15}
            direction="up"
            className="relative z-20"
          >
            <h1 className="font-black font-heading tracking-tighter uppercase text-fluid-h1 flex flex-col items-center gap-2 cursor-pointer group drop-shadow-2xl">
              <span className="block text-[var(--color-primary)] leading-none text-shadow-sm">
                <WaveText
                  key={`hero-title-top-${locale}`}
                  text={copy.titleTop}
                  filterId={`hero-wave-nova-${locale}`}
                  turbulence
                />
              </span>
              <span className="block text-white leading-none text-shadow-sm">
                <WaveText
                  key={`hero-title-bottom-${locale}`}
                  text={copy.titleBottom}
                  filterId={`hero-wave-colecao-${locale}`}
                  turbulence
                />
              </span>
            </h1>
          </Reveal>

          <Reveal
            type="clip"
            delay={0.8}
            direction="up"
            className="mt-4 sm:mt-6 max-w-lg w-full"
          >
            <p className="text-base sm:text-lg md:text-xl text-white/70 font-medium">
              {copy.description}
            </p>
          </Reveal>

          <Reveal type="scale" delay={1.0} className="mt-6 sm:mt-8 flex gap-4">
            <MagneticHover strength={0.4}>
              <MagneticButton
                variant="primary"
                className="hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/70 border border-transparent hover:border-[var(--color-primary)]/30 transition-all duration-300"
                onClick={() => {
                  triggerWithDelay(() => {
                    document
                      .getElementById("featured-drop-cards")
                      ?.scrollIntoView({ behavior: "smooth", block: "start" });
                  });
                }}
              >
                {copy.primaryCta}
              </MagneticButton>
            </MagneticHover>
          </Reveal>

          {/* AI SIZE GUIDE BUTTON */}
          <Reveal
            type="clip"
            delay={1.1}
            direction="up"
            className="mt-3 sm:mt-4"
          >
            <button
              onClick={() => setIsSizeModalOpen(true)}
              className="px-6 py-2 bg-[var(--color-primary)]/10 hover:bg-[var(--color-primary)]/20 border border-[var(--color-primary)]/30 text-[var(--color-primary)] rounded-full flex items-center gap-2 transition-all duration-300 text-xs md:text-sm font-bold uppercase tracking-widest"
            >
              <Wand2 size={16} />
              {copy.sizeGuideCta}
            </button>
          </Reveal>

          {/* TRACK ORDER LINK */}
          <Reveal
            type="clip"
            delay={1.2}
            direction="up"
            className="mt-3 sm:mt-4"
          >
            <a
              href="/rastreio"
              className="px-6 py-3.5 bg-black/40 hover:bg-[#111] backdrop-blur-xl border border-white/10 hover:border-[var(--color-primary)]/50 rounded-full flex items-center gap-3 transition-all duration-300 text-[11px] md:text-sm font-bold uppercase tracking-widest text-white/80 hover:text-white group"
            >
              <Package
                strokeWidth={2.5}
                size={16}
                className="text-[var(--color-primary)] group-hover:-translate-y-0.5 transition-transform"
              />
              {copy.orderTrackingCta}
              <ArrowRight
                size={14}
                className="opacity-0 -ml-2 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300"
              />
            </a>
          </Reveal>
        </div>

        {/*  -� -� SCROLL INDICATOR  - anchored at the bottom in normal flow  -� -� */}
        <div className="shrink-0 flex flex-col items-center gap-2 pb-6 sm:pb-8 opacity-50 pointer-events-none">
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/80">
            {copy.scrollHint}
          </span>
          <div className="w-px h-10 bg-gradient-to-b from-white to-transparent overflow-hidden">
            <div className="w-full h-1/2 bg-[var(--color-primary)] animate-bounce" />
          </div>
        </div>
      </div>

      {isSizeModalOpen && (
        <AiSizeGuideModal
          isOpen={isSizeModalOpen}
          onClose={() => setIsSizeModalOpen(false)}
        />
      )}
    </section>
  );
}
