"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { Apple, ArrowUpRight, Smartphone, X } from "lucide-react";
import { useLocale, type Locale } from "@/components/providers/LocaleProvider";
import { repairDeepStrings } from "@/lib/utils";

type DeviceType = "ios" | "android";

const coxaIdCopy: Record<
  Locale,
  {
    subtitle: string;
    description: string;
    downloadCta: string;
    chooserTitle: string;
    chooserDescription: string;
    recommended: string;
    continueLabel: string;
    closeLabel: string;
    androidSubtitle: string;
    iosSubtitle: string;
  }
> = {
  pt: {
    subtitle: "Coritiba Oficial App",
    description:
      "Acompanhe tudo sobre o Coritiba e tenha acesso a benefícios exclusivos no seu celular. O clube na palma da sua mão.",
    downloadCta: "Baixe Agora o App",
    chooserTitle: "Escolha seu dispositivo",
    chooserDescription:
      "Selecione a plataforma e siga direto para a loja oficial do app.",
    recommended: "Recomendado",
    continueLabel: "Continuar",
    closeLabel: "Fechar seletor de dispositivo",
    androidSubtitle: "Abrir na Google Play",
    iosSubtitle: "Abrir na App Store",
  },
  en: {
    subtitle: "Official Coritiba App",
    description:
      "Follow everything about Coritiba and get exclusive benefits on your phone. The club in the palm of your hand.",
    downloadCta: "Download the App",
    chooserTitle: "Choose your device",
    chooserDescription:
      "Select your platform and go straight to the official app store.",
    recommended: "Recommended",
    continueLabel: "Continue",
    closeLabel: "Close device selector",
    androidSubtitle: "Open in Google Play",
    iosSubtitle: "Open in the App Store",
  },
  es: {
    subtitle: "App Oficial de Coritiba",
    description:
      "Sigue todo sobre Coritiba y accede a beneficios exclusivos en tu celular. El club en la palma de tu mano.",
    downloadCta: "Descarga la App",
    chooserTitle: "Elige tu dispositivo",
    chooserDescription:
      "Selecciona la plataforma y ve directo a la tienda oficial de la app.",
    recommended: "Recomendado",
    continueLabel: "Continuar",
    closeLabel: "Cerrar selector de dispositivo",
    androidSubtitle: "Abrir en Google Play",
    iosSubtitle: "Abrir en App Store",
  },
};

function detectRecommendedDevice(): DeviceType | null {
  if (typeof navigator === "undefined") {
    return null;
  }

  const userAgent = navigator.userAgent.toLowerCase();
  const navigatorWithUaData = navigator as Navigator & {
    userAgentData?: { platform?: string };
  };
  const platform =
    navigatorWithUaData.userAgentData?.platform?.toLowerCase() ??
    navigator.platform?.toLowerCase() ??
    "";

  if (
    /iphone|ipad|ipod|ios|mac/.test(userAgent) ||
    /iphone|ipad|ipod|ios|mac/.test(platform)
  ) {
    return "ios";
  }

  if (/android/.test(userAgent) || /android/.test(platform)) {
    return "android";
  }

  return null;
}

