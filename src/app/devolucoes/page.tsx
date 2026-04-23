"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, ShieldCheck, PackageSearch, ArrowRight } from "lucide-react";
import { MainNavbar } from "@/components/navigation/MainNavbar";
import { SiteFooter } from "@/components/navigation/SiteFooter";
import { FloatingLabelInput } from "@/components/commerce/checkout/FloatingLabelInput";
import { useLocale, type Locale } from "@/components/providers/LocaleProvider";

const returnsCopy: Record<
  Locale,
  {
    titleTop: string;
    titleAccent: string;
    subtitle: string;
    policyTitle: string;
    policyText: string;
    timelineTitle: string;
    timelineText: string;
    accountTitle: string;
    accountText: string;
    guestTitle: string;
    guestText: string;
    accountCta: string;
    guestCta: string;
    formTitle: string;
    formSubtitle: string;
    orderNumber: string;
    email: string;
    reason: string;
    continueCta: string;
    successTag: string;
    successTitle: string;
    successText: string;
    trackCta: string;
    back: string;
    reasons: string[];
  }
> = {
  pt: {
    titleTop: "Devoluções",
    titleAccent: "Premium",
    subtitle:
      "Um fluxo de pós-compra pensado para devoluções e trocas com mais clareza, rapidez e segurança.",
    policyTitle: "Política clara",
    policyText:
      "Solicite a devolução dentro do prazo informado após o recebimento, com o produto preservado e em condições adequadas para análise.",
    timelineTitle: "Acompanhamento contínuo",
    timelineText:
      "Depois de abrir a solicitação, você acompanha status, próximos passos e validação do processo sem ruído.",
    accountTitle: "Pedido com conta Coxa",
    accountText:
      "Acesse sua conta para iniciar a solicitação com dados do pedido já vinculados.",
    guestTitle: "Pedido sem conta",
    guestText:
      "Informe número do pedido e e-mail para localizar sua compra e começar a devolução.",
    accountCta: "Entrar e solicitar",
    guestCta: "Solicitar sem conta",
    formTitle: "Iniciar devolução",
    formSubtitle:
      "Preencha os dados do pedido para abrir uma solicitação inicial de análise.",
    orderNumber: "Número do Pedido",
    email: "E-mail usado na compra",
    reason: "Motivo da devolução",
    continueCta: "Enviar solicitação",
    successTag: "Solicitação iniciada",
    successTitle: "Recebemos seu pedido de devolução",
    successText:
      "Nossa equipe vai validar as informações e seguir com as próximas instruções no seu e-mail.",
    trackCta: "Acompanhar pedido",
    back: "← Voltar",
    reasons: [
      "Tamanho ou caimento",
      "Produto diferente do esperado",
      "Avaria ou defeito",
      "Outro motivo",
    ],
  },
  en: {
    titleTop: "Premium",
    titleAccent: "Returns",
    subtitle:
      "A post-purchase flow designed for returns and exchanges with more clarity, speed and confidence.",
    policyTitle: "Clear policy",
    policyText:
      "Request your return within the informed timeframe after delivery, with the item preserved and suitable for review.",
    timelineTitle: "Continuous tracking",
    timelineText:
      "After opening a request, you can follow status, next steps and validation updates with no friction.",
    accountTitle: "Order with Coxa account",
    accountText:
      "Sign in to start the request with your order data already connected.",
    guestTitle: "Order without account",
    guestText:
      "Enter your order number and e-mail to locate the purchase and start the return.",
    accountCta: "Sign in and request",
    guestCta: "Request as guest",
    formTitle: "Start return",
    formSubtitle:
      "Fill in your order details to open an initial return request for review.",
    orderNumber: "Order Number",
    email: "Purchase e-mail",
    reason: "Return reason",
    continueCta: "Submit request",
    successTag: "Request started",
    successTitle: "We received your return request",
    successText:
      "Our team will validate the information and send the next instructions to your e-mail.",
    trackCta: "Track order",
    back: "← Back",
    reasons: [
      "Size or fit",
      "Different from expected",
      "Damage or defect",
      "Other reason",
    ],
  },
  es: {
    titleTop: "Devoluciones",
    titleAccent: "Premium",
    subtitle:
      "Un flujo de postcompra pensado para devoluciones y cambios con más claridad, rapidez y confianza.",
    policyTitle: "Política clara",
    policyText:
      "Solicita la devolución dentro del plazo informado tras la entrega, con la pieza preservada y apta para revisión.",
    timelineTitle: "Seguimiento continuo",
    timelineText:
      "Después de abrir la solicitud, acompañas estado, próximos pasos y validación sin fricción.",
    accountTitle: "Pedido con cuenta Coxa",
    accountText:
      "Accede a tu cuenta para iniciar la solicitud con los datos del pedido ya vinculados.",
    guestTitle: "Pedido sin cuenta",
    guestText:
      "Ingresa número de pedido y e-mail para localizar tu compra y empezar la devolución.",
    accountCta: "Entrar y solicitar",
    guestCta: "Solicitar sin cuenta",
    formTitle: "Iniciar devolución",
    formSubtitle:
      "Completa los datos del pedido para abrir una solicitud inicial de revisión.",
    orderNumber: "Número de Pedido",
    email: "E-mail de compra",
    reason: "Motivo de la devolución",
    continueCta: "Enviar solicitud",
    successTag: "Solicitud iniciada",
    successTitle: "Recibimos tu solicitud de devolución",
    successText:
      "Nuestro equipo validará la información y enviará las próximas instrucciones a tu e-mail.",
    trackCta: "Rastrear pedido",
    back: "← Volver",
    reasons: [
      "Talla o ajuste",
      "Producto diferente a lo esperado",
      "Daño o defecto",
      "Otro motivo",
    ],
  },
};

