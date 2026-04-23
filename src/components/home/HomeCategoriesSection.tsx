"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { useLocale, type Locale } from "@/components/providers/LocaleProvider";
import { useMediaPreferences } from "@/hooks/useMediaPreferences";

const categoriesCopy: Record<
  Locale,
  {
    titleTop: string;
    titleAccent: string;
    description: string;
    uniformsAlt: string;
    uniformsEyebrow: string;
    uniformsTitle: string;
    uniformsMeta: string;
    kidsAlt: string;
    kidsBadge: string;
    kidsEyebrow: string;
    kidsTitle: string;
    casualAlt: string;
    casualEyebrow: string;
    casualTitle: string;
    trainingAlt: string;
    trainingEyebrow: string;
    trainingTitle: string;
  }
> = {
  pt: {
    titleTop: "Linhas",
    titleAccent: "da Loja",
    description:
      "Explore os produtos oficiais do Coritiba, do campo ao casual, para toda a fam\u00EDlia coxa-branca.",
    uniformsAlt: "Uniformes de Jogo",
    uniformsEyebrow: "Performance",
    uniformsTitle: "Uniformes",
    uniformsMeta: "Masculino \u00B7 Feminino \u00B7 Goleiro",
    kidsAlt: "Infantojuvenil",
    kidsBadge: "Nova Linha",
    kidsEyebrow: "Tamanhos 4-14",
    kidsTitle: "Infantojuvenil",
    casualAlt: "Casual / Viagem",
    casualEyebrow: "Eleg\u00E2ncia",
    casualTitle: "Casual",
    trainingAlt: "Treino",
    trainingEyebrow: "Alta Performance",
    trainingTitle: "Treino",
  },
  en: {
    titleTop: "Store",
    titleAccent: "Lines",
    description:
      "Explore Coritiba\u2019s official products, from matchday to casual wear, for the whole Coxa family.",
    uniformsAlt: "Match Jerseys",
    uniformsEyebrow: "Performance",
    uniformsTitle: "Jerseys",
    uniformsMeta: "Men \u00B7 Women \u00B7 Goalkeeper",
    kidsAlt: "Kids",
    kidsBadge: "New Line",
    kidsEyebrow: "Sizes 4-14",
    kidsTitle: "Kids",
    casualAlt: "Casual / Travel",
    casualEyebrow: "Elegance",
    casualTitle: "Casual",
    trainingAlt: "Training",
    trainingEyebrow: "High Performance",
    trainingTitle: "Training",
  },
  es: {
    titleTop: "L\u00EDneas",
    titleAccent: "de la Tienda",
    description:
      "Explora los productos oficiales del Coritiba, del campo al casual, para toda la familia coxa-branca.",
    uniformsAlt: "Uniformes de Juego",
    uniformsEyebrow: "Performance",
    uniformsTitle: "Uniformes",
    uniformsMeta: "Masculino \u00B7 Femenino \u00B7 Arquero",
    kidsAlt: "Infantojuvenil",
    kidsBadge: "Nueva L\u00EDnea",
    kidsEyebrow: "Tallas 4-14",
    kidsTitle: "Infantojuvenil",
    casualAlt: "Casual / Viaje",
    casualEyebrow: "Elegancia",
    casualTitle: "Casual",
    trainingAlt: "Entrenamiento",
    trainingEyebrow: "Alta Performance",
    trainingTitle: "Entrenamiento",
  },
};

