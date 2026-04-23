"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { ShoppingBag, Search, Menu, Heart, User } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useShopStore } from "@/store/useShopStore";
import { AnimatePresence, motion } from "framer-motion";
import { useLocale, type Locale } from "@/components/providers/LocaleProvider";
import { WaveText } from "@/components/shared/WaveText";
import { HoverPreviewVideo } from "@/components/shared/HoverPreviewVideo";

const SearchOverlayPanel = dynamic(
  () =>
    import("@/components/navigation/SearchOverlayPanel").then(
      (mod) => mod.SearchOverlayPanel,
    ),
  { ssr: false },
);
const AiSizeGuideModal = dynamic(
  () =>
    import("@/components/fit-guide/AiSizeGuideModal").then(
      (mod) => mod.AiSizeGuideModal,
    ),
  { ssr: false },
);

const navbarCopy: Record<
  Locale,
  {
    ticker: string[];
    sizeGuide: string;
    tracking: string;
    login: string;
    nav: string[];
    megaLabels: {
      matchday: string;
      authentic: string;
      authenticDesc: string;
      streetwear: string;
      casualCulture: string;
      casualDesc: string;
      intensity: string;
      proTraining: string;
      proDesc: string;
      services: string;
      discoverSize: string;
      trackDelivery: string;
      becomeMember: string;
      returns: string;
    };
  }
> = {
  pt: {
    ticker: [
      "S\u00D3CIO COXA TEM DESCONTO DE AT\u00C9 20%",
      "PARCELAMENTO EM AT\u00C9 6X SEM JUROS",
      "FRETE GR\u00C1TIS PARA CURITIBA E REGI\u00C3O",
      "TROCA GR\u00C1TIS EM AT\u00C9 30 DIAS",
    ],
    sizeGuide: "Guia de Tamanhos",
    tracking: "Rastreio",
    login: "Login Coxa ID",
    nav: ["Lan\u00E7amentos", "Uniformes", "Feminino", "Infantil"],
    megaLabels: {
      matchday: "Match Day",
      authentic: "Authentic 26",
      authenticDesc: "Desempenho Profissional.",
      streetwear: "Streetwear",
      casualCulture: "Casual Culture",
      casualDesc: "Do est\u00E1dio para a rua.",
      intensity: "Alta Intensidade",
      proTraining: "Pro Training",
      proDesc: "Engenharia de precis\u00E3o.",
      services: "Servi\u00E7os e Guias",
      discoverSize: "Descobrir Tamanho",
      trackDelivery: "Rastrear Entrega",
      becomeMember: "Seja S\u00F3cio Coxa",
      returns: "Devolu\u00E7\u00F5es Premium",
    },
  },
  en: {
    ticker: [
      "COXA MEMBERS GET UP TO 20% OFF",
      "PAY IN UP TO 6 INTEREST-FREE INSTALLMENTS",
      "FREE SHIPPING FOR CURITIBA AND REGION",
      "FREE EXCHANGES WITHIN 30 DAYS",
    ],
    sizeGuide: "Size Guide",
    tracking: "Tracking",
    login: "Coxa ID Login",
    nav: ["New Arrivals", "Jerseys", "Women", "Kids"],
    megaLabels: {
      matchday: "Match Day",
      authentic: "Authentic 26",
      authenticDesc: "Professional performance.",
      streetwear: "Streetwear",
      casualCulture: "Casual Culture",
      casualDesc: "From stadium to street.",
      intensity: "High Intensity",
      proTraining: "Pro Training",
      proDesc: "Precision engineering.",
      services: "Services & Guides",
      discoverSize: "Find Your Size",
      trackDelivery: "Track Delivery",
      becomeMember: "Become a Coxa Member",
      returns: "Premium Returns",
    },
  },
  es: {
    ticker: [
      "SOCIO COXA TIENE HASTA 20% DE DESCUENTO",
      "PAGA HASTA EN 6 CUOTAS SIN INTER\u00C9S",
      "ENVIO GRATIS PARA CURITIBA Y REGION",
      "CAMBIOS GRATIS HASTA 30 D\u00CDAS",
    ],
    sizeGuide: "Gu\u00EDa de Tallas",
    tracking: "Rastreo",
    login: "Login Coxa ID",
    nav: ["Lanzamientos", "Uniformes", "Mujer", "Infantil"],
    megaLabels: {
      matchday: "D\u00EDa de Partido",
      authentic: "Authentic 26",
      authenticDesc: "Rendimiento profesional.",
      streetwear: "Streetwear",
      casualCulture: "Cultura Casual",
      casualDesc: "Del estadio a la calle.",
      intensity: "Alta Intensidad",
      proTraining: "Pro Training",
      proDesc: "Ingenier\u00EDa de precisi\u00F3n.",
      services: "Servicios y Gu\u00EDas",
      discoverSize: "Descubrir Talla",
      trackDelivery: "Rastrear Entrega",
      becomeMember: "Hazte Socio Coxa",
      returns: "Devoluciones Premium",
    },
  },
};

