"use client";

import { useEffect, useState } from "react";

interface NetworkConnection {
  saveData?: boolean;
  addEventListener?: (type: "change", listener: () => void) => void;
  removeEventListener?: (type: "change", listener: () => void) => void;
}

interface MediaPreferences {
  prefersReducedMotion: boolean;
  prefersReducedData: boolean;
  shouldReduceMedia: boolean;
}

export function useMediaPreferences(): MediaPreferences {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [prefersReducedData, setPrefersReducedData] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (navigator as Navigator & { connection?: NetworkConnection })
      .connection;

    const syncPreferences = () => {
      setPrefersReducedMotion(motionQuery.matches);
      setPrefersReducedData(Boolean(connection?.saveData));
    };

    syncPreferences();

    motionQuery.addEventListener("change", syncPreferences);
    connection?.addEventListener?.("change", syncPreferences);

    return () => {
      motionQuery.removeEventListener("change", syncPreferences);
      connection?.removeEventListener?.("change", syncPreferences);
    };
  }, []);

  return {
    prefersReducedMotion,
    prefersReducedData,
    shouldReduceMedia: prefersReducedMotion || prefersReducedData,
  };
}
