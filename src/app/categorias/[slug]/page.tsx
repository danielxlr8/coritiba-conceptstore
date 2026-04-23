"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Check,
  ChevronDown,
  ChevronRight,
  SearchX,
  SlidersHorizontal,
  X,
} from "lucide-react";
import gsap from "gsap";
import { AnimatePresence, motion } from "framer-motion";
import { SiteFooter } from "@/components/navigation/SiteFooter";
import {
  useLocale,
  type Locale,
} from "@/components/providers/LocaleProvider";
import { MainNavbar } from "@/components/navigation/MainNavbar";
import { ProductCard } from "@/components/commerce/catalog/ProductCard";
import { PRODUCTS } from "@/data/productCatalog";

const CATEGORIES = ["uniformes", "treino", "casual", "infantojuvenil"] as const;
const GENDERS = ["masculino", "feminino", "infantil"] as const;
const SIZES = ["P", "M", "G", "GG", "EG", "3G"];

type Category = (typeof CATEGORIES)[number];
type Gender = (typeof GENDERS)[number];
type SortOrder = "relevantes" | "menor" | "maior";

const localeCategoryLabels: Record<Locale, Record<Category, string>> = {
  pt: {
    uniformes: "Uniformes",
    treino: "Treino",
    casual: "Casual",
    infantojuvenil: "Infantojuvenil",
  },
  en: {
    uniformes: "Jerseys",
    treino: "Training",
    casual: "Casual",
    infantojuvenil: "Youth",
  },
  es: {
    uniformes: "Uniformes",
    treino: "Entrenamiento",
    casual: "Casual",
    infantojuvenil: "Infantil",
  },
};

const localeGenderLabels: Record<Locale, Record<Gender, string>> = {
  pt: {
    masculino: "Masculino",
    feminino: "Feminino",
    infantil: "Infantil",
  },
  en: {
    masculino: "Men",
    feminino: "Women",
    infantil: "Kids",
  },
  es: {
    masculino: "Hombre",
    feminino: "Mujer",
    infantil: "Infantil",
  },
};

const pageCopy: Record<
  Locale,
  {
    home: string;
    categories: string;
    productFound: string;
    productsFound: string;
    filters: string;
    sortBy: string;
    emptyTitle: string;
    emptyTitleAccent: string;
    emptyDescription: string;
    clearFilters: string;
    active: string;
    gender: string;
    size: string;
    member: string;
    memberDescription: string;
    clearAllFilters: string;
    noResults: string;
    viewResults: (count: number) => string;
    sortLabels: Record<SortOrder, string>;
  }
