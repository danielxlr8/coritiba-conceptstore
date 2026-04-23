"use client";

import { useRef, useEffect } from "react";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useShopStore } from "@/store/useShopStore";
import Image from "next/image";
import Link from "next/link";
import SplitType from "split-type";
import gsap from "gsap";

export function ShoppingCartDrawer() {
  const { cartItems, isCartOpen, setCartOpen, removeFromCart, updateQuantity } = useShopStore();
  const subtotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (isCartOpen && titleRef.current) {
      const text = new SplitType(titleRef.current, { types: 'chars' });
      gsap.fromTo(text.chars, 
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.05, ease: "power4.out", delay: 0.2 }
      );
      return () => { text.revert(); };
    }
  }, [isCartOpen]);

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
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={() => setCartOpen(false)}
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
                Seu Carrinho <span className="text-[var(--color-primary)]">({cartItems.length})</span>
              </h2>
              <button 
                onClick={() => setCartOpen(false)}
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content List */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 md:p-8 custom-scrollbar">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-white/40">
                  <div className="w-16 h-16 border border-white/10 rounded flex items-center justify-center mb-4">
                    <X size={24} className="text-white/20" />
                  </div>
                  <p className="text-sm font-semibold uppercase tracking-widest">Carrinho Vazio</p>
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
                  {cartItems.map((item) => (
                    <motion.div 
                      key={`${item.product.id}-${item.size}`} 
                      variants={itemVariants}
                      className="flex gap-4 group"
                    >
                      {/* Image */}
                      <div className="w-24 h-32 md:w-28 md:h-[140px] bg-[#111] rounded overflow-hidden relative shrink-0">
                        <Image
                          src={item.product.cardImage || item.product.images[0]}
                          alt={item.product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-[var(--ease-premium)]"
                        />
                      </div>
                      
                      {/* Details */}
                      <div className="flex flex-col flex-1 py-1">
                        <div className="flex justify-between items-start gap-4">
                          <h3 className="text-sm font-bold font-heading uppercase leading-tight text-white/90 group-hover:text-white line-clamp-2">
                            {item.product.name}
                          </h3>
                          <button 
                            onClick={() => removeFromCart(item.product.id, item.size)}
                            className="text-white/40 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        
                        <p className="text-xs text-white/50 uppercase mt-1">Tamanho: <span className="font-bold text-white/80">{item.size}</span></p>
                        
                        <div className="mt-auto flex items-center justify-between">
                          {/* Quantity Controls Brutalist */}
                          <div className="flex items-center gap-3 border border-white/20 rounded-[2px]">
                            <button 
                              onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="text-xs font-bold text-white w-2 text-center">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          
                          {/* Price */}
                          <p className="font-bold text-white tracking-wide">
                            {(item.product.price * item.quantity).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Footer Checkout */}
            {cartItems.length > 0 && (
              <div className="p-6 md:p-8 bg-[#050505] border-t border-white/5">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-sm text-white/60 uppercase tracking-widest font-semibold">Subtotal</span>
                  <span className="text-2xl font-black text-white tracking-tight">
                    {subtotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                  </span>
                </div>
                <Link 
                  href="/checkout"
                  onClick={() => setCartOpen(false)}
                  className="block w-full bg-white text-black font-black font-heading uppercase text-xl py-5 rounded-[2px] transition-transform active:scale-[0.98] hover:bg-[#60E861] duration-300 relative overflow-hidden group"
                >
                  <span className="relative z-10 flex h-[1.4em] items-center justify-center overflow-hidden">
                    <span className="absolute inset-0 flex items-center justify-center transition-transform duration-500 ease-[var(--ease-premium)] group-hover:-translate-y-full">
                      Finalizar Compra
                    </span>
                    <span className="absolute inset-0 flex items-center justify-center transition-transform duration-500 ease-[var(--ease-premium)] translate-y-full group-hover:translate-y-0 text-black">
                      Avançar →
                    </span>
                  </span>
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}


