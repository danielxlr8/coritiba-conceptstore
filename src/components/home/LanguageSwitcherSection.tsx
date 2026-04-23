"use client";

import { Reveal } from "@/components/motion/Reveal";
import { useLocale, type Locale } from "@/components/providers/LocaleProvider";
import { repairDeepStrings } from "@/lib/utils";

const languages: Array<{
  locale: Locale;
  flag: string;
  label: string;
  nativeLabel: string;
}> = [
  { locale: "pt", flag: "BR", label: "Português", nativeLabel: "Português" },
  { locale: "en", flag: "US", label: "English", nativeLabel: "Inglês" },
  { locale: "es", flag: "ES", label: "Español", nativeLabel: "Español" },
];

const sectionCopy = {
  pt: {
    eyebrow: "Idioma",
    title: "Escolha Seu Idioma",
    description:
      "Selecione o idioma da experi?ncia e navegue pela campanha no idioma que preferir.",
  },
  en: {
    eyebrow: "Language",
    title: "Choose Your Language",
    description:
      "Select your preferred language and explore the campaign in the way that feels natural to you.",
  },
  es: {
    eyebrow: "Idioma",
    title: "Elige Tu Idioma",
    description:
      "Selecciona tu idioma preferido y explora la campa?a con una experiencia m?s natural para ti.",
  },
} as const;

export function LanguageSwitcherSection() {
  const { locale, setLocale } = useLocale();
  const copy = repairDeepStrings(sectionCopy[locale]);

  return (
    <section className="w-full bg-[#0A0A0A] pt-8 pb-8">
      <div className="container mx-auto max-w-[1440px] px-6">
        <Reveal
          type="fade"
          className="flex flex-col gap-6 rounded-[28px] border border-white/8 bg-white/[0.03] px-6 py-6 backdrop-blur-xl md:flex-row md:items-end md:justify-between md:px-8"
        >
          <div className="max-w-[560px]">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-[var(--color-primary)]">
              {copy.eyebrow}
            </p>
            <h2 className="font-heading text-3xl font-black uppercase tracking-[-0.04em] text-white md:text-4xl">
              {copy.title}
            </h2>
            <p className="mt-3 max-w-[520px] text-sm font-medium leading-relaxed text-white/68 md:text-base">
              {copy.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {languages.map((language) => {
              const isActive = language.locale === locale;

              return (
                <button
                  key={language.locale}
                  type="button"
                  onClick={() => setLocale(language.locale)}
                  className={[
                    "flex min-w-[148px] items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-all duration-300",
                    isActive
                      ? "border-[var(--color-primary)] bg-[var(--color-primary)]/12 text-white"
                      : "border-white/10 bg-white/[0.02] text-white/72 hover:border-white/20 hover:bg-white/[0.05] hover:text-white",
                  ].join(" ")}
                  aria-pressed={isActive}
                >
                  <span className="text-2xl leading-none" aria-hidden="true">
                    {language.flag}
                  </span>
                  <span className="flex flex-col">
                    <span className="text-sm font-bold uppercase tracking-[0.14em]">
                      {language.label}
                    </span>
                    <span className="text-[11px] uppercase tracking-[0.18em] text-white/50">
                      {language.nativeLabel}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
