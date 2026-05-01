"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Heart,
  Minus,
  Plus,
  Ruler,
  Share2,
  ShoppingCart,
  Star,
} from "lucide-react";
import gsap from "gsap";
import { SiteFooter } from "@/components/navigation/SiteFooter";
import { useLocale, type Locale } from "@/components/providers/LocaleProvider";
import { MainNavbar } from "@/components/navigation/MainNavbar";
import { ProductCard } from "@/components/commerce/catalog/ProductCard";
import { ProductShareModal } from "@/components/commerce/catalog/ProductShareModal";
import { ProductSizeGuideModal } from "@/components/fit-guide/ProductSizeGuideModal";
import { PRODUCTS, getProductBySlug } from "@/data/productCatalog";
import { useShopStore } from "@/store/useShopStore";

type ReviewBundle = {
  rating: number;
  count: number;
  fit: number;
  quality: number;
  comfort: number;
  items: Array<{
    id: number;
    author: string;
    date: string;
    rating: number;
    title: string;
    content: string;
    fit: string;
  }>;
};

const localeFormatMap: Record<Locale, string> = {
  pt: "pt-BR",
  en: "en-US",
  es: "es-ES",
};

const categoryLabels: Record<Locale, Record<string, string>> = {
  pt: { uniformes: "uniformes", treino: "treino", casual: "casual" },
  en: { uniformes: "jerseys", treino: "training", casual: "casual" },
  es: { uniformes: "uniformes", treino: "entrenamiento", casual: "casual" },
};

const productPageaopy: Record<
  Locale,
  {
    home: string;
    soldBy: string;
    member: string;
    memberOff: string;
    trending: string;
    trendingDescription: string;
    size: string;
    smartGuide: string;
    addToCart: string;
    selectSize: string;
    description: string;
    technicalDetails: string;
    reviews: string;
    totalReviews: string;
    tight: string;
    perfect: string;
    loose: string;
    comfort: string;
    fit: string;
    writeReview: string;
    related: string;
    previousPhotos: string;
    nextPhotos: string;
    buy: string;
  }
> = {
  pt: {
    home: "Home",
    soldBy: "Vendido por",
    member: "Socio Coxa",
    memberOff: "ate 20% OFF",
    trending: "Tendencia!",
    trendingDescription: "Este artigo tem muita procura.",
    size: "Tamanho",
    smartGuide: "Guia inteligente",
    addToCart: "Adicionar ao Carrinho",
    selectSize: "Selecione um tamanho",
    description: "Descricao",
    technicalDetails: "Detalhes Tecnicos",
    reviews: "Avaliacoes",
    totalReviews: "avaliacoes",
    tight: "Apertado",
    perfect: "Perfeito",
    loose: "Largo",
    comfort: "aonforto",
    fit: "aaimento",
    writeReview: "Escrever uma avaliacao",
    related: "Voce Tambem Pode Gostar",
    previousPhotos: "Fotos anteriores",
    nextPhotos: "Proximas fotos",
    buy: "Comprar",
  },
  en: {
    home: "Home",
    soldBy: "Sold by",
    member: "Coxa Member",
    memberOff: "up to 20% OFF",
    trending: "Trending!",
    trendingDescription: "This item is in high demand.",
    size: "Size",
    smartGuide: "Smart guide",
    addToCart: "Add to Cart",
    selectSize: "Select a size",
    description: "Description",
    technicalDetails: "Technical Details",
    reviews: "Reviews",
    totalReviews: "reviews",
    tight: "Tight",
    perfect: "Perfect",
    loose: "Loose",
    comfort: "aomfort",
    fit: "Fit",
    writeReview: "Write a review",
    related: "You May Also Like",
    previousPhotos: "Previous photos",
    nextPhotos: "Next photos",
    buy: "Buy",
  },
  es: {
    home: "Home",
    soldBy: "Vendido por",
    member: "Socio Coxa",
    memberOff: "hasta 20% OFF",
    trending: "Tendencia!",
    trendingDescription: "Este articulo tiene mucha demanda.",
    size: "Talla",
    smartGuide: "Guia inteligente",
    addToCart: "Agregar al carrito",
    selectSize: "Selecciona una talla",
    description: "Descripcion",
    technicalDetails: "Detalles Tecnicos",
    reviews: "Resenas",
    totalReviews: "resenas",
    tight: "Ajustado",
    perfect: "Perfecto",
    loose: "Holgado",
    comfort: "Comodidad",
    fit: "Caída",
    writeReview: "Escribir una resena",
    related: "Tambien Te Puede Gustar",
    previousPhotos: "Fotos anteriores",
    nextPhotos: "Siguientes fotos",
    buy: "Comprar",
  },
};

