"use client";

import { useState } from "react";
import { Copy, Check, MessageCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  productUrl: string;
}

export function ProductShareModal({ isOpen, onClose, productName, productUrl }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(productUrl);
    setCopied(true);
    
    // Vibrate when copying
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate([100]);
    }

    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    const text = `Dê uma olhada nisso: ${productName}\n\n${productUrl}`;
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 w-full md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[400px] z-[90] bg-[#111] border border-white/10 rounded-t-xl md:rounded-xl p-6 shadow-2xl"
          >
             <div className="flex justify-between items-center mb-6">
               <h3 className="text-white font-bold uppercase tracking-widest text-sm">Compartilhar</h3>
               <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
                 <X size={20} />
               </button>
             </div>

             <div className="flex flex-col gap-3">
               <button 
                 onClick={handleCopyLink}
                 className="flex items-center justify-between w-full h-14 px-4 bg-white/5 border border-white/10 rounded hover:bg-white/10 transition-colors"
               >
                 <span className="text-white text-sm font-medium">Copiar Link</span>
                 {copied ? <Check size={18} className="text-[var(--color-primary)]" /> : <Copy size={18} className="text-white/50" />}
               </button>

               <button 
                 onClick={handleWhatsApp}
                 className="flex items-center justify-between w-full h-14 px-4 bg-[#25D366]/10 border border-[#25D366]/30 rounded hover:bg-[#25D366]/20 transition-colors text-[#25D366]"
               >
                 <span className="text-sm font-medium font-bold">WhatsApp</span>
                 <MessageCircle size={18} />
               </button>
             </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