export function MainNavbar() {
  const { locale } = useLocale();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  // Use refs for scroll tracking  - avoids re-render on every scroll tick
  const lastScrollYRef = useRef(0);
  const isScrolledRef = useRef(false);
  const isHiddenRef = useRef(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isSizeModalOpen, setIsSizeModalOpen] = useState(false);

  // VIBRATION STATE
  const [favVibrating, setFavVibrating] = useState(false);

  const cartItems = useShopStore((state) => state.cartItems);
  const favoriteItems = useShopStore((state) => state.favoriteItems);
  const toggleCart = useShopStore((state) => state.toggleCart);
  const toggleFavoritesDrawer = useShopStore(
    (state) => state.toggleFavoritesDrawer,
  );
  const isCartVibrating = useShopStore((state) => state.isCartVibrating);
  const copy = navbarCopy[locale];

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const favCount = favoriteItems.length;

  useEffect(() => {
    if (favCount > 0) {
      if (typeof navigator !== "undefined" && navigator.vibrate)
        navigator.vibrate([200]);

      const startTimer = window.setTimeout(() => setFavVibrating(true), 0);
      const stopTimer = window.setTimeout(() => setFavVibrating(false), 200);

      return () => {
        window.clearTimeout(startTimer);
        window.clearTimeout(stopTimer);
      };
    }
  }, [favCount]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Glassmorphism  - only setState when value actually changes
      const shouldBeScrolled = currentScrollY > 50;
      if (shouldBeScrolled !== isScrolledRef.current) {
        isScrolledRef.current = shouldBeScrolled;
        setIsScrolled(shouldBeScrolled);
      }

      // Hide/show  - only update when direction changes AND delta > 4px
      if (Math.abs(currentScrollY - lastScrollYRef.current) > 4) {
        const shouldBeHidden =
          currentScrollY > lastScrollYRef.current && currentScrollY > 100;
        if (shouldBeHidden !== isHiddenRef.current) {
          isHiddenRef.current = shouldBeHidden;
          setIsHidden(shouldBeHidden);
        }
        lastScrollYRef.current = currentScrollY;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []); // Empty dep array  - listener registers exactly ONCE

  return (
    <header
      onMouseLeave={() => setActiveMenu(null)}
      className={cn(
        "fixed top-0 left-0 w-full z-50 flex flex-col transition-all duration-500 ease-[var(--ease-premium)]",
        isScrolled
          ? "bg-[#0A0A0A]/90 backdrop-blur-xl border-b border-[var(--color-primary)]/20"
          : "bg-transparent hover:bg-[#0A0A0A]/95",
        isHidden ? "-translate-y-full" : "translate-y-0",
        activeMenu ? "bg-[#0A0A0A] backdrop-blur-3xl" : "",
      )}
    >
      {/* PREMIUM TOP MICRO BAR WITH SUBTLE TICKER */}
      <div
        className={cn(
          "w-full h-8 flex items-center justify-between px-6 border-b border-white/5 transition-all duration-300 overflow-hidden",
          isScrolled ? "hidden" : "bg-[#050505]",
        )}
      >
        {/* Ticker Section - Very subtle, Apple/Nike style */}
        <div className="flex-1 flex items-center h-full max-w-[65%] overflow-hidden relative opacity-70 hover:opacity-100 transition-opacity">
          <div className="ticker-track flex whitespace-nowrap h-full items-center">
            {copy.ticker
              .concat(copy.ticker)
              .concat(copy.ticker)
              .map((item, i) => (
                <span
                  key={i}
                  className="inline-flex items-center text-white/80 font-sans text-[9px] uppercase tracking-[0.15em] mr-10 shrink-0 font-bold"
                >
                  {item}
                </span>
              ))}
          </div>
        </div>

        {/* Right side navigation */}
        <nav className="flex items-center gap-4 text-[9px] text-white/50 font-bold uppercase tracking-widest pl-4 shrink-0 bg-[#050505] z-10 relative shadow-[-20px_0_20px_#050505]">
          <button
            onClick={() => setIsSizeModalOpen(true)}
            className="hover:text-[var(--color-primary)] transition-colors duration-300"
          >
            {copy.sizeGuide}
          </button>
          <span className="text-white/10">|</span>
          <Link
            href="/rastreio"
            className="hover:text-[var(--color-primary)] transition-colors duration-300"
          >
            {copy.tracking}
          </Link>
          <span className="text-white/10">|</span>
          <Link
            href="/login"
            className="hover:text-[var(--color-text-dark)] transition-colors duration-300"
          >
            {copy.login}
          </Link>
        </nav>
      </div>

      {/* MAIN NAVBAR */}
      <div
        className={cn(
          "container mx-auto px-6 border-solid flex items-center justify-between transition-all duration-300",
          isScrolled ? "h-16" : "h-24",
        )}
      >
        {/* Left Links */}
        <nav className="hidden md:flex items-center gap-8 h-full">
          {[
            { label: copy.nav[0], id: "lancamentos" },
            { label: copy.nav[1], id: "uniformes" },
            { label: copy.nav[2], id: "feminino" },
            { label: copy.nav[3], id: "infantil" },
          ].map((item) => (
            <div
              key={item.id}
              onMouseEnter={() => setActiveMenu(item.id)}
              className="h-full flex items-center relative group cursor-pointer"
            >
              <span
                className={cn(
                  "text-sm font-semibold uppercase tracking-widest transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(96,232,97,0.7)]",
                  activeMenu === item.id
                    ? "text-[var(--color-primary)] scale-105"
                    : "text-white group-hover:text-[var(--color-primary)] group-hover:scale-105",
                )}
              >
                {item.label}
              </span>
              <span
                className={cn(
                  "absolute bottom-0 left-0 h-[3px] transition-all duration-300 ease-out bg-[var(--color-primary)]",
                  activeMenu === item.id ? "w-full" : "w-0 group-hover:w-full",
                )}
              ></span>
            </div>
          ))}
        </nav>

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center justify-center relative z-10"
        >
          <h1 className="text-3xl font-heading font-black text-white hover:text-[var(--color-primary)] transition-colors uppercase tracking-tight">
            <WaveText text="Coxa Store" filterId="navbar-wave-logo" />
          </h1>
        </Link>

        {/* Right Actions */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="text-white hover:text-[var(--color-primary)] transition-colors"
          >
            <Search size={22} strokeWidth={2.5} />
          </button>

          <Link
            href="/login"
            className="text-white hover:text-[var(--color-primary)] transition-colors"
          >
            <User size={22} strokeWidth={2.5} />
          </Link>

          <button
            onClick={toggleFavoritesDrawer}
            className={cn(
              "text-white hover:text-[var(--color-primary)] transition-colors relative",
              favVibrating &&
                "animate-shake-vibrate text-[var(--color-primary)]",
            )}
          >
            <Heart size={22} strokeWidth={2.5} />
            <AnimatePresence>
              {favCount > 0 && (
                <motion.span
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="absolute -top-2 -right-2 bg-[#5D8B6E] text-white text-[11px] font-bold h-[18px] w-[18px] rounded-full flex items-center justify-center pointer-events-none shadow-sm"
                >
                  {favCount}
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          <button
            onClick={toggleCart}
            className="text-white hover:text-[var(--color-primary)] transition-colors relative"
          >
            <motion.div
              animate={
                isCartVibrating
                  ? // On add-to-cart: strong rapid shake
                    { rotate: [0, -20, 20, -20, 20, 0], scale: [1, 1.2, 1] }
                  : // When cart has items: periodic gentle swing like a phone notification
                    cartCount > 0
                    ? { rotate: [0, -12, 12, -8, 8, -4, 4, 0] }
                    : {}
              }
              transition={
                isCartVibrating
                  ? { duration: 0.8, ease: "easeInOut" }
                  : cartCount > 0
                    ? {
                        duration: 1.8,
                        repeat: Infinity,
                        repeatDelay: 5,
                        ease: "easeInOut",
                      }
                    : {}
              }
              style={{ transformOrigin: "50% 20%" }}
            >
              <ShoppingBag
                size={22}
                strokeWidth={2.5}
                className={cn(
                  "transition-colors",
                  isCartVibrating &&
                    "text-[var(--color-primary)] drop-shadow-[0_0_12px_rgba(96,232,97,0.8)]",
                )}
              />
            </motion.div>
            <AnimatePresence>
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className={cn(
                    "absolute -top-2 -right-2 text-[11px] font-bold h-[18px] w-[18px] rounded-full flex items-center justify-center pointer-events-none shadow-sm transition-colors duration-500",
                    isCartVibrating
                      ? "bg-white text-black shadow-[0_0_12px_rgba(255,255,255,0.8)]"
                      : "bg-[#5D8B6E] text-white",
                  )}
                >
                  {cartCount}
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          <button className="md:hidden text-white hover:text-[var(--color-primary)] transition-colors">
            <Menu size={24} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Search Overlay Component */}
      {isSearchOpen && (
        <SearchOverlayPanel
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
        />
      )}

      {/* ADIDAS STYLE MEGA MENU DROPDOWN */}
      <AnimatePresence>
        {activeMenu && (
          <motion.div
            initial={{ opacity: 0, y: -10, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{
              opacity: 0,
              y: -5,
              filter: "blur(5px)",
              transition: { duration: 0.2 },
            }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="absolute top-full left-0 w-full bg-[#111] overflow-hidden border-t border-white/5 shadow-2xl"
            onMouseEnter={() => setActiveMenu(activeMenu)}
            onMouseLeave={() => setActiveMenu(null)}
          >
            <div className="container mx-auto px-6 py-12">
              <div className="grid grid-cols-4 gap-8">
                {/* Visual Block 1 - Principal */}
                <Link
                  href="/produto/camisa-jogo"
                  className="col-span-1 flex flex-col group cursor-pointer relative overflow-hidden rounded-xl bg-[#0A0A0A] border border-white/5 hover:border-[var(--color-primary)]/40 transition-colors duration-500"
                >
                  <div className="w-full h-56 relative overflow-hidden">
                    <HoverPreviewVideo
                      videoSrc="/media/video/navigation-editorial-loop.mp4"
                      posterSrc="https://cdn.fanmarket.app.br/69cd71d56e060ab3f78c9a61_camisa-jogo-1-mas.png"
                      posterClassName="opacity-80 object-top"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-black/40 to-transparent pointer-events-none" />
                  </div>
                  <div className="absolute bottom-0 left-0 w-full p-6">
                    <span className="text-[var(--color-primary)] text-[10px] font-bold tracking-[0.2em] uppercase mb-2 block">
                      {copy.megaLabels.matchday}
                    </span>
                    <h4 className="text-white font-heading font-black text-2xl uppercase tracking-wider mb-1 group-hover:text-[var(--color-primary)] transition-colors">
                      {copy.megaLabels.authentic}
                    </h4>
                    <p className="text-white/50 text-xs font-semibold tracking-wide">
                      {copy.megaLabels.authenticDesc}
                    </p>
                  </div>
                </Link>

                {/* Visual Block 2 - Secundário */}
                <Link
                  href="/categorias/casual"
                  className="col-span-1 flex flex-col group cursor-pointer relative overflow-hidden rounded-xl bg-[#0A0A0A] border border-white/5 hover:border-white/30 transition-colors duration-500"
                >
                  <div className="w-full h-56 relative overflow-hidden">
                    <HoverPreviewVideo
                      videoSrc="/media/video/casual.mp4"
                      posterSrc="/imagens/casual.webp"
                      posterClassName="opacity-80 object-top"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-black/40 to-transparent pointer-events-none" />
                  </div>
                  <div className="absolute bottom-0 left-0 w-full p-6">
                    <span className="text-white/60 text-[10px] font-bold tracking-[0.2em] uppercase mb-2 block">
                      {copy.megaLabels.streetwear}
                    </span>
                    <h4 className="text-white font-heading font-black text-2xl uppercase tracking-wider mb-1">
                      {copy.megaLabels.casualCulture}
                    </h4>
                    <p className="text-white/50 text-xs font-semibold tracking-wide">
                      {copy.megaLabels.casualDesc}
                    </p>
                  </div>
                </Link>

                {/* Visual Block 3 - Terciário */}
                <Link
                  href="/categorias/treino"
                  className="col-span-1 flex flex-col group cursor-pointer relative overflow-hidden rounded-xl bg-[#0A0A0A] border border-white/5 hover:border-white/30 transition-colors duration-500"
                >
                  <div className="w-full h-56 relative overflow-hidden bg-[#111]">
                    <HoverPreviewVideo
                      videoSrc="/media/video/protraining.mp4"
                      posterSrc="/imagens/camisa-masc-treino.webp"
                      posterClassName="opacity-80 object-top"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-black/40 to-transparent pointer-events-none" />
                  </div>
                  <div className="absolute bottom-0 left-0 w-full p-6">
                    <span className="text-white/60 text-[10px] font-bold tracking-[0.2em] uppercase mb-2 block">
                      {copy.megaLabels.intensity}
                    </span>
                    <h4 className="text-white font-heading font-black text-2xl uppercase tracking-wider mb-1">
                      {copy.megaLabels.proTraining}
                    </h4>
                    <p className="text-white/50 text-xs font-semibold tracking-wide">
                      {copy.megaLabels.proDesc}
                    </p>
                  </div>
                </Link>

                {/* Column 4: Quick Services (Utility only) */}
                <div className="col-span-1 flex flex-col justify-end pl-8 border-l border-white/5">
                  <h5 className="text-[var(--color-primary)] font-bold text-[10px] uppercase tracking-[0.2em] mb-8">
                    {copy.megaLabels.services}
                  </h5>
                  <ul className="flex flex-col gap-6">
                    <li>
                      <button
                        onClick={() => {
                          setIsSizeModalOpen(true);
                          setActiveMenu(null);
                        }}
                        className="text-left text-white/50 hover:text-white font-bold text-sm tracking-widest transition-colors inline-block hover:translate-x-1 duration-300"
                      >
                        {copy.megaLabels.discoverSize}
                      </button>
                    </li>
                    <li>
                      <Link
                        href="/rastreio"
                        className="text-white/50 hover:text-white font-bold text-sm tracking-widest transition-colors inline-block hover:translate-x-1 duration-300"
                      >
                        {copy.megaLabels.trackDelivery}
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/login"
                        className="text-white/50 hover:text-white font-bold text-sm tracking-widest transition-colors inline-block hover:translate-x-1 duration-300"
                      >
                        {copy.megaLabels.becomeMember}
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/devolucoes"
                        className="text-white/50 hover:text-white font-bold text-sm tracking-widest transition-colors inline-block hover:translate-x-1 duration-300"
                      >
                        {copy.megaLabels.returns}
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isSizeModalOpen && (
        <AiSizeGuideModal
          isOpen={isSizeModalOpen}
          onClose={() => setIsSizeModalOpen(false)}
        />
      )}
    </header>
  );
}
