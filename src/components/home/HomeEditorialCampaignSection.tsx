"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { useLocale, type Locale } from "@/components/providers/LocaleProvider";
import { repairDeepStrings } from "@/lib/utils";

type ChapterKey = "hero" | "culture" | "matchday";

const featuredDropCopy: Record<
  Locale,
  {
    sectionEyebrow: string;
    sectionTitle: string;
    sectionDescription: string;
    heroEyebrow: string;
    heroTitle: string;
    heroProduct: string;
    heroDescription: string;
    cultureEyebrow: string;
    cultureTitle: string;
    cultureDescription: string;
    matchdayEyebrow: string;
    matchdayTitle: string;
    matchdayDescription: string;
    cta: string;
    sideCta: string;
    modalClose: string;
    chapters: Record<
      ChapterKey,
      {
        eyebrow: string;
        title: string;
        subtitle: string;
        description: string;
        details: [string, string, string];
        image: string;
        alt: string;
      }
    >;
  }
> = {
  pt: {
    sectionEyebrow: "Editorial Exclusivo",
    sectionTitle: "A Alma do Couto",
    sectionDescription:
      "Mais que uniforme. Uma campanha para vestir pertencimento, cidade e noite de jogo com peso simbólico.",
    heroEyebrow: "Capítulo Principal",
    heroTitle: "Vestida Pela História",
    heroProduct: "Camisa I 26/27",
    heroDescription:
      "Feita para a arquibancada e lapidada pela tradição. A peça central da temporada chega com presença, contraste e uma identidade que não pede licença.",
    cultureEyebrow: "Cidade E Cultura",
    cultureTitle: "A Camisa Fora Do Estádio",
    cultureDescription:
      "Na rua, no concreto e no frio de Curitiba, a campanha respira futebol com linguagem urbana e postura premium.",
    matchdayEyebrow: "Noite De Jogo",
    matchdayTitle: "Quando A Bola Rola",
    matchdayDescription:
      "Luz de estádio, tensão no ar e o verde carregado por quem entra em campo para decidir a história da noite.",
    cta: "Explorar Campanha",
    sideCta: "Ver História",
    modalClose: "Fechar campanha",
    chapters: {
      hero: {
        eyebrow: "Capítulo Principal",
        title: "Vestida Pela História",
        subtitle: "Camisa I 26/27",
        description:
          "O lançamento principal da temporada nasce como peça de identidade. É a camisa que traduz arquibancada, tradição e a força visual do verde em sua forma mais emblemática.",
        details: [
          "Presença de campanha com leitura premium e institucional.",
          "Construída para carregar pertencimento antes de vender produto.",
          "Imagem central da temporada dentro e fora do estádio.",
        ],
        image: "/images/home/home-editorial-campaign-primary.webp",
        alt: "Camisa I 26/27",
      },
      culture: {
        eyebrow: "Cidade E Cultura",
        title: "A Camisa Fora Do Estádio",
        subtitle: "Camisa III 26/27",
        description:
          "Este capítulo posiciona a camisa como peça cultural. O foco sai do jogo e entra na rua, no concreto, no frio e na atmosfera urbana que também fazem parte da identidade coxa-branca.",
        details: [
          "Leitura mais editorial e lifestyle da coleção.",
          "Conexão entre clube, cidade e linguagem contemporânea.",
          "Campanha pensada para presença urbana com sofisticação.",
        ],
        image: "/images/home/home-editorial-campaign-secondary.webp",
        alt: "Camisa III 26/27",
      },
      matchday: {
        eyebrow: "Noite De Jogo",
        title: "Quando A Bola Rola",
        subtitle: "Camisa II 26/27",
        description:
          "Aqui a campanha entra em clima de estádio. É o bloco de tensão, luz, energia e decisão. A peça aparece conectada ao momento em que o ritual do jogo ganha vida.",
        details: [
          "Atmosfera de campo e intensidade competitiva.",
          "Narrativa visual orientada por luz, movimento e presença.",
          "Uma leitura que valoriza o uniforme no contexto da partida.",
        ],
        image: "/images/home/home-editorial-campaign-tertiary.webp",
        alt: "Camisa II 26/27",
      },
    },
  },
  en: {
    sectionEyebrow: "Exclusive Editorial",
    sectionTitle: "The Soul Of Couto",
    sectionDescription:
      "More than a jersey. A campaign built to sell belonging, city energy and match-night identity before product.",
    heroEyebrow: "Main Chapter",
    heroTitle: "Worn By History",
    heroProduct: "Jersey I 26/27",
    heroDescription:
      "Made for the stands and shaped by tradition. The season's main piece arrives with presence, contrast and an identity that never asks for permission.",
    cultureEyebrow: "City And Culture",
    cultureTitle: "The Jersey Beyond The Stadium",
    cultureDescription:
      "On the street, in the concrete and inside Curitiba's cold atmosphere, the campaign frames football through an elevated urban lens.",
    matchdayEyebrow: "Match Night",
    matchdayTitle: "When The Ball Rolls",
    matchdayDescription:
      "Stadium lights, tension in the air and green carried by those who step on the pitch to decide the night.",
    cta: "Explore Campaign",
    sideCta: "View Story",
    modalClose: "Close campaign",
    chapters: {
      hero: {
        eyebrow: "Main Chapter",
        title: "Worn By History",
        subtitle: "Jersey I 26/27",
        description:
          "The main launch of the season is positioned as an identity piece. It translates the stands, tradition and the power of green in its most emblematic form.",
        details: [
          "Premium campaign presence with an institutional tone.",
          "Built to create belonging before it sells product.",
          "The season's leading image inside and beyond the stadium.",
        ],
        image: "/images/home/home-editorial-campaign-primary.webp",
        alt: "Jersey I 26/27",
      },
      culture: {
        eyebrow: "City And Culture",
        title: "The Jersey Beyond The Stadium",
        subtitle: "Jersey III 26/27",
        description:
          "This chapter treats the jersey as a cultural piece. The focus moves from the pitch to the street, the concrete and the cold atmosphere that also shape Coxa identity.",
        details: [
          "A more editorial and lifestyle reading of the collection.",
          "Connection between club, city and contemporary language.",
          "Campaign thinking built for urban presence with sophistication.",
        ],
        image: "/images/home/home-editorial-campaign-secondary.webp",
        alt: "Jersey III 26/27",
      },
      matchday: {
        eyebrow: "Match Night",
        title: "When The Ball Rolls",
        subtitle: "Jersey II 26/27",
        description:
          "Here the campaign enters full stadium mode. It is the chapter of tension, light, energy and decision, with the piece connected to the ritual moment of the game.",
        details: [
          "Pitch atmosphere and competitive intensity.",
          "Visual narrative shaped by light, motion and presence.",
          "A reading that values the jersey inside the context of matchday.",
        ],
        image: "/images/home/home-editorial-campaign-tertiary.webp",
        alt: "Jersey II 26/27",
      },
    },
  },
  es: {
    sectionEyebrow: "Editorial Exclusivo",
    sectionTitle: "El Alma Del Couto",
    sectionDescription:
      "Más que una camiseta. Una campaña pensada para vender pertenencia, ciudad y noche de partido antes que producto.",
    heroEyebrow: "Capítulo Principal",
    heroTitle: "Vestida Por La Historia",
    heroProduct: "Camiseta I 26/27",
    heroDescription:
      "Hecha para la tribuna y moldeada por la tradición. La pieza central de la temporada llega con presencia, contraste e identidad propia.",
    cultureEyebrow: "Ciudad Y Cultura",
    cultureTitle: "La Camiseta Fuera Del Estadio",
    cultureDescription:
      "En la calle, en el concreto y en el frío de Curitiba, la campaña lleva el fútbol a un lenguaje urbano premium.",
    matchdayEyebrow: "Noche De Partido",
    matchdayTitle: "Cuando Rueda La Pelota",
    matchdayDescription:
      "Luz de estadio, tensión en el aire y el verde llevado por quienes entran al campo para decidir la historia de la noche.",
    cta: "Explorar Campaña",
    sideCta: "Ver Historia",
    modalClose: "Cerrar campaña",
    chapters: {
      hero: {
        eyebrow: "Capítulo Principal",
        title: "Vestida Por La Historia",
        subtitle: "Camiseta I 26/27",
        description:
          "El lanzamiento principal de la temporada se presenta como una pieza de identidad. Traduce tribuna, tradición y el peso visual del verde en su forma más emblemática.",
        details: [
          "Presencia premium con tono institucional de campaña.",
          "Construida para generar pertenencia antes de vender producto.",
          "Imagen principal de la temporada dentro y fuera del estadio.",
        ],
        image: "/images/home/home-editorial-campaign-primary.webp",
        alt: "Camiseta I 26/27",
      },
      culture: {
        eyebrow: "Ciudad Y Cultura",
        title: "La Camiseta Fuera Del Estadio",
        subtitle: "Camiseta III 26/27",
        description:
          "Este capítulo trata la camiseta como pieza cultural. El foco sale del juego y entra en la calle, el concreto y el frío que también forman parte de la identidad coxa.",
        details: [
          "Lectura más editorial y lifestyle de la colección.",
          "Conexión entre club, ciudad y lenguaje contemporáneo.",
          "Campaña pensada para presencia urbana con sofisticación.",
        ],
        image: "/images/home/home-editorial-campaign-secondary.webp",
        alt: "Camiseta III 26/27",
      },
      matchday: {
        eyebrow: "Noche De Partido",
        title: "Cuando Rueda La Pelota",
        subtitle: "Camiseta II 26/27",
        description:
          "Aquí la campaña entra en clima de estadio. Es el bloque de tensión, luz, energía y decisión, con la pieza conectada al ritual del partido.",
        details: [
          "Atmósfera de campo e intensidad competitiva.",
          "Narrativa visual guiada por luz, movimiento y presencia.",
          "Una lectura que valora la camiseta en el contexto del juego.",
        ],
        image: "/images/home/home-editorial-campaign-tertiary.webp",
        alt: "Camiseta II 26/27",
      },
    },
  },
};