const localizedReviews: Record<Locale, ReviewBundle> = {
  pt: {
    rating: 4.8,
    count: 124,
    fit: 50,
    quality: 95,
    comfort: 90,
    items: [
      {
        id: 1,
        author: "membro.coxa_1909",
        date: "15 de marco de 2026",
        rating: 5,
        title: "Detalhes impressionantes, muito leve.",
        content:
          "Uma das camisas mais bonitas que o clube ja lancou. O tecido respira muito bem e o detalhe cromado no escudo ao vivo e surreal.",
        fit: "Perfeito",
      },
      {
        id: 2,
        author: "camisasecia",
        date: "02 de abril de 2026",
        rating: 5,
        title: "Design futurista com alma classica",
        content:
          "O conforto e absurdo. Pedi meu tamanho normal e serviu perfeitamente. O jacquard botanico traz uma textura incrivel.",
        fit: "Perfeito",
      },
    ],
  },
  en: {
    rating: 4.8,
    count: 124,
    fit: 50,
    quality: 95,
    comfort: 90,
    items: [
      {
        id: 1,
        author: "membro.coxa_1909",
        date: "March 15, 2026",
        rating: 5,
        title: "Impressive details and very lightweight.",
        content:
          "One of the most beautiful jerseys the club has released. The fabric breathes really well and the chrome crest detail looks unreal in person.",
        fit: "Perfect",
      },
      {
        id: 2,
        author: "camisasecia",
        date: "April 2, 2026",
        rating: 5,
        title: "Futuristic design with a classic soul",
        content:
          "The comfort is outstanding. I ordered my usual size and it fit perfectly. The botanical jacquard adds incredible texture.",
        fit: "Perfect",
      },
    ],
  },
  es: {
    rating: 4.8,
    count: 124,
    fit: 50,
    quality: 95,
    comfort: 90,
    items: [
      {
        id: 1,
        author: "membro.coxa_1909",
        date: "15 de marzo de 2026",
        rating: 5,
        title: "Detalles impresionantes y muy ligera.",
        content:
          "Una de las camisetas mas bonitas que ha lanzado el club. El tejido respira muy bien y el detalle cromado del escudo en vivo es increible.",
        fit: "Perfecto",
      },
      {
        id: 2,
        author: "camisasecia",
        date: "02 de abril de 2026",
        rating: 5,
        title: "Diseno futurista con alma clasica",
        content:
          "La comodidad es impresionante. Pedi mi talla habitual y quedo perfecta. El jacquard botanico aporta una textura increible.",
        fit: "Perfecto",
      },
    ],
  },
};