> = {
  pt: {
    home: "Home",
    categories: "Categorias",
    productFound: "Produto Encontrado",
    productsFound: "Produtos Encontrados",
    filters: "Filtros",
    sortBy: "Ordenar por:",
    emptyTitle: "Nenhum Produto",
    emptyTitleAccent: "Encontrado",
    emptyDescription:
      "Os filtros selecionados nao correspondem a nenhum item do catalogo atual.",
    clearFilters: "Limpar Filtros",
    active: "ativos",
    gender: "Genero",
    size: "Tamanho",
    member: "Socio Coxa",
    memberDescription: "Mostrar apenas itens com desconto para socios.",
    clearAllFilters: "Limpar todos os filtros",
    noResults: "Nenhum resultado",
    viewResults: (count) =>
      `Ver ${count} produto${count > 1 ? "s" : ""}`,
    sortLabels: {
      relevantes: "Mais Relevantes",
      menor: "Menor Preco",
      maior: "Maior Preco",
    },
  },
  en: {
    home: "Home",
    categories: "Categories",
    productFound: "Product Found",
    productsFound: "Products Found",
    filters: "Filters",
    sortBy: "Sort by:",
    emptyTitle: "No Products",
    emptyTitleAccent: "Found",
    emptyDescription:
      "The selected filters do not match any item in the current catalog.",
    clearFilters: "Clear Filters",
    active: "active",
    gender: "Gender",
    size: "Size",
    member: "Coxa Member",
    memberDescription: "Show only items with member discount.",
    clearAllFilters: "Clear all filters",
    noResults: "No results",
    viewResults: (count) =>
      `View ${count} product${count > 1 ? "s" : ""}`,
    sortLabels: {
      relevantes: "Most Relevant",
      menor: "Lowest Price",
      maior: "Highest Price",
    },
  },
  es: {
    home: "Home",
    categories: "Categorias",
    productFound: "Producto Encontrado",
    productsFound: "Productos Encontrados",
    filters: "Filtros",
    sortBy: "Ordenar por:",
    emptyTitle: "Ningun Producto",
    emptyTitleAccent: "Encontrado",
    emptyDescription:
      "Los filtros seleccionados no coinciden con ningun articulo del catalogo actual.",
    clearFilters: "Limpiar Filtros",
    active: "activos",
    gender: "Genero",
    size: "Talla",
    member: "Socio Coxa",
    memberDescription: "Mostrar solo articulos con descuento para socios.",
    clearAllFilters: "Limpiar todos los filtros",
    noResults: "Sin resultados",
    viewResults: (count) =>
      `Ver ${count} producto${count > 1 ? "s" : ""}`,
    sortLabels: {
      relevantes: "Mas Relevantes",
      menor: "Menor Precio",
      maior: "Mayor Precio",
    },
  },
};

function formatSlugTitle(slug: string) {
  return slug.replace(/-/g, " ").toUpperCase();
}