export default function ReturnsPage() {
  const { locale } = useLocale();
  const copy = returnsCopy[locale];
  const [view, setView] = useState<"overview" | "guest_form" | "success">(
    "overview",
  );
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState(copy.reasons[0]);

  return (
    <main className="min-h-screen bg-[var(--color-background-dark)] flex flex-col selection:bg-[var(--color-primary)] selection:text-black">
      <MainNavbar />

      <section className="flex-1 container mx-auto px-4 pt-32 pb-24">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-black font-heading uppercase tracking-tight text-white">
              {copy.titleTop} <span className="text-[var(--color-primary)]">{copy.titleAccent}</span>
            </h1>
            <p className="mt-4 max-w-xl text-sm md:text-base text-white/55 leading-relaxed">
              {copy.subtitle}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {view === "overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="mt-12 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]"
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="rounded-[1.5rem] border border-white/10 bg-[#0A0A0A] p-6">
                    <ShieldCheck className="text-[var(--color-primary)]" size={22} />
                    <h2 className="mt-5 text-lg font-black font-heading uppercase text-white">
                      {copy.policyTitle}
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-white/55">
                      {copy.policyText}
                    </p>
                  </div>

                  <div className="rounded-[1.5rem] border border-white/10 bg-[#0A0A0A] p-6">
                    <PackageSearch className="text-[var(--color-primary)]" size={22} />
                    <h2 className="mt-5 text-lg font-black font-heading uppercase text-white">
                      {copy.timelineTitle}
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-white/55">
                      {copy.timelineText}
                    </p>
                  </div>
                </div>

                <div className="grid gap-5">
                  <div className="rounded-[1.5rem] border border-white/10 bg-[#0A0A0A] p-6 md:p-7">
                    <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--color-primary)]">
                      Coxa ID
                    </p>
                    <h3 className="mt-4 text-2xl font-black font-heading uppercase text-white">
                      {copy.accountTitle}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-white/55">
                      {copy.accountText}
                    </p>
                    <Link
                      href="/login"
                      className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white transition-colors hover:border-white hover:bg-white hover:text-black"
                    >
                      {copy.accountCta}
                      <ArrowRight size={14} />
                    </Link>
                  </div>

                  <div className="rounded-[1.5rem] border border-white/10 bg-[#0A0A0A] p-6 md:p-7">
                    <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--color-primary)]">
                      Guest Flow
                    </p>
                    <h3 className="mt-4 text-2xl font-black font-heading uppercase text-white">
                      {copy.guestTitle}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-white/55">
                      {copy.guestText}
                    </p>
                    <button
                      onClick={() => setView("guest_form")}
                      className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-black transition-colors hover:bg-[var(--color-primary)]"
                    >
                      {copy.guestCta}
                      <RotateCcw size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {view === "guest_form" && (
              <motion.div
                key="guest_form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="mt-12 mx-auto max-w-[640px] rounded-[1.75rem] border border-white/10 bg-[#0A0A0A] p-6 md:p-8"
              >
                <button
                  onClick={() => setView("overview")}
                  className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/45 transition-colors hover:text-white"
                >
                  {copy.back}
                </button>

                <h2 className="mt-6 text-3xl font-black font-heading uppercase text-white">
                  {copy.formTitle}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-white/55">
                  {copy.formSubtitle}
                </p>

                <div className="mt-8 space-y-4">
                  <FloatingLabelInput
                    label={copy.orderNumber}
                    type="text"
                    value={orderNumber}
                    onChange={(event) => setOrderNumber(event.target.value)}
                  />
                  <FloatingLabelInput
                    label={copy.email}
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />

                  <div className="rounded-[1.25rem] border border-white/10 bg-[#111] px-5 py-4">
                    <label className="mb-3 block text-[10px] font-bold uppercase tracking-[0.18em] text-white/40">
                      {copy.reason}
                    </label>
                    <select
                      value={reason}
                      onChange={(event) => setReason(event.target.value)}
                      className="w-full bg-transparent text-sm font-medium text-white outline-none"
                    >
                      {copy.reasons.map((item) => (
                        <option key={item} value={item} className="bg-[#111] text-white">
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={() => setView("success")}
                    disabled={!orderNumber || !email}
                    className={`w-full rounded-full py-4 text-sm font-black uppercase tracking-[0.18em] transition-colors ${
                      orderNumber && email
                        ? "bg-[var(--color-primary)] text-black hover:bg-white"
                        : "cursor-not-allowed bg-white/8 text-white/25"
                    }`}
                  >
                    {copy.continueCta}
                  </button>
                </div>
              </motion.div>
            )}

            {view === "success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="mt-12 mx-auto max-w-[720px] rounded-[2rem] border border-white/10 bg-[#0A0A0A] p-8 md:p-10 text-center"
              >
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--color-primary)]">
                  {copy.successTag}
                </p>
                <h2 className="mt-4 text-3xl md:text-4xl font-black font-heading uppercase text-white">
                  {copy.successTitle}
                </h2>
                <p className="mt-4 mx-auto max-w-xl text-sm md:text-base leading-relaxed text-white/55">
                  {copy.successText}
                </p>

                <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <Link
                    href="/rastreio"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-4 text-xs font-bold uppercase tracking-[0.18em] text-black transition-colors hover:bg-[var(--color-primary)]"
                  >
                    {copy.trackCta}
                    <ArrowRight size={14} />
                  </Link>
                  <button
                    onClick={() => setView("overview")}
                    className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-4 text-xs font-bold uppercase tracking-[0.18em] text-white transition-colors hover:border-white hover:bg-white hover:text-black"
                  >
                    {copy.back}
                  </button>
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
