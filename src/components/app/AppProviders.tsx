"use client";

import { useEffect, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { LocaleProvider } from "@/components/providers/LocaleProvider";

const ShoppingCartDrawer = dynamic(
  () =>
    import("@/components/commerce/cart/ShoppingCartDrawer").then(
      (mod) => mod.ShoppingCartDrawer,
    ),
  { ssr: false },
);
const FavoritesDrawerPanel = dynamic(
  () =>
    import("@/components/commerce/favorites/FavoritesDrawerPanel").then(
      (mod) => mod.FavoritesDrawerPanel,
    ),
  { ssr: false },
);
const FloatingCartButton = dynamic(
  () =>
    import("@/components/commerce/cart/FloatingCartButton").then(
      (mod) => mod.FloatingCartButton,
    ),
  { ssr: false },
);
const AiShoppingAssistantWidget = dynamic(
  () =>
    import("@/components/assistants/AiShoppingAssistantWidget").then(
      (mod) => mod.AiShoppingAssistantWidget,
    ),
  { ssr: false },
);

export function AppProviders({ children }: { children: ReactNode }) {
  const [showAIGuide, setShowAIGuide] = useState(false);

  useEffect(() => {
    const scheduleGuide = () => setShowAIGuide(true);

    if ("requestIdleCallback" in window) {
      const idleId = window.requestIdleCallback(scheduleGuide, {
        timeout: 2000,
      });

      return () => window.cancelIdleCallback(idleId);
    }

    const timeoutId = globalThis.setTimeout(scheduleGuide, 1200);

    return () => globalThis.clearTimeout(timeoutId);
  }, []);

  return (
    <LocaleProvider>
      <SmoothScrollProvider>
        {children}
        <ShoppingCartDrawer />
        <FavoritesDrawerPanel />
        <FloatingCartButton />
        {showAIGuide && <AiShoppingAssistantWidget />}
      </SmoothScrollProvider>
    </LocaleProvider>
  );
}