export default function CategoryListingPage() {
  const { locale } = useLocale();
  const copy = pageCopy[locale];
  const categoryLabels = localeCategoryLabels[locale];
  const genderLabels = localeGenderLabels[locale];
  const params = useParams();
  const slug = params.slug as string;

  const getInitialCategories = (): Category[] => {
    if (slug === "infantojuvenil") return [];
    if (CATEGORIES.includes(slug as Category)) return [slug as Category];
    return [];
  };

  const getInitialGenders = (): Gender[] => {
    if (slug === "infantojuvenil") return ["infantil"];
    return [];
  };

  const [selectedCategories, setSelectedCategories] = useState<Category[]>(
    getInitialCategories,
  );
  const [selectedGenders, setSelectedGenders] = useState<Gender[]>(
    getInitialGenders,
  );
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [onlySocio, setOnlySocio] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<SortOrder>("relevantes");
  const [isSortOpen, setIsSortOpen] = useState(false);

  const finalProducts = useMemo(() => {
    let result = [...PRODUCTS];
    const selectedStandardCategories = selectedCategories.filter(
      (category): category is Exclude<Category, "infantojuvenil"> =>
        category !== "infantojuvenil",
    );

    if (selectedCategories.length > 0) {
      result = result.filter((product) =>
        selectedCategories.includes("infantojuvenil" as Category)
          ? product.gender === "infantil" ||
            selectedStandardCategories.includes(product.category)
          : selectedCategories.includes(product.category as Category),
      );
    } else if (slug === "infantojuvenil" && selectedGenders.length === 0) {
      result = result.filter((product) => product.gender === "infantil");
    }

    if (selectedGenders.length > 0) {
      result = result.filter((product) =>
        selectedGenders.includes(product.gender as Gender),
      );
    }

    if (selectedSizes.length > 0) {
      result = result.filter((product) =>
        selectedSizes.some((size) => product.sizes.includes(size)),
      );
    }

    if (onlySocio) {
      result = result.filter(
        (product) =>
          product.discountInfo &&
          product.discountInfo.toLowerCase().includes("socio"),
      );
    }

    if (sortOrder === "menor") result.sort((a, b) => a.price - b.price);
    if (sortOrder === "maior") result.sort((a, b) => b.price - a.price);

    return result;
  }, [
    onlySocio,
    selectedCategories,
    selectedGenders,
    selectedSizes,
    slug,
    sortOrder,
  ]);

  const toggleCategory = (category: Category) =>
    setSelectedCategories((previous) =>
      previous.includes(category)
        ? previous.filter((item) => item !== category)
        : [...previous, category],
    );

  const toggleGender = (gender: Gender) =>
    setSelectedGenders((previous) =>
      previous.includes(gender)
        ? previous.filter((item) => item !== gender)
        : [...previous, gender],
    );

  const toggleSize = (size: string) =>
    setSelectedSizes((previous) =>
      previous.includes(size)
        ? previous.filter((item) => item !== size)
        : [...previous, size],
    );

  const clearAllFilters = () => {
    setSelectedCategories(getInitialCategories());
    setSelectedGenders(getInitialGenders());
    setSelectedSizes([]);
    setOnlySocio(false);
  };

  const activeFilterCount =
    selectedCategories.length +
    selectedGenders.length +
    selectedSizes.length +
    (onlySocio ? 1 : 0);

  const sidebarRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isSidebarOpen) {
      gsap.to(overlayRef.current, {
        opacity: 1,
        duration: 0.3,
        display: "block",
        ease: "power2.out",
      });
      gsap.to(sidebarRef.current, {
        x: 0,
        duration: 0.5,
        ease: "power3.out",
      });
      document.body.style.overflow = "hidden";
    } else {
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.3,
        display: "none",
        ease: "power2.in",
      });
      gsap.to(sidebarRef.current, {
        x: "-100%",
        duration: 0.5,
        ease: "power3.in",
      });
      document.body.style.overflow = "";
    }
  }, [isSidebarOpen]);

  const title =
    (slug in categoryLabels
      ? categoryLabels[slug as Category]
      : formatSlugTitle(slug)) || formatSlugTitle(slug);

  return (
    <main className="min-h-screen cursor-crosshair bg-[var(--color-background-dark)] flex flex-col">
      <MainNavbar />

      <div className="container mx-auto px-6 pt-28 pb-8">
        <nav className="mb-6 flex items-center gap-2 text-sm text-white/40">
          <Link
            href="/"
            className="transition-colors hover:text-[var(--color-primary)]"
          >
            {copy.home}
          </Link>
          <ChevronRight size={14} />
          <span className="text-white/70">{copy.categories}</span>
          <ChevronRight size={14} />
          <span className="font-bold text-white">{title}</span>
        </nav>

        <h1 className="text-5xl md:text-7xl font-black font-heading uppercase tracking-tight text-white leading-none">
          {title} <span className="text-[var(--color-primary)]">.</span>
        </h1>
        <motion.p
          key={finalProducts.length}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 text-lg font-medium text-white/50"
        >
          {finalProducts.length}{" "}
          {finalProducts.length === 1 ? copy.productFound : copy.productsFound}
        </motion.p>
      </div>

      <div className="sticky top-[72px] z-40 mt-4 mb-8 border-y border-white/10 bg-[#0A0A0A]/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="group flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-white transition-colors hover:text-[var(--color-primary)]"
          >
            <SlidersHorizontal
              size={18}
              className="transition-transform group-hover:scale-110"
            />
            {copy.filters}
            {activeFilterCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-primary)] text-[10px] font-black text-black"
              >
                {activeFilterCount}
              </motion.span>
            )}
          </button>

          <div className="relative">
            <button
              onClick={() => setIsSortOpen((value) => !value)}
              className="group flex cursor-pointer items-center gap-2"
            >
              <span className="text-sm font-medium text-white/60">
                {copy.sortBy}
              </span>
              <span className="text-sm font-bold text-white">
                {copy.sortLabels[sortOrder]}
              </span>
              <ChevronDown
                size={16}
                className={`text-white transition-transform duration-200 ${
                  isSortOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <AnimatePresence>
              {isSortOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full z-50 mt-2 w-48 overflow-hidden rounded-[4px] border border-white/10 bg-[#111] shadow-2xl"
                >
                  {(["relevantes", "menor", "maior"] as const).map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setSortOrder(option);
                        setIsSortOpen(false);
                      }}
                      className={`flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium transition-colors ${
                        sortOrder === option
                          ? "bg-white/5 text-[var(--color-primary)]"
                          : "text-white/70 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      {copy.sortLabels[option]}
                      {sortOrder === option && <Check size={14} />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <section className="container mx-auto flex-1 px-6 pb-24">
        <AnimatePresence mode="wait">
          {finalProducts.length > 0 ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-x-6 md:gap-y-10 lg:grid-cols-4"
            >
              <AnimatePresence>
                {finalProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{
                      duration: 0.4,
                      delay: index * 0.04,
                      ease: [0.23, 1, 0.32, 1],
                    }}
                    layout
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
              className="flex flex-col items-center justify-center py-32 text-center"
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  delay: 0.15,
                  duration: 0.5,
                  ease: [0.23, 1, 0.32, 1],
                }}
                className="mb-8 flex h-24 w-24 items-center justify-center rounded-full border border-white/10 bg-white/5"
              >
                <SearchX size={36} className="text-white/30" />
              </motion.div>

              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="mb-3 text-3xl font-black font-heading uppercase tracking-tighter text-white md:text-4xl"
              >
                {copy.emptyTitle}{" "}
                <span className="text-[var(--color-primary)]">
                  {copy.emptyTitleAccent}
                </span>
              </motion.h3>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="mb-10 max-w-sm text-base font-medium text-white/40"
              >
                {copy.emptyDescription}
              </motion.p>

              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={clearAllFilters}
                className="flex items-center gap-2 rounded-[4px] bg-[var(--color-primary)] px-8 py-4 text-sm font-bold uppercase tracking-widest text-black transition-colors hover:bg-white"
              >
                <X size={16} />
                {copy.clearFilters}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <SiteFooter />

      <div
        ref={overlayRef}
        onClick={() => setIsSidebarOpen(false)}
        className="fixed inset-0 z-[90] hidden bg-black/70 opacity-0 backdrop-blur-sm"
      />

      <div
        ref={sidebarRef}
        className="fixed top-0 left-0 z-[100] flex h-full w-[340px] max-w-[90vw] -translate-x-full flex-col border-r border-white/10 bg-[#0F0F0F] shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-white/10 p-6">
          <div className="flex items-center gap-3">
            <h3 className="font-heading text-2xl font-black uppercase tracking-widest text-white">
              {copy.filters}
            </h3>
            {activeFilterCount > 0 && (
              <span className="rounded-full bg-[var(--color-primary)] px-2 py-0.5 text-[11px] font-black uppercase tracking-wide text-black">
                {activeFilterCount} {copy.active}
              </span>
            )}
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="text-white/50 transition-colors hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 space-y-8 overflow-y-auto p-6">
          <div className="space-y-4">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
              {copy.categories}
            </h4>
            <div className="space-y-1">
              {CATEGORIES.map((category) => {
                const isActive = selectedCategories.includes(category);

                return (
                  <motion.button
                    key={category}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => toggleCategory(category)}
                    className={`group flex w-full items-center gap-3 rounded-[4px] px-3 py-2.5 transition-all duration-200 ${
                      isActive
                        ? "bg-[var(--color-primary)]/10"
                        : "hover:bg-white/5"
                    }`}
                  >
                    <div
                      className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-[2px] border transition-all duration-200 ${
                        isActive
                          ? "border-[var(--color-primary)] bg-[var(--color-primary)]"
                          : "border-white/20 group-hover:border-white/50"
                      }`}
                    >
                      {isActive && (
                        <Check size={12} className="text-black" strokeWidth={3} />
                      )}
                    </div>
                    <span
                      className={`text-sm font-semibold capitalize transition-colors ${
                        isActive
                          ? "text-white"
                          : "text-white/60 group-hover:text-white"
                      }`}
                    >
                      {categoryLabels[category]}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          <div className="space-y-4 border-t border-white/5 pt-6">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
              {copy.gender}
            </h4>
            <div className="space-y-1">
              {GENDERS.map((gender) => {
                const isActive = selectedGenders.includes(gender);

                return (
                  <motion.button
                    key={gender}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => toggleGender(gender)}
                    className={`group flex w-full items-center gap-3 rounded-[4px] px-3 py-2.5 transition-all duration-200 ${
                      isActive
                        ? "bg-[var(--color-primary)]/10"
                        : "hover:bg-white/5"
                    }`}
                  >
                    <div
                      className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-[2px] border transition-all duration-200 ${
                        isActive
                          ? "border-[var(--color-primary)] bg-[var(--color-primary)]"
                          : "border-white/20 group-hover:border-white/50"
                      }`}
                    >
                      {isActive && (
                        <Check size={12} className="text-black" strokeWidth={3} />
                      )}
                    </div>
                    <span
                      className={`text-sm font-semibold capitalize transition-colors ${
                        isActive
                          ? "text-white"
                          : "text-white/60 group-hover:text-white"
                      }`}
                    >
                      {genderLabels[gender]}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          <div className="space-y-4 border-t border-white/5 pt-6">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
              {copy.size}
            </h4>
            <div className="flex flex-wrap gap-2">
              {SIZES.map((size) => {
                const isActive = selectedSizes.includes(size);

                return (
                  <motion.button
                    key={size}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => toggleSize(size)}
                    className={`h-10 w-12 rounded-[2px] border text-xs font-bold transition-all duration-200 ${
                      isActive
                        ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-black"
                        : "border-white/15 text-white/60 hover:border-white hover:text-white"
                    }`}
                  >
                    {size}
                  </motion.button>
                );
              })}
            </div>
          </div>

          <div className="border-t border-white/5 pt-6">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => setOnlySocio((value) => !value)}
              className={`w-full cursor-pointer rounded-[4px] border p-4 flex items-start gap-3 transition-all duration-300 ${
                onlySocio
                  ? "border-[var(--color-primary)]/60 bg-[var(--color-primary)]/15"
                  : "border-[var(--color-primary)]/20 bg-[var(--color-primary)]/5 hover:border-[var(--color-primary)]/40"
              }`}
            >
              <div
                className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-[2px] border transition-all ${
                  onlySocio
                    ? "border-[var(--color-primary)] bg-[var(--color-primary)]"
                    : "border-[var(--color-primary)]/60"
                }`}
              >
                {onlySocio && (
                  <Check size={12} className="text-black" strokeWidth={3} />
                )}
              </div>
              <div className="text-left">
                <p className="text-sm font-bold uppercase tracking-wide text-[var(--color-primary)]">
                  {copy.member}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-[var(--color-primary)]/60">
                  {copy.memberDescription}
                </p>
              </div>
            </motion.button>
          </div>

          {activeFilterCount > 0 && (
            <motion.button
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={clearAllFilters}
              className="w-full py-2 text-center text-xs font-bold uppercase tracking-widest text-white/40 transition-colors hover:text-white/80"
            >
              {copy.clearAllFilters}
            </motion.button>
          )}
        </div>

        <div className="border-t border-white/10 bg-[#0A0A0A] p-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setIsSidebarOpen(false)}
            className="h-12 w-full rounded-[4px] bg-white text-sm font-bold uppercase tracking-widest text-black transition-colors hover:bg-[var(--color-primary)]"
          >
            {finalProducts.length === 0
              ? copy.noResults
              : copy.viewResults(finalProducts.length)}
          </motion.button>
        </div>
      </div>
    </main>
  );
}
