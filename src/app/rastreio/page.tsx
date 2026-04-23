"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MainNavbar } from "@/components/navigation/MainNavbar";
import { SiteFooter } from "@/components/navigation/SiteFooter";
import { FloatingLabelInput } from "@/components/commerce/checkout/FloatingLabelInput";
import {
  Search,
  Package,
  Truck,
  CheckCircle,
  Clock,
  User,
  UserMinus,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useLocale, type Locale } from "@/components/providers/LocaleProvider";
import { repairDeepStrings } from "@/lib/utils";

const MOCK_ORDER = {
  id: "CX-9821-44B",
  status: "shipped",
  date: "12 de Abril, 2026",
  items: [
    {
      name: "Camisa I 2026 Jogador",
      size: "G",
      image:
        "https://cdn.fanmarket.app.br/69c863e72a35aa109ae884d4_camisa-jogo-1-mas.png",
    },
  ],
};

const trackOrderCopy: Record<
  Locale,
  {
    titleTop: string;
    titleAccent: string;
    subtitle: string;
    accountOrder: string;
    guestOrder: string;
    returnsQuestion: string;
    learnMore: string;
    reportIssue: string;
    back: string;
    orderNumber: string;
    email: string;
    trackPackage: string;
    statusOfficial: string;
    order: string;
    trackAnother: string;
    steps: Array<{ title: string; desc: string }>;
    processingTag: string;
  }
> = {
  pt: {
    titleTop: "Acompanhe seu",
    titleAccent: "Pedido",
    subtitle:
      "Para visualizar o status do seu pacote, insira o número do pedido enviado na confirmação do seu e-mail.",
    accountOrder: "Pedido com conta Coxa",
    guestOrder: "Pedido sem conta Coxa",
    returnsQuestion: "Deseja fazer uma devolução?",
    learnMore: "Saiba mais.",
    reportIssue: "Relatar problema",
    back: "← Voltar",
    orderNumber: "Número do Pedido (Ex: CX-1234)",
    email: "Endereço de E-mail",
    trackPackage: "Rastrear Pacote",
    statusOfficial: "Status Oficial",
    order: "Pedido",
    trackAnother: "Rastrear outro",
    steps: [
      { title: "Pedido Confirmado", desc: "Seu pagamento foi aprovado" },
      {
        title: "Em Separação e Envio",
        desc: "Saindo do nosso centro de distribuição",
      },
      { title: "Em Rota", desc: "Chegando no seu endereço hoje" },
      { title: "Entregue", desc: "Aproveite seu manto coxa-branca!" },
    ],
    processingTag: "Processando",
  },
  en: {
    titleTop: "Track your",
    titleAccent: "Order",
    subtitle:
      "To view your package status, enter the order number sent in your email confirmation.",
    accountOrder: "Order with Coxa account",
    guestOrder: "Order without Coxa account",
    returnsQuestion: "Need to make a return?",
    learnMore: "Learn more.",
    reportIssue: "Report issue",
    back: "← Back",
    orderNumber: "Order Number (Ex: CX-1234)",
    email: "E-mail Address",
    trackPackage: "Track Package",
    statusOfficial: "Official Status",
    order: "Order",
    trackAnother: "Track another",
    steps: [
      { title: "Order Confirmed", desc: "Your payment has been approved" },
      {
        title: "Preparing and Shipping",
        desc: "Leaving our distribution center",
      },
      { title: "On the Way", desc: "Arriving at your address today" },
      { title: "Delivered", desc: "Enjoy your Coxa jersey!" },
    ],
    processingTag: "Processing",
  },
  es: {
    titleTop: "Sigue tu",
    titleAccent: "Pedido",
    subtitle:
      "Para ver el estado de tu paquete, ingresa el número de pedido enviado en la confirmación de tu e-mail.",
    accountOrder: "Pedido con cuenta Coxa",
    guestOrder: "Pedido sin cuenta Coxa",
    returnsQuestion: "¿Deseas hacer una devolución?",
    learnMore: "Saber más.",
    reportIssue: "Reportar problema",
    back: "← Volver",
    orderNumber: "Número de Pedido (Ej: CX-1234)",
    email: "Dirección de E-mail",
    trackPackage: "Rastrear Paquete",
    statusOfficial: "Estado Oficial",
    order: "Pedido",
    trackAnother: "Rastrear otro",
    steps: [
      { title: "Pedido Confirmado", desc: "Tu pago fue aprobado" },
      {
        title: "En Preparación y Envío",
        desc: "Saliendo de nuestro centro de distribución",
      },
      { title: "En Ruta", desc: "Llegando hoy a tu dirección" },
      { title: "Entregado", desc: "¡Disfruta tu camiseta coxa-branca!" },
    ],
    processingTag: "Procesando",
  },
};

