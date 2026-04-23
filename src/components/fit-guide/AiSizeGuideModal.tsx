"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X, Sparkles, Activity, Minus, Plus } from "lucide-react";
import { useLocale, type Locale } from "@/components/providers/LocaleProvider";
import { repairDeepStrings } from "@/lib/utils";

type Mode = "selection" | "fast" | "result";
type Size = "P" | "M" | "G" | "GG";
type BodyType = "magro" | "normal" | "atletico" | "forte" | "obeso";

interface AISizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NumericStepperFieldProps {
  label: string;
  value: number | "";
  onChange: (value: number | "") => void;
  min: number;
  max: number;
  step: number;
  unit: string;
  placeholder: string;
  decreaseLabel: string;
  increaseLabel: string;
}

const BODY_TYPES: BodyType[] = [
  "magro",
  "normal",
  "atletico",
  "forte",
  "obeso",
];

const bodyTypeLabels: Record<Locale, Record<BodyType, string>> = {
  pt: {
    magro: "Magro",
    normal: "Normal",
    atletico: "Atl?tico",
    forte: "Forte",
    obeso: "Obeso",
  },
  en: {
    magro: "Slim",
    normal: "Regular",
    atletico: "Athletic",
    forte: "Strong",
    obeso: "Broad",
  },
  es: {
    magro: "Delgado",
    normal: "Normal",
    atletico: "Atl?tico",
    forte: "Robusto",
    obeso: "Amplio",
  },
};

const modalCopy: Record<
  Locale,
  {
    title: string;
    selectionTag: string;
    selectionTitle: string;
    selectionDescription: string;
    selectionCardTitle: string;
    selectionCardDescription: string;
    back: string;
    fastTag: string;
    fastTitle: string;
    fastDescription: string;
    height: string;
    weight: string;
    bodyType: string;
    calculate: string;
    resultTag: string;
    recommendedTitle: string;
    fitTitle: string;
    tighter: string;
    looser: string;
    continueShopping: string;
    redo: string;
    decrease: string;
    increase: string;
  }
> = {
  pt: {
    title: "AI Fit Guide",
    selectionTag: "Recomendacao Instant?nea",
    selectionTitle: "Descubra seu tamanho ideal",
    selectionDescription:
      "Resposta r?pida, precisa e pensada para um caimento mais seguro.",
    selectionCardTitle: "Descobrir meu tamanho",
    selectionCardDescription:
      "Informe suas medidas e receba uma recomenda??o limpa e objetiva.",
    back: "Voltar",
    fastTag: "Ajuste Rapido",
    fastTitle: "Informe seu perfil",
    fastDescription:
      "Altura, peso e estrutura f?sica bastam para uma recomenda??o premium.",
    height: "Altura",
    weight: "Peso",
    bodyType: "Tipo fisico",
    calculate: "Calcular tamanho",
    resultTag: "An?lise concluida",
    recommendedTitle: "Tamanho recomendado",
    fitTitle: "Caimento padr?o",
    tighter: "Mais justo",
    looser: "Mais solto",
    continueShopping: "Continuar comprando",
    redo: "Refazer analise",
    decrease: "Diminuir",
    increase: "Aumentar",
  },
  en: {
    title: "AI Fit Guide",
    selectionTag: "Instant Recommendation",
    selectionTitle: "Find your ideal size",
    selectionDescription:
      "A fast, precise answer designed for a more confident fit.",
    selectionCardTitle: "Find my size",
    selectionCardDescription:
      "Enter your measurements and get a clean, objective recommendation.",
    back: "Back",
    fastTag: "Quick Fit",
    fastTitle: "Tell us your profile",
    fastDescription:
      "Height, weight and body structure are enough for a premium recommendation.",
    height: "Height",
    weight: "Weight",
    bodyType: "Body type",
    calculate: "Calculate size",
    resultTag: "Analysis complete",
    recommendedTitle: "Recommended size",
    fitTitle: "Standard fit",
    tighter: "Tighter fit",
    looser: "Looser fit",
    continueShopping: "Continue shopping",
    redo: "Redo analysis",
    decrease: "Decrease",
    increase: "Increase",
  },
  es: {
    title: "AI Fit Guide",
    selectionTag: "Recomendaci?n Instant?nea",
    selectionTitle: "Descubre tu talla ideal",
    selectionDescription:
      "Una respuesta r?pida, precisa y pensada para un ajuste mas seguro.",
    selectionCardTitle: "Descubrir mi talla",
    selectionCardDescription:
      "Ingresa tus medidas y recibe una recomendacion clara y objetiva.",
    back: "Volver",
    fastTag: "Ajuste Rapido",
    fastTitle: "Cu?ntanos tu perfil",
    fastDescription:
      "Altura, peso y estructura f?sica bastan para una recomendacion premium.",
    height: "Altura",
    weight: "Peso",
    bodyType: "Tipo fisico",
    calculate: "Calcular talla",
    resultTag: "Analisis completado",
    recommendedTitle: "Talla recomendada",
    fitTitle: "Ca?da est?ndar",
    tighter: "M?s ajustada",
    looser: "M?s holgada",
    continueShopping: "Seguir comprando",
    redo: "Rehacer an?lisis",
    decrease: "Disminuir",
    increase: "Aumentar",
  },
};

