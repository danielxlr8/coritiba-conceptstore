"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { Apple, ArrowUpRight, Play, Smartphone, X } from "lucide-react";
import { useLocale, type Locale } from "@/components/providers/LocaleProvider";
import { repairDeepStrings } from "@/lib/utils";
import Lottie from "lottie-react";
import youtubeIconData from "../../../public/animations/icons/youtube-icon.json";

const footerCopy: Record<
  Locale,
  {
    newsletterTitle: [string, string];
    newsletterPlaceholder: string;
    newsletterSubmit: string;
    categoriesTitle: string;
    categories: [string, string, string, string];
    helpTitle: string;
    help: [string, string, string, string];
    youtubeTitle: string;
    youtubeAria: string;
    youtubeEyebrow: string;
    youtubeHeadline: string;
    youtubeCaption: string;
    appHeadline: [string, string];
    appDescription: string;
    appCta: string;
    appMeta: string;
    copyright: string;
    appClose: string;
    appChooserTitle: string;
    appChooserDescription: string;
    androidSubtitle: string;
    iosSubtitle: string;
    continueLabel: string;
  }
> = {
  pt: {
    newsletterTitle: ["Assine nossa", "Newsletter"],
    newsletterPlaceholder: "Seu e-mail...",
    newsletterSubmit: "Enviar",
    categoriesTitle: "Categorias",
    categories: ["Uniformes de Jogo", "Linha Treino", "Acessórios", "Outlet"],
    helpTitle: "Ajuda",
    help: ["FAQ", "Rastreio", "Trocas & Devoluções", "Contato"],
    youtubeTitle: "Acompanhe também no YouTube",
    youtubeAria: "Reproduzir vídeo de bastidores no YouTube",
    youtubeEyebrow: "Conteúdo Exclusivo",
    youtubeHeadline: "Bastidores do Coxa",
    youtubeCaption: "Acompanhe os bastidores exclusivos no nosso canal.",
    appHeadline: ["O app oficial", "na palma da mão"],
    appDescription:
      "Um único acesso para notícias, benefícios e a rotina do Coxa no seu celular.",
    appCta: "Escolher dispositivo",
    appMeta: "Android ou iPhone",
    copyright: "Design Premium.",
    appClose: "Fechar seletor do app",
    appChooserTitle: "Escolha seu dispositivo",
    appChooserDescription:
      "Selecione a plataforma e siga direto para a loja oficial do app.",
    androidSubtitle: "Abrir na Google Play",
    iosSubtitle: "Abrir na App Store",
    continueLabel: "Continuar",
  },
  en: {
    newsletterTitle: ["Join our", "Newsletter"],
    newsletterPlaceholder: "Your email...",
    newsletterSubmit: "Submit",
    categoriesTitle: "Categories",
    categories: ["Match Jerseys", "Training Line", "Accessories", "Outlet"],
    helpTitle: "Help",
    help: ["FAQ", "Tracking", "Returns & Exchanges", "Contact"],
    youtubeTitle: "Follow us on YouTube too",
    youtubeAria: "Play behind-the-scenes video on YouTube",
    youtubeEyebrow: "Exclusive Content",
    youtubeHeadline: "Behind Coxa",
    youtubeCaption:
      "Follow exclusive behind-the-scenes content on our channel.",
    appHeadline: ["The official app", "in your hand"],
    appDescription:
      "A single access point for news, benefits and the Coxa routine on your phone.",
    appCta: "Choose device",
    appMeta: "Android or iPhone",
    copyright: "Premium Design.",
    appClose: "Close app selector",
    appChooserTitle: "Choose your device",
    appChooserDescription:
      "Select your platform and go straight to the official app store.",
    androidSubtitle: "Open in Google Play",
    iosSubtitle: "Open in the App Store",
    continueLabel: "Continue",
  },
  es: {
    newsletterTitle: ["Suscríbete a nuestra", "Newsletter"],
    newsletterPlaceholder: "Tu e-mail...",
    newsletterSubmit: "Enviar",
    categoriesTitle: "Categorías",
    categories: [
      "Uniformes de Juego",
      "Línea de Entreno",
      "Accesorios",
      "Outlet",
    ],
    helpTitle: "Ayuda",
    help: ["FAQ", "Rastreo", "Cambios y Devoluciones", "Contacto"],
    youtubeTitle: "Síguenos también en YouTube",
    youtubeAria: "Reproducir video de bastidores en YouTube",
    youtubeEyebrow: "Contenido Exclusivo",
    youtubeHeadline: "Bastidores del Coxa",
    youtubeCaption: "Sigue los bastidores exclusivos en nuestro canal.",
    appHeadline: ["La app oficial", "en la palma de tu mano"],
    appDescription:
      "Un único acceso para noticias, beneficios y la rutina del Coxa en tu celular.",
    appCta: "Elegir dispositivo",
    appMeta: "Android o iPhone",
    copyright: "Diseño Premium.",
    appClose: "Cerrar selector de la app",
    appChooserTitle: "Elige tu dispositivo",
    appChooserDescription:
      "Selecciona la plataforma y ve directo a la tienda oficial de la app.",
    androidSubtitle: "Abrir en Google Play",
    iosSubtitle: "Abrir en App Store",
    continueLabel: "Continuar",
  },
};

