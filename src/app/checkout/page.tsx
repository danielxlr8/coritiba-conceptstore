"use client";

import { CheckoutSteps } from "@/components/commerce/checkout/CheckoutSteps";
import { CheckoutOrderSummary } from "@/components/commerce/checkout/CheckoutOrderSummary";
import { useLocale, type Locale } from "@/components/providers/LocaleProvider";

const checkoutPageCopy: Record<Locale, { title: string }> = {
  pt: { title: "Finalizar Compra" },
  en: { title: "Checkout" },
  es: { title: "Finalizar Compra" },
};

export default function CheckoutPage() {
  const { locale } = useLocale();
  const copy = checkoutPageCopy[locale];
  return (
    <main className="flex-1 bg-[#050505] selection:bg-[var(--color-primary)] selection:text-black">
      <div className="container max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-16">
        
        {/* TÃ­tulo da PÃ¡gina - VisÃ­vel penas Desktop ou Topo Mobile */}
        <h1 className="text-3xl md:text-5xl font-black font-heading uppercase tracking-tight text-white mb-8 md:mb-12">
          {copy.title} <span className="text-[var(--color-primary)]">.</span>
        </h1>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 relative items-start">
          
          {/* COLUNA ESQUERDA: FormulÃ¡rios / AcordeÃ£o */}
          <div className="flex-1 w-full ord">
            <CheckoutSteps />
          </div>

          {/* COLUNA DIREITA: Resumo Fixo */}
          <aside className="w-full lg:w-[400px] xl:w-[480px] shrink-0 order-first lg:order-last mb-8 lg:mb-0">
            <CheckoutOrderSummary />
          </aside>
          
        </div>
      </div>
    </main>
  );
}

