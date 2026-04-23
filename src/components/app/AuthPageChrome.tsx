"use client";

import Link from "next/link";
import { ChevronLeft, ShieldCheck } from "lucide-react";
import { WaveText } from "@/components/shared/WaveText";
import { useLocale, type Locale } from "@/components/providers/LocaleProvider";

const authChromeCopy: Record<
  Locale,
  {
    backToStore: string;
    secureAccess: string;
    secureCheckout: string;
    rights: string;
    privacy: string;
    terms: string;
  }
> = {
  pt: {
    backToStore: "Voltar para a loja",
    secureAccess: "Acesso Seguro",
    secureCheckout: "Checkout Seguro",
    rights: "Todos os direitos reservados.",
    privacy: "Política de Privacidade",
    terms: "Termos de Uso",
  },
  en: {
    backToStore: "Back to store",
    secureAccess: "Secure Access",
    secureCheckout: "Secure Checkout",
    rights: "All rights reserved.",
    privacy: "Privacy Policy",
    terms: "Terms of Use",
  },
  es: {
    backToStore: "Volver a la tienda",
    secureAccess: "Acceso Seguro",
    secureCheckout: "Checkout Seguro",
    rights: "Todos los derechos reservados.",
    privacy: "Política de Privacidad",
    terms: "Términos de Uso",
  },
};

export function AuthPageChrome({
  children,
  mode,
}: {
  children: React.ReactNode;
  mode: "login" | "checkout";
}) {
  const { locale } = useLocale();
  const copy = authChromeCopy[locale];
  const secureLabel =
    mode === "checkout" ? copy.secureCheckout : copy.secureAccess;

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans">
      <header className="sticky top-0 z-50 flex h-[72px] w-full items-center justify-center border-b border-white/5 bg-[#0A0A0A]/90 px-4 backdrop-blur-md md:h-20 md:px-8">
        <Link
          href="/"
          className="absolute left-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/50 transition-colors hover:text-white md:left-8 md:text-sm"
        >
          <ChevronLeft size={16} />
          <span className="hidden sm:inline">{copy.backToStore}</span>
        </Link>

        <Link
          href="/"
          className="font-heading text-2xl font-black tracking-[0.1em] transition-transform hover:scale-105 active:scale-95"
        >
          <WaveText text="CORITIBA" />
        </Link>

        <div className="absolute right-4 flex items-center gap-2 text-[var(--color-primary)] opacity-80 md:right-8">
          <ShieldCheck size={20} />
          <span className="hidden text-[10px] font-bold uppercase tracking-widest sm:inline sm:text-xs">
            {secureLabel}
          </span>
        </div>
      </header>

      {children}

      <footer className="mt-auto w-full py-8 text-center text-xs uppercase tracking-widest text-white/30">
        <p className="mb-2">
          &copy; 2026 Coritiba Store - {copy.rights}
        </p>
        <div className="flex justify-center gap-4 text-white/20">
          <Link href="/" className="transition-colors hover:text-white">
            {copy.privacy}
          </Link>
          <Link href="/" className="transition-colors hover:text-white">
            {copy.terms}
          </Link>
        </div>
      </footer>
    </div>
  );
}