export function SiteFooter() {
  const { locale } = useLocale();
  const [shouldLoadYoutube, setShouldLoadYoutube] = useState(false);
  const [isAppChooserOpen, setIsAppChooserOpen] = useState(false);
  const copy = repairDeepStrings(footerCopy[locale]);

  const appLinks = {
    ios: "https://apps.apple.com/app/coxa-id-coritiba-oficial-app/id1541896243",
    android:
      "https://play.google.com/store/apps/details?id=com.sportm.coritiba",
  };

  return (
    <footer
      className="overflow-hidden border-t border-white/5 bg-black pb-12 text-white"
      style={{ paddingTop: "clamp(40px, 5vw, 80px)" }}
    >
      <div className="container mx-auto px-6">
        <div className="mb-32 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12 lg:gap-8 xl:gap-12">
          <div className="lg:col-span-4 lg:pr-8">
            <Reveal type="clip" direction="up">
              <h2 className="mb-6 flex items-center gap-4 text-4xl font-black uppercase tracking-tighter md:text-5xl">
                <div>
                  {copy.newsletterTitle[0]} <br />
                  <span className="text-[var(--color-primary)]">
                    {copy.newsletterTitle[1]}
                  </span>
                </div>
                <Image
                  src="https://config.fanbase.com.br/fanpage/54/img/logo.png"
                  alt="Coxa Logo"
                  width={60}
                  height={60}
                  className="h-auto w-[60px] object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                />
              </h2>
              <form className="relative mt-8 flex border-b border-white/20 pb-2 group">
                <input
                  type="email"
                  autoComplete="email"
                  placeholder={copy.newsletterPlaceholder}
                  className="newsletter-input w-full border-none bg-transparent text-lg text-[var(--color-primary)] outline-none placeholder:text-white/30"
                />
                <button
                  type="button"
                  className="text-sm font-bold uppercase tracking-widest transition-colors group-hover:text-[var(--color-primary)]"
                >
                  {copy.newsletterSubmit}
                </button>
              </form>
            </Reveal>
          </div>

          <div className="lg:col-span-2">
            <Reveal type="fade" delay={0.2} direction="up">
              <h4 className="mb-6 text-sm font-bold uppercase tracking-widest text-white/50">
                {copy.categoriesTitle}
              </h4>
              <ul className="flex flex-col gap-4 text-lg">
                <li>
                  <Link
                    href="/categorias/uniformes"
                    className="transition-colors hover:text-[var(--color-primary)]"
                  >
                    {copy.categories[0]}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/categorias/treino"
                    className="transition-colors hover:text-[var(--color-primary)]"
                  >
                    {copy.categories[1]}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/categorias/casual"
                    className="transition-colors hover:text-[var(--color-primary)]"
                  >
                    {copy.categories[2]}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/categorias/casual"
                    className="transition-colors hover:text-[var(--color-primary)]"
                  >
                    {copy.categories[3]}
                  </Link>
                </li>
              </ul>
            </Reveal>
          </div>

          <div className="lg:col-span-2">
            <Reveal type="fade" delay={0.4} direction="up">
              <h4 className="mb-6 text-sm font-bold uppercase tracking-widest text-white/50">
                {copy.helpTitle}
              </h4>
              <ul className="flex flex-col gap-4 text-lg">
                <li>
                  <Link
                    href="/login"
                    className="transition-colors hover:text-[var(--color-primary)]"
                  >
                    {copy.help[0]}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/rastreio"
                    className="transition-colors hover:text-[var(--color-primary)]"
                  >
                    {copy.help[1]}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/checkout"
                    className="transition-colors hover:text-[var(--color-primary)]"
                  >
                    {copy.help[2]}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/login"
                    className="transition-colors hover:text-[var(--color-primary)]"
                  >
                    {copy.help[3]}
                  </Link>
                </li>
              </ul>
            </Reveal>
          </div>

          <div className="mt-8 flex flex-col gap-6 md:col-span-2 lg:col-span-4 lg:mt-0">
            <Reveal type="fade" delay={0.6} direction="up">
              <div className="mb-6 flex items-center gap-3">
                <div className="relative -ml-1 flex h-[38px] w-[38px] shrink-0 items-center justify-center">
                  <Lottie
                    animationData={youtubeIconData}
                    loop={true}
                    className="h-full w-full scale-[1.7]"
                    style={{ background: "transparent" }}
                  />
                </div>
                <h4 className="group relative pt-1 font-heading text-xl font-black uppercase tracking-widest text-white md:text-2xl">
                  <span className="relative z-10 bg-gradient-to-br from-green-900 to-green-600 bg-clip-text text-transparent drop-shadow-md">
                    {copy.youtubeTitle}
                  </span>
                  <span className="absolute -inset-1 -z-10 block rounded blur-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-red-500/20"></span>
                </h4>
              </div>

              <div className="group relative aspect-video w-full overflow-hidden rounded-[4px] border border-white/10 bg-neutral-900 shadow-2xl">
                {shouldLoadYoutube ? (
                  <iframe
                    className="h-full w-full"
                    src="https://www.youtube.com/embed/VcXcceacCng?si=0KeojgR0QBtXapZ9"
                    title="Coritiba Bastidores"
                    frameBorder="0"
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShouldLoadYoutube(true)}
                    className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(69,209,94,0.18),_transparent_42%),linear-gradient(135deg,_#111_0%,_#050505_100%)] text-white transition-colors duration-300 hover:bg-[#111]"
                    aria-label={copy.youtubeAria}
                  >
                    <div className="absolute inset-0 bg-[linear-gradient(to_top,_rgba(0,0,0,0.82),_rgba(0,0,0,0.18))]" />
                    <div className="relative z-10 flex flex-col items-center gap-4 px-6 text-center">
                      <span className="flex h-16 w-16 items-center justify-center rounded-full border border-[var(--color-primary)]/40 bg-[var(--color-primary)]/12 text-[var(--color-primary)] shadow-[0_0_30px_rgba(69,209,94,0.18)] transition-transform duration-300 group-hover:scale-105">
                        <Play size={24} fill="currentColor" />
                      </span>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--color-primary)]">
                          {copy.youtubeEyebrow}
                        </p>
                        <p className="mt-2 font-heading text-2xl font-black uppercase tracking-wide">
                          {copy.youtubeHeadline}
                        </p>
                      </div>
                    </div>
                  </button>
                )}
              </div>
              <p className="mt-3 ml-1 flex items-center gap-1.5 text-xs text-white/40">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--color-primary)]" />
                {copy.youtubeCaption}
              </p>
            </Reveal>

            <Reveal type="fade" delay={0.7} direction="up">
              <div className="group relative mt-2 flex min-h-[300px] w-full flex-col justify-between overflow-hidden rounded-[18px] border border-[#2e7d32]/35 bg-[linear-gradient(135deg,#0c3013_0%,#115a22_45%,#0a2110_100%)] p-6 shadow-[0_28px_70px_rgba(0,0,0,0.35)] transition-transform duration-300 hover:-translate-y-1">
                <div className="pointer-events-none absolute inset-y-0 right-0 w-[46%] min-w-[210px] translate-x-[8%] transition-transform duration-500 group-hover:translate-x-[5%]">
                  <div className="h-full w-full bg-[url('/images/home/home-membership-app.webp')] bg-contain bg-right-bottom bg-no-repeat opacity-95 drop-shadow-[0_20px_40px_rgba(0,0,0,0.35)]" />
                </div>
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(96,232,97,0.18),transparent_36%)]" />

                <div className="relative z-10 max-w-[58%] min-w-[220px]">
                  <div className="mb-4 inline-flex items-center gap-2 rounded border border-white/5 bg-black/40 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-[var(--color-primary)] backdrop-blur-sm">
                    <Smartphone size={12} className="text-white/80" /> Coxa ID
                  </div>
                  <h3 className="max-w-[260px] font-heading text-[clamp(28px,3.2vw,42px)] font-black uppercase leading-[0.92] tracking-tight text-white drop-shadow-lg">
                    {copy.appHeadline[0]}
                    <span className="mt-1 block text-[var(--color-primary)] drop-shadow-[0_0_12px_rgba(69,209,94,0.25)]">
                      {copy.appHeadline[1]}
                    </span>
                  </h3>
                  <p className="mt-4 max-w-[260px] text-sm leading-relaxed text-white/60">
                    {copy.appDescription}
                  </p>
                </div>

                <div className="relative z-10 mt-8 flex flex-col items-start gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAppChooserOpen(true)}
                    className="group/cta inline-flex h-12 items-center gap-3 rounded-full border border-white/10 bg-black/30 px-5 text-[11px] font-bold uppercase tracking-[0.22em] text-white transition-all duration-300 hover:border-[var(--color-primary)]/45 hover:bg-black/40"
                  >
                    <span>{copy.appCta}</span>
                    <ArrowUpRight
                      size={16}
                      className="text-[var(--color-primary)] transition-transform duration-300 group-hover/cta:translate-x-1 group-hover/cta:-translate-y-1"
                    />
                  </button>
                  <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/45">
                    {copy.appMeta}
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between border-t border-white/10 pt-8 text-sm text-white/40 md:flex-row">
          <p>
            &copy; {new Date().getFullYear()} Coxa Store. {copy.copyright}
          </p>
          <div className="mt-4 flex gap-6 md:mt-0">
            <Link href="/login" className="transition-colors hover:text-white">
              Instagram
            </Link>
            <Link
              href="/rastreio"
              className="transition-colors hover:text-white"
            >
              Twitter
            </Link>
            <Link
              href="/produto/camisa-jogo-1-masc"
              className="transition-colors hover:text-white"
            >
              YouTube
            </Link>
          </div>
        </div>
      </div>

      {isAppChooserOpen && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center px-4">
          <button
            type="button"
            aria-label={copy.appClose}
            className="absolute inset-0 bg-black/72 backdrop-blur-md"
            onClick={() => setIsAppChooserOpen(false)}
          />

          <div className="relative z-10 w-full max-w-[520px] overflow-hidden rounded-[20px] border border-white/10 bg-[linear-gradient(180deg,rgba(13,13,13,0.98),rgba(7,7,7,0.98))] shadow-[0_40px_120px_rgba(0,0,0,0.55)]">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(96,232,97,0.12),transparent_38%)]" />
            <div className="relative border-b border-white/8 px-6 py-5 sm:px-7">
              <button
                type="button"
                onClick={() => setIsAppChooserOpen(false)}
                className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/70 transition-colors hover:bg-white/[0.08] hover:text-white"
                aria-label={copy.appClose}
              >
                <X size={18} />
              </button>

              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--color-primary)]">
                Coxa ID
              </p>
              <h3 className="mt-3 max-w-[320px] font-heading text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">
                {copy.appChooserTitle}
              </h3>
              <p className="mt-3 max-w-[380px] text-sm leading-relaxed text-white/55 sm:text-base">
                {copy.appChooserDescription}
              </p>
            </div>

            <div className="relative grid gap-3 p-4 sm:grid-cols-2 sm:gap-4 sm:p-6">
              <a
                href={appLinks.android}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden rounded-[16px] border border-white/10 bg-white/[0.03] p-5 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.05]"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(96,232,97,0.16),transparent_35%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="relative flex min-h-[170px] flex-col justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-white">
                    <Smartphone size={24} />
                  </span>
                  <div className="mt-8">
                    <p className="font-heading text-2xl font-black uppercase tracking-wide text-white">
                      Android
                    </p>
                    <p className="mt-2 text-sm text-white/50">
                      {copy.androidSubtitle}
                    </p>
                  </div>
                  <div className="mt-8 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--color-primary)]">
                    <span>{copy.continueLabel}</span>
                    <ArrowUpRight
                      size={16}
                      className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                    />
                  </div>
                </div>
              </a>

              <a
                href={appLinks.ios}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden rounded-[16px] border border-white/10 bg-white/[0.03] p-5 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.05]"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(96,232,97,0.16),transparent_35%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="relative flex min-h-[170px] flex-col justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-white">
                    <Apple size={24} />
                  </span>
                  <div className="mt-8">
                    <p className="font-heading text-2xl font-black uppercase tracking-wide text-white">
                      iOS
                    </p>
                    <p className="mt-2 text-sm text-white/50">
                      {copy.iosSubtitle}
                    </p>
                  </div>
                  <div className="mt-8 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--color-primary)]">
                    <span>{copy.continueLabel}</span>
                    <ArrowUpRight
                      size={16}
                      className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                    />
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
