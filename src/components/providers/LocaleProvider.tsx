"use client";

import {
  createContext,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

export type Locale = "pt" | "en" | "es";

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);
const STORAGE_KEY = "coxa-store-locale";
const LOCALE_EVENT = "coxa-store-locale-change";

function isLocale(value: string | null): value is Locale {
  return value === "pt" || value === "en" || value === "es";
}

function getStoredLocale(): Locale {
  if (typeof window === "undefined") {
    return "pt";
  }

  const storedLocale = window.localStorage.getItem(STORAGE_KEY);
  return isLocale(storedLocale) ? storedLocale : "pt";
}

function subscribe(callback: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      callback();
    }
  };

  const handleLocaleChange = () => {
    callback();
  };

  window.addEventListener("storage", handleStorage);
  window.addEventListener(LOCALE_EVENT, handleLocaleChange);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(LOCALE_EVENT, handleLocaleChange);
  };
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const locale = useSyncExternalStore<Locale>(
    subscribe,
    getStoredLocale,
    () => "pt",
  );

  const setLocale = (nextLocale: Locale) => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, nextLocale);
    window.dispatchEvent(new Event(LOCALE_EVENT));
  };

  const value = useMemo(
    () => ({
      locale,
      setLocale,
    }),
    [locale],
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);

  if (!context) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }

  return context;
}
