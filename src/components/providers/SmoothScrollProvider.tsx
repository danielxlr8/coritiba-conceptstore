"use client";

import { ReactNode, useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "@studio-freight/lenis";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });
    window.__lenis = lenis;

    const previousScrollRestoration =
      typeof window.history.scrollRestoration === "string"
        ? window.history.scrollRestoration
        : null;
    window.history.scrollRestoration = "manual";

    const scrollToTop = () => {
      lenis.scrollTo(0, { immediate: true, force: true });
      window.scrollTo(0, 0);
    };

    let rafId = 0;

    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);
    requestAnimationFrame(scrollToTop);

    const handlePageShow = () => {
      requestAnimationFrame(scrollToTop);
    };

    window.addEventListener("pageshow", handlePageShow);

    return () => {
      window.removeEventListener("pageshow", handlePageShow);
      cancelAnimationFrame(rafId);
      lenis.stop();
      lenis.destroy();
      delete window.__lenis;
      if (previousScrollRestoration) {
        window.history.scrollRestoration = previousScrollRestoration;
      }
    };
  }, [pathname]);

  return <>{children}</>;
}