export function HomeMembershipAppSection() {
  const { locale } = useLocale();
  const sectionRef = useRef<HTMLDivElement>(null);
  const mockupRef = useRef<HTMLDivElement>(null);
  const scrollWrapRef = useRef<HTMLDivElement>(null);
  const chooserRef = useRef<HTMLDivElement>(null);
  const [isChooserOpen, setIsChooserOpen] = useState(false);
  const [recommendedDevice] = useState<DeviceType | null>(
    detectRecommendedDevice,
  );
  const copy = repairDeepStrings(coxaIdCopy[locale]);

  const appLinks = {
    ios: "https://apps.apple.com/app/coxa-id-coritiba-oficial-app/id1541896243",
    android: "https://play.google.com/store/apps/details?id=com.sportm.coritiba",
  };

  useEffect(() => {
    if (!sectionRef.current || !mockupRef.current || !scrollWrapRef.current) return;

    // Float animation on the inner element (mockupRef)
    const floatTween = gsap.to(mockupRef.current, {
      y: -30,
      repeat: -1,
      yoyo: true,
      duration: 3,
      ease: "power1.inOut",
    });

    // Scroll parallax on the outer wrapper (scrollWrapRef)  - no conflict
    gsap.to(scrollWrapRef.current, {
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
      y: -80,
    });

    // Pause float tween while section is offscreen  - stops idle GSAP cycles
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            floatTween.play();
          } else {
            floatTween.pause();
          }
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isChooserOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!chooserRef.current?.contains(event.target as Node)) {
        setIsChooserOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsChooserOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isChooserOpen]);

  const deviceCards = [
      {
        id: "android" as const,
        label: "Android",
        subtitle: copy.androidSubtitle,
        href: appLinks.android,
        icon: Smartphone,
      },
      {
        id: "ios" as const,
        label: "iOS",
        subtitle: copy.iosSubtitle,
        href: appLinks.ios,
        icon: Apple,
    },
  ];

  return (
    <section 
      ref={sectionRef} 
      className="relative w-full bg-[#050505] overflow-hidden border-t border-white/5"
      style={{ paddingTop: "clamp(64px, 8vw, 128px)", paddingBottom: "clamp(32px, 4vw, 64px)" }}
    >
      {/*  -� -� GRADIENT BRIDGE  - conecta suavemente ao footer  -� -� */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, rgba(96,232,97,0.025) 60%, rgba(0,0,0,0.6) 100%)",
        }}
      />
      {/* BACKGROUND TEXTURE / GLOW */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] bg-[var(--color-primary)] opacity-5 blur-[150px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* TEXT CONTENT */}
          <div className="flex flex-col gap-6 order-2 lg:order-1 text-center lg:text-left">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black font-heading uppercase text-white tracking-tighter leading-none">
                Coxa ID
                <span className="block text-2xl md:text-3xl text-[var(--color-primary)] mt-2">
                 {copy.subtitle}
                </span>
            </h2>
            
            <p className="text-white/60 text-lg max-w-lg mx-auto lg:mx-0 font-medium leading-relaxed">
              {copy.description}
            </p>

            <div
              ref={chooserRef}
              className="mt-4 flex flex-col items-center gap-4 lg:items-start"
            >
              <button
                type="button"
                onClick={() => setIsChooserOpen((current) => !current)}
                aria-expanded={isChooserOpen}
                aria-controls="coxa-id-device-chooser"
                className="group flex h-14 items-center justify-center gap-2 rounded-[2px] bg-white px-8 text-sm font-bold uppercase tracking-widest text-black transition-transform duration-300 hover:bg-[#60E861] active:scale-95"
              >
                 <span>{copy.downloadCta}</span>
                <ArrowUpRight
                  size={18}
                  className={`transition-transform ${isChooserOpen ? "rotate-45" : "group-hover:rotate-45"}`}
                />
              </button>
            </div>
          </div>

          {/* MOCKUP IMAGE COM EFEITO PARALLAX */}
          <div ref={scrollWrapRef} className="order-1 lg:order-2 flex justify-center lg:justify-end relative h-[400px] lg:h-[600px]">
             <div 
               ref={mockupRef}
               className="relative w-full max-w-[300px] lg:max-w-[400px] h-full"
             >
               <Image
                 src="https://cdn.fanbase.com.br/fanmarket/coxa-store/mockup-coxa-store-1-1.png"
                 alt="Coxa ID - App Screenshot"
                 fill
                 className="object-contain drop-shadow-[0_20px_50px_rgba(96,232,97,0.15)]"
                 sizes="(max-width: 768px) 100vw, 50vw"
                 priority
               />
             </div>
          </div>
        </div>
      </div>

      {isChooserOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center px-4">
          <button
            type="button"
             aria-label={copy.closeLabel}
            className="absolute inset-0 bg-black/72 backdrop-blur-md"
            onClick={() => setIsChooserOpen(false)}
          />

          <div
            id="coxa-id-device-chooser"
            ref={chooserRef}
            className="relative z-10 w-full max-w-[520px] overflow-hidden rounded-[20px] border border-white/10 bg-[linear-gradient(180deg,rgba(13,13,13,0.98),rgba(7,7,7,0.98))] shadow-[0_40px_120px_rgba(0,0,0,0.55)]"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(96,232,97,0.12),transparent_38%)] pointer-events-none" />
            <div className="relative border-b border-white/8 px-6 py-5 sm:px-7">
              <button
                type="button"
                onClick={() => setIsChooserOpen(false)}
                className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/70 transition-colors hover:bg-white/[0.08] hover:text-white"
                 aria-label={copy.closeLabel}
              >
                <X size={18} />
              </button>

              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--color-primary)]">
                Coxa ID
              </p>
              <h3 className="mt-3 max-w-[320px] font-heading text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">
                 {copy.chooserTitle}
              </h3>
              <p className="mt-3 max-w-[380px] text-sm leading-relaxed text-white/55 sm:text-base">
                 {copy.chooserDescription}
              </p>
            </div>

            <div className="relative grid gap-3 p-4 sm:grid-cols-2 sm:gap-4 sm:p-6">
              {deviceCards.map((device) => {
                const Icon = device.icon;
                const isRecommended = recommendedDevice === device.id;

                return (
                  <a
                    key={device.id}
                    href={device.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group relative overflow-hidden rounded-[16px] border p-5 transition-all duration-300 ${
                      isRecommended
                        ? "border-[var(--color-primary)]/45 bg-[linear-gradient(180deg,rgba(96,232,97,0.12),rgba(255,255,255,0.03))]"
                        : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]"
                    }`}
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(96,232,97,0.16),transparent_35%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <div className="relative flex min-h-[170px] flex-col justify-between">
                      <div className="flex items-start justify-between gap-4">
                        <span
                          className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${
                            isRecommended
                              ? "border-[var(--color-primary)]/45 bg-[var(--color-primary)]/12 text-[var(--color-primary)]"
                              : "border-white/10 bg-white/[0.04] text-white"
                          }`}
                        >
                          <Icon size={24} />
                        </span>
                        {isRecommended && (
                          <span className="rounded-full border border-[var(--color-primary)]/35 bg-[var(--color-primary)]/12 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.18em] text-[var(--color-primary)]">
                             {copy.recommended}
                          </span>
                        )}
                      </div>

                      <div className="mt-8">
                        <p className="font-heading text-2xl font-black uppercase tracking-wide text-white">
                          {device.label}
                        </p>
                        <p className="mt-2 text-sm text-white/50">
                          {device.subtitle}
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
                );
              })}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

