"use strict";
"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Send, Bot, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Simulated AI Q&A Flow
const AI_FLOW = [
  { text: "Fala, Coxa-branca! Estava indeciso sobre qual manto levar? Me diz: você procura algo mais para jogar e suar a camisa, ou casual para torcer?", isBot: true },
];

export function AiShoppingAssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(AI_FLOW);
  const [step, setStep] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleChoice = (choice: string) => {
    // Add user message
    setMessages(prev => [...prev, { text: choice, isBot: false }]);
    setIsTyping(true);
    
    // Simulate thinking delay
    setTimeout(() => {
      setIsTyping(false);
      
      if (step === 0) {
        if (choice.includes("Jogar")) {
          setMessages(prev => [...prev, { text: "Excelente! Para performance no campo, a 'Camisa I 2026 Jogador' é feita com tecnologia que expulsa o suor e o corte colado não deixa o adversário puxar.", isBot: true }]);
          setStep(1); // shows product card
        } else {
          setMessages(prev => [...prev, { text: "Legal! Para passeio e Couto Pereira, o tecido confortável e larguinho do modelo Torcedor é sua melhor escolha. Olha só essa recomendação ideal:", isBot: true }]);
          setStep(2);
        }
      }
    }, 1500);
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-[100] w-14 h-14 bg-[var(--color-primary)] text-black rounded-full shadow-[0_4px_30px_rgba(96,232,97,0.4)] flex items-center justify-center cursor-pointer overflow-hidden group"
          >
            {/* Pulsing rings */}
            <div className="absolute inset-0 rounded-full border-4 border-black/10 scale-150 animate-ping opacity-50" />
            <Bot size={24} strokeWidth={2.5} className="group-hover:-translate-y-1 transition-transform" />
            <Sparkles size={12} className="absolute right-3 top-3 text-white fill-white group-hover:scale-125 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            style={{ transformOrigin: "bottom right" }}
            className="fixed bottom-6 right-6 sm:bottom-24 sm:right-6 z-[100] w-[calc(100%-48px)] sm:w-[380px] h-[500px] max-h-[80vh] bg-[#0A0A0A] border border-[var(--color-primary)]/30 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="w-full h-16 bg-[#111] border-b border-white/10 flex items-center px-4 justify-between shrink-0 relative overflow-hidden">
              <div className="absolute left-0 top-0 w-32 h-full bg-[var(--color-primary)]/10 blur-[30px] rounded-full pointer-events-none" />
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-10 h-10 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-black">
                  <Sparkles size={18} fill="currentColor"/>
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm tracking-widest uppercase flex items-center gap-2">
                    Coxa IA <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-pulse" />
                  </h3>
                  <p className="text-[10px] text-white/50 uppercase tracking-wider font-semibold">Consultor Pessoal</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-[url('/noise.png')] opacity-95">
              {messages.map((msg, idx) => (
                <motion.div 
                  initial={{ opacity: 0, x: msg.isBot ? -10 : 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={idx} 
                  className={`flex ${msg.isBot ? "justify-start" : "justify-end"}`}
                >
                  <div className={`max-w-[85%] rounded-2xl p-4 text-sm font-medium leading-relaxed
                    ${msg.isBot ? "bg-[#1A1A1A] text-white/90 border border-white/5 rounded-tl-none" 
                    : "bg-[var(--color-primary)] text-black rounded-tr-none font-bold"}`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-[#1A1A1A] p-4 rounded-2xl rounded-tl-none border border-white/5 flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}

              {/* Product Cards that AI generates conditionally */}
              {step === 1 && !isTyping && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
                  <div className="bg-black border border-[var(--color-primary)]/50 rounded-xl overflow-hidden w-[220px]">
                    <Image src="https://cdn.fanmarket.app.br/69c863e72a35aa109ae884d4_camisa-jogo-1-mas.png" width={220} height={220} alt="Camisa Jogador" className="w-full h-[180px] object-cover bg-white/5 p-4" />
                    <div className="p-3">
                      <p className="text-[10px] text-[var(--color-primary)] uppercase tracking-widest font-bold mb-1">Para Performance</p>
                      <h4 className="text-white text-xs font-bold leading-tight mb-2 uppercase">Camisa I 2026 Jogador</h4>
                      <Link onClick={() => setIsOpen(false)} href="/produto/camisa-jogo-1-masc" className="w-full h-8 text-[10px] font-bold text-black bg-[var(--color-primary)] rounded-[2px] flex items-center justify-center uppercase tracking-widest gap-1">
                        Ver Detalhes <ArrowRight size={12}/>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )}
              {step === 2 && !isTyping && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
                  <div className="bg-black border border-[var(--color-primary)]/50 rounded-xl overflow-hidden w-[220px]">
                    <div className="p-3">
                      <p className="text-[10px] text-[var(--color-primary)] uppercase tracking-widest font-bold mb-1">Dia a Dia & Estádio</p>
                      <h4 className="text-white text-xs font-bold leading-tight mb-2 uppercase">Versão Torcedor e Casual</h4>
                      <Link onClick={() => setIsOpen(false)} href="/produto/camisa-torcedor" className="w-full h-8 text-[10px] font-bold text-black bg-[var(--color-primary)] rounded-[2px] flex items-center justify-center uppercase tracking-widest gap-1">
                        Mostrar opções <ArrowRight size={12}/>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input Action Area */}
            <div className="p-4 border-t border-white/10 bg-[#0A0A0A]">
              {step === 0 && !isTyping ? (
                <div className="flex flex-col gap-2">
                  <button onClick={() => handleChoice("Para Jogar e Treinar")} className="w-full bg-[#1A1A1A] hover:bg-white text-white hover:text-black border border-white/10 transition-colors p-3 rounded-xl text-xs font-bold uppercase tracking-wider text-center">
                    Para Jogar e Treinar
                  </button>
                  <button onClick={() => handleChoice("Casual / Torcedor Estádio")} className="w-full bg-[#1A1A1A] hover:bg-white text-white hover:text-black border border-white/10 transition-colors p-3 rounded-xl text-xs font-bold uppercase tracking-wider text-center">
                    Casual / Torcedor Estádio
                  </button>
                </div>
              ) : step > 0 && !isTyping ? (
                 <button onClick={() => {setStep(0); setMessages(AI_FLOW);}} className="text-xs text-white/50 hover:text-white uppercase tracking-widest font-bold text-center w-full pb-2">
                   ← Refazer Perfil
                 </button>
              ) : (
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Digitando..." 
                    disabled 
                    className="w-full bg-[#1A1A1A] border border-white/10 rounded-full h-12 px-4 text-sm text-white focus:outline-none"
                  />
                  <button disabled className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-[var(--color-primary)] text-black">
                    <Send size={14} />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}



