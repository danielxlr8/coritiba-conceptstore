"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PRODUCTS } from "@/data/productCatalog";
import Image from "next/image";
import Link from "next/link";

interface SearchOverlayPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchOverlayPanel({
  isOpen,
  onClose,
}: SearchOverlayPanelProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const isBrowser = typeof document !== "undefined";

  const handleClose = useCallback(() => {
    setQuery("");
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const searchResults = query.trim() === "" 
    ? [] 
    : PRODUCTS.filter(p => {
        const q = query.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) || 
          p.category.toLowerCase().includes(q) ||
          p.subtitle.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tagline.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q)
        );
      }).slice(0, 4);

  if (!isBrowser) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-xl overflow-y-auto"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          onClick={handleClose}
        >
          <div 
            className="flex flex-col items-center pt-24 md:pt-40 px-6 min-h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={(e) => {
                e.preventDefault();
                handleClose();
              }}
              className="absolute top-4 right-4 md:top-8 md:right-8 text-white hover:text-[var(--color-primary)] transition-colors z-[9999] flex flex-col items-center gap-1 group cursor-pointer p-2 bg-black/40 rounded-full border border-white/10 hover:border-[var(--color-primary)] backdrop-blur-md"
              aria-label="Fechar pesquisa"
            >
              <X size={32} className="group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-bold tracking-widest uppercase mt-[-4px]">Fechar</span>
            </button>
            
            <div className="w-full max-w-4xl relative shrink-0 mt-8 md:mt-0">
            <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-white/40" size={36} />
            <input 
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="O que você está procurando?"
              className="w-full bg-transparent border-b-2 border-white/20 text-3xl md:text-5xl lg:text-6xl font-black font-heading uppercase text-white pb-4 pl-14 outline-none placeholder:text-white/20 focus:border-[var(--color-primary)] transition-colors"
            />
          </div>

          <div className="w-full max-w-4xl mt-12 text-left pb-20">
            {query.trim() === "" ? (
              <>
                <h3 className="text-white/40 uppercase tracking-widest text-xs font-bold mb-6">Sugestões de Busca</h3>
                <div className="flex gap-4 flex-wrap">
                  {["Camisa Oficial", "Viagem", "Moletom", "Goleiro"].map(term => (
                    <button 
                      key={term} 
                      onClick={() => setQuery(term)}
                      className="px-4 py-2 bg-white/5 border border-white/10 rounded-[2px] text-white text-sm hover:bg-[var(--color-primary)] hover:text-black hover:border-[var(--color-primary)] font-semibold transition-all"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-white/40 uppercase tracking-widest text-xs font-bold">
                    Resultados para <span>&quot;{query}&quot;</span>
                  </h3>
                  <span className="text-white/30 text-xs font-bold uppercase">{searchResults.length} Itens</span>
                </div>

                {searchResults.length === 0 ? (
                  <p className="text-white/60 text-lg">Nenhum produto encontrado.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {searchResults.map((product) => (
                        <Link 
                          href={`/produto/${product.slug}`} 
                          key={product.id}
                          onClick={handleClose}
                          className="group flex flex-col gap-3"
                      >
                        <div className="relative aspect-[3/4] bg-[#111] overflow-hidden rounded-[4px] border border-white/5 group-hover:border-white/20 transition-colors">
                          <Image
                            src={product.cardImage || product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-[var(--ease-premium)]"
                          />
                        </div>
                        <div>
                          <h4 className="text-white font-bold uppercase tracking-wide text-xs line-clamp-2 leading-tight group-hover:text-[var(--color-primary)] transition-colors">
                            {product.name}
                          </h4>
                          <p className="text-white/50 text-[10px] font-bold tracking-widest uppercase mt-1">
                            {product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

