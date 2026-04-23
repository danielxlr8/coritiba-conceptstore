"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { motion } from "framer-motion";
import { ProductCard } from "@/components/commerce/catalog/ProductCard";
import { Reveal } from "@/components/motion/Reveal";
import { PRODUCTS } from "@/data/productCatalog";
import { useLocale, type Locale } from "@/components/providers/LocaleProvider";
import { repairDeepStrings } from "@/lib/utils";

function getItemsPerView() {
  if (typeof window === "undefined") return 3;

  const width = window.innerWidth;
  if (width < 640) return 1;
  if (width < 1024) return 2;
  return 3;
}

const releasesCopy: Record<
  Locale,
  {
    eyebrow: string;
    title: string;
    description: string;
    prevLabel: string;
    nextLabel: string;
    slideLabel: string;
  }
> = {
  pt: {
    eyebrow: "Conexão Com Produto",
    title: "Peças da campanha",
    description:
      "Depois da narrativa, entram as peças. Seleção enxuta, imagens grandes e presença suficiente para manter a campanha premium.",
    prevLabel: "Peça anterior",
    nextLabel: "Próxima peça",
    slideLabel: "Ir para peça",
  },
  en: {
    eyebrow: "Product Connection",
    title: "Pieces from the campaign",
    description:
      "After the narrative, the pieces step in. A reduced selection, large imagery and enough breathing room to keep the campaign premium.",
    prevLabel: "Previous piece",
    nextLabel: "Next piece",
    slideLabel: "Go to piece",
  },
  es: {
    eyebrow: "Conexión Con Producto",
    title: "Piezas de la campaña",
    description:
      "Después de la narrativa llegan las piezas. Una selección reducida, imágenes grandes y el espacio justo para mantener el tono premium.",
    prevLabel: "Pieza anterior",
    nextLabel: "Siguiente pieza",
    slideLabel: "Ir a la pieza",
  },
};

export function HomeLatestReleasesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(getItemsPerView);
  const isAnimating = useRef(false);
  const { locale } = useLocale();
  const copy = repairDeepStrings(releasesCopy[locale]);

  const totalItems = PRODUCTS.length;
  const maxIndex = Math.max(0, totalItems - itemsPerView);

  useEffect(() => {
    const handleResize = () => {
      const newItems = getItemsPerView();
      setItemsPerView(newItems);
      setCurrentIndex((prev) =>
        Math.min(prev, Math.max(0, totalItems - newItems)),
      );
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [totalItems]);

  const animateToIndex = useCallback(
    (index: number) => {
      if (!trackRef.current || isAnimating.current) return;

      const clampedIndex = Math.max(0, Math.min(index, maxIndex));
      isAnimating.current = true;

      const card = trackRef.current.children[0] as HTMLElement | undefined;
      if (!card) return;

      const cardWidth = card.offsetWidth;
      const gap = window.innerWidth < 768 ? 16 : 24;
      const offset = clampedIndex * (cardWidth + gap);

      gsap.to(trackRef.current, {
        x: -offset,
        duration: 0.85,
        ease: "power3.out",
        onComplete: () => {
          isAnimating.current = false;
        },
      });

      setCurrentIndex(clampedIndex);
    },
    [maxIndex],
  );

  const goNext = useCallback(() => {
    animateToIndex(currentIndex + 1);
  }, [animateToIndex, currentIndex]);

  const goPrev = useCallback(() => {
    animateToIndex(currentIndex - 1);
  }, [animateToIndex, currentIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (!inView) return;

      if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goNext, goPrev]);

  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < maxIndex;
  const totalPages = maxIndex + 1;

  return (
    <section
      ref={sectionRef}
      id="lancamentos"
      className="relative scroll-mt-24 flex w-full flex-col justify-center overflow-hidden border-t border-white/5 bg-[var(--color-surface)] py-20 md:py-28"
    >
      <div className="container mx-auto mb-10 px-6 md:mb-14">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <Reveal type="clip" direction="up" className="max-w-[760px]">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-[var(--color-primary)]">
              {copy.eyebrow}
            </p>
            <h2 className="font-heading text-fluid-h2 font-black uppercase leading-none tracking-[-0.05em] text-white">
              {copy.title}
            </h2>
            <p className="mt-4 max-w-[520px] text-sm font-medium leading-relaxed text-white/56 md:text-base">
              {copy.description}
            </p>
          </Reveal>

          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden items-center gap-2 mr-2 sm:flex">
              <span className="font-heading text-lg font-bold tabular-nums text-white">
                {String(currentIndex + 1).padStart(2, "0")}
              </span>
              <span className="h-[1px] w-8 bg-white/30"></span>
              <span className="font-heading text-lg tabular-nums text-white/40">
                {String(totalItems).padStart(2, "0")}
              </span>
            </div>

            <button
              onClick={goPrev}
              disabled={!canGoPrev}
              aria-label={copy.prevLabel}
              className="releases-nav-btn group"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                className="transition-transform duration-300 group-hover:-translate-x-0.5 group-active:-translate-x-1"
              >
                <path
                  d="M13 4L7 10L13 16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <button
              onClick={goNext}
              disabled={!canGoNext}
              aria-label={copy.nextLabel}
              className="releases-nav-btn group"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-active:translate-x-1"
              >
                <path
                  d="M7 4L13 10L7 16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden px-6">
        <div ref={trackRef} className="flex w-max gap-4 md:gap-6">
          {PRODUCTS.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.8,
                delay: index * 0.12,
                ease: [0.23, 1, 0.32, 1],
              }}
              className="h-[65vh] min-h-[420px] max-h-[650px] w-[85vw] shrink-0 sm:w-[45vw] lg:w-[calc((100vw-48px-48px)/3)]"
            >
              <ProductCard product={item} className="h-full w-full" />
            </motion.div>
          ))}
        </div>
      </div>

      <div className="container mx-auto mt-8 px-6 md:mt-12">
        <div className="flex items-center gap-4">
          <div className="h-[2px] flex-1 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-[var(--color-primary)] transition-all duration-700 ease-[var(--ease-premium)]"
              style={{
                width: `${((currentIndex + 1) / totalPages) * 100}%`,
              }}
            />
          </div>

          <div className="flex items-center gap-1.5 sm:hidden">
            {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
              const isActive = i === Math.min(currentIndex, 4);
              return (
                <button
                  key={i}
                  onClick={() => animateToIndex(i)}
                  aria-label={`${copy.slideLabel} ${i + 1}`}
                  className={`rounded-full transition-all duration-500 ${
                    isActive
                      ? "h-1.5 w-6 bg-[var(--color-primary)]"
                      : "h-1.5 w-1.5 bg-white/25 hover:bg-white/40"
                  }`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}