export default function ProductPage() {
  const { locale } = useLocale();
  const copy = productPageaopy[locale];
  const reviews = localizedReviews[locale];
  const params = useParams();
  const slug = params.id as string;

  const product =
    getProductBySlug(slug) ||
    PRODUCTS.find((item) => item.id === slug) ||
    PRODUCTS[0];

  const { addToCart, toggleFavorite, favoriteItems } = useShopStore();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const isFavorite = favoriteItems.some(
    (favorite) => favorite.id === product.id,
  );

  const [isMagnified, setIsMagnified] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [showStickyCart, setShowStickyCart] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string>("info");
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isHoveringImage, setIsHoveringImage] = useState(false);

  const cursorRef = useRef<HTMLDivElement>(null);
  const mainImageRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const addToCartBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(mainImageRef.current, {
        opacity: 0,
        x: -60,
        duration: 0.9,
        ease: "power3.out",
      });
      gsap.from(detailsRef.current, {
        opacity: 0,
        x: 60,
        duration: 0.9,
        delay: 0.15,
        ease: "power3.out",
      });
    });

    return () => ctx.revert();
  }, [slug]);

  useEffect(() => {
    const handleScroll = () => {
      if (addToCartBtnRef.current) {
        const buttonRect = addToCartBtnRef.current.getBoundingClientRect();
        setShowStickyCart(buttonRect.bottom < 0);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!cursorRef.current) return;

    const xTo = gsap.quickTo(cursorRef.current, "x", {
      duration: 0.15,
      ease: "power3",
    });
    const yTo = gsap.quickTo(cursorRef.current, "y", {
      duration: 0.15,
      ease: "power3",
    });

    const moveaursor = (event: MouseEvent) => {
      xTo(event.clientX);
      yTo(event.clientY);
    };

    window.addEventListener("mousemove", moveaursor);
    return () => window.removeEventListener("mousemove", moveaursor);
  }, []);

  const handleImageClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isMagnified) {
      const rect = event.currentTarget.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      setMousePos({ x, y });
    }

    setIsMagnified(!isMagnified);
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isMagnified) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  const priceFormatted = product.price.toLocaleString(localeFormatMap[locale], {
    style: "currency",
    currency: "BRL",
  });
  const socioPrice = (product.price * 0.8).toLocaleString(
    localeFormatMap[locale],
    {
      style: "currency",
      currency: "BRL",
    },
  );
  const related = PRODUCTS.filter((item) => item.id !== product.id).slice(0, 3);

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? "" : id);
  };

  const categoryLabel =
    categoryLabels[locale][product.category] || product.category;

  return (
    <main className="min-h-screen bg-[var(--color-background-dark)] pb-24 selection:bg-[var(--color-primary)] selection:text-black lg:pb-0">
      <MainNavbar />

      <div className="container mx-auto px-6 pt-28 pb-4">
        <nav className="flex items-center gap-2 text-sm text-white/40">
          <Link
            href="/"
            className="flex items-center gap-1 transition-colors hover:text-[var(--color-primary)]"
          >
            <ChevronLeft size={14} /> {copy.home}
          </Link>
          <span>/</span>
          <span className="cursor-pointer capitalize transition-colors hover:text-[var(--color-primary)]">
            {categoryLabel}
          </span>
          <span>/</span>
          <span className="text-white/70">{product.name}</span>
        </nav>
      </div>

      <section className="container mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 xl:gap-20">
          <div
            ref={mainImageRef}
            className="relative flex flex-col gap-4 lg:col-span-7"
          >
            <div
              className="relative aspect-[4/5] w-full cursor-none overflow-hidden bg-[#0A0A0A]"
              onClick={handleImageClick}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsHoveringImage(true)}
              onMouseLeave={() => {
                setIsMagnified(false);
                setIsHoveringImage(false);
              }}
            >
              <div
                className="pointer-events-none absolute inset-0 h-full w-full transition-transform duration-[400ms] ease-out"
                style={{
                  transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                  transform: isMagnified ? "scale(2.5)" : "scale(1)",
                }}
              >
                <Image
                  src={product.images[selectedImage]}
                  alt={product.name}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  quality={100}
                />
              </div>

              <div
                className={`pointer-events-none absolute inset-0 transition-opacity duration-300 ${
                  isMagnified ? "opacity-0" : "opacity-100"
                }`}
              >
                <div className="absolute top-4 left-4 z-10">
                  <span className="inline-flex items-center gap-1.5 bg-black px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white">
                    <span className="ball-spin inline-block">✦</span>
                    {copy.member} -20%
                  </span>
                </div>
                <div className="pointer-events-auto absolute top-4 right-4 z-10 flex flex-col gap-2">
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      toggleFavorite(product);
                    }}
                    className={`p-2.5 transition-all duration-300 ${
                      isFavorite
                        ? "border border-white/20 bg-black/80 text-[var(--color-primary)]"
                        : "bg-white text-black hover:bg-gray-200"
                    }`}
                  >
                    <Heart
                      size={18}
                      fill={isFavorite ? "currentColor" : "none"}
                    />
                  </button>
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      setIsShareOpen(true);
                    }}
                    className="pointer-events-auto bg-white p-2.5 text-black transition-all duration-300 hover:bg-gray-200"
                  >
                    <Share2 size={18} />
                  </button>
                </div>
              </div>
            </div>

            <div className="relative w-full group/thumbs">
              <button
                onClick={() => {
                  const element = document.getElementById("thumb-track");
                  if (element) {
                    element.scrollBy({ left: -140, behavior: "smooth" });
                  }
                }}
                aria-label={copy.previousPhotos}
                className="absolute left-0 top-0 bottom-0 z-20 flex w-10 items-center justify-center bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/90 to-transparent opacity-0 transition-opacity duration-300 hover:from-[#0A0A0A] group-hover/thumbs:opacity-100 md:w-12"
              >
                <ChevronLeft
                  size={22}
                  className="text-white/80 transition-colors hover:text-[var(--color-primary)]"
                />
              </button>

              <div
                id="thumb-track"
                className="scrollbar-hide flex w-full shrink-0 gap-2 overflow-x-auto scroll-smooth px-1 pb-2"
              >
                {product.images.map((src, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative h-24 w-24 shrink-0 overflow-hidden rounded-[2px] border-b-[3px] bg-[#0A0A0A] transition-all duration-300 md:h-28 md:w-28 ${
                      selectedImage === index
                        ? "scale-[1.02] border-[var(--color-primary)] opacity-100"
                        : "border-transparent opacity-50 hover:opacity-90"
                    }`}
                  >
                    <Image
                      src={src}
                      alt={`thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="112px"
                    />
                  </button>
                ))}
              </div>

              <button
                onClick={() => {
                  const element = document.getElementById("thumb-track");
                  if (element) {
                    element.scrollBy({ left: 140, behavior: "smooth" });
                  }
                }}
                aria-label={copy.nextPhotos}
                className="absolute right-0 top-0 bottom-0 z-20 flex w-10 items-center justify-center bg-gradient-to-l from-[#0A0A0A] via-[#0A0A0A]/90 to-transparent opacity-0 transition-opacity duration-300 hover:from-[#0A0A0A] group-hover/thumbs:opacity-100 md:w-12"
              >
                <ChevronRight
                  size={22}
                  className="text-white/80 transition-colors hover:text-[var(--color-primary)]"
                />
              </button>
            </div>
          </div>

          <div ref={detailsRef} className="flex flex-col pt-2 lg:col-span-5">
            <div className="mb-4 flex items-center gap-3">
              <span className="text-xs font-semibold uppercase tracking-widest text-white/40">
                {copy.soldBy}
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary)]">
                {product.vendor}
              </span>
              <span className="text-white/20">|</span>
              <span className="text-xs font-semibold uppercase tracking-wider text-white/50">
                {product.brand}
              </span>
            </div>

            <h1 className="mb-2 text-4xl font-black font-heading uppercase leading-none tracking-tight text-white md:text-5xl">
              {product.name}
            </h1>
            <div className="mb-8 flex items-center gap-4">
              <p className="text-lg font-medium text-white/50">
                {product.subtitle}
              </p>
              <div className="flex items-center gap-1 rounded bg-[var(--color-primary)]/10 px-2 py-1 text-[var(--color-primary)]">
                <Star size={14} fill="currentColor" />
                <span className="text-xs font-bold">{reviews.rating}</span>
                <span className="text-xs text-white/40">({reviews.count})</span>
              </div>
            </div>

            <div className="relative mb-8 rounded-[4px] border border-white/10 bg-[var(--color-surface)] p-6">
              <div className="mb-1 flex items-end gap-3">
                <span className="tabular-nums text-4xl font-black text-white">
                  {priceFormatted}
                </span>
              </div>
              <p className="mb-3 text-sm text-white/50">
                {product.installments}
              </p>
              <div className="m-0 flex items-center gap-2 rounded border border-[#115740] bg-[#115740]/40 px-4 py-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#60E861]">
                  {copy.member}
                </span>
                <span className="text-xl font-black text-[#60E861]">
                  {socioPrice}
                </span>
                <span className="ml-auto text-[10px] font-medium text-[#60E861]/70">
                  {copy.memberOff}
                </span>
              </div>

              <div className="mt-4 flex items-center gap-2 rounded-[2px] bg-[#E9EaEF] px-4 py-3 text-black">
                <Star size={16} fill="currentColor" strokeWidth={1} />
                <span>
                  <span className="text-sm font-bold tracking-wide">
                    {copy.trending}{" "}
                  </span>
                  <span className="text-sm">{copy.trendingDescription}</span>
                </span>
              </div>
            </div>

            <div className="mb-8">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-bold uppercase tracking-wider text-white">
                  {copy.size}
                </span>
                <button
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-[var(--color-primary)] underline-offset-2 transition-colors hover:underline"
                >
                  <Ruler size={14} /> {copy.smartGuide}
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[56px] rounded-[4px] border px-4 h-12 text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
                      selectedSize === size
                        ? "scale-105 border-[var(--color-primary)] bg-[var(--color-primary)] text-black"
                        : "border-white/15 bg-transparent text-white hover:border-white/40 hover:bg-white/5"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-10 flex flex-col gap-3 sm:flex-row">
              <div className="flex h-14 shrink-0 items-center overflow-hidden rounded-[4px] border border-white/15">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="flex h-full w-12 items-center justify-center text-white/60 transition-colors hover:bg-white/5 hover:text-white"
                >
                  <Minus size={16} />
                </button>
                <span className="w-12 text-center text-lg font-bold tabular-nums text-white">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="flex h-full w-12 items-center justify-center text-white/60 transition-colors hover:bg-white/5 hover:text-white"
                >
                  <Plus size={16} />
                </button>
              </div>
              <button
                ref={addToCartBtnRef}
                onClick={() => {
                  if (!selectedSize) return;

                  for (let index = 0; index < quantity; index += 1) {
                    addToCart(product, selectedSize);
                  }
                }}
                className={`flex h-14 flex-1 items-center justify-center gap-3 rounded-[4px] text-sm font-bold uppercase tracking-widest transition-all duration-400 ${
                  selectedSize
                    ? "cursor-pointer bg-[var(--color-primary)] text-black shadow-[0_4px_20px_rgba(96,232,97,0.3)] hover:scale-[1.02] hover:bg-white active:scale-95"
                    : "cursor-not-allowed bg-white/10 text-white/30"
                }`}
                disabled={!selectedSize}
              >
                <ShoppingCart size={18} />
                {selectedSize ? copy.addToCart : copy.selectSize}
              </button>
            </div>

            <div className="border-t border-white/10">
              <div className="border-b border-white/10">
                <button
                  onClick={() => toggleAccordion("info")}
                  className="group flex w-full items-center justify-between py-6 text-left"
                >
                  <span className="text-sm font-bold uppercase tracking-wider text-white transition-colors group-hover:text-[var(--color-primary)]">
                    {copy.description}
                  </span>
                  <ChevronDown
                    size={20}
                    className={`text-white/40 transition-transform duration-300 ${
                      openAccordion === "info" ? "rotate-180 text-white" : ""
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-500 ease-[var(--ease-spring)] ${
                    openAccordion === "info"
                      ? "max-h-[800px] pb-6 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="space-y-4 text-sm leading-relaxed text-white/60">
                    <p>{product.description}</p>
                    {product.descriptionExtra && (
                      <p>{product.descriptionExtra}</p>
                    )}
                    <p className="mt-4 text-base font-semibold italic text-white">
                      {product.tagline}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-b border-white/10">
                <button
                  onClick={() => toggleAccordion("specs")}
                  className="group flex w-full items-center justify-between py-6 text-left"
                >
                  <span className="text-sm font-bold uppercase tracking-wider text-white transition-colors group-hover:text-[var(--color-primary)]">
                    {copy.technicalDetails}
                  </span>
                  <ChevronDown
                    size={20}
                    className={`text-white/40 transition-transform duration-300 ${
                      openAccordion === "specs" ? "rotate-180 text-white" : ""
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-500 ease-[var(--ease-spring)] ${
                    openAccordion === "specs"
                      ? "max-h-[800px] pb-6 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <ul className="grid grid-cols-1 gap-x-6 gap-y-3 md:grid-cols-2">
                    {product.specs.map((spec, index) => (
                      <li
                        key={index}
                        className="relative flex items-start gap-2 pl-4 before:absolute before:left-0 before:top-2 before:h-1.5 before:w-1.5 before:rounded-full before:bg-[var(--color-primary)] before:content-['']"
                      >
                        <span className="text-sm text-white/80">
                          <span className="font-semibold text-white/40">
                            {spec.label}:
                          </span>{" "}
                          {spec.value}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="border-b border-white/10">
                <button
                  onClick={() => toggleAccordion("reviews")}
                  className="group flex w-full items-center justify-between py-6 text-left"
                >
                  <span className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-white transition-colors group-hover:text-[var(--color-primary)]">
                    {copy.reviews}
                    <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs font-medium">
                      {reviews.count}
                    </span>
                  </span>
                  <ChevronDown
                    size={20}
                    className={`text-white/40 transition-transform duration-300 ${
                      openAccordion === "reviews" ? "rotate-180 text-white" : ""
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-500 ease-[var(--ease-spring)] ${
                    openAccordion === "reviews"
                      ? "max-h-[1200px] pb-6 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="mb-8 grid grid-cols-1 gap-8 rounded-[4px] border border-white/5 bg-white/[0.02] p-6 sm:grid-cols-2">
                    <div>
                      <div className="mb-2 flex items-baseline gap-2">
                        <span className="text-5xl font-black font-heading tracking-tight text-white">
                          {reviews.rating}
                        </span>
                        <div className="flex text-[var(--color-primary)]">
                          {[...Array(5)].map((_, index) => (
                            <Star
                              key={index}
                              size={16}
                              fill={
                                index < Math.floor(reviews.rating)
                                  ? "currentColor"
                                  : "none"
                              }
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-white/50">
                        {reviews.count} {copy.totalReviews}
                      </p>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <div className="mb-1 flex justify-between text-xs font-bold uppercase text-white/40">
                          <span>{copy.tight}</span>
                          <span>{copy.perfect}</span>
                          <span>{copy.loose}</span>
                        </div>
                        <div className="relative h-1.5 w-full rounded-full bg-white/10">
                          <div
                            className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-white shadow-[0_0_10px_white]"
                            style={{
                              left: `${reviews.fit}%`,
                              transform: "translate(-50%, -50%)",
                            }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="mb-1 flex justify-between text-xs font-bold uppercase text-white/40">
                          <span>{copy.comfort}</span>
                          <span>{reviews.comfort}%</span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                          <div
                            className="h-full bg-[var(--color-primary)]"
                            style={{ width: `${reviews.comfort}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {reviews.items.map((review) => (
                      <div
                        key={review.id}
                        className="border-b border-white/5 pb-6 last:border-0 last:pb-0"
                      >
                        <div className="mb-2 flex items-center gap-1 text-[var(--color-primary)]">
                          {[...Array(5)].map((_, index) => (
                            <Star
                              key={index}
                              size={12}
                              fill={
                                index < review.rating ? "currentColor" : "none"
                              }
                            />
                          ))}
                        </div>
                        <h4 className="mb-1 text-base font-bold text-white">
                          {review.title}
                        </h4>
                        <p className="mb-3 text-sm leading-relaxed text-white/60">
                          {review.content}
                        </p>
                        <div className="flex items-center gap-2 text-xs font-medium text-white/40">
                          <span className="text-white/80">{review.author}</span>
                          <span>&quot;</span>
                          <span>{review.date}</span>
                          <span>&quot;</span>
                          <span>
                            {copy.fit}:{" "}
                            <strong className="text-white/60">
                              {review.fit}
                            </strong>
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button className="mt-6 w-full rounded-[4px] border border-white/20 py-4 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-white hover:text-black">
                    {copy.writeReview}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-24 border-t border-white/10 pt-16">
          <h2 className="mb-10 text-2xl font-black font-heading uppercase tracking-tight text-white md:text-3xl">
            {copy.related}{" "}
            <span className="text-[var(--color-primary)]">.</span>
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <ProductCard
                key={item.id}
                product={item}
                className="h-full w-full"
              />
            ))}
          </div>
        </div>
      </section>

      <div
        className={`fixed bottom-0 left-0 z-50 flex w-full translate-y-full justify-center border-t border-white/10 bg-[#0A0A0A]/95 p-4 backdrop-blur-xl transition-transform duration-500 ease-[var(--ease-spring)] ${
          showStickyCart ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="container mx-auto flex max-w-6xl items-center justify-between gap-4">
          <div className="hidden flex-1 items-center gap-4 md:flex">
            <div className="relative h-14 w-12 overflow-hidden rounded">
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-white">
                {product.name}
              </p>
              <p className="text-sm font-black text-[var(--color-primary)]">
                {priceFormatted}
              </p>
            </div>
          </div>

          <div className="flex w-full items-center gap-3 md:w-auto">
            <select
              value={selectedSize || ""}
              onChange={(event) => setSelectedSize(event.target.value)}
              className="min-w-[120px] appearance-none rounded-[4px] border border-white/10 bg-white/5 px-4 h-12 cursor-pointer text-xs font-bold uppercase tracking-wider text-white outline-none focus:border-[var(--color-primary)]"
            >
              <option value="" disabled>
                {copy.size}
              </option>
              {product.sizes.map((size) => (
                <option key={size} value={size} className="text-black">
                  {size}
                </option>
              ))}
            </select>

            <button
              onClick={() => {
                if (!selectedSize) return;

                for (let index = 0; index < quantity; index += 1) {
                  addToCart(product, selectedSize);
                }
              }}
              className={`flex h-12 flex-1 items-center justify-center gap-2 rounded-[4px] text-xs font-bold uppercase tracking-widest transition-all duration-400 sm:text-sm md:w-[240px] ${
                selectedSize
                  ? "bg-[var(--color-primary)] text-black hover:bg-white"
                  : "cursor-not-allowed bg-white/10 text-white/30"
              }`}
              disabled={!selectedSize}
            >
              <ShoppingCart size={16} /> {copy.buy}
            </button>
          </div>
        </div>
      </div>

      <SiteFooter />

      <div
        ref={cursorRef}
        className={`pointer-events-none fixed top-0 left-0 z-[9999] -mt-7 -ml-7 flex h-14 w-14 items-center justify-center transition-opacity duration-300 ${
          isHoveringImage ? "opacity-100" : "opacity-0"
        }`}
      >
        <div
          className={`relative h-full w-full transition-transform duration-500 ease-[var(--ease-spring)] ${
            isMagnified
              ? "scale-[0.7] rotate-[90deg] opacity-70"
              : "scale-100 rotate-0 opacity-100"
          }`}
        >
          <Image
            src="/images/brand/brand-coritiba-cursor.webp"
            alt="aoritiba aursor"
            fill
            className="object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)]"
          />
        </div>
      </div>

      <ProductShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        productName={product.name}
        productUrl={
          typeof window !== "undefined"
            ? window.location.href
            : `https://coxastore.com.br/produto/${product.slug}`
        }
      />

      <ProductSizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        productType={
          product.name.toLowerCase().includes("jogador")
            ? "jogador"
            : "torcedor"
        }
      />
    </main>
  );
}
