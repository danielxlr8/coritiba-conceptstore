"use client";

import { ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useShopStore } from "@/store/useShopStore";
import { useEffect, useState } from "react";

export function FloatingCartButton() {
  const { cartItems, toggleCart, isCartOpen, isCartVibrating } = useShopStore();
  const [isVisible, setIsVisible] = useState(false);
  
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      // Show floating cart when scrolled down past header
      if (window.scrollY > 200) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Also visible if there are items, regardless of scroll? 
    // Let's stick to scroll for now so it doesn't overlap header
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && !isCartOpen && totalItems > 0 && (
        <motion.button
          onClick={toggleCart}
          initial={{ scale: 0, opacity: 0, rotate: -90 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          exit={{ scale: 0, opacity: 0, rotate: 90 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="fixed bottom-24 right-6 z-40 bg-[var(--color-primary)] text-black w-14 h-14 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(69,209,94,0.4)] hover:shadow-[0_0_30px_rgba(69,209,94,0.6)] transition-shadow duration-300 group"
        >
          <motion.div 
            className="relative"
            animate={isCartVibrating ? { rotate: [0, -25, 25, -25, 25, 0], scale: [1, 1.3, 1] } : {}}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            <ShoppingBag size={24} className="group-hover:animate-bounce" />
            <span className={cn(
              "absolute -top-3 -right-3 bg-black text-white text-[11px] font-bold h-5 w-5 rounded-full flex items-center justify-center border-2 border-[var(--color-primary)] transition-colors duration-500",
              isCartVibrating && "bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.8)] border-white"
            )}>
              {totalItems}
            </span>
          </motion.div>
        </motion.button>
      )}
    </AnimatePresence>
  );
}