export function HomeEditorialCampaignSection() {
  const { locale } = useLocale();
  const [activeChapter, setActiveChapter] = useState<ChapterKey | null>(null);
  const copy = repairDeepStrings(featuredDropCopy[locale]);
  const activeContent = useMemo(
    () => (activeChapter ? copy.chapters[activeChapter] : null),
    [activeChapter, copy.chapters],
  );

  return (
    <section
      id="featured-drop"
      className="w-full bg-[#0A0A0A] pt-32 pb-32 md:pt-40"
    >
      <div className="container mx-auto max-w-[1440px] px-6">
        <Reveal type="clip" direction="up" className="mb-12 md:mb-16">
          <div className="max-w-[900px]">
            <h2 className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-[var(--color-primary)] md:text-base">
              {copy.sectionEyebrow}
            </h2>
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-8">
              <h3 className="font-heading text-4xl font-black uppercase leading-none tracking-tighter text-white md:text-6xl">
                {copy.sectionTitle}
              </h3>
              <p className="max-w-[440px] text-sm font-medium leading-relaxed text-white/58 md:text-base">
                {copy.sectionDescription}
              </p>
            </div>
          </div>
        </Reveal>

        <div
          id="featured-drop-cards"
          className="scroll-mt-24 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-12"
        >
          <Reveal
            type="fade"
            delay={0.1}
            className="group relative col-span-1 h-[520px] cursor-pointer overflow-hidden rounded-[32px] md:col-span-2 lg:col-span-8 lg:h-[760px]"
            onClick={() => setActiveChapter("hero")}
          >
            <div className="absolute inset-0 z-0 bg-black">
              <Image
                src="/images/home/home-editorial-campaign-primary.webp"
                alt={copy.heroProduct}
                fill
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="h-full w-full object-cover object-center transition-transform duration-[1600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
              />
            </div>

            <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#050505] via-[#050505]/56 to-[#050505]/12 transition-opacity duration-700 group-hover:opacity-95" />
            <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_18%_78%,rgba(93,235,99,0.16),transparent_34%)] opacity-80 transition-opacity duration-700 group-hover:opacity-100" />
            <div className="absolute inset-y-0 left-8 z-10 hidden w-px bg-white/10 lg:block" />

            <div className="absolute bottom-0 left-0 z-20 flex w-full max-w-[760px] flex-col items-start p-8 transition-transform duration-700 ease-out group-hover:-translate-y-2 lg:p-12">
              <span className="mb-4 text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--color-primary)]">
                {copy.heroEyebrow}
              </span>
              <h4 className="mb-3 max-w-[12ch] font-heading text-4xl font-black uppercase leading-[0.92] tracking-[-0.05em] text-white md:text-6xl lg:text-7xl">
                {copy.heroTitle}
              </h4>
              <p className="mb-4 font-heading text-xl font-black uppercase tracking-[-0.04em] text-white md:text-3xl">
                {copy.heroProduct}
              </p>
              <p className="mb-8 max-w-[540px] text-base font-medium leading-relaxed text-white/76 md:text-lg">
                {copy.heroDescription}
              </p>

              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setActiveChapter("hero");
                }}
                className="rounded-full border border-white/10 bg-white px-8 py-3 text-sm font-bold uppercase tracking-[0.18em] text-black transition-all duration-500 ease-out group-hover:-translate-y-0.5 group-hover:border-[var(--color-primary)]/40 group-hover:bg-[var(--color-primary)] group-hover:text-black"
              >
                {copy.cta}
              </button>
            </div>
          </Reveal>

          <div className="col-span-1 grid grid-cols-1 gap-4 md:col-span-2 md:grid-cols-2 md:gap-6 lg:col-span-4 lg:flex lg:flex-col">
            <Reveal
              type="fade"
              delay={0.25}
              className="group relative h-[320px] cursor-pointer overflow-hidden rounded-[32px] md:h-[370px] lg:h-[calc(380px-12px)]"
              onClick={() => setActiveChapter("culture")}
            >
              <div className="absolute inset-0 z-0 bg-black">
                <Image
                  src="/images/home/home-editorial-campaign-secondary.webp"
                  alt={copy.cultureTitle}
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="h-full w-full object-cover object-center transition-transform duration-[1500ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
                />
              </div>
              <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#050505] via-[#050505]/52 to-transparent transition-opacity duration-700 group-hover:opacity-95" />
              <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_20%_18%,rgba(93,235,99,0.14),transparent_34%)] opacity-70 transition-opacity duration-700 group-hover:opacity-100" />

              <div className="absolute bottom-0 left-0 z-20 flex w-full flex-col items-start p-6 transition-transform duration-700 ease-out group-hover:-translate-y-1.5 lg:p-8">
                <span className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--color-primary)]">
                  {copy.cultureEyebrow}
                </span>
                <h4 className="mb-3 max-w-[12ch] font-heading text-2xl font-black uppercase leading-[0.96] tracking-[-0.05em] text-white lg:text-[2.25rem]">
                  {copy.cultureTitle}
                </h4>
                <p className="mb-5 max-w-[280px] text-sm font-medium leading-relaxed text-white/76 lg:text-[15px]">
                  {copy.cultureDescription}
                </p>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    setActiveChapter("culture");
                  }}
                  className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-primary)]"
                >
                  {copy.sideCta}
                </button>
              </div>
            </Reveal>

            <Reveal
              type="fade"
              delay={0.4}
              className="group relative h-[320px] cursor-pointer overflow-hidden rounded-[32px] md:h-[370px] lg:h-[calc(380px-12px)]"
              onClick={() => setActiveChapter("matchday")}
            >
              <div className="absolute inset-0 z-0 bg-black">
                <Image
                  src="/images/home/home-editorial-campaign-tertiary.webp"
                  alt={copy.matchdayTitle}
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="h-full w-full object-cover object-center transition-transform duration-[1500ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
                />
              </div>
              <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#050505] via-[#050505]/58 to-transparent transition-opacity duration-700 group-hover:opacity-95" />
              <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_78%_18%,rgba(93,235,99,0.14),transparent_34%)] opacity-70 transition-opacity duration-700 group-hover:opacity-100" />

              <div className="absolute bottom-0 left-0 z-20 flex w-full flex-col items-start p-6 transition-transform duration-700 ease-out group-hover:-translate-y-1.5 lg:p-8">
                <span className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--color-primary)]">
                  {copy.matchdayEyebrow}
                </span>
                <h4 className="mb-3 max-w-[12ch] font-heading text-2xl font-black uppercase leading-[0.96] tracking-[-0.05em] text-white lg:text-[2.25rem]">
                  {copy.matchdayTitle}
                </h4>
                <p className="mb-5 max-w-[280px] text-sm font-medium leading-relaxed text-white/76 lg:text-[15px]">
                  {copy.matchdayDescription}
                </p>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    setActiveChapter("matchday");
                  }}
                  className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-primary)]"
                >
                  {copy.sideCta}
                </button>
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {activeContent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.24 }}
            className="fixed inset-0 z-[120] flex items-center justify-center bg-black/72 px-4 py-6 backdrop-blur-md"
            onClick={() => setActiveChapter(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.985 }}
              transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
              className="relative grid max-h-[88vh] w-full max-w-[1180px] overflow-hidden rounded-[32px] border border-white/10 bg-[#090909] lg:grid-cols-[1.08fr_0.92fr]"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                aria-label={copy.modalClose}
                onClick={() => setActiveChapter(null)}
                className="absolute right-4 top-4 z-30 flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-black/45 text-white/78 transition-colors duration-300 hover:text-white"
              >
                <X size={18} />
              </button>

              <div className="relative min-h-[320px] overflow-hidden lg:min-h-[680px]">
                <Image
                  src={activeContent.image}
                  alt={activeContent.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 52vw"
                  className="h-full w-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent lg:bg-gradient-to-r lg:from-black/40 lg:via-transparent lg:to-transparent" />
              </div>

              <div className="relative flex max-h-[88vh] flex-col overflow-y-auto p-7 md:p-10 lg:p-12">
                <span className="mb-4 text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--color-primary)]">
                  {activeContent.eyebrow}
                </span>
                <h4 className="max-w-[12ch] font-heading text-4xl font-black uppercase leading-[0.92] tracking-[-0.05em] text-white md:text-6xl">
                  {activeContent.title}
                </h4>
                <p className="mt-4 font-heading text-xl font-black uppercase tracking-[-0.04em] text-white md:text-3xl">
                  {activeContent.subtitle}
                </p>
                <p className="mt-6 max-w-[560px] text-base font-medium leading-relaxed text-white/72 md:text-lg">
                  {activeContent.description}
                </p>

                <div className="mt-8 grid gap-3">
                  {activeContent.details.map((item) => (
                    <div
                      key={item}
                      className="rounded-[20px] border border-white/8 bg-white/[0.03] px-5 py-4"
                    >
                      <p className="text-sm font-medium leading-relaxed text-white/78 md:text-[15px]">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