export default function TrackOrderPage() {
  const { locale } = useLocale();
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [orderResult, setOrderResult] = useState<typeof MOCK_ORDER | null>(
    null,
  );
  const [viewState, setViewState] = useState<
    "selection" | "guest_form" | "results"
  >("selection");
  const copy = repairDeepStrings(trackOrderCopy[locale]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber || !email) return;

    setIsSearching(true);
    setTimeout(() => {
      setOrderResult(MOCK_ORDER);
      setIsSearching(false);
      setViewState("results");
    }, 1200);
  };

  const steps = [
    { id: "processing", icon: Clock, ...copy.steps[0] },
    { id: "shipped", icon: Package, ...copy.steps[1] },
    { id: "out_for_delivery", icon: Truck, ...copy.steps[2] },
    { id: "delivered", icon: CheckCircle, ...copy.steps[3] },
  ];

  const getCurrentStepIndex = () => {
    if (!orderResult) return -1;
    const orderStatuses = [
      "processing",
      "shipped",
      "out_for_delivery",
      "delivered",
    ];
    return orderStatuses.indexOf(orderResult.status);
  };

  const currentStep = getCurrentStepIndex();

  return (
    <main className="min-h-screen bg-[var(--color-background-dark)] flex flex-col selection:bg-[var(--color-primary)] selection:text-black">
      <MainNavbar />

      <section className="flex-1 container mx-auto px-4 pt-32 pb-24 flex justify-center">
        <div className="w-full max-w-[600px]">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-black font-heading uppercase tracking-tight text-white mb-2">
              {copy.titleTop} <br />{" "}
              <span className="text-[var(--color-primary)]">
                {copy.titleAccent}
              </span>
            </h1>
            <p className="text-sm text-white/50">{copy.subtitle}</p>
          </div>

          <AnimatePresence mode="wait">
            {viewState === "selection" && (
              <motion.div
                key="selection"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full flex flex-col items-center gap-4"
              >
                <div className="w-full max-w-[500px] flex flex-col gap-4">
                  <Link
                    href="/login"
                    className="w-full bg-[#111] border border-white/20 hover:border-white transition-colors h-20 rounded-full flex items-center justify-center gap-3 text-white font-bold uppercase tracking-wider group"
                  >
                    {copy.accountOrder}
                    <User
                      size={20}
                      className="group-hover:text-[var(--color-primary)] transition-colors"
                    />
                  </Link>
                  <button
                    onClick={() => setViewState("guest_form")}
                    className="w-full bg-[#111] border border-white/20 hover:border-white transition-colors h-20 rounded-full flex items-center justify-center gap-3 text-white font-bold uppercase tracking-wider group"
                  >
                    {copy.guestOrder}
                    <UserMinus
                      size={20}
                      className="group-hover:text-[var(--color-primary)] transition-colors"
                    />
                  </button>
                </div>

                <div className="mt-8 flex flex-col items-center text-sm font-bold gap-3">
                  <div className="flex gap-2 text-white">
                    {copy.returnsQuestion}
                    <button className="text-[var(--color-primary)] hover:underline">
                      {copy.learnMore}
                    </button>
                  </div>
                  <button className="text-white/50 hover:text-white underline uppercase tracking-widest text-xs">
                    {copy.reportIssue}
                  </button>
                </div>
              </motion.div>
            )}

            {viewState === "guest_form" && (
              <motion.div
                key="search-form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#0A0A0A] border border-white/5 p-6 md:p-8 rounded-[4px] shadow-2xl relative overflow-hidden"
              >
                <button
                  onClick={() => setViewState("selection")}
                  className="mb-6 text-[10px] font-bold text-white/40 hover:text-white uppercase tracking-widest"
                >
                  {copy.back}
                </button>
                <form onSubmit={handleSearch} className="space-y-4">
                  <FloatingLabelInput
                    label={copy.orderNumber}
                    type="text"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                  />
                  <FloatingLabelInput
                    label={copy.email}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={!orderNumber || !email || isSearching}
                    className={`w-full h-14 font-black uppercase tracking-widest text-sm transition-all rounded-[2px] mt-4 flex items-center justify-center gap-2 ${
                      !orderNumber || !email
                        ? "bg-white/10 text-white/30 cursor-not-allowed"
                        : "bg-[var(--color-primary)] text-black hover:bg-white shadow-[0_0_20px_rgba(96,232,97,0.15)]"
                    }`}
                  >
                    {isSearching ? (
                      <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        {copy.trackPackage} <Search size={18} />
                      </>
                    )}
                  </motion.button>
                </form>
              </motion.div>
            )}

            {viewState === "results" && orderResult && (
              <motion.div
                key="search-result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full flex flex-col gap-6"
              >
                <div className="bg-[#0A0A0A] border border-white/10 p-6 rounded-[2px] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-white/40 tracking-widest mb-1">
                      {copy.statusOfficial}
                    </p>
                    <h2 className="text-xl md:text-3xl font-black font-heading uppercase text-white tracking-tight">
                      {copy.order} {orderResult.id}
                    </h2>
                  </div>
                  <button
                    onClick={() => {
                      setOrderResult(null);
                      setViewState("selection");
                    }}
                    className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-widest hover:underline whitespace-nowrap"
                  >
                    {copy.trackAnother}
                  </button>
                </div>

                <div className="bg-[#0A0A0A] border border-white/5 p-6 md:p-10 rounded-[2px] relative overflow-hidden">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[80%] h-[100px] bg-[var(--color-primary)]/5 blur-[100px] pointer-events-none" />

                  <div className="relative z-10 flex flex-col w-full">
                    {steps.map((step, index) => {
                      const isPast = index <= currentStep;
                      const isActive = index === currentStep;
                      const isLast = index === steps.length - 1;

                      return (
                        <div
                          key={step.id}
                          className="flex gap-6 relative group"
                        >
                          {!isLast && (
                            <div className="absolute left-6 top-10 bottom-[-10px] w-[2px] bg-white/10 ml-[-1px]">
                              {isPast && (
                                <motion.div
                                  initial={{ height: 0 }}
                                  animate={{ height: "100%" }}
                                  transition={{
                                    duration: 0.8,
                                    delay: index * 0.3,
                                  }}
                                  className="w-full bg-[var(--color-primary)] shadow-[0_0_8px_rgba(96,232,97,0.5)]"
                                />
                              )}
                            </div>
                          )}

                          <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: index * 0.15 }}
                            className={`relative z-10 w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-full border-2 transition-colors duration-500 ${
                              isActive
                                ? "bg-[var(--color-primary)] border-[var(--color-primary)] text-black shadow-[0_0_20px_rgba(96,232,97,0.3)]"
                                : isPast
                                  ? "bg-[#0A0A0A] border-[var(--color-primary)] text-[var(--color-primary)]"
                                  : "bg-[#0A0A0A] border-white/10 text-white/30"
                            }`}
                          >
                            <step.icon
                              size={20}
                              strokeWidth={isPast ? 2.5 : 2}
                            />
                          </motion.div>

                          <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.15 + 0.1 }}
                            className={`pb-10 pt-2 ${isActive ? "opacity-100" : isPast ? "opacity-70" : "opacity-40"}`}
                          >
                            <h3
                              className={`font-bold uppercase tracking-wider text-sm ${isActive ? "text-[var(--color-primary)]" : "text-white"}`}
                            >
                              {step.title}
                            </h3>
                            <p className="text-xs text-white/50 mt-1 max-w-[250px] leading-relaxed">
                              {step.desc}
                            </p>

                            {isActive && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                className="mt-4 p-3 bg-white/5 border border-white/10 rounded-[2px] flex gap-3 max-w-[280px]"
                              >
                                <Image
                                  src={orderResult.items[0].image}
                                  alt="Produto"
                                  width={40}
                                  height={40}
                                  className="object-cover rounded bg-black/50"
                                />
                                <div className="flex flex-col justify-center">
                                  <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">
                                    {copy.processingTag}
                                  </span>
                                  <span className="text-xs text-white font-medium truncate max-w-[180px]">
                                    {orderResult.items[0].name}
                                  </span>
                                </div>
                              </motion.div>
                            )}
                          </motion.div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

