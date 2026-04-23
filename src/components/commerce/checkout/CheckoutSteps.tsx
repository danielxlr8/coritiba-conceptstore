"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Truck, CreditCard, Box } from "lucide-react";
import { FloatingLabelInput } from "./FloatingLabelInput";
import { useLocale, type Locale } from "@/components/providers/LocaleProvider";

function StepHeader({
  stepNum,
  title,
  isCompleted,
  isActive,
  onClick,
}: {
  stepNum: number;
  title: string;
  isCompleted: boolean;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <div
      className={`flex items-center gap-4 py-6 cursor-pointer ${!isActive ? "opacity-50 hover:opacity-100" : "opacity-100"}`}
      onClick={onClick}
    >
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
          isCompleted
            ? "bg-[var(--color-primary)] text-black"
            : isActive
              ? "border-2 border-[var(--color-primary)] text-[var(--color-primary)]"
              : "border border-white/20 text-white"
        }`}
      >
        {isCompleted ? <Check size={14} strokeWidth={4} /> : stepNum}
      </div>
      <h2 className="text-xl md:text-2xl font-heading tracking-widest uppercase text-white">
        {title}
      </h2>
    </div>
  );
}

const checkoutStepsCopy: Record<
  Locale,
  {
    identification: string;
    delivery: string;
    payment: string;
    email: string;
    fullName: string;
    cpf: string;
    phone: string;
    continueToDelivery: string;
    ship: string;
    pickup: string;
    zipCode: string;
    search: string;
    address: string;
    number: string;
    complement: string;
    district: string;
    city: string;
    state: string;
    pickupAvailable: string;
    pickupStore: string;
    pickupAddress: string;
    continueToPayment: string;
    card: string;
    cardNumber: string;
    cardholderName: string;
    expiration: string;
    installmentOptions: string;
    installment1: string;
    installment2: string;
    confirmAndPay: string;
  }
> = {
  pt: {
    identification: "Identificação",
    delivery: "Entrega",
    payment: "Pagamento",
    email: "E-mail",
    fullName: "Nome Completo",
    cpf: "CPF",
    phone: "Telefone / Celular",
    continueToDelivery: "Continuar para Entrega",
    ship: "Entregar",
    pickup: "Retirar na Loja",
    zipCode: "CEP",
    search: "Buscar",
    address: "Endereço",
    number: "Número",
    complement: "Complemento",
    district: "Bairro",
    city: "Cidade",
    state: "UF",
    pickupAvailable: "Retirada disponível no",
    pickupStore: "Couto Pereira - Store",
    pickupAddress: "Rua Ubaldino do Amaral, 37 - Alto da Glória",
    continueToPayment: "Continuar para Pagamento",
    card: "Cartão",
    cardNumber: "Número do Cartão",
    cardholderName: "Nome Impresso no Cartão",
    expiration: "Validade (MM/AA)",
    installmentOptions: "Opções de Parcelamento",
    installment1: "1x sem juros",
    installment2: "2x sem juros",
    confirmAndPay: "Confirmar e Pagar",
  },
  en: {
    identification: "Identification",
    delivery: "Delivery",
    payment: "Payment",
    email: "E-mail",
    fullName: "Full Name",
    cpf: "CPF",
    phone: "Phone / Mobile",
    continueToDelivery: "Continue to Delivery",
    ship: "Ship",
    pickup: "Store Pickup",
    zipCode: "ZIP Code",
    search: "Search",
    address: "Address",
    number: "Number",
    complement: "Complement",
    district: "District",
    city: "City",
    state: "State",
    pickupAvailable: "Pickup available at",
    pickupStore: "Couto Pereira - Store",
    pickupAddress: "Rua Ubaldino do Amaral, 37 - Alto da Glória",
    continueToPayment: "Continue to Payment",
    card: "Card",
    cardNumber: "Card Number",
    cardholderName: "Name on Card",
    expiration: "Expiration (MM/YY)",
    installmentOptions: "Installment Options",
    installment1: "1x interest-free",
    installment2: "2x interest-free",
    confirmAndPay: "Confirm and Pay",
  },
  es: {
    identification: "Identificación",
    delivery: "Entrega",
    payment: "Pago",
    email: "E-mail",
    fullName: "Nombre Completo",
    cpf: "CPF",
    phone: "Teléfono / Celular",
    continueToDelivery: "Continuar a Entrega",
    ship: "Entregar",
    pickup: "Retirar en Tienda",
    zipCode: "Código Postal",
    search: "Buscar",
    address: "Dirección",
    number: "Número",
    complement: "Complemento",
    district: "Barrio",
    city: "Ciudad",
    state: "UF",
    pickupAvailable: "Retiro disponible en",
    pickupStore: "Couto Pereira - Store",
    pickupAddress: "Rua Ubaldino do Amaral, 37 - Alto da Glória",
    continueToPayment: "Continuar al Pago",
    card: "Tarjeta",
    cardNumber: "Número de la Tarjeta",
    cardholderName: "Nombre en la Tarjeta",
    expiration: "Vencimiento (MM/AA)",
    installmentOptions: "Opciones de Cuotas",
    installment1: "1x sin interés",
    installment2: "2x sin interés",
    confirmAndPay: "Confirmar y Pagar",
  },
};

export function CheckoutSteps() {
  const { locale } = useLocale();
  const [activeStep, setActiveStep] = useState(1);
  const [shippingMethod, setShippingMethod] = useState<"delivery" | "pickup">(
    "delivery",
  );
  const copy = checkoutStepsCopy[locale];

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="border-b border-white/10">
        <StepHeader
          stepNum={1}
          title={copy.identification}
          isCompleted={activeStep > 1}
          isActive={activeStep === 1}
          onClick={() => setActiveStep(1)}
        />
        <AnimatePresence initial={false}>
          {activeStep === 1 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ ease: "circOut", duration: 0.4 }}
              className="overflow-hidden"
            >
              <div className="flex flex-col gap-4 pb-8 pt-2">
                <FloatingLabelInput label={copy.email} type="email" placeholder={copy.email} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FloatingLabelInput label={copy.fullName} type="text" placeholder={copy.fullName} />
                  <FloatingLabelInput label={copy.cpf} type="text" placeholder={copy.cpf} />
                </div>
                <FloatingLabelInput label={copy.phone} type="tel" placeholder={copy.phone} />
                <button
                  onClick={() => setActiveStep(2)}
                  className="mt-4 h-14 bg-[var(--color-primary)] text-black font-bold uppercase tracking-widest text-sm hover:bg-white transition-colors"
                >
                  {copy.continueToDelivery}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="border-b border-white/10">
        <StepHeader
          stepNum={2}
          title={copy.delivery}
          isCompleted={activeStep > 2}
          isActive={activeStep === 2}
          onClick={() => setActiveStep(2)}
        />
        <AnimatePresence initial={false}>
          {activeStep === 2 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ ease: "circOut", duration: 0.4 }}
              className="overflow-hidden"
            >
              <div className="flex flex-col gap-6 pb-8 pt-2">
                <div className="flex border border-white/10 p-1 rounded bg-white/5">
                  <button
                    onClick={() => setShippingMethod("delivery")}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold uppercase tracking-widest rounded transition-all ${
                      shippingMethod === "delivery"
                        ? "bg-white text-black shadow-sm"
                        : "text-white/50 hover:text-white"
                    }`}
                  >
                    <Truck size={16} /> {copy.ship}
                  </button>
                  <button
                    onClick={() => setShippingMethod("pickup")}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold uppercase tracking-widest rounded transition-all ${
                      shippingMethod === "pickup"
                        ? "bg-white text-black shadow-sm"
                        : "text-white/50 hover:text-white"
                    }`}
                  >
                    <Box size={16} /> {copy.pickup}
                  </button>
                </div>

                {shippingMethod === "delivery" ? (
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <FloatingLabelInput label={copy.zipCode} type="text" placeholder={copy.zipCode} className="flex-1" />
                      <button className="h-14 px-6 border border-white/20 text-xs font-bold uppercase tracking-widest hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors">
                        {copy.search}
                      </button>
                    </div>
                    <FloatingLabelInput label={copy.address} type="text" placeholder={copy.address} />
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      <FloatingLabelInput label={copy.number} type="text" placeholder={copy.number} />
                      <FloatingLabelInput
                        label={copy.complement}
                        type="text"
                        placeholder={copy.complement}
                        className="col-span-1 sm:col-span-2"
                      />
                    </div>
                    <FloatingLabelInput label={copy.district} type="text" placeholder={copy.district} />
                    <div className="grid grid-cols-3 gap-4">
                      <FloatingLabelInput label={copy.city} type="text" placeholder={copy.city} className="col-span-2" />
                      <FloatingLabelInput label={copy.state} type="text" placeholder={copy.state} />
                    </div>
                  </div>
                ) : (
                  <div className="p-6 border border-white/10 bg-white/5 rounded text-center">
                    <p className="text-sm text-white/60 mb-2">{copy.pickupAvailable}</p>
                    <p className="font-bold text-[var(--color-primary)] text-lg">{copy.pickupStore}</p>
                    <p className="text-xs text-white/40 mt-1">{copy.pickupAddress}</p>
                  </div>
                )}

                <button
                  onClick={() => setActiveStep(3)}
                  className="mt-2 h-14 bg-[var(--color-primary)] text-black font-bold uppercase tracking-widest text-sm hover:bg-white transition-colors"
                >
                  {copy.continueToPayment}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="border-b border-transparent">
        <StepHeader
          stepNum={3}
          title={copy.payment}
          isCompleted={activeStep > 3}
          isActive={activeStep === 3}
          onClick={() => setActiveStep(3)}
        />
        <AnimatePresence initial={false}>
          {activeStep === 3 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ ease: "circOut", duration: 0.4 }}
              className="overflow-hidden"
            >
              <div className="flex flex-col gap-4 pb-8 pt-2">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <button className="border-2 border-[var(--color-primary)] bg-[var(--color-primary)]/5 py-4 rounded flex flex-col items-center gap-2">
                    <CreditCard className="text-[var(--color-primary)]" size={24} />
                    <span className="text-xs font-bold uppercase tracking-widest text-white">
                      {copy.card}
                    </span>
                  </button>
                  <button className="border border-white/10 bg-white/5 py-4 rounded flex flex-col items-center gap-2 hover:border-white/30 transition-colors">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M12 2L2 7V17L12 22L22 17V7L12 2ZM12 4.23607L19.7639 8.11803L12 12V4.23607ZM4.23607 8.11803L12 12V19.7639L4.23607 15.882V8.11803ZM22 15.882L14.2361 19.7639L14.2361 12H22V15.882Z"
                        fill="currentColor"
                      />
                    </svg>
                    <span className="text-xs font-bold uppercase tracking-widest text-white/50">
                      PIX (-5%)
                    </span>
                  </button>
                </div>

                <FloatingLabelInput label={copy.cardNumber} type="text" placeholder={copy.cardNumber} />
                <FloatingLabelInput label={copy.cardholderName} type="text" placeholder={copy.cardholderName} />

                <div className="grid grid-cols-2 gap-4">
                  <FloatingLabelInput label={copy.expiration} type="text" placeholder={copy.expiration} />
                  <FloatingLabelInput label="CVV" type="text" placeholder="CVV" />
                </div>

                <select
                  defaultValue=""
                  className="h-14 w-full bg-[#111] border border-white/10 text-white px-4 rounded-[4px] outline-none focus:border-[var(--color-primary)] font-medium text-sm"
                >
                  <option value="" disabled>
                    {copy.installmentOptions}
                  </option>
                  <option value="1">{copy.installment1}</option>
                  <option value="2">{copy.installment2}</option>
                </select>

                <button
                  onClick={() => alert("Simulação de Compra Finalizada!")}
                  className="mt-6 h-14 bg-[#60E861] text-black font-black uppercase tracking-widest text-sm hover:bg-white hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(96,232,97,0.3)]"
                >
                  {copy.confirmAndPay}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

