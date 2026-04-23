"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useState } from "react";
import { Product } from "@/data/productCatalog";
import { useLocale, type Locale } from "@/components/providers/LocaleProvider";
import { cn, repairDeepStrings } from "@/lib/utils";
import { useShopStore } from "@/store/useShopStore";

interface ProductCardProps {
  product: Product;
  className?: string;
  large?: boolean;
}

const localeFormatMap: Record<Locale, string> = {
  pt: "pt-BR",
  en: "en-US",
  es: "es-ES",
};

const productCardCopy: Record<
  Locale,
  {
    memberDiscount: string;
    genderLabels: Record<string, string>;
  }
> = {
  pt: {
    memberDiscount: "-20% Socio",
    genderLabels: {
      masculino: "Masculino",
      feminino: "Feminino",
      infantil: "Infantil",
    },
  },
  en: {
    memberDiscount: "-20% Member",
    genderLabels: {
      masculino: "Men",
      feminino: "Women",
      infantil: "Kids",
    },
  },
  es: {
    memberDiscount: "-20% Socio",
    genderLabels: {
      masculino: "Hombre",
      feminino: "Mujer",
      infantil: "Infantil",
    },
  },
};

export function ProductCard({
  product,
  className,
  large = false,
}: ProductCardProps) {
  const { locale } = useLocale();
  const copy = repairDeepStrings(productCardCopy[locale]);
  const { toggleFavorite, favoriteItems } = useShopStore();
  const isFavorite = favoriteItems.some((favorite) => favorite.id === product.id);
  const [hoverReady, setHoverReady] = useState(false);

  const priceFormatted = product.price.toLocaleString(localeFormatMap[locale], {
    style: "currency",
    currency: "BRL",
  });
  const href = `/produto/${product.slug}`;

  const mainImg = product.cardImage || product.images[0];
  const hoverImg = product.images[1] || mainImg;

  const handleFavoriteClick = (event: React.MouseEvent) => {
    event.preventDefault();
    toggleFavorite(product);
  };

  return (
    <Link
      href={href}
      onMouseEnter={() => setHoverReady(true)}
      className={cn(
        "group relative block cursor-pointer overflow-hidden rounded-[4px] bg-neutral-900 transition-all duration-500 ease-[var(--ease-premium)] hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(96,232,97,0.15)]",
        large ? "aspect-square md:aspect-[3/4]" : "aspect-[4/5]",
        className,
      )}
    >
      <div className="absolute inset-0 h-full w-full overflow-hidden bg-[#0A0A0A]">
        <Image
          src={mainImg}
          alt={product.name}
          fill
          className="object-cover opacity-100 transition-transform duration-500 ease-[var(--ease-fluid)] group-hover:scale-[1.05] group-hover:opacity-0"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        {hoverReady && (
          <Image
            src={hoverImg}
            alt={`${product.name} hover`}
            fill
            className="object-cover opacity-0 transition-all duration-500 ease-[var(--ease-fluid)] group-hover:scale-100 group-hover:opacity-100"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-80 transition-opacity duration-1000 group-hover:opacity-100" />
      </div>

      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
        {product.discountInfo && (
          <span className="inline-flex items-center gap-1.5 bg-black px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-[#60E861]">
            <span className="ball-spin inline-block">✦</span>
            {copy.memberDiscount}
          </span>
        )}
      </div>

      <button
        onClick={handleFavoriteClick}
        className="absolute top-4 right-4 z-30 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/40 backdrop-blur-sm transition-colors hover:bg-black/60"
      >
        <Heart
          size={18}
          className={cn(
            "transition-colors duration-300",
            isFavorite
              ? "fill-[var(--color-primary)] text-[var(--color-primary)]"
              : "text-white group-hover:text-[var(--color-primary)]",
          )}
        />
      </button>

      <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-end p-6 opacity-100 md:p-8">
        <div className="flex translate-y-8 items-end justify-between transition-transform duration-700 ease-[var(--ease-spring)] group-hover:translate-y-0">
          <div className="relative flex w-full flex-col gap-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-primary)] md:text-xs">
              {copy.genderLabels[product.gender] || product.gender}
            </p>
            <h3 className="mt-1 line-clamp-2 pr-12 font-heading text-xl uppercase leading-none tracking-widest text-white md:text-3xl">
              {product.name}
            </h3>

            <div className="mt-2 flex items-center justify-between">
              <p className="text-sm tracking-wide text-white/60">{priceFormatted}</p>

              <div className="flex flex-wrap justify-end gap-1.5 opacity-0 transition-opacity duration-500 delay-100 group-hover:opacity-100">
                {product.sizes.map((size) => (
                  <span
                    key={size}
                    className="rounded-[2px] border border-white/20 bg-white/10 px-1.5 py-0.5 text-[10px] font-bold uppercase text-white/70"
                  >
                    {size}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
