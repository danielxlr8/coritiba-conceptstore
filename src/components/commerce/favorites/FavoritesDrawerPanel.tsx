"use client";

import { useRef, useEffect, useState } from "react";
import { X, Trash2, ShoppingCart, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useShopStore } from "@/store/useShopStore";
import Image from "next/image";
import SplitType from "split-type";
import gsap from "gsap";

export function FavoritesDrawerPanel() {
  const {
    favoriteItems,
    isFavoritesOpen,
    setFavoritesOpen,
    toggleFavorite,
    addToCart,
    setCartOpen,
  } = useShopStore();
  const titleRef = useRef<HTMLHeadingElement>(null);
  const addFeedbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);
  const [toastProductName, setToastProductName] = useState<string | null>(null);

  useEffect(() => {
    if (isFavoritesOpen && titleRef.current) {
      const text = new SplitType(titleRef.current, { types: 'chars' });
      gsap.fromTo(text.chars, 
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.05, ease: "power4.out", delay: 0.2 }
      );
      return () => { text.revert(); };
    }
  }, [isFavoritesOpen]);

  useEffect(() => {
    return () => {
      if (addFeedbackTimeoutRef.current) {
        clearTimeout(addFeedbackTimeoutRef.current);
      }
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  const handleAddToCart = (product: (typeof favoriteItems)[number]) => {
    addToCart(product, product.sizes[0] || "M");
    setCartOpen(false);

    setRecentlyAddedId(product.id);
    setToastProductName(product.name);

    if (addFeedbackTimeoutRef.current) {
      clearTimeout(addFeedbackTimeoutRef.current);
    }
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }

    addFeedbackTimeoutRef.current = setTimeout(() => {
      setRecentlyAddedId((current) => (current === product.id ? null : current));
    }, 1800);

    toastTimeoutRef.current = setTimeout(() => {
      setToastProductName(null);
    }, 4000);
  };

  const handleOpenCart = () => {
    setToastProductName(null);
    setFavoritesOpen(false);
    setCartOpen(true);
  };

  // Drawer Animation Variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const drawerVariants = {
    hidden: { x: "100%", transition: { duration: 0.6 } },
    visible: { x: 0, transition: { duration: 0.6 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <AnimatePresence>
      {isFavoritesOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={() => setFavoritesOpen(false)}
          />

          {/* Drawer */}
          <motion.div
            className="fixed top-0 right-0 h-[100dvh] w-full md:w-[480px] bg-[#0A0A0A] z-[70] shadow-2xl border-l border-white/5 flex flex-col"
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 md:p-8 border-b border-white/10">
              <h2 ref={titleRef} className="text-2xl font-black font-heading uppercase tracking-tighter text-white">
                Favoritos <span className="text-[var(--color-primary)]">({favoriteItems.length})</span>
              </h2>
              <button 
                onClick={() => setFavoritesOpen(false)}
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content List */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 md:p-8 custom-scrollbar">
              {favoriteItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-white/40">
                  <div className="w-16 h-16 border border-white/10 rounded flex items-center justify-center mb-4">
                    <X size={24} className="text-white/20" />
                  </div>
                  <p className="text-sm font-semibold uppercase tracking-widest text-center px-4">Sem produtos salvos</p>
                </div>
              ) : (
                <motion.div 
                  className="flex flex-col gap-6"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } }
                  }}
                >
                  {favoriteItems.map((product) => (
                    <motion.div 
                      key={product.id} 
                      variants={itemVariants}
                      className="flex gap-4 group"
                    >
                      {/* Image */}
                      <div className="w-24 h-32 md:w-28 md:h-[140px] bg-[#111] rounded overflow-hidden relative shrink-0">
                        <Image
                          src={product.cardImage || product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-[var(--ease-premium)]"
                        />
                      </div>
                      
                      {/* Details */}
                      <div className="flex flex-col flex-1 py-1">
                        <div className="flex justify-between items-start gap-4">
                          <h3 className="text-sm font-bold font-heading uppercase leading-tight text-white/90 group-hover:text-white line-clamp-2">
                            {product.name}
                          </h3>
                          <button 
                            onClick={() => toggleFavorite(product)}
                            className="text-white/40 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        
                        <p className="font-bold text-white tracking-wide mt-2">
                          {product.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                        </p>
                        
                        <div className="mt-auto">
                          <button
                            onClick={() => handleAddToCart(product)}
                            className={`w-full flex items-center justify-center gap-2 border text-xs font-bold uppercase tracking-widest py-2.5 rounded-[2px] transition-colors ${
                              recentlyAddedId === product.id
                                ? "border-[var(--color-primary)]/50 bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                                : "border-white/20 hover:border-white text-white"
                            }`}
                          >
                            {recentlyAddedId === product.id ? (
                              <>
                                <Check size={14} /> Adicionado
                              </>
                            ) : (
                              <>
                                <ShoppingCart size={14} /> Adicionar
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
            <AnimatePresence>
              {toastProductName && (
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 16 }}
                  className="pointer-events-none absolute bottom-6 left-6 right-6 z-20 md:bottom-8 md:left-8 md:right-8"
                >
                  <div className="pointer-events-auto flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[#111]/95 px-4 py-4 shadow-[0_24px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl">
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--color-primary)]">
                        Produto adicionado
                      </p>
                      <p className="mt-1 truncate text-sm font-semibold text-white">
                        {toastProductName} foi para o carrinho.
                      </p>
                    </div>

                    <button
                      onClick={handleOpenCart}
                      className="shrink-0 rounded-full border border-white/15 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-colors hover:border-white hover:bg-white hover:text-black"
                    >
                      Ver carrinho
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