const getSmallerSize = (size: Size): string =>
  ({ P: "PP", M: "P", G: "M", GG: "G" })[size];

const getLargerSize = (size: Size): string =>
  ({ P: "M", M: "G", G: "GG", GG: "XG" })[size];

const calculateSize = (
  height: number,
  weight: number,
  bodyType?: BodyType | null,
): Size => {
  const bmi = weight / Math.pow(height / 100, 2);
  let size: Size = bmi < 21 ? "P" : bmi < 25 ? "M" : bmi < 29 ? "G" : "GG";

  if (bodyType === "forte") {
    size = size === "P" ? "M" : size === "M" ? "G" : size === "G" ? "GG" : "GG";
  }

  if (bodyType === "obeso") {
    size = size === "P" ? "G" : size === "M" ? "GG" : "GG";
  }

  return size;
};

function NumericStepperField({
  label,
  value,
  onChange,
  min,
  max,
  step,
  unit,
  placeholder,
  decreaseLabel,
  increaseLabel,
}: NumericStepperFieldProps) {
  const decrement = () => {
    const baseValue = typeof value === "number" ? value : min;
    onChange(Math.max(min, baseValue - step));
  };

  const increment = () => {
    const baseValue = typeof value === "number" ? value : min;
    onChange(Math.min(max, baseValue + step));
  };

  const handleChange = (nextValue: string) => {
    if (!nextValue) {
      onChange("");
      return;
    }

    const digitsOnly = nextValue.replace(/[^\d]/g, "");
    if (!digitsOnly) {
      onChange("");
      return;
    }

    onChange(Number(digitsOnly));
  };

  const handleBlur = () => {
    if (value === "") return;
    onChange(Math.min(max, Math.max(min, value)));
  };

  return (
    <div>
      <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-white/50">
        {label}
      </label>
      <div className="group flex items-center gap-3 rounded-[1.25rem] border border-white/10 bg-[#111] p-3 transition-all duration-300 hover:border-white/15 hover:bg-[#151515] focus-within:border-[var(--color-primary)]/50 focus-within:ring-2 focus-within:ring-[var(--color-primary)]/20">
        <button
          type="button"
          onClick={decrement}
          aria-label={`${decreaseLabel} ${label}`}
          className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/80 transition-all duration-200 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/40 active:scale-95"
        >
          <Minus size={16} />
        </button>

        <div className="flex min-w-0 flex-1 items-center justify-center gap-2">
          <input
            type="number"
            inputMode="numeric"
            value={value}
            onChange={(event) => handleChange(event.target.value)}
            onBlur={handleBlur}
            min={min}
            max={max}
            step={step}
            placeholder={placeholder}
            className="w-full appearance-none bg-transparent text-center text-lg font-semibold text-white outline-none placeholder:text-white/20 [moz-appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
          <span className="text-xs font-bold uppercase tracking-widest text-white/35">
            {unit}
          </span>
        </div>

        <button
          type="button"
          onClick={increment}
          aria-label={`${increaseLabel} ${label}`}
          className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/80 transition-all duration-200 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/40 active:scale-95"
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
}

export function AiSizeGuideModal({ isOpen, onClose }: AISizeGuideModalProps) {
  const { locale } = useLocale();
  const copy = repairDeepStrings(modalCopy[locale]);
  const [mode, setMode] = useState<Mode>("selection");
  const [isClosing, setIsClosing] = useState(false);
  const [height, setHeight] = useState<number | "">("");
  const [weight, setWeight] = useState<number | "">("");
  const [bodyType, setBodyType] = useState<BodyType | null>(null);
  const [recommendedSize, setRecommendedSize] = useState<Size | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const frameId = requestAnimationFrame(() => {
      setMode("selection");
      setHeight("");
      setWeight("");
      setBodyType(null);
      setRecommendedSize(null);
      setIsClosing(false);
    });

    return () => cancelAnimationFrame(frameId);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  const portalNode = typeof document !== "undefined" ? document.body : null;

  const handleFastCalculate = () => {
    if (!height || !weight || !bodyType) return;

    const size = calculateSize(Number(height), Number(weight), bodyType);
    setRecommendedSize(size);
    setMode("result");
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 400);
  };

  if ((!isOpen && !isClosing) || !portalNode) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && !isClosing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#050505]/90 backdrop-blur-xl"
        >
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <motion.div
              animate={{ opacity: [0.08, 0.18, 0.08], scale: [1, 1.04, 1] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/4 left-1/4 h-[40vw] w-[40vw] rounded-full bg-[var(--color-primary)]/10 blur-[100px]"
            />
          </div>

          <motion.div
            initial={{ scale: 0.96, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.96, y: 20, opacity: 0 }}
            transition={{
              type: "spring",
              damping: 30,
              stiffness: 300,
              mass: 0.8,
            }}
            className="relative z-10 mx-4 flex max-h-[95vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a]/85 shadow-[0_0_80px_rgba(0,0,0,0.5)] md:rounded-[2rem]"
          >
            <div className="relative z-20 flex flex-shrink-0 items-center justify-between border-b border-white/5 p-6 md:px-10 md:py-8">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5">
                  <Sparkles size={14} className="text-[var(--color-primary)]" />
                </div>
                <h2 className="font-heading text-lg font-bold uppercase tracking-widest text-white">
                  {copy.title}
                </h2>
              </div>
              <button
                onClick={handleClose}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="relative min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
              <AnimatePresence mode="wait">
                {mode === "selection" && (
                  <motion.div
                    key={`selection-${locale}`}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ ease: "easeOut", duration: 0.3 }}
                    className="flex min-h-[420px] flex-col items-center justify-center p-6 md:p-12"
                  >
                    <span className="mb-5 text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--color-primary)]">
                      {copy.selectionTag}
                    </span>
                    <h3 className="mb-3 text-center text-3xl font-black text-white md:text-4xl">
                      {copy.selectionTitle}
                    </h3>
                    <p className="mb-10 max-w-md text-center text-sm leading-relaxed text-white/50 md:text-base">
                      {copy.selectionDescription}
                    </p>

                    <button
                      onClick={() => setMode("fast")}
                      className="group relative w-full max-w-xl overflow-hidden rounded-3xl border border-white/8 bg-[#111] p-8 text-left transition-all duration-500 hover:border-[var(--color-primary)]/40 hover:bg-[#151515]"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/8 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                      <div className="relative z-10 flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-[var(--color-primary)]">
                          <Activity size={20} />
                        </div>
                        <div>
                          <h4 className="mb-2 text-xl font-black uppercase tracking-wide text-white">
                            {copy.selectionCardTitle}
                          </h4>
                          <p className="max-w-md text-sm leading-relaxed text-white/50">
                            {copy.selectionCardDescription}
                          </p>
                        </div>
                      </div>
                    </button>
                  </motion.div>
                )}

                {mode === "fast" && (
                  <motion.div
                    key={`fast-${locale}`}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ ease: "easeOut", duration: 0.3 }}
                    className="flex flex-col p-6 md:p-12"
                  >
                    <button
                      onClick={() => setMode("selection")}
                      className="mb-8 w-fit text-xs uppercase tracking-widest text-white/40 transition-colors hover:text-white"
                    >
                      {copy.back}
                    </button>

                    <div className="mx-auto w-full max-w-xl">
                      <div className="mb-10">
                        <span className="mb-3 block text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--color-primary)]">
                          {copy.fastTag}
                        </span>
                        <h3 className="mb-2 text-2xl font-black text-white md:text-3xl">
                          {copy.fastTitle}
                        </h3>
                        <p className="text-sm leading-relaxed text-white/45">
                          {copy.fastDescription}
                        </p>
                      </div>

                      <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-2">
                        <NumericStepperField
                          label={copy.height}
                          value={height}
                          onChange={setHeight}
                          min={140}
                          max={220}
                          step={1}
                          unit="cm"
                          placeholder="175"
                          decreaseLabel={copy.decrease}
                          increaseLabel={copy.increase}
                        />
                        <NumericStepperField
                          label={copy.weight}
                          value={weight}
                          onChange={setWeight}
                          min={35}
                          max={180}
                          step={1}
                          unit="kg"
                          placeholder="75"
                          decreaseLabel={copy.decrease}
                          increaseLabel={copy.increase}
                        />
                      </div>

                      <div className="mb-10">
                        <label className="mb-4 block text-[10px] font-bold uppercase tracking-widest text-white/50">
                          {copy.bodyType}
                        </label>
                        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
                          {BODY_TYPES.map((type) => (
                            <button
                              key={type}
                              onClick={() => setBodyType(type)}
                              className={`rounded-xl border p-3 text-xs font-bold uppercase tracking-wider transition-all ${
                                bodyType === type
                                  ? "border-[var(--color-primary)]/50 bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                                  : "border-white/5 bg-[#111] text-white/60 hover:bg-white/5"
                              }`}
                            >
                              {bodyTypeLabels[locale][type]}
                            </button>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={handleFastCalculate}
                        disabled={!height || !weight || !bodyType}
                        className={`w-full rounded-xl py-4 text-sm font-black uppercase tracking-widest transition-all duration-300 ${
                          height && weight && bodyType
                            ? "bg-white text-black hover:bg-[var(--color-primary)] hover:shadow-[0_0_30px_var(--color-primary)]"
                            : "cursor-not-allowed bg-white/5 text-white/20"
                        }`}
                      >
                        {copy.calculate}
                      </button>
                    </div>
                  </motion.div>
                )}

                {mode === "result" && recommendedSize && (
                  <motion.div
                    key={`result-${locale}`}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ ease: "easeOut", duration: 0.35 }}
                    className="relative flex flex-col items-center justify-center overflow-hidden p-6 py-12 md:p-12"
                  >
                    <motion.div
                      initial={{ scale: 0.7, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.9, ease: "easeOut" }}
                      className="pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-primary)]/16 blur-[90px]"
                    />

                    <span className="relative z-10 mb-5 rounded-full border border-[var(--color-primary)]/30 bg-[var(--color-primary)]/5 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[var(--color-primary)]">
                      {copy.resultTag}
                    </span>

                    <h3 className="relative z-10 mb-2 text-center text-sm font-medium text-white/50 md:text-base">
                      {copy.recommendedTitle}
                    </h3>

                    <motion.div
                      initial={{ y: 18, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.15, type: "spring" }}
                      className="relative z-10 mb-8 text-7xl font-black text-white md:text-9xl [text-shadow:0_0_40px_rgba(var(--color-primary-rgb),0.4)]"
                    >
                      {recommendedSize}
                    </motion.div>

                    <div className="relative z-10 mb-8 w-full max-w-md rounded-2xl border border-white/10 bg-[#111] p-5 md:p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white/5">
                          <Activity
                            size={18}
                            className="text-[var(--color-primary)]"
                          />
                        </div>
                        <div className="w-full space-y-3">
                          <p className="text-sm font-bold uppercase tracking-wide text-white">
                            {copy.fitTitle}: {recommendedSize}
                          </p>
                          <div className="border-t border-white/5 pt-3 text-xs leading-relaxed text-white/55">
                            <p>
                              {copy.tighter}: {getSmallerSize(recommendedSize)}
                            </p>
                            <p className="mt-1">
                              {copy.looser}: {getLargerSize(recommendedSize)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleClose}
                      className="relative z-10 rounded-xl bg-white px-8 py-4 text-sm font-black uppercase tracking-widest text-black transition-colors hover:bg-[var(--color-primary)]"
                    >
                      {copy.continueShopping}
                    </button>

                    <button
                      onClick={() => setMode("selection")}
                      className="relative z-10 mt-4 text-xs uppercase tracking-widest text-white/30 transition-colors hover:text-white"
                    >
                      {copy.redo}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    portalNode,
  );
}

export default AiSizeGuideModal;
