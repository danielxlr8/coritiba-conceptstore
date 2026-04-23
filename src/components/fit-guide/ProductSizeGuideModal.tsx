"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Ruler, User, ArrowRight } from "lucide-react";

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  productType?: "jogador" | "torcedor" | "feminina";
}

type FitPreference = "justo" | "normal" | "largo";

const FIT_OPTIONS: Array<{
  id: FitPreference;
  label: string;
  desc: string;
}> = [
  {
    id: "justo",
    label: "Ajustado (Slim)",
    desc: "Colado ao corpo, zero sobra de tecido.",
  },
  {
    id: "normal",
    label: "Caimento Padrao",
    desc: "Classico, conforto equilibrado.",
  },
  {
    id: "largo",
    label: "Largo (Oversized)",
    desc: "Estilo mais solto e relaxado.",
  },
];

export function ProductSizeGuideModal({
  isOpen,
  onClose,
  productType = "torcedor",
}: SizeGuideModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [fitPreference, setFitPreference] = useState<FitPreference | null>(
    null,
  );

  const getRecommendation = () => {
    if (!fitPreference) return null;
    if (productType === "jogador") {
      if (fitPreference === "largo") {
        return "Recomendamos pegar UM TAMANHO MAIOR (Ex: se usa M, peca G). O modelo jogador possui corte atletico slim muito restrito.";
      }
      if (fitPreference === "normal") {
        return "Recomendamos pegar O SEU TAMANHO EXATO para um caimento bem ajustado ao corpo.";
      }
      return "Recomendamos pegar O SEU TAMANHO EXATO para um visual 'Performance' de campo.";
    }

    if (fitPreference === "justo") {
      return "Recomendamos pegar UM TAMANHO MENOR. O modelo padr?o tem corte levemente solto.";
    }
    if (fitPreference === "largo") {
      return "Recomendamos pegar UM TAMANHO MAIOR para o estilo oversized streetwear.";
    }
    return "Seu tamanho normal e a escolha ideal.";
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setStep(1);
      setFitPreference(null);
    }, 300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999]"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full md:w-[480px] bg-[#0A0A0A] border-l border-white/5 z-[10000] shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-sm font-bold uppercase tracking-widest text-white flex items-center gap-2">
                <Ruler size={16} className="text-[var(--color-primary)]" />
                Inteligencia de Medidas
              </h2>
              <button
                onClick={handleClose}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-white/50 hover:bg-white/10 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-8 relative">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex flex-col h-full"
                  >
                    <div className="mb-8">
                      <h3 className="text-2xl font-black font-heading uppercase text-white mb-2 leading-tight">
                        Como voce gosta
                        <br />
                        que a camisa vista?
                      </h3>
                      <p className="text-sm text-white/50">
                        Nossa inteligencia ajuda voce a evitar trocas e
                        devolucoes escolhendo o fit perfeito para o seu estilo.
                      </p>
                    </div>

                    <div className="space-y-3">
                      {FIT_OPTIONS.map((pref) => (
                        <button
                          key={pref.id}
                          onClick={() => setFitPreference(pref.id)}
                          className={`w-full text-left p-5 rounded-[4px] border border-white/10 transition-all flex flex-col gap-1 relative overflow-hidden group ${
                            fitPreference === pref.id
                              ? "bg-[var(--color-primary)]/10 border-[var(--color-primary)]/50"
                              : "bg-[#111] hover:bg-white/5"
                          }`}
                        >
                          {fitPreference === pref.id && (
                            <div className="absolute top-0 left-0 w-1 h-full bg-[var(--color-primary)]" />
                          )}
                          <span
                            className={`text-sm font-bold uppercase tracking-wider ${
                              fitPreference === pref.id
                                ? "text-[var(--color-primary)]"
                                : "text-white"
                            }`}
                          >
                            {pref.label}
                          </span>
                          <span className="text-xs text-white/40 font-medium">
                            {pref.desc}
                          </span>
                        </button>
                      ))}
                    </div>

                    <div className="mt-auto pt-8">
                      <button
                        disabled={!fitPreference}
                        onClick={() => setStep(2)}
                        className={`w-full h-14 rounded-[2px] font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 transition-all ${
                          fitPreference
                            ? "bg-white text-black hover:bg-[var(--color-primary)]"
                            : "bg-white/5 text-white/20 cursor-not-allowed"
                        }`}
                      >
                        Ver Recomendacao <ArrowRight size={16} />
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step-2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <button
                      onClick={() => setStep(1)}
                      className="text-[10px] font-bold text-white/40 hover:text-white uppercase tracking-widest mb-6"
                    >
                      ← Mudar preferência
                    </button>

                    <div className="bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/30 p-6 rounded-[2px] mb-8">
                      <div className="w-10 h-10 rounded bg-[var(--color-primary)] flex items-center justify-center mb-4 text-black">
                        <User size={20} strokeWidth={2.5} />
                      </div>
                      <h4 className="text-white font-bold uppercase tracking-wider text-sm mb-2">
                        Seu Perfil Ideal:
                      </h4>
                      <p className="text-sm text-white/80 leading-relaxed font-medium">
                        {getRecommendation()}
                      </p>
                    </div>

                    <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
                      Tabela de Medidas Oficial
                    </h4>
                    <div className="bg-[#111] rounded-[2px] border border-white/5 overflow-hidden">
                      <table className="w-full text-left text-xs uppercase tracking-wider">
                        <thead>
                          <tr className="bg-white/5 text-white/60">
                            <th className="p-4 font-bold">Tamanho</th>
                            <th className="p-4 font-bold">Peito (cm)</th>
                            <th className="p-4 font-bold">
                              Comprimento (cm)
                            </th>
                          </tr>
                        </thead>
                        <tbody className="text-white/80 divide-y divide-white/5">
                          <tr>
                            <td className="p-4 font-black">P</td>
                            <td className="p-4">48</td>
                            <td className="p-4">70</td>
                          </tr>
                          <tr>
                            <td className="p-4 font-black">M</td>
                            <td className="p-4">52</td>
                            <td className="p-4">72</td>
                          </tr>
                          <tr>
                            <td className="p-4 font-black">G</td>
                            <td className="p-4">56</td>
                            <td className="p-4">74</td>
                          </tr>
                          <tr>
                            <td className="p-4 font-black">GG</td>
                            <td className="p-4">60</td>
                            <td className="p-4">76</td>
                          </tr>
                          <tr>
                            <td className="p-4 font-black">3G</td>
                            <td className="p-4">65</td>
                            <td className="p-4">78</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="mt-8 p-4 bg-white/5 rounded-[2px] flex items-start gap-3">
                      <span className="text-lg">ℹ</span>
                      <p className="text-xs text-white/50 leading-relaxed">
                        Coloque uma camisa que você gosta reta sobre a mesa e
                        tire as medidas para comparar com perfeição.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}