export function HomeCategoriesSection() {
  const { locale } = useLocale();
  const decorVideoPrimaryRef = useRef<HTMLVideoElement>(null);
  const decorVideoSecondaryRef = useRef<HTMLVideoElement>(null);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const { shouldReduceMedia } = useMediaPreferences();
  const copy = categoriesCopy[locale];

  useEffect(() => {
    const primaryVideo = decorVideoPrimaryRef.current;
    const secondaryVideo = decorVideoSecondaryRef.current;
    if (!primaryVideo || !secondaryVideo) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setShouldLoadVideo((current) => current || entry.isIntersecting);

          if (entry.isIntersecting && !shouldReduceMedia) {
            primaryVideo.play().catch(() => {});
          } else {
            primaryVideo.pause();
            secondaryVideo.pause();
          }
        });
      },
      { threshold: 0.05, rootMargin: "160px 0px" },
    );

    observer.observe(primaryVideo);

    return () => observer.disconnect();
  }, [shouldReduceMedia]);

  useEffect(() => {
    const primaryVideo = decorVideoPrimaryRef.current;
    const secondaryVideo = decorVideoSecondaryRef.current;

    if (
      !shouldLoadVideo ||
      shouldReduceMedia ||
      !primaryVideo ||
      !secondaryVideo
    ) {
      return;
    }

    let activeVideo: HTMLVideoElement = primaryVideo;
    let inactiveVideo: HTMLVideoElement = secondaryVideo;
    let isTransitioning = false;
    let rafId = 0;
    let swapTimeoutId = 0;
    const blendWindow = 0.72;
    const crossfadeDurationMs = 560;

    primaryVideo.style.opacity = "0.92";
    secondaryVideo.style.opacity = "0";
    secondaryVideo.currentTime = 0;
    primaryVideo.playbackRate = 1;
    secondaryVideo.playbackRate = 1;

    primaryVideo.play().catch(() => {});

    const syncLoop = () => {
      const duration = activeVideo.duration || 0;

      if (
        duration > 0 &&
        !isTransitioning &&
        duration - activeVideo.currentTime <= blendWindow
      ) {
        isTransitioning = true;

        inactiveVideo.currentTime = 0;
        inactiveVideo.style.opacity = "0";
        inactiveVideo
          .play()
          .then(() => {
            inactiveVideo.style.opacity = "0.92";
            activeVideo.style.opacity = "0";

            swapTimeoutId = window.setTimeout(() => {
              activeVideo.pause();
              activeVideo.currentTime = 0;

              const previousActive = activeVideo;
              activeVideo = inactiveVideo;
              inactiveVideo = previousActive;
              isTransitioning = false;
            }, crossfadeDurationMs);
          })
          .catch(() => {
            isTransitioning = false;
          });
      }

      rafId = requestAnimationFrame(syncLoop);
    };

    rafId = requestAnimationFrame(syncLoop);

    return () => {
      cancelAnimationFrame(rafId);
      window.clearTimeout(swapTimeoutId);
      primaryVideo.pause();
      secondaryVideo.pause();
      primaryVideo.style.opacity = "0.92";
      secondaryVideo.style.opacity = "0";
    };
  }, [shouldLoadVideo, shouldReduceMedia]);

  return (
    <section className="py-32 bg-[var(--color-background-dark)] w-full relative z-10">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16">
          <Reveal type="clip" direction="up">
            <div className="flex items-center">
              <h2 className="text-white text-fluid-h2 font-black font-heading uppercase tracking-tight leading-none">
                {copy.titleTop} <br />
                <span className="text-[var(--color-primary)]">{copy.titleAccent}</span>
              </h2>
              <div
                className="relative ml-4 h-auto w-48 shrink-0 pointer-events-none md:ml-10 md:w-32"
                style={{
                  maskImage:
                    "radial-gradient(ellipse at center, black 0%, black 62%, transparent 100%)",
                  WebkitMaskImage:
                    "radial-gradient(ellipse at center, black 0%, black 62%, transparent 100%)",
                  filter: "contrast(1.16) saturate(1.06)",
                  contain: "layout paint",
                }}
                aria-hidden="true"
              >
                <video
                  ref={decorVideoPrimaryRef}
                  muted
                  playsInline
                  preload="metadata"
                  className="h-auto w-full object-contain transition-opacity duration-[560ms] ease-out"
                  style={{ opacity: 0.92 }}
                >
                  {shouldLoadVideo && !shouldReduceMedia && (
                    <source src="/media/video/home-categories-loop.mp4" type="video/mp4" />
                  )}
                </video>
                <video
                  ref={decorVideoSecondaryRef}
                  muted
                  playsInline
                  preload="metadata"
                  className="absolute inset-0 h-auto w-full object-contain transition-opacity duration-[560ms] ease-out"
                  style={{ opacity: 0 }}
                >
                  {shouldLoadVideo && !shouldReduceMedia && (
                    <source src="/media/video/home-categories-loop.mp4" type="video/mp4" />
                  )}
                </video>
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_46%,rgba(0,0,0,0.1)_72%,rgba(0,0,0,0.45)_100%)]" />
              </div>
            </div>
          </Reveal>
          <Reveal
            type="fade"
            delay={0.7}
            direction="up"
            className="mt-6 md:mt-0"
          >
            <p className="text-white/50 max-w-sm font-medium text-lg leading-relaxed">
              {copy.description}
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <Link
            href="/categorias/uniformes"
            className="md:col-span-2 group relative overflow-hidden rounded-[2px] h-[400px] md:h-[560px] cursor-pointer block"
          >
            <Image
              src="/images/home/home-hero-uniforms.webp"
              alt={copy.uniformsAlt}
              fill
              className="object-cover transform scale-100 group-hover:scale-110 transition-transform duration-[2s] ease-[var(--ease-premium)]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-black/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-700" />
            <div className="absolute inset-0 p-8 flex flex-col justify-end z-10">
              <span className="text-[var(--color-primary)] font-bold tracking-widest uppercase text-sm mb-2 opacity-0 -translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100">
                {copy.uniformsEyebrow}
              </span>
              <h3 className="text-white text-4xl md:text-6xl font-black uppercase tracking-tight font-heading">
                {copy.uniformsTitle}
              </h3>
              <p className="text-white/60 text-sm mt-2 font-medium">
                {copy.uniformsMeta}
              </p>
            </div>
          </Link>

          <div className="md:col-span-1 flex flex-col gap-4 md:gap-6">
            <Link
              href="/categorias/infantojuvenil"
              className="group relative overflow-hidden rounded-[2px] h-[200px] md:h-[240px] cursor-pointer block bg-neutral-900"
            >
              <Image
                src="https://cdn.fanmarket.app.br/69c91bd1e039ef33fb14fe33_camisa-jogo-1-infjuv.png"
                alt={copy.kidsAlt}
                fill
                className="object-cover transform scale-100 group-hover:scale-110 transition-transform duration-[2s] ease-[var(--ease-premium)] opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="absolute top-4 left-4 z-20">
                <span className="inline-flex items-center px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest bg-[var(--color-primary)] text-black rounded-[2px]">
                  {copy.kidsBadge}
                </span>
              </div>
              <div className="absolute inset-0 p-6 flex flex-col justify-end z-10">
                <span className="text-[var(--color-primary)] font-bold tracking-widest uppercase text-xs mb-1 opacity-0 -translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100">
                  {copy.kidsEyebrow}
                </span>
                <h3 className="text-white text-2xl font-black uppercase tracking-tight font-heading">
                  {copy.kidsTitle}
                </h3>
              </div>
            </Link>

            <Link
              href="/categorias/casual"
              className="group relative overflow-hidden rounded-[2px] h-[160px] md:h-[150px] cursor-pointer bg-neutral-800 block"
            >
              <Image
                src="/images/home/home-categories-casual.webp"
                alt={copy.casualAlt}
                fill
                className="object-cover transform scale-100 group-hover:scale-110 transition-transform duration-[2s] ease-[var(--ease-premium)] opacity-70"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="absolute inset-0 p-6 flex flex-col justify-end z-10">
                <span className="text-[var(--color-primary)] font-bold tracking-widest uppercase text-xs mb-1 opacity-0 -translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100">
                  {copy.casualEyebrow}
                </span>
                <h3 className="text-white text-2xl font-black uppercase tracking-tight font-heading">
                  {copy.casualTitle}
                </h3>
              </div>
            </Link>

            <Link
              href="/categorias/treino"
              className="group relative overflow-hidden rounded-[2px] h-[160px] md:h-[150px] cursor-pointer bg-neutral-700 block"
            >
              <Image
                src="https://cdn.fanmarket.app.br/69c863fbe810c57450f23e9f_camisa-jogo-1-fem.png"
                alt={copy.trainingAlt}
                fill
                className="object-cover transform scale-100 group-hover:scale-110 transition-transform duration-[2s] ease-[var(--ease-premium)]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="absolute inset-0 p-6 flex flex-col justify-end z-10">
                <span className="text-[var(--color-primary)] font-bold tracking-widest uppercase text-xs mb-1 opacity-0 -translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100">
                  {copy.trainingEyebrow}
                </span>
                <h3 className="text-white text-2xl font-black uppercase tracking-tight font-heading">
                  {copy.trainingTitle}
                </h3>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

